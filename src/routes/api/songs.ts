/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { dbConnect } from "@/lib/db";
import { MediaItem } from "@/lib/models";
import mongoose from "mongoose";

export const Route = createFileRoute("/api/songs")({
  server: {
    handlers: {
      GET: async () => {
        try {
          await dbConnect();
          const songs = await MediaItem.find({ type: "song" }).sort({ createdAt: -1 });
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
        try {
          await dbConnect();
          const formData = await request.formData();
          const file = formData.get("file") as File | null;
          const coverFile = formData.get("coverFile") as File | null;
          const title = formData.get("title") as string | null;
          const artist = formData.get("artist") as string | null;
          const description = formData.get("description") as string | null;
          const duration = formData.get("duration") as string | null;

          if (!file) {
            return new Response(JSON.stringify({ error: "No audio file uploaded" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          if (!title || !artist) {
            return new Response(JSON.stringify({ error: "Title and Artist are required" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          // Validate Audio MIME Type
          const allowedAudioMimeTypes = [
            "audio/mpeg",
            "audio/wav",
            "audio/ogg",
            "audio/webm",
            "audio/mp3",
            "audio/x-m4a",
          ];
          if (
            !allowedAudioMimeTypes.includes(file.type) &&
            !file.name.endsWith(".mp3") &&
            !file.name.endsWith(".m4a")
          ) {
            return new Response(
              JSON.stringify({
                error: `Invalid audio MIME type: ${file.type}. Allowed: MP3, WAV, OGG, WEBM.`,
              }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          // Audio Size Limit: 20MB
          const MAX_AUDIO_SIZE = 20 * 1024 * 1024;
          if (file.size > MAX_AUDIO_SIZE) {
            return new Response(
              JSON.stringify({ error: `Audio file size exceeds the limit of 20MB` }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          const db = mongoose.connection.db;
          if (!db) {
            return new Response(JSON.stringify({ error: "Database connection failed" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }
          const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "media" });

          // Upload Audio File
          const audioArrayBuffer = await file.arrayBuffer();
          const audioBuffer = Buffer.from(audioArrayBuffer);

          const fileId = await new Promise<mongoose.Types.ObjectId>((resolve, reject) => {
            const uploadStream = bucket.openUploadStream(file.name, {
              contentType: file.type || "audio/mpeg",
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
          if (coverFile && coverFile.size > 0) {
            const allowedImageMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
            if (
              allowedImageMimeTypes.includes(coverFile.type) ||
              coverFile.name.match(/\.(jpg|jpeg|png|webp|gif)$/i)
            ) {
              const coverArrayBuffer = await coverFile.arrayBuffer();
              const coverBuffer = Buffer.from(coverArrayBuffer);

              coverFileId = await new Promise<mongoose.Types.ObjectId>((resolve, reject) => {
                const uploadStream = bucket.openUploadStream(coverFile.name, {
                  contentType: coverFile.type || "image/jpeg",
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

          // Save metadata to MediaItem
          const song = new MediaItem({
            type: "song",
            source: "upload",
            title,
            artist,
            description: description || "",
            filename: file.name,
            mimeType: file.type || "audio/mpeg",
            fileSize: file.size,
            fileId,
            coverFileId,
            duration: duration || "3:00",
            memoryDate: new Date().toISOString().split("T")[0],
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
