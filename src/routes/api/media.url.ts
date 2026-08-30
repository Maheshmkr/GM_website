/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { dbConnect } from "@/lib/db";
import { MediaItem } from "@/lib/models";

export const Route = createFileRoute("/api/media/url")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          await dbConnect();
          const body = await request.json();
          const { title, artist, url, type, memoryDate, category } = body;

          if (!type || !["image", "video", "song"].includes(type)) {
            return new Response(JSON.stringify({ error: "Invalid or missing media type" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          if (!title || !title.trim()) {
            return new Response(JSON.stringify({ error: "Title is required" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          if (type === "song" && (!artist || !artist.trim())) {
            return new Response(JSON.stringify({ error: "Artist name is required for songs" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          if (!url || !url.trim()) {
            return new Response(JSON.stringify({ error: "Media URL is required" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          // Validate URL format
          try {
            new URL(url);
          } catch (_) {
            return new Response(JSON.stringify({ error: "Please enter a valid URL." }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          // Validate against direct playability restrictions
          const lowerUrl = url.toLowerCase();
          const isNonDirect =
            lowerUrl.includes("youtube.com") ||
            lowerUrl.includes("youtu.be") ||
            lowerUrl.includes("spotify.com") ||
            lowerUrl.includes("instagram.com") ||
            lowerUrl.includes("soundcloud.com");

          if (isNonDirect) {
            let errorMsg = "This URL cannot be played directly.";
            if (type === "song") {
              errorMsg = "This URL cannot be played directly as an audio file. Please use a direct audio URL.";
            } else if (type === "video") {
              errorMsg = "This URL cannot be played directly as a video file. Please use a direct video URL.";
            } else if (type === "image") {
              errorMsg = "This URL cannot be rendered directly as an image. Please use a direct image URL.";
            }
            return new Response(JSON.stringify({ error: errorMsg }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          // Create media item in database
          const mediaItem = new MediaItem({
            type,
            source: "url",
            title,
            artist: type === "song" ? artist : undefined,
            url,
            memoryDate: memoryDate || new Date().toISOString().split("T")[0],
            category: category || "Favorites",
          });
          await mediaItem.save();

          return new Response(JSON.stringify(mediaItem), {
            status: 201,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("Error creating URL media item:", error);
          return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
