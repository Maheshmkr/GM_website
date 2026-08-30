/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { dbConnect } from "@/lib/db";
import { Timeline } from "@/lib/models";
import mongoose from "mongoose";

export const Route = createFileRoute("/api/timeline/$id")({
  server: {
    handlers: {
      PUT: async ({ request, params }) => {
        try {
          await dbConnect();
          const { id } = params;

          if (!mongoose.Types.ObjectId.isValid(id)) {
            return new Response(JSON.stringify({ error: "Invalid document ID format" }), {
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
          const title = formData.get("title") as string | null;
          const description = formData.get("description") as string | null;
          const date = formData.get("date") as string | null;
          const memoryDate = formData.get("memoryDate") as string | null;
          const location = formData.get("location") as string | null;
          const icon = formData.get("icon") as string | null;
          const highlight = formData.get("highlight") === "true";

          const imageFile = formData.get("imageFile") as File | null;
          const videoFile = formData.get("videoFile") as File | null;
          const deleteImage = formData.get("deleteImage") === "true";
          const deleteVideo = formData.get("deleteVideo") === "true";

          if (title) milestone.title = title;
          if (description !== null) milestone.description = description;
          if (date) {
            milestone.date = date;
          } else if (memoryDate) {
            milestone.date = new Date(memoryDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
          }
          if (memoryDate) {
            milestone.memoryDate = memoryDate;
          }
          if (location !== null) milestone.location = location;
          if (icon) milestone.icon = icon;
          milestone.highlight = highlight;

          const db = mongoose.connection.db;
          if (!db) {
            return new Response(JSON.stringify({ error: "Database connection failed" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }
          const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "media" });

          // Handle Image deletion or update
          if (deleteImage || (imageFile && imageFile.size > 0)) {
            if (milestone.imageFileId) {
              try {
                await bucket.delete(milestone.imageFileId);
              } catch (err) {
                console.warn("GridFS old image delete failed:", err);
              }
              milestone.imageFileId = undefined;
            }
          }

          if (imageFile && imageFile.size > 0) {
            const allowedImageMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
            if (
              allowedImageMimeTypes.includes(imageFile.type) ||
              imageFile.name.match(/\.(jpg|jpeg|png|webp|gif)$/i)
            ) {
              const imageArrayBuffer = await imageFile.arrayBuffer();
              const imageBuffer = Buffer.from(imageArrayBuffer);

              const imageFileId = await new Promise<mongoose.Types.ObjectId>((resolve, reject) => {
                const uploadStream = bucket.openUploadStream(imageFile.name, {
                  contentType: imageFile.type || "image/jpeg",
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
          }

          // Handle Video deletion or update
          if (deleteVideo || (videoFile && videoFile.size > 0)) {
            if (milestone.videoFileId) {
              try {
                await bucket.delete(milestone.videoFileId);
              } catch (err) {
                console.warn("GridFS old video delete failed:", err);
              }
              milestone.videoFileId = undefined;
            }
          }

          if (videoFile && videoFile.size > 0) {
            const allowedVideoMimeTypes = ["video/mp4", "video/webm", "video/quicktime"];
            if (
              allowedVideoMimeTypes.includes(videoFile.type) ||
              videoFile.name.match(/\.(mp4|webm|mov)$/i)
            ) {
              const videoArrayBuffer = await videoFile.arrayBuffer();
              const videoBuffer = Buffer.from(videoArrayBuffer);

              const videoFileId = await new Promise<mongoose.Types.ObjectId>((resolve, reject) => {
                const uploadStream = bucket.openUploadStream(videoFile.name, {
                  contentType: videoFile.type || "video/mp4",
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
      DELETE: async ({ params }) => {
        try {
          await dbConnect();
          const { id } = params;

          if (!mongoose.Types.ObjectId.isValid(id)) {
            return new Response(JSON.stringify({ error: "Invalid document ID format" }), {
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

            // Delete attached image from GridFS
            if (milestone.imageFileId) {
              try {
                await bucket.delete(milestone.imageFileId);
              } catch (err) {
                console.warn("GridFS image delete failed:", err);
              }
            }

            // Delete attached video from GridFS
            if (milestone.videoFileId) {
              try {
                await bucket.delete(milestone.videoFileId);
              } catch (err) {
                console.warn("GridFS video delete failed:", err);
              }
            }
          }

          // Delete metadata document
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
