/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { dbConnect } from "@/lib/db";
import { MediaItem } from "@/lib/models";
import mongoose from "mongoose";

export const Route = createFileRoute("/api/media/$id")({
  server: {
    handlers: {
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

          const mediaItem = await MediaItem.findById(id);
          if (!mediaItem) {
            return new Response(JSON.stringify({ error: "Media item not found" }), {
              status: 404,
              headers: { "Content-Type": "application/json" },
            });
          }

          // If the media item is an uploaded file, delete its binary from GridFS
          if (mediaItem.source === "upload" && mediaItem.fileId) {
            const db = mongoose.connection.db;
            if (db) {
              const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "media" });
              try {
                await bucket.delete(mediaItem.fileId);
              } catch (err) {
                console.warn("GridFS file delete failed during media item deletion:", err);
              }
            }
          }

          // Remove the metadata from DB
          await MediaItem.findByIdAndDelete(id);

          return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("Error deleting media item:", error);
          return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
