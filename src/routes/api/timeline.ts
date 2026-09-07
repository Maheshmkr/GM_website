/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { dbConnect } from "@/lib/db";
import { Timeline } from "@/lib/models";
import {
  requireAdmin,
  validateMediaUpload,
  checkRateLimit,
  mutationRateLimiter,
  createRateLimitResponse,
  sanitizePlainText,
} from "@/lib/security";
import mongoose from "mongoose";

export const Route = createFileRoute("/api/timeline")({
  server: {
    handlers: {
      GET: async () => {
        try {
          await dbConnect();
          const milestones = await Timeline.find().select("-__v");

          const sortedMilestones = [...milestones].sort((a: any, b: any) => {
            const getTimestamp = (item: any) => {
              const memoryDate = item.memoryDate ? String(item.memoryDate).trim() : "";
              if (memoryDate) {
                const t = Date.parse(memoryDate);
                if (!isNaN(t)) return t;
              }
              const dateStr = item.date ? String(item.date).trim() : "";
              if (dateStr) {
                if (
                  dateStr.toLowerCase() === "forever" ||
                  dateStr.toLowerCase().includes("future") ||
                  dateStr.toLowerCase().includes("many more")
                ) {
                  return 9999999999999;
                }
                const t = Date.parse(dateStr);
                if (!isNaN(t)) return t;
              }
              if (item.createdAt) {
                const t = new Date(item.createdAt).getTime();
                if (!isNaN(t)) return t;
              }
              return 0;
            };

            return getTimestamp(a) - getTimestamp(b);
          });

          return new Response(JSON.stringify(sortedMilestones), {
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
        // 1. Authorization: Admin check
        const auth = requireAdmin(request);
        if ("errorResponse" in auth) {
          return auth.errorResponse;
        }

        // 2. Rate Limiting
        const rateCheck = checkRateLimit(request, mutationRateLimiter);
        if (!rateCheck.allowed) {
          return createRateLimitResponse(rateCheck.retryAfterSeconds);
        }

        try {
          await dbConnect();
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

          const title = sanitizePlainText(rawTitle, 150);
          const date = sanitizePlainText(rawDate, 50);

          if (!title) {
            return new Response(JSON.stringify({ error: "Title is required" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const description = sanitizePlainText(rawDescription, 1000);
          const memoryDate = sanitizePlainText(rawMemoryDate, 20) || (date && !isNaN(Date.parse(date)) ? new Date(date).toISOString().split("T")[0] : undefined);
          const location = sanitizePlainText(rawLocation, 100);
          const validIcons = ["heart", "coffee", "sparkles", "plane", "star"];
          const icon = validIcons.includes(rawIcon || "") ? rawIcon : "heart";

          const db = mongoose.connection.db;
          if (!db) {
            return new Response(JSON.stringify({ error: "Database connection unavailable" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }
          const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "media" });

          // 3. Upload Image if present with Magic Bytes validation
          let imageFileId: mongoose.Types.ObjectId | undefined;
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

            imageFileId = await new Promise<mongoose.Types.ObjectId>((resolve, reject) => {
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
          }

          // 4. Upload Video if present with Magic Bytes validation
          let videoFileId: mongoose.Types.ObjectId | undefined;
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

            videoFileId = await new Promise<mongoose.Types.ObjectId>((resolve, reject) => {
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
          }

          // 5. Save Timeline milestone
          const milestone = new Timeline({
            title,
            description,
            date: date || (memoryDate ? new Date(memoryDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : ""),
            memoryDate,
            location,
            imageFileId,
            videoFileId,
            icon,
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
