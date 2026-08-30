/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { dbConnect } from "@/lib/db";
import { Song } from "@/lib/models";
import mongoose from "mongoose";

export const Route = createFileRoute("/api/songs/$id")({
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

          const song = await Song.findById(id);
          if (!song) {
            return new Response(JSON.stringify({ error: "Song not found" }), {
              status: 404,
              headers: { "Content-Type": "application/json" },
            });
          }

          const db = mongoose.connection.db;
          if (db) {
            const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "media" });

            // Delete song audio file from GridFS
            if (song.fileId) {
              try {
                await bucket.delete(song.fileId);
              } catch (err) {
                console.warn("GridFS audio file delete failed:", err);
              }
            }

            // Delete cover art image from GridFS if present
            if (song.coverFileId) {
              try {
                await bucket.delete(song.coverFileId);
              } catch (err) {
                console.warn("GridFS cover file delete failed:", err);
              }
            }
          }

          // Delete metadata document
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
