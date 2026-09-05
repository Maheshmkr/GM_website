/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { dbConnect } from "@/lib/db";
import { MediaItem } from "@/lib/models";
import { requireAdmin, isValidObjectId } from "@/lib/security";
import mongoose from "mongoose";

export const Route = createFileRoute("/api/media/$id")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        try {
          await dbConnect();
          const { id } = params;

          if (!isValidObjectId(id)) {
            return new Response(JSON.stringify({ error: "Invalid media file ID format" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const db = mongoose.connection.db;
          if (!db) {
            return new Response(JSON.stringify({ error: "Database connection unavailable" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          const objectId = new mongoose.Types.ObjectId(id);
          const file = await db.collection("media.files").findOne({ _id: objectId });

          if (!file) {
            return new Response(JSON.stringify({ error: "Media file not found" }), {
              status: 404,
              headers: { "Content-Type": "application/json" },
            });
          }

          const contentType = file.contentType || "application/octet-stream";
          const fileSize = file.length;
          const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "media" });

          // Support HTTP 206 Range requests for video/audio seeking
          const rangeHeader = request.headers.get("range");
          if (rangeHeader && fileSize > 0) {
            const parts = rangeHeader.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10) || 0;
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const safeEnd = Math.min(end, fileSize - 1);
            const chunksize = safeEnd - start + 1;

            const downloadStream = bucket.openDownloadStream(objectId, {
              start,
              end: safeEnd + 1, // exclusive in GridFS
            });

            const readable = new ReadableStream({
              start(controller) {
                downloadStream.on("data", (chunk) => controller.enqueue(chunk));
                downloadStream.on("end", () => controller.close());
                downloadStream.on("error", (err) => controller.error(err));
              },
              cancel() {
                downloadStream.destroy();
              },
            });

            return new Response(readable, {
              status: 206,
              headers: {
                "Content-Range": `bytes ${start}-${safeEnd}/${fileSize}`,
                "Accept-Ranges": "bytes",
                "Content-Length": chunksize.toString(),
                "Content-Type": contentType,
                "X-Content-Type-Options": "nosniff",
              },
            });
          } else {
            const downloadStream = bucket.openDownloadStream(objectId);
            const readable = new ReadableStream({
              start(controller) {
                downloadStream.on("data", (chunk) => controller.enqueue(chunk));
                downloadStream.on("end", () => controller.close());
                downloadStream.on("error", (err) => controller.error(err));
              },
              cancel() {
                downloadStream.destroy();
              },
            });

            return new Response(readable, {
              status: 200,
              headers: {
                "Content-Length": fileSize.toString(),
                "Content-Type": contentType,
                "Accept-Ranges": "bytes",
                "X-Content-Type-Options": "nosniff",
              },
            });
          }
        } catch (error: any) {
          console.error("Error streaming media from GridFS:", error);
          return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
      DELETE: async ({ params, request }) => {
        // 1. Authorization: Admin check
        const auth = requireAdmin(request);
        if ("errorResponse" in auth) {
          return auth.errorResponse;
        }

        try {
          await dbConnect();
          const { id } = params;

          if (!isValidObjectId(id)) {
            return new Response(JSON.stringify({ error: "Invalid document ID format" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const mediaItem = await MediaItem.findById(id);
          if (!mediaItem) {
            return new Response(JSON.stringify({ error: "Media item not found" }), {
              status: 404,
              headers: { "Content-Type": "application/json" },
            });
          }

          // 2. Cascade delete binary files from GridFS
          if (mediaItem.source === "upload") {
            const db = mongoose.connection.db;
            if (db) {
              const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "media" });

              if (mediaItem.fileId) {
                try {
                  await bucket.delete(new mongoose.Types.ObjectId(mediaItem.fileId));
                } catch (err) {
                  console.warn("GridFS file deletion warning:", err);
                }
              }

              if (mediaItem.coverFileId) {
                try {
                  await bucket.delete(new mongoose.Types.ObjectId(mediaItem.coverFileId));
                } catch (err) {
                  console.warn("GridFS cover deletion warning:", err);
                }
              }
            }
          }

          // 3. Delete metadata
          await MediaItem.findByIdAndDelete(id);

          return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("Error deleting media item:", error);
          return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
