/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { dbConnect } from "@/lib/db";
import { FunZoneStage } from "@/lib/models";
import mongoose from "mongoose";

const STAGE_TITLES: Record<number, string> = {
  1: "Stage 1 — Normal",
  2: "Stage 2 — Small Injury",
  3: "Stage 3 — Bruise",
  4: "Stage 4 — Bandage",
  5: "Stage 5 — Maximum Injury",
};

export const Route = createFileRoute("/api/fun/stages")({
  server: {
    handlers: {
      GET: async () => {
        try {
          await dbConnect();
          const stages = await FunZoneStage.find({}).sort({ stage: 1 });

          const stageData = stages.map((s) => ({
            _id: s._id,
            stage: s.stage,
            title: s.title || STAGE_TITLES[s.stage] || `Stage ${s.stage}`,
            filename: s.filename,
            mimeType: s.mimeType,
            fileSize: s.fileSize,
            fileId: s.fileId,
            url: `/api/media/file/${s.fileId}`,
            updatedAt: s.updatedAt,
          }));

          return new Response(JSON.stringify(stageData), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("Error fetching fun zone stages:", error);
          return new Response(
            JSON.stringify({ error: "Internal server error" }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      },
      POST: async ({ request }) => {
        try {
          // Verify admin authorization
          const cookieHeader = request.headers.get("cookie") || "";
          const cookies = cookieHeader
            .split(";")
            .reduce((acc: Record<string, string>, cookie) => {
              const [name, value] = cookie.trim().split("=");
              if (name && value) acc[name] = value;
              return acc;
            }, {});
          const role = cookies["auth_role"];

          if (role !== "admin") {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
              status: 403,
              headers: { "Content-Type": "application/json" },
            });
          }

          await dbConnect();
          const formData = await request.formData();
          const file = formData.get("file") as File | null;
          const stageStr = formData.get("stage") as string | null;

          if (!stageStr) {
            return new Response(
              JSON.stringify({ error: "Stage number is required" }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          const stageNum = parseInt(stageStr, 10);
          if (isNaN(stageNum) || stageNum < 1 || stageNum > 5) {
            return new Response(
              JSON.stringify({ error: "Stage must be a number between 1 and 5" }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          if (!file) {
            return new Response(
              JSON.stringify({ error: "No image file provided" }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          // Validate MIME type
          const allowedMimeTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
          ];
          if (!allowedMimeTypes.includes(file.type)) {
            return new Response(
              JSON.stringify({
                error: `Invalid MIME type: ${file.type}. Allowed: JPEG, PNG, WEBP, GIF.`,
              }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          // Validate extension
          const ext = file.name.split(".").pop()?.toLowerCase();
          const allowedExtensions = ["jpg", "jpeg", "png", "webp", "gif"];
          if (!ext || !allowedExtensions.includes(ext)) {
            return new Response(
              JSON.stringify({
                error: `Invalid file extension. Allowed: jpg, jpeg, png, webp, gif.`,
              }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          // Validate size (10MB limit)
          const MAX_SIZE = 10 * 1024 * 1024;
          if (file.size > MAX_SIZE) {
            return new Response(
              JSON.stringify({
                error: `File size exceeds the limit of 10MB (actual: ${(file.size / 1024 / 1024).toFixed(2)}MB)`,
              }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          const db = mongoose.connection.db;
          if (!db) {
            return new Response(
              JSON.stringify({ error: "Database connection failed" }),
              {
                status: 500,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          const bucket = new mongoose.mongo.GridFSBucket(db, {
            bucketName: "media",
          });

          // Check for existing stage to clean up previous file
          const existingStage = await FunZoneStage.findOne({ stage: stageNum });
          if (existingStage && existingStage.fileId) {
            try {
              await bucket.delete(new mongoose.Types.ObjectId(existingStage.fileId));
            } catch (cleanupErr) {
              console.warn("Could not delete old stage file from GridFS:", cleanupErr);
            }
          }

          // Upload binary to GridFS
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          const fileId = await new Promise<mongoose.Types.ObjectId>(
            (resolve, reject) => {
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
            }
          );

          const title = STAGE_TITLES[stageNum] || `Stage ${stageNum}`;

          const updatedStage = await FunZoneStage.findOneAndUpdate(
            { stage: stageNum },
            {
              stage: stageNum,
              title,
              filename: file.name,
              mimeType: file.type,
              fileSize: file.size,
              fileId,
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );

          return new Response(
            JSON.stringify({
              success: true,
              stage: {
                _id: updatedStage._id,
                stage: updatedStage.stage,
                title: updatedStage.title,
                filename: updatedStage.filename,
                mimeType: updatedStage.mimeType,
                fileSize: updatedStage.fileSize,
                fileId: updatedStage.fileId,
                url: `/api/media/file/${updatedStage.fileId}`,
                updatedAt: updatedStage.updatedAt,
              },
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }
          );
        } catch (error: any) {
          console.error("Error uploading fun zone stage image:", error);
          return new Response(
            JSON.stringify({ error: "Internal server error" }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      },
      DELETE: async ({ request }) => {
        try {
          // Verify admin authorization
          const cookieHeader = request.headers.get("cookie") || "";
          const cookies = cookieHeader
            .split(";")
            .reduce((acc: Record<string, string>, cookie) => {
              const [name, value] = cookie.trim().split("=");
              if (name && value) acc[name] = value;
              return acc;
            }, {});
          const role = cookies["auth_role"];

          if (role !== "admin") {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
              status: 403,
              headers: { "Content-Type": "application/json" },
            });
          }

          await dbConnect();
          const url = new URL(request.url);
          const stageStr = url.searchParams.get("stage");

          if (!stageStr) {
            return new Response(
              JSON.stringify({ error: "Stage parameter is required" }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          const stageNum = parseInt(stageStr, 10);
          if (isNaN(stageNum) || stageNum < 1 || stageNum > 5) {
            return new Response(
              JSON.stringify({ error: "Invalid stage number (must be 1-5)" }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          const db = mongoose.connection.db;
          if (!db) {
            return new Response(
              JSON.stringify({ error: "Database connection failed" }),
              {
                status: 500,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          const existingStage = await FunZoneStage.findOne({ stage: stageNum });
          if (!existingStage) {
            return new Response(
              JSON.stringify({ error: `Stage ${stageNum} image not found in database` }),
              {
                status: 404,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          // Delete file binary from GridFS
          if (existingStage.fileId) {
            try {
              const bucket = new mongoose.mongo.GridFSBucket(db, {
                bucketName: "media",
              });
              await bucket.delete(new mongoose.Types.ObjectId(existingStage.fileId));
            } catch (cleanupErr) {
              console.warn("Could not delete stage file from GridFS:", cleanupErr);
            }
          }

          // Delete stage document from MongoDB
          await FunZoneStage.deleteOne({ stage: stageNum });

          return new Response(
            JSON.stringify({
              success: true,
              message: `Stage ${stageNum} image deleted successfully from database and storage`,
              stage: stageNum,
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }
          );
        } catch (error: any) {
          console.error("Error deleting fun zone stage image:", error);
          return new Response(
            JSON.stringify({ error: "Internal server error" }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      },
    },
  },
});
