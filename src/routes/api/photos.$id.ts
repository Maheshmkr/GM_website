/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { dbConnect } from "@/lib/db";
import { Photo } from "@/lib/models";
import mongoose from "mongoose";

export const Route = createFileRoute("/api/photos/$id")({
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

          const photo = await Photo.findById(id);
          if (!photo) {
            return new Response(JSON.stringify({ error: "Photo not found" }), {
              status: 404,
              headers: { "Content-Type": "application/json" },
            });
          }

          // Delete binary file from GridFS
          const db = mongoose.connection.db;
          if (db && photo.fileId) {
            const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "media" });
            try {
              await bucket.delete(photo.fileId);
            } catch (err) {
              console.warn("GridFS file delete failed (it may have been deleted already):", err);
            }
          }

          // Delete metadata document
          await Photo.findByIdAndDelete(id);

          return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("Error deleting photo:", error);
          return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
