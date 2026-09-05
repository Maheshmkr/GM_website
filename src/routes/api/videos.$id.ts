/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { dbConnect } from "@/lib/db";
import { MediaItem, Video } from "@/lib/models";
import { requireAdmin, isValidObjectId } from "@/lib/security";
import mongoose from "mongoose";

export const Route = createFileRoute("/api/videos/$id")({
  server: {
    handlers: {
      DELETE: async ({ params, request }) => {
        // 1. Authorization: Admin check
        const auth = requireAdmin(request);
        if ("errorResponse" in auth) {
          return auth.errorResponse;
        }

        try {
          await dbConnect();
          const { id } = params;

          // 2. Strict ID validation
          if (!isValidObjectId(id)) {
            return new Response(JSON.stringify({ error: "Invalid video ID format" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const item = (await MediaItem.findById(id)) || (await Video.findById(id));
          if (!item) {
            return new Response(JSON.stringify({ error: "Video not found" }), {
              status: 404,
              headers: { "Content-Type": "application/json" },
            });
          }

          // 3. Delete binary file from GridFS
          const db = mongoose.connection.db;
          if (db && item.fileId) {
            const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "media" });
            try {
              await bucket.delete(new mongoose.Types.ObjectId(item.fileId));
            } catch (err) {
              console.warn("GridFS file deletion warning (may already be deleted):", err);
            }
          }

          // 4. Delete metadata document
          await MediaItem.findByIdAndDelete(id);
          await Video.findByIdAndDelete(id);

          return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("Error deleting video:", error);
          return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
