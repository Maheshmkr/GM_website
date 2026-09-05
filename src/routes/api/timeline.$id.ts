/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { dbConnect } from "@/lib/db";
import { Timeline } from "@/lib/models";
import {
  requireAdmin,
  isValidObjectId,
  validateMediaUpload,
  sanitizePlainText,
} from "@/lib/security";
import mongoose from "mongoose";

export const Route = createFileRoute("/api/timeline/$id")({
  server: {
    handlers: {
      PUT: async ({ request, params }) => {
        // 1. Authorization: Admin check
        const auth = requireAdmin(request);
        if ("errorResponse" in auth) {
          return auth.errorResponse;
        }

        try {
          await dbConnect();
          const { id } = params;

          if (!isValidObjectId(id)) {
            return new Response(JSON.stringify({ error: "Invalid timeline ID format" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const milestone = await Timeline.findById(id);
          if (!milestone) {
            return new Response(JSON.stringify({ error: "Timeline item not found" }), {
              status: 404,
              headers: { "Content-Type": "application/json" },
            });
          }

          const formData = await request.formData();
          const rawTitle = formData.get("title") as string | null;
          const rawDescription = formData.get("description") as string | null;
          const rawDate = formData.get("date") as string | null;
          const rawMemoryDate = formData.get("memoryDate") as string | null;
          const rawLocation = formData.get("location") as string | null;
          const rawIcon = formData.get("icon") as string | null;
          const highlight = formData.get("highlight") === "true";

          const imageFile = formData.get("imageFile") as File | null;
          const videoFile = formData.get("videoFile") as File | null;
          const deleteImage = formData.get("deleteImage") === "true";
          const deleteVideo = formData.get("deleteVideo") === "true";

          if (rawTitle !== null) {
            const cleanTitle = sanitizePlainText(rawTitle, 150);
            if (cleanTitle) milestone.title = cleanTitle;
          }
          if (rawDescription !== null) milestone.description = sanitizePlainText(rawDescription, 1000);
          if (rawDate !== null) milestone.date = sanitizePlainText(rawDate, 50);
          if (rawMemoryDate !== null) milestone.memoryDate = sanitizePlainText(rawMemoryDate, 20);
          if (rawLocation !== null) milestone.location = sanitizePlainText(rawLocation, 100);
          if (rawIcon !== null) {
            const validIcons = ["heart", "coffee", "sparkles", "plane", "star"];
            if (validIcons.includes(rawIcon)) milestone.icon = rawIcon;
          }
          milestone.highlight = highlight;

          const db = mongoose.connection.db;
          if (!db) {
            return new Response(JSON.stringify({ error: "Database connection unavailable" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }
          const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "media" });

          // 2. Handle Image deletion or replacement
          if (deleteImage || (imageFile && imageFile instanceof File && imageFile.size > 0)) {
            if (milestone.imageFileId) {
              try {
                await bucket.delete(new mongoose.Types.ObjectId(milestone.imageFileId));
              } catch (err) {
                console.warn("GridFS old image delete warning:", err);
              }
              milestone.imageFileId = undefined;
            }
          }

          if (imageFile && imageFile instanceof File && imageFile.size > 0) {
            const imageArrayBuffer = await imageFile.arrayBuffer();
            const imageBuffer = Buffer.from(imageArrayBuffer);

            const imageValidation = validateMediaUpload(imageBuffer, imageFile.name, imageFile.type, "image");
            if (!imageValidation.valid) {
              return new Response(JSON.stringify({ error: imageValidation.error }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
              });
            }

            const imageFileId = await new Promise<mongoose.Types.ObjectId>((resolve, reject) => {
              const uploadStream = bucket.openUploadStream(imageValidation.safeFilename, {
                contentType: imageValidation.detectedMimeType || "image/jpeg",
              });
              uploadStream.on("finish", () => {
                resolve(uploadStream.id as mongoose.Types.ObjectId);
              });
              uploadStream.on("error", (err) => {
                reject(err);
              });
              uploadStream.write(imageBuffer);
              uploadStream.end();
            });
            milestone.imageFileId = imageFileId;
          }

          // 3. Handle Video deletion or replacement
          if (deleteVideo || (videoFile && videoFile instanceof File && videoFile.size > 0)) {
            if (milestone.videoFileId) {
              try {
                await bucket.delete(new mongoose.Types.ObjectId(milestone.videoFileId));
              } catch (err) {
                console.warn("GridFS old video delete warning:", err);
              }
              milestone.videoFileId = undefined;
            }
          }

          if (videoFile && videoFile instanceof File && videoFile.size > 0) {
            const videoArrayBuffer = await videoFile.arrayBuffer();
            const videoBuffer = Buffer.from(videoArrayBuffer);

            const videoValidation = validateMediaUpload(videoBuffer, videoFile.name, videoFile.type, "video");
            if (!videoValidation.valid) {
              return new Response(JSON.stringify({ error: videoValidation.error }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
              });
            }

            const videoFileId = await new Promise<mongoose.Types.ObjectId>((resolve, reject) => {
              const uploadStream = bucket.openUploadStream(videoValidation.safeFilename, {
                contentType: videoValidation.detectedMimeType || "video/mp4",
              });
              uploadStream.on("finish", () => {
                resolve(uploadStream.id as mongoose.Types.ObjectId);
              });
              uploadStream.on("error", (err) => {
                reject(err);
              });
              uploadStream.write(videoBuffer);
              uploadStream.end();
            });
            milestone.videoFileId = videoFileId;
          }

          await milestone.save();

          return new Response(JSON.stringify(milestone), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("Error updating timeline item:", error);
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
            return new Response(JSON.stringify({ error: "Invalid timeline ID format" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const milestone = await Timeline.findById(id);
          if (!milestone) {
            return new Response(JSON.stringify({ error: "Timeline item not found" }), {
              status: 404,
              headers: { "Content-Type": "application/json" },
            });
          }

          const db = mongoose.connection.db;
          if (db) {
            const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "media" });

            if (milestone.imageFileId) {
              try {
                await bucket.delete(new mongoose.Types.ObjectId(milestone.imageFileId));
              } catch (err) {
                console.warn("GridFS image delete warning:", err);
              }
            }

            if (milestone.videoFileId) {
              try {
                await bucket.delete(new mongoose.Types.ObjectId(milestone.videoFileId));
              } catch (err) {
                console.warn("GridFS video delete warning:", err);
              }
            }
          }

          await Timeline.findByIdAndDelete(id);

          return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("Error deleting timeline item:", error);
          return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
