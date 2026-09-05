/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { dbConnect } from "@/lib/db";
import { MediaItem } from "@/lib/models";
import {
  requireAdmin,
  isValidObjectId,
  sanitizeMongoInput,
  sanitizePlainText,
} from "@/lib/security";

const EditMediaSchema = z.object({
  title: z.string().min(1).max(150).optional(),
  artist: z.string().max(100).optional(),
  memoryDate: z.string().max(20).optional(),
  category: z.string().max(50).optional(),
  favorite: z.boolean().optional(),
});

export const Route = createFileRoute("/api/media/edit/$id")({
  server: {
    handlers: {
      PUT: async ({ params, request }) => {
        // 1. Authorization: Admin check
        const auth = requireAdmin(request);
        if ("errorResponse" in auth) {
          return auth.errorResponse;
        }

        try {
          await dbConnect();
          const { id } = params;

          if (!isValidObjectId(id)) {
            return new Response(JSON.stringify({ error: "Invalid document ID format" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const rawBody = await request.json().catch(() => null);
          if (!rawBody || typeof rawBody !== "object") {
            return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const parsed = EditMediaSchema.safeParse(sanitizeMongoInput(rawBody));
          if (!parsed.success) {
            return new Response(
              JSON.stringify({ error: parsed.error.issues[0]?.message || "Validation failed" }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          const updateData: any = {};
          if (parsed.data.title !== undefined) updateData.title = sanitizePlainText(parsed.data.title, 150);
          if (parsed.data.artist !== undefined) updateData.artist = sanitizePlainText(parsed.data.artist, 100);
          if (parsed.data.memoryDate !== undefined) updateData.memoryDate = sanitizePlainText(parsed.data.memoryDate, 20);
          if (parsed.data.category !== undefined) updateData.category = sanitizePlainText(parsed.data.category, 50);
          if (parsed.data.favorite !== undefined) updateData.favorite = parsed.data.favorite;

          const updatedItem = await MediaItem.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
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
