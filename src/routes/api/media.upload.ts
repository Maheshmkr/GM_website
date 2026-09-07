/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { dbConnect } from "@/lib/db";
import { MediaItem, UploadChunk } from "@/lib/models";
import {
  requireAdmin,
  validateMediaUpload,
  checkRateLimit,
  uploadRateLimiter,
  createRateLimitResponse,
  sanitizePlainText,
} from "@/lib/security";
import mongoose from "mongoose";

export const Route = createFileRoute("/api/media/upload")({
  server: {
    handlers: {
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
          const rawArtist = formData.get("artist") as string | null;
          const rawType = formData.get("type") as string | null; // 'image', 'video', 'song'
          const rawCategory = formData.get("category") as string | null;
          const rawDescription = formData.get("description") as string | null;
          const rawMemoryDate = formData.get("memoryDate") as string | null;
          const favorite = formData.get("favorite") === "true";
          const showInHero = formData.get("showInHero") === "true";

          if (!file || !(file instanceof File)) {
            return new Response(JSON.stringify({ error: "No file uploaded" }), {
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

          if (!rawType || !["image", "video", "song"].includes(rawType)) {
            return new Response(JSON.stringify({ error: "Invalid or missing media type" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }
          const type = rawType as "image" | "video" | "song";

          const artist = sanitizePlainText(rawArtist, 100);
          const description = sanitizePlainText(rawDescription, 1000);
          const category = sanitizePlainText(rawCategory, 50) || "Favorites";
          const memoryDate = sanitizePlainText(rawMemoryDate, 20) || new Date().toISOString().split("T")[0];
          const rawDuration = formData.get("duration") as string | null;
          const duration = sanitizePlainText(rawDuration, 30);
          const rawCoverFileId = formData.get("coverFileId") as string | null;
          const coverFileId = rawCoverFileId && mongoose.Types.ObjectId.isValid(rawCoverFileId)
            ? new mongoose.Types.ObjectId(rawCoverFileId)
            : undefined;
          const rawStartTime = formData.get("startTime") as string | null;
          const startTime = sanitizePlainText(rawStartTime, 20);
          const rawEndTime = formData.get("endTime") as string | null;
          const endTime = sanitizePlainText(rawEndTime, 20);

          // 3. Chunk validation & security checks
          const uploadIdRaw = formData.get("uploadId") as string;
          const uploadId = sanitizePlainText(uploadIdRaw, 100);
          const chunkIndex = parseInt(formData.get("chunkIndex") as string, 10);
          const totalChunks = parseInt(formData.get("totalChunks") as string, 10);
          const isLastChunk = formData.get("isLastChunk") === "true";
          const filename = sanitizePlainText(formData.get("filename") as string, 200) || file.name;
          const mimeType = sanitizePlainText(formData.get("mimeType") as string, 100) || file.type;

          if (!uploadId || isNaN(chunkIndex) || isNaN(totalChunks) || chunkIndex < 0 || totalChunks <= 0 || chunkIndex >= totalChunks) {
            return new Response(JSON.stringify({ error: "Invalid chunk upload parameters" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          // Limit maximum chunk count (max 200 chunks = 400MB)
          if (totalChunks > 200) {
            return new Response(JSON.stringify({ error: "Total chunks exceed allowed limit" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          const db = mongoose.connection.db;
          if (!db) {
            return new Response(JSON.stringify({ error: "Database connection unavailable" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          // 4. Save chunk temporarily
          const tempChunk = new UploadChunk({
            uploadId,
            chunkIndex,
            filename,
            contentType: mimeType || "application/octet-stream",
            type,
            data: buffer,
          });
          await tempChunk.save();

          if (!isLastChunk) {
            return new Response(
              JSON.stringify({
                success: true,
                message: `Chunk ${chunkIndex + 1}/${totalChunks} uploaded successfully`,
              }),
              { status: 200, headers: { "Content-Type": "application/json" } }
            );
          }

          // 5. Final Chunk: Assemble & Validate Magic Bytes
          const chunks = await UploadChunk.find({ uploadId }).sort({ chunkIndex: 1 });
          if (chunks.length < totalChunks) {
            await UploadChunk.deleteMany({ uploadId });
            return new Response(
              JSON.stringify({
                error: `Chunk assembly failed. Only ${chunks.length}/${totalChunks} chunks received.`,
              }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          const finalBuffer = Buffer.concat(chunks.map((c) => c.data));

          // Validate the assembled file buffer with Magic Bytes
          const validation = validateMediaUpload(finalBuffer, filename, mimeType, type);
          if (!validation.valid) {
            await UploadChunk.deleteMany({ uploadId });
            return new Response(JSON.stringify({ error: validation.error }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "media" });
          const fileId = await new Promise<mongoose.Types.ObjectId>((resolve, reject) => {
            const uploadStream = bucket.openUploadStream(validation.safeFilename, {
              contentType: validation.detectedMimeType || mimeType,
            });
            uploadStream.on("finish", () => {
              resolve(uploadStream.id as mongoose.Types.ObjectId);
            });
            uploadStream.on("error", (err) => {
              reject(err);
            });
            uploadStream.write(finalBuffer);
            uploadStream.end();
          });

          // 6. Save metadata
          const mediaItem = new MediaItem({
            type,
            source: "upload",
            title,
            artist: type === "song" ? artist || "Unknown Artist" : undefined,
            description,
            duration: duration || (type === "video" ? "0:30" : type === "song" ? "3:00" : undefined),
            filename: validation.safeFilename,
            mimeType: validation.detectedMimeType || mimeType,
            fileSize: finalBuffer.length,
            fileId,
            coverFileId,
            startTime,
            endTime,
            category,
            favorite,
            showInHero,
            memoryDate,
          });
          await mediaItem.save();

          // 7. Cleanup chunks
          await UploadChunk.deleteMany({ uploadId });

          return new Response(JSON.stringify(mediaItem), {
            status: 201,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("Error uploading media chunk:", error);
          return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
