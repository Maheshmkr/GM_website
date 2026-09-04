/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { dbConnect } from "@/lib/db";
import { MediaItem } from "@/lib/models";

function extractSpotifyTrackId(url: string): string | null {
  const match = url.match(
    /(?:open\.spotify\.com\/(?:intl-[a-z]{2}\/)?track\/|spotify:track:)([a-zA-Z0-9]{22})/i,
  );
  return match ? match[1] : null;
}

function extractGoogleDriveFileId(url: string): string | null {
  const match = url.match(/(?:\/file\/d\/|[?&]id=)([a-zA-Z0-9_-]{20,})/i);
  return match ? match[1] : null;
}

export const Route = createFileRoute("/api/media/url")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          await dbConnect();
          const body = await request.json();
          const { title, artist, url, type, memoryDate, category, sourceType } = body;

          if (!type || !["image", "video", "song"].includes(type)) {
            return new Response(JSON.stringify({ error: "Invalid or missing media type" }), {
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

          const trimmedUrl = url.trim();
          const lowerUrl = trimmedUrl.toLowerCase();

          let determinedSource: "url" | "spotify" | "google-drive" = "url";
          let canonicalUrl = trimmedUrl;

          if (type === "song") {
            const isSpotify =
              sourceType === "spotify" ||
              lowerUrl.includes("spotify.com") ||
              lowerUrl.startsWith("spotify:track:");

            const isGoogleDrive =
              sourceType === "google-drive" ||
              lowerUrl.includes("drive.google.com") ||
              lowerUrl.includes("docs.google.com");

            if (isSpotify) {
              const trackId = extractSpotifyTrackId(trimmedUrl);
              if (!trackId) {
                return new Response(JSON.stringify({ error: "Invalid Spotify song URL" }), {
                  status: 400,
                  headers: { "Content-Type": "application/json" },
                });
              }
              determinedSource = "spotify";
              canonicalUrl = `https://open.spotify.com/track/${trackId}`;

              // Check duplicate in DB
              const existing = await MediaItem.findOne({
                type: "song",
                $or: [
                  { url: canonicalUrl },
                  { url: { $regex: trackId } },
                ],
              });
              if (existing) {
                return new Response(
                  JSON.stringify({ error: "This song has already been added." }),
                  { status: 400, headers: { "Content-Type": "application/json" } },
                );
              }
            } else if (isGoogleDrive) {
              const fileId = extractGoogleDriveFileId(trimmedUrl);
              if (!fileId) {
                return new Response(JSON.stringify({ error: "Invalid Google Drive URL" }), {
                  status: 400,
                  headers: { "Content-Type": "application/json" },
                });
              }
              determinedSource = "google-drive";
              canonicalUrl = `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;

              // Check duplicate in DB
              const existing = await MediaItem.findOne({
                type: "song",
                $or: [
                  { url: canonicalUrl },
                  { url: { $regex: fileId } },
                ],
              });
              if (existing) {
                return new Response(
                  JSON.stringify({ error: "This song has already been added." }),
                  { status: 400, headers: { "Content-Type": "application/json" } },
                );
              }
            } else {
              // Direct URL or generic audio URL validation
              try {
                new URL(trimmedUrl);
              } catch (_) {
                return new Response(JSON.stringify({ error: "Please enter a valid URL." }), {
                  status: 400,
                  headers: { "Content-Type": "application/json" },
                });
              }

              // Check restriction for non-direct URLs if not spotify/drive
              const isNonDirect =
                lowerUrl.includes("youtube.com") ||
                lowerUrl.includes("youtu.be") ||
                lowerUrl.includes("instagram.com") ||
                lowerUrl.includes("soundcloud.com");

              if (isNonDirect) {
                return new Response(
                  JSON.stringify({
                    error:
                      "This URL cannot be played directly as an audio file. Please use a Spotify URL, Google Drive URL, or direct audio link.",
                  }),
                  { status: 400, headers: { "Content-Type": "application/json" } },
                );
              }

              // Check duplicate
              const existing = await MediaItem.findOne({ type: "song", url: canonicalUrl });
              if (existing) {
                return new Response(
                  JSON.stringify({ error: "This song has already been added." }),
                  { status: 400, headers: { "Content-Type": "application/json" } },
                );
              }
            }
          } else {
            // Photos/Videos URL validation
            try {
              new URL(trimmedUrl);
            } catch (_) {
              return new Response(JSON.stringify({ error: "Please enter a valid URL." }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
              });
            }

            const isNonDirect =
              lowerUrl.includes("youtube.com") ||
              lowerUrl.includes("youtu.be") ||
              lowerUrl.includes("spotify.com") ||
              lowerUrl.includes("instagram.com") ||
              lowerUrl.includes("soundcloud.com");

            if (isNonDirect) {
              const errorMsg =
                type === "video"
                  ? "This URL cannot be played directly as a video file. Please use a direct video URL."
                  : "This URL cannot be rendered directly as an image. Please use a direct image URL.";
              return new Response(JSON.stringify({ error: errorMsg }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
              });
            }
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

          // Create media item in database
          const mediaItem = new MediaItem({
            type,
            source: determinedSource,
            title: title.trim(),
            artist: type === "song" ? (artist ? artist.trim() : "Unknown Artist") : undefined,
            url: canonicalUrl,
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
          return new Response(
            JSON.stringify({ error: error.message || "Internal server error" }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
      },
    },
  },
});
