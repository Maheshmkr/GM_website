/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { dbConnect } from "@/lib/db";
import { MediaItem } from "@/lib/models";
import mongoose from "mongoose";

export const Route = createFileRoute("/api/videos")({
  server: {
    handlers: {
      GET: async () => {
        try {
          await dbConnect();
          const videos = await MediaItem.find({ type: "video" }).sort({ createdAt: -1 });
          return new Response(JSON.stringify(videos), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("Error fetching videos:", error);
          return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
      POST: async ({ request }) => {
        try {
          await dbConnect();
          const formData = await request.formData();
          const file = formData.get("file") as File | null;
          const title = formData.get("title") as string | null;
          const description = formData.get("description") as string | null;
          const favorite = formData.get("favorite") === "true";
          const duration = formData.get("duration") as string | null;

          if (!file) {
            return new Response(JSON.stringify({ error: "No file uploaded" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          if (!title) {
            return new Response(JSON.stringify({ error: "Title is required" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          // MIME type validation
          const allowedMimeTypes = ["video/mp4", "video/webm", "video/quicktime"];
          if (!allowedMimeTypes.includes(file.type)) {
            return new Response(
              JSON.stringify({
                error: `Invalid MIME type: ${file.type}. Allowed: MP4, WEBM, QuickTime.`,
              }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          // File extension validation
          const ext = file.name.split(".").pop()?.toLowerCase();
          const allowedExtensions = ["mp4", "webm", "mov", "qt"];
          if (!ext || !allowedExtensions.includes(ext)) {
            return new Response(
              JSON.stringify({ error: `Invalid file extension. Allowed: mp4, webm, mov, qt.` }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          // File size validation (100MB limit)
          const MAX_SIZE = 100 * 1024 * 1024;
          if (file.size > MAX_SIZE) {
            return new Response(
              JSON.stringify({
                error: `File size exceeds the limit of 100MB (actual: ${(file.size / 1024 / 1024).toFixed(2)}MB)`,
              }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          // Upload binary to GridFS
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          const db = mongoose.connection.db;
          if (!db) {
            return new Response(JSON.stringify({ error: "Database connection failed" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }
          const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "media" });

          const fileId = await new Promise<mongoose.Types.ObjectId>((resolve, reject) => {
            const uploadStream = bucket.openUploadStream(file.name, {
              contentType: file.type,
            });
            uploadStream.on("finish", () => {
              resolve(uploadStream.id as mongoose.Types.ObjectId);
            });
            uploadStream.on("error", (err) => {
              reject(err);
            });
            uploadStream.write(buffer);
            uploadStream.end();
          });

          // Save metadata to MediaItem
          const video = new MediaItem({
            type: "video",
            source: "upload",
            title,
            description: description || "",
            filename: file.name,
            mimeType: file.type,
            fileSize: file.size,
            fileId,
            favorite,
            duration: duration || "0:30",
            memoryDate: new Date().toISOString().split("T")[0],
          });
          await video.save();

          return new Response(JSON.stringify(video), {
            status: 201,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("Error uploading video:", error);
          return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
