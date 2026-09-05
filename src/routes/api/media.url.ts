/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { dbConnect } from "@/lib/db";
import { MediaItem } from "@/lib/models";
import {
  requireAdmin,
  checkRateLimit,
  mutationRateLimiter,
  createRateLimitResponse,
  sanitizeMongoInput,
  sanitizePlainText,
} from "@/lib/security";

const MediaUrlSchema = z.object({
  title: z.string().min(1, "Title is required").max(150),
  url: z.string().url("Valid URL is required").max(2000),
  type: z.enum(["image", "video", "song"]),
  artist: z.string().max(100).optional(),
  category: z.string().max(50).optional(),
  memoryDate: z.string().max(20).optional(),
  sourceType: z.enum(["url", "spotify", "google-drive"]).optional(),
});

function extractSpotifyTrackId(url: string): string | null {
  const match = url.match(
    /(?:open\.spotify\.com\/(?:intl-[a-z]{2}\/)?track\/|spotify:track:)([a-zA-Z0-9]{22})/i
  );
  return match ? match[1] : null;
}

function extractGoogleDriveFileId(url: string): string | null {
  const match = url.match(/(?:\/file\/d\/|[?&]id=)([a-zA-Z0-9_-]{20,})/i);
  return match ? match[1] : null;
}

function validateUrlProtocolAndHost(urlString: string): boolean {
  try {
    const parsed = new URL(urlString);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return false;
    }
    const hostname = parsed.hostname.toLowerCase();
    // Prevent SSRF / local requests
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1" ||
      hostname.startsWith("10.") ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("172.16.") ||
      hostname.startsWith("169.254.") ||
      hostname.endsWith(".internal") ||
      hostname.endsWith(".local")
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export const Route = createFileRoute("/api/media/url")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // 1. Authorization: Admin check
        const auth = requireAdmin(request);
        if ("errorResponse" in auth) {
          return auth.errorResponse;
        }

        // 2. Rate Limiting
        const rateCheck = checkRateLimit(request, mutationRateLimiter);
        if (!rateCheck.allowed) {
          return createRateLimitResponse(rateCheck.retryAfterSeconds);
        }

        try {
          await dbConnect();
          const rawBody = await request.json().catch(() => null);
          if (!rawBody || typeof rawBody !== "object") {
            return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const parsed = MediaUrlSchema.safeParse(sanitizeMongoInput(rawBody));
          if (!parsed.success) {
            return new Response(
              JSON.stringify({ error: parsed.error.issues[0]?.message || "Validation failed" }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          const { title, url, type, artist, category, memoryDate, sourceType } = parsed.data;

          if (!validateUrlProtocolAndHost(url)) {
            return new Response(
              JSON.stringify({ error: "Invalid or unsupported URL protocol/host" }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
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
            }
          }

          // Check duplicate
          const existing = await MediaItem.findOne({ type, url: canonicalUrl });
          if (existing) {
            return new Response(
              JSON.stringify({ error: "This media URL has already been added." }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          const mediaItem = new MediaItem({
            type,
            source: determinedSource,
            title: sanitizePlainText(title, 150),
            artist: type === "song" ? sanitizePlainText(artist || "Unknown Artist", 100) : undefined,
            url: canonicalUrl,
            memoryDate: sanitizePlainText(memoryDate, 20) || new Date().toISOString().split("T")[0],
            category: sanitizePlainText(category || "Favorites", 50),
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
