/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { dbConnect } from "@/lib/db";
import { isValidObjectId } from "@/lib/security";
import mongoose from "mongoose";

export const Route = createFileRoute("/api/media/file/$fileId")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        try {
          await dbConnect();
          const { fileId } = params;

          if (!isValidObjectId(fileId)) {
            return new Response(JSON.stringify({ error: "Invalid file ID format" }), {
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

          const objectId = new mongoose.Types.ObjectId(fileId);
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
          if (rangeHeader && fileSize > 0) {
            const parts = rangeHeader.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10) || 0;
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const safeEnd = Math.min(end, fileSize - 1);
            const chunksize = safeEnd - start + 1;

            const downloadStream = bucket.openDownloadStream(objectId, {
              start,
              end: safeEnd + 1, // exclusive
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
          console.error("Error fetching media from GridFS:", error);
          return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
