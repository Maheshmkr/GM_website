/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { dbConnect } from "@/lib/db";
import { Photo } from "@/lib/models";
import mongoose from "mongoose";

export const Route = createFileRoute("/api/photos")({
  server: {
    handlers: {
      GET: async () => {
        try {
          await dbConnect();
          const photos = await Photo.find().sort({ createdAt: -1 });
          return new Response(JSON.stringify(photos), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("Error fetching photos:", error);
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
          const category = formData.get("category") as string | null;
          const favorite = formData.get("favorite") === "true";

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
          const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
          if (!allowedMimeTypes.includes(file.type)) {
            return new Response(
              JSON.stringify({
                error: `Invalid MIME type: ${file.type}. Allowed: JPEG, PNG, WEBP, GIF.`,
              }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          // File extension validation
          const ext = file.name.split(".").pop()?.toLowerCase();
          const allowedExtensions = ["jpg", "jpeg", "png", "webp", "gif"];
          if (!ext || !allowedExtensions.includes(ext)) {
            return new Response(
              JSON.stringify({
                error: `Invalid file extension. Allowed: jpg, jpeg, png, webp, gif.`,
              }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          // File size validation (10MB limit)
          const MAX_SIZE = 10 * 1024 * 1024;
          if (file.size > MAX_SIZE) {
            return new Response(
              JSON.stringify({
                error: `File size exceeds the limit of 10MB (actual: ${(file.size / 1024 / 1024).toFixed(2)}MB)`,
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

          // Save metadata
          const photo = new Photo({
            title,
            description: description || "",
            filename: file.name,
            mimeType: file.type,
            fileSize: file.size,
            fileId,
            category: category || "Favorites",
            favorite,
          });
          await photo.save();

          return new Response(JSON.stringify(photo), {
            status: 201,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("Error uploading photo:", error);
          return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
