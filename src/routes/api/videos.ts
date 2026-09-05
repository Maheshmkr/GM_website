/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { dbConnect } from "@/lib/db";
import { MediaItem } from "@/lib/models";
import {
  requireAdmin,
  validateMediaUpload,
  checkRateLimit,
  uploadRateLimiter,
  createRateLimitResponse,
  sanitizePlainText,
} from "@/lib/security";
import mongoose from "mongoose";

export const Route = createFileRoute("/api/videos")({
  server: {
    handlers: {
      GET: async () => {
        try {
          await dbConnect();
          const videos = await MediaItem.find({ type: "video" })
            .select("-__v")
            .sort({ createdAt: -1 });

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
        // 1. Authorization: Admin check
        const auth = requireAdmin(request);
        if ("errorResponse" in auth) {
          return auth.errorResponse;
        }

        // 2. Rate Limiting
        const rateCheck = checkRateLimit(request, uploadRateLimiter);
        if (!rateCheck.allowed) {
          return createRateLimitResponse(rateCheck.retryAfterSeconds);
        }

        try {
          await dbConnect();
          const formData = await request.formData();
          const file = formData.get("file") as File | null;
          const rawTitle = formData.get("title") as string | null;
          const rawDescription = formData.get("description") as string | null;
          const rawDuration = formData.get("duration") as string | null;
          const rawMemoryDate = formData.get("memoryDate") as string | null;
          const favorite = formData.get("favorite") === "true";

          if (!file || !(file instanceof File)) {
            return new Response(JSON.stringify({ error: "No video file uploaded" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const title = sanitizePlainText(rawTitle, 150);
          if (!title) {
            return new Response(JSON.stringify({ error: "Title is required" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const description = sanitizePlainText(rawDescription, 1000);
          const duration = sanitizePlainText(rawDuration, 20) || "0:30";
          const memoryDate = sanitizePlainText(rawMemoryDate, 20) || new Date().toISOString().split("T")[0];

          // 3. Binary Magic Bytes & Security Validation
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          const validation = validateMediaUpload(buffer, file.name, file.type, "video");
          if (!validation.valid) {
            return new Response(JSON.stringify({ error: validation.error }), {
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

          const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "media" });
          const fileId = await new Promise<mongoose.Types.ObjectId>((resolve, reject) => {
            const uploadStream = bucket.openUploadStream(validation.safeFilename, {
              contentType: validation.detectedMimeType || "video/mp4",
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

          // 4. Save metadata to MediaItem
          const video = new MediaItem({
            type: "video",
            source: "upload",
            title,
            description,
            filename: validation.safeFilename,
            mimeType: validation.detectedMimeType || "video/mp4",
            fileSize: buffer.length,
            fileId,
            favorite,
            duration,
            memoryDate,
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
