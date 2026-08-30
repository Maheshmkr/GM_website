/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { dbConnect } from "@/lib/db";
import { Timeline } from "@/lib/models";
import mongoose from "mongoose";

export const Route = createFileRoute("/api/timeline")({
  server: {
    handlers: {
      GET: async () => {
        try {
          await dbConnect();
          const milestones = await Timeline.find().sort({ memoryDate: 1, date: 1, createdAt: 1 }); // chronological order
          return new Response(JSON.stringify(milestones), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("Error fetching timeline:", error);
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
          const title = formData.get("title") as string | null;
          const description = formData.get("description") as string | null;
          const date = formData.get("date") as string | null;
          const memoryDate = formData.get("memoryDate") as string | null;
          const location = formData.get("location") as string | null;
          const icon = formData.get("icon") as string | null;
          const highlight = formData.get("highlight") === "true";

          const imageFile = formData.get("imageFile") as File | null;
          const videoFile = formData.get("videoFile") as File | null;

          if (!title || !date) {
            return new Response(JSON.stringify({ error: "Title and Date are required" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const db = mongoose.connection.db;
          if (!db) {
            return new Response(JSON.stringify({ error: "Database connection failed" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }
          const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "media" });

          // Upload Image if present
          let imageFileId: mongoose.Types.ObjectId | undefined;
          if (imageFile && imageFile.size > 0) {
            const allowedImageMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
            if (
              allowedImageMimeTypes.includes(imageFile.type) ||
              imageFile.name.match(/\.(jpg|jpeg|png|webp|gif)$/i)
            ) {
              const imageArrayBuffer = await imageFile.arrayBuffer();
              const imageBuffer = Buffer.from(imageArrayBuffer);

              imageFileId = await new Promise<mongoose.Types.ObjectId>((resolve, reject) => {
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
            }
          }

          // Upload Video if present
          let videoFileId: mongoose.Types.ObjectId | undefined;
          if (videoFile && videoFile.size > 0) {
            const allowedVideoMimeTypes = ["video/mp4", "video/webm", "video/quicktime"];
            if (
              allowedVideoMimeTypes.includes(videoFile.type) ||
              videoFile.name.match(/\.(mp4|webm|mov)$/i)
            ) {
              const videoArrayBuffer = await videoFile.arrayBuffer();
              const videoBuffer = Buffer.from(videoArrayBuffer);

              videoFileId = await new Promise<mongoose.Types.ObjectId>((resolve, reject) => {
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
            }
          }

          // Save Timeline item
          const milestone = new Timeline({
            title,
            description: description || "",
            date: date || (memoryDate ? new Date(memoryDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : ""),
            memoryDate: memoryDate || (date && !isNaN(Date.parse(date)) ? new Date(date).toISOString().split("T")[0] : undefined),
            location: location || "",
            imageFileId,
            videoFileId,
            icon: icon || "heart",
            highlight,
          });
          await milestone.save();

          return new Response(JSON.stringify(milestone), {
            status: 201,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("Error creating timeline item:", error);
          return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
