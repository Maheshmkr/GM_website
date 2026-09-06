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
  parseTimeString,
  extractAndNormalizeSpotifyTrackUrl,
} from "@/lib/security";

const EditMediaSchema = z.object({
  title: z.string().min(1).max(150).optional(),
  artist: z.string().max(100).optional(),
  description: z.string().max(1000).optional(),
  url: z.string().max(2000).optional(),
  memoryDate: z.string().max(20).optional(),
  category: z.string().max(50).optional(),
  favorite: z.boolean().optional(),
  startTime: z.string().max(20).optional(),
  endTime: z.string().max(20).optional(),
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

          const existingItem = await MediaItem.findById(id);
          if (!existingItem) {
            return new Response(JSON.stringify({ error: "Media item not found" }), {
              status: 404,
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
          if (parsed.data.description !== undefined) updateData.description = sanitizePlainText(parsed.data.description, 1000);
          if (parsed.data.memoryDate !== undefined) updateData.memoryDate = sanitizePlainText(parsed.data.memoryDate, 20);
          if (parsed.data.category !== undefined) updateData.category = sanitizePlainText(parsed.data.category, 50);
          if (parsed.data.favorite !== undefined) updateData.favorite = parsed.data.favorite;

          // If updating Spotify URL
          if (parsed.data.url !== undefined) {
            const trimmedUrl = parsed.data.url.trim();
            if (existingItem.source === "spotify" || trimmedUrl.includes("spotify.com")) {
              const spotifyResult = extractAndNormalizeSpotifyTrackUrl(trimmedUrl);
              if (!spotifyResult.valid || !spotifyResult.normalizedUrl) {
                return new Response(
                  JSON.stringify({ error: spotifyResult.error || "Invalid Spotify song URL" }),
                  { status: 400, headers: { "Content-Type": "application/json" } }
                );
              }
              updateData.url = spotifyResult.normalizedUrl;
              updateData.source = "spotify";
            } else {
              updateData.url = trimmedUrl;
            }
          }

          // If updating start time
          let startSecs = existingItem.startSeconds ?? 0;
          if (parsed.data.startTime !== undefined) {
            const startParsed = parseTimeString(parsed.data.startTime);
            if (!startParsed.valid) {
              return new Response(
                JSON.stringify({ error: startParsed.error || "Invalid start time format" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
              );
            }
            updateData.startTime = startParsed.formatted || "0:00";
            updateData.startSeconds = startParsed.seconds !== null ? startParsed.seconds : 0;
            startSecs = updateData.startSeconds;
          }

          // If updating end time
          if (parsed.data.endTime !== undefined) {
            if (!parsed.data.endTime || !parsed.data.endTime.trim()) {
              updateData.endTime = undefined;
              updateData.endSeconds = undefined;
            } else {
              const endParsed = parseTimeString(parsed.data.endTime);
              if (!endParsed.valid) {
                return new Response(
                  JSON.stringify({ error: endParsed.error || "Invalid stop time format" }),
                  { status: 400, headers: { "Content-Type": "application/json" } }
                );
              }
              updateData.endTime = endParsed.formatted || undefined;
              updateData.endSeconds = endParsed.seconds !== null ? endParsed.seconds : undefined;

              if (
                updateData.endSeconds !== undefined &&
                updateData.endSeconds <= startSecs
              ) {
                return new Response(
                  JSON.stringify({ error: "Stop time must be greater than start time" }),
                  { status: 400, headers: { "Content-Type": "application/json" } }
                );
              }
            }
          }

          const updatedItem = await MediaItem.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
          );

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
