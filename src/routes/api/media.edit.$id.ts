/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { dbConnect } from "@/lib/db";
import { MediaItem } from "@/lib/models";
import mongoose from "mongoose";

export const Route = createFileRoute("/api/media/edit/$id")({
  server: {
    handlers: {
      PUT: async ({ params, request }) => {
        try {
          await dbConnect();
          const { id } = params;
          const body = await request.json();
          const { title, artist, memoryDate, category, favorite } = body;

          if (!mongoose.Types.ObjectId.isValid(id)) {
            return new Response(JSON.stringify({ error: "Invalid document ID format" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const updateData: any = {};
          if (title !== undefined) updateData.title = title;
          if (artist !== undefined) updateData.artist = artist;
          if (memoryDate !== undefined) updateData.memoryDate = memoryDate;
          if (category !== undefined) updateData.category = category;
          if (favorite !== undefined) updateData.favorite = favorite;

          const updatedItem = await MediaItem.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true },
          );

          if (!updatedItem) {
            return new Response(JSON.stringify({ error: "Media item not found" }), {
              status: 404,
              headers: { "Content-Type": "application/json" },
            });
          }

          return new Response(JSON.stringify(updatedItem), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("Error updating media item:", error);
          return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
