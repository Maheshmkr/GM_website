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
  parseTimeString,
} from "@/lib/security";
import mongoose from "mongoose";

export const Route = createFileRoute("/api/songs")({
  server: {
    handlers: {
      GET: async () => {
        try {
          await dbConnect();
          const songs = await MediaItem.find({ type: "song" })
            .select("-__v")
            .sort({ createdAt: -1 });

          return new Response(JSON.stringify(songs), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("Error fetching songs:", error);
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
          const coverFile = formData.get("coverFile") as File | null;
          const rawTitle = formData.get("title") as string | null;
          const rawArtist = formData.get("artist") as string | null;
          const rawDescription = formData.get("description") as string | null;
          const rawDuration = formData.get("duration") as string | null;
          const rawMemoryDate = formData.get("memoryDate") as string | null;
          const rawStartTime = formData.get("startTime") as string | null;
          const rawEndTime = formData.get("endTime") as string | null;

          if (!file || !(file instanceof File)) {
            return new Response(JSON.stringify({ error: "No audio file uploaded" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const title = sanitizePlainText(rawTitle, 150);
          const artist = sanitizePlainText(rawArtist, 100);

          if (!title || !artist) {
            return new Response(JSON.stringify({ error: "Title and Artist are required" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const description = sanitizePlainText(rawDescription, 1000);
          const duration = sanitizePlainText(rawDuration, 20) || "3:00";
          const memoryDate = sanitizePlainText(rawMemoryDate, 20) || new Date().toISOString().split("T")[0];

          // Validate Start and End Time
          let validatedStartTime = "0:00";
          let validatedStartSeconds = 0;
          let validatedEndTime: string | undefined;
          let validatedEndSeconds: number | undefined;

          if (rawStartTime && rawStartTime.trim()) {
            const startParsed = parseTimeString(rawStartTime);
            if (!startParsed.valid) {
              return new Response(
                JSON.stringify({ error: startParsed.error || "Invalid start time format" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
              );
            }
            validatedStartTime = startParsed.formatted || "0:00";
            validatedStartSeconds = startParsed.seconds !== null ? startParsed.seconds : 0;
          }

          if (rawEndTime && rawEndTime.trim()) {
            const endParsed = parseTimeString(rawEndTime);
            if (!endParsed.valid) {
              return new Response(
                JSON.stringify({ error: endParsed.error || "Invalid stop time format" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
              );
            }
            validatedEndTime = endParsed.formatted || undefined;
            validatedEndSeconds = endParsed.seconds !== null ? endParsed.seconds : undefined;

            if (
              validatedEndSeconds !== undefined &&
              validatedEndSeconds <= validatedStartSeconds
            ) {
              return new Response(
                JSON.stringify({ error: "Stop time must be greater than start time" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
              );
            }
          }

          // 3. Audio Binary Magic Bytes & Security Validation
          const audioArrayBuffer = await file.arrayBuffer();
          const audioBuffer = Buffer.from(audioArrayBuffer);

          const audioValidation = validateMediaUpload(audioBuffer, file.name, file.type, "song");
          if (!audioValidation.valid) {
            return new Response(JSON.stringify({ error: audioValidation.error }), {
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

          // Upload Audio File
          const fileId = await new Promise<mongoose.Types.ObjectId>((resolve, reject) => {
            const uploadStream = bucket.openUploadStream(audioValidation.safeFilename, {
              contentType: audioValidation.detectedMimeType || "audio/mpeg",
            });
            uploadStream.on("finish", () => {
              resolve(uploadStream.id as mongoose.Types.ObjectId);
            });
            uploadStream.on("error", (err) => {
              reject(err);
            });
            uploadStream.write(audioBuffer);
            uploadStream.end();
          });

          // Upload Optional Cover File
          let coverFileId: mongoose.Types.ObjectId | undefined;
          if (coverFile && coverFile instanceof File && coverFile.size > 0) {
            const coverArrayBuffer = await coverFile.arrayBuffer();
            const coverBuffer = Buffer.from(coverArrayBuffer);

            const coverValidation = validateMediaUpload(coverBuffer, coverFile.name, coverFile.type, "image");
            if (coverValidation.valid) {
              coverFileId = await new Promise<mongoose.Types.ObjectId>((resolve, reject) => {
                const uploadStream = bucket.openUploadStream(coverValidation.safeFilename, {
                  contentType: coverValidation.detectedMimeType || "image/jpeg",
                });
                uploadStream.on("finish", () => {
                  resolve(uploadStream.id as mongoose.Types.ObjectId);
                });
                uploadStream.on("error", (err) => {
                  reject(err);
                });
                uploadStream.write(coverBuffer);
                uploadStream.end();
              });
            }
          }

          // 4. Save metadata to MediaItem
          const song = new MediaItem({
            type: "song",
            source: "upload",
            title,
            artist,
            description,
            filename: audioValidation.safeFilename,
            mimeType: audioValidation.detectedMimeType || "audio/mpeg",
            fileSize: audioBuffer.length,
            fileId,
            coverFileId,
            duration,
            memoryDate,
            startTime: validatedStartTime,
            startSeconds: validatedStartSeconds,
            endTime: validatedEndTime,
            endSeconds: validatedEndSeconds,
          });
          await song.save();

          return new Response(JSON.stringify(song), {
            status: 201,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("Error uploading song:", error);
          return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
