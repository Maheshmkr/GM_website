/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { dbConnect } from "@/lib/db";
import { MediaItem, Song } from "@/lib/models";
import { requireAdmin, isValidObjectId } from "@/lib/security";
import mongoose from "mongoose";

export const Route = createFileRoute("/api/songs/$id")({
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
            return new Response(JSON.stringify({ error: "Invalid song ID format" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const item = (await MediaItem.findById(id)) || (await Song.findById(id));
          if (!item) {
            return new Response(JSON.stringify({ error: "Song not found" }), {
              status: 404,
              headers: { "Content-Type": "application/json" },
            });
          }

          const db = mongoose.connection.db;
          if (db) {
            const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "media" });

            // Delete song audio file from GridFS
            if (item.fileId) {
              try {
                await bucket.delete(new mongoose.Types.ObjectId(item.fileId));
              } catch (err) {
                console.warn("GridFS audio file deletion warning:", err);
              }
            }

            // Delete cover art image from GridFS if present
            if (item.coverFileId) {
              try {
                await bucket.delete(new mongoose.Types.ObjectId(item.coverFileId));
              } catch (err) {
                console.warn("GridFS cover file deletion warning:", err);
              }
            }
          }

          // Delete metadata document
          await MediaItem.findByIdAndDelete(id);
          await Song.findByIdAndDelete(id);

          return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("Error deleting song:", error);
          return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
