/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { dbConnect } from "@/lib/db";
import { MediaItem } from "@/lib/models";
import mongoose from "mongoose";

export const Route = createFileRoute("/api/media/$id")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        try {
          await dbConnect();
          const { id } = params;

          if (!mongoose.Types.ObjectId.isValid(id)) {
            return new Response(JSON.stringify({ error: "Invalid file ID format" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const db = mongoose.connection.db;
          if (!db) {
            return new Response(JSON.stringify({ error: "Database connection failed" }), {
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

          const rangeHeader = request.headers.get("range");
          if (rangeHeader) {
            const parts = rangeHeader.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunksize = end - start + 1;

            const downloadStream = bucket.openDownloadStream(objectId, {
              start,
              end: end + 1, // exclusive
            });

            const readable = new ReadableStream({
              start(controller) {
                downloadStream.on("data", (chunk) => {
                  controller.enqueue(chunk);
                });
                downloadStream.on("end", () => {
                  controller.close();
                });
                downloadStream.on("error", (err) => {
                  controller.error(err);
                });
              },
              cancel() {
                downloadStream.destroy();
              },
            });

            return new Response(readable, {
              status: 206,
              headers: {
                "Content-Range": `bytes ${start}-${end}/${fileSize}`,
                "Accept-Ranges": "bytes",
                "Content-Length": chunksize.toString(),
                "Content-Type": contentType,
              },
            });
          } else {
            const downloadStream = bucket.openDownloadStream(objectId);
            const readable = new ReadableStream({
              start(controller) {
                downloadStream.on("data", (chunk) => {
                  controller.enqueue(chunk);
                });
                downloadStream.on("end", () => {
                  controller.close();
                });
                downloadStream.on("error", (err) => {
                  controller.error(err);
                });
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
              },
            });
          }
        } catch (error: any) {
          console.error("Error fetching media from GridFS:", error);
          return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
      DELETE: async ({ params }) => {
        try {
          await dbConnect();
          const { id } = params;
          console.log(`[DELETE /api/media/${id}] Deletion requested.`);

          if (!mongoose.Types.ObjectId.isValid(id)) {
            console.warn(`[DELETE /api/media/${id}] Invalid ID format.`);
            return new Response(JSON.stringify({ error: "Invalid document ID format" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const mediaItem = await MediaItem.findById(id);
          if (!mediaItem) {
            console.warn(`[DELETE /api/media/${id}] Media item not found in DB.`);
            return new Response(JSON.stringify({ error: "Media item not found" }), {
              status: 404,
              headers: { "Content-Type": "application/json" },
            });
          }

          // If the media item is an uploaded file, delete its binary from GridFS
          if (mediaItem.source === "upload") {
            const db = mongoose.connection.db;
            if (db) {
              const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "media" });
              
              if (mediaItem.fileId) {
                try {
                  await bucket.delete(mediaItem.fileId);
                } catch (err) {
                  console.warn("GridFS file delete failed during media item deletion:", err);
                }
              }

              // Delete optional cover art if present (for songs)
              if (mediaItem.coverFileId) {
                try {
                  await bucket.delete(mediaItem.coverFileId);
                } catch (err) {
                  console.warn("GridFS cover art file delete failed during media item deletion:", err);
                }
              }
            }
          }

          // Remove the metadata from DB
          await MediaItem.findByIdAndDelete(id);
          console.log(`[DELETE /api/media/${id}] Document and attachments deleted successfully.`);

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
