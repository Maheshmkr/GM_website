/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { dbConnect } from "@/lib/db";
import { MediaItem, UploadChunk } from "@/lib/models";
import mongoose from "mongoose";

export const Route = createFileRoute("/api/media/upload")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          await dbConnect();
          const formData = await request.formData();
          const file = formData.get("file") as File | null;
          const title = formData.get("title") as string | null;
          const artist = formData.get("artist") as string | null;
          const type = formData.get("type") as string | null; // 'image', 'video', 'song'
          const category = formData.get("category") as string | null;
          const favorite = formData.get("favorite") === "true";
          const memoryDate = formData.get("memoryDate") as string | null;

          if (!file) {
            return new Response(JSON.stringify({ error: "No file uploaded" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          if (!title || !title.trim()) {
            return new Response(JSON.stringify({ error: "Title is required" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          if (!type || !["image", "video", "song"].includes(type)) {
            return new Response(JSON.stringify({ error: "Invalid or missing media type" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          // Validate files based on type
          const ext = file.name.split(".").pop()?.toLowerCase();

          if (type === "image") {
            const allowedImageMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
            const allowedImageExts = ["jpg", "jpeg", "png", "webp", "gif"];
            if (
              !allowedImageMimeTypes.includes(file.type) &&
              (!ext || !allowedImageExts.includes(ext))
            ) {
              return new Response(
                JSON.stringify({
                  error: `Invalid image type: ${file.type}. Allowed formats: JPG, JPEG, PNG, WEBP, GIF.`,
                }),
                {
                  status: 400,
                  headers: { "Content-Type": "application/json" },
                },
              );
            }
            if (file.size > 10 * 1024 * 1024) {
              return new Response(
                JSON.stringify({ error: "Image size exceeds the limit of 10MB" }),
                {
                  status: 400,
                  headers: { "Content-Type": "application/json" },
                },
              );
            }
          } else if (type === "video") {
            const allowedVideoMimeTypes = ["video/mp4", "video/webm", "video/quicktime"];
            const allowedVideoExts = ["mp4", "webm", "mov"];
            if (
              !allowedVideoMimeTypes.includes(file.type) &&
              (!ext || !allowedVideoExts.includes(ext))
            ) {
              return new Response(
                JSON.stringify({
                  error: `Invalid video type: ${file.type}. Allowed formats: MP4, WEBM, MOV.`,
                }),
                {
                  status: 400,
                  headers: { "Content-Type": "application/json" },
                },
              );
            }
            if (file.size > 100 * 1024 * 1024) {
              return new Response(
                JSON.stringify({ error: "Video size exceeds the limit of 100MB" }),
                {
                  status: 400,
                  headers: { "Content-Type": "application/json" },
                },
              );
            }
          } else if (type === "song") {
            const allowedSongMimeTypes = [
              "audio/mpeg",
              "audio/wav",
              "audio/ogg",
              "audio/x-m4a",
              "audio/mp3",
              "audio/webm",
              "audio/m4a",
            ];
            const allowedSongExts = ["mp3", "wav", "ogg", "m4a", "webm"];
            if (
              !allowedSongMimeTypes.includes(file.type) &&
              (!ext || !allowedSongExts.includes(ext))
            ) {
              return new Response(
                JSON.stringify({
                  error: `Invalid audio type: ${file.type}. Allowed formats: MP3, WAV, OGG, M4A, WEBM.`,
                }),
                {
                  status: 400,
                  headers: { "Content-Type": "application/json" },
                },
              );
            }
            if (file.size > 20 * 1024 * 1024) {
              return new Response(
                JSON.stringify({ error: "Audio file size exceeds the limit of 20MB" }),
                {
                  status: 400,
                  headers: { "Content-Type": "application/json" },
                },
              );
            }
          }

          // Save chunk data temporarily
          const uploadId = formData.get("uploadId") as string;
          const chunkIndex = parseInt(formData.get("chunkIndex") as string, 10);
          const totalChunks = parseInt(formData.get("totalChunks") as string, 10);
          const isLastChunk = formData.get("isLastChunk") === "true";
          const filename = (formData.get("filename") as string) || file.name;
          const mimeType = (formData.get("mimeType") as string) || file.type;

          if (!uploadId || isNaN(chunkIndex) || isNaN(totalChunks)) {
            return new Response(JSON.stringify({ error: "Missing chunk upload parameters" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          // Extract chunk binary
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          const db = mongoose.connection.db;
          if (!db) {
            return new Response(JSON.stringify({ error: "Database connection failed" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          // Save the chunk temporarily to UploadChunk collection
          const tempChunk = new UploadChunk({
            uploadId,
            chunkIndex,
            filename,
            contentType: mimeType || "application/octet-stream",
            type,
            data: buffer,
          });
          await tempChunk.save();

          // If this is not the last chunk, return success indicating chunk was saved
          if (!isLastChunk) {
            return new Response(
              JSON.stringify({
                success: true,
                message: `Chunk ${chunkIndex + 1}/${totalChunks} uploaded successfully`,
              }),
              {
                status: 200,
                headers: { "Content-Type": "application/json" },
              },
            );
          }

          // Assemble the chunks on the final chunk request
          const chunks = await UploadChunk.find({ uploadId }).sort({ chunkIndex: 1 });
          if (chunks.length < totalChunks) {
            return new Response(
              JSON.stringify({
                error: `Chunk assembly failed. Only ${chunks.length}/${totalChunks} chunks received.`,
              }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              },
            );
          }

          const finalBuffer = Buffer.concat(chunks.map((c) => c.data));
          const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "media" });

          const fileId = await new Promise<mongoose.Types.ObjectId>((resolve, reject) => {
            const uploadStream = bucket.openUploadStream(filename, {
              contentType:
                mimeType ||
                (type === "song" ? "audio/mpeg" : type === "video" ? "video/mp4" : "image/jpeg"),
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

          // Save metadata to MediaItem
          const mediaItem = new MediaItem({
            type,
            source: "upload",
            title,
            artist: type === "song" ? artist || "Unknown Artist" : undefined,
            filename,
            mimeType:
              mimeType ||
              (type === "song" ? "audio/mpeg" : type === "video" ? "video/mp4" : "image/jpeg"),
            fileSize: finalBuffer.length,
            fileId,
            category: category || "Favorites",
            favorite,
            memoryDate: memoryDate || new Date().toISOString().split("T")[0],
          });
          await mediaItem.save();

          // Cleanup temporary chunks
          await UploadChunk.deleteMany({ uploadId });

          return new Response(JSON.stringify(mediaItem), {
            status: 201,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("Error uploading media item:", error);
          return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
