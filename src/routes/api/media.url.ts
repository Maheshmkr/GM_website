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
  parseTimeString,
  extractAndNormalizeSpotifyTrackUrl,
} from "@/lib/security";

const MediaUrlSchema = z.object({
  title: z.string().min(1, "Title is required").max(150),
  description: z.string().max(1000).optional(),
  url: z.string().min(1, "Valid URL is required").max(2000),
  type: z.enum(["image", "video", "song"]),
  artist: z.string().max(100).optional(),
  category: z.string().max(50).optional(),
  memoryDate: z.string().max(20).optional(),
  sourceType: z.enum(["url", "spotify", "google-drive"]).optional(),
  startTime: z.string().max(20).optional(),
  endTime: z.string().max(20).optional(),
});

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

          const {
            title,
            description,
            url,
            type,
            artist,
            category,
            memoryDate,
            sourceType,
            startTime: rawStartTime,
            endTime: rawEndTime,
          } = parsed.data;

          const trimmedUrl = url.trim();
          const lowerUrl = trimmedUrl.toLowerCase();
          let determinedSource: "url" | "spotify" | "google-drive" = "url";
          let canonicalUrl = trimmedUrl;

          let validatedStartTime: string | undefined;
          let validatedStartSeconds: number | undefined;
          let validatedEndTime: string | undefined;
          let validatedEndSeconds: number | undefined;

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
              const spotifyResult = extractAndNormalizeSpotifyTrackUrl(trimmedUrl);
              if (!spotifyResult.valid || !spotifyResult.normalizedUrl) {
                return new Response(
                  JSON.stringify({ error: spotifyResult.error || "Invalid Spotify song URL" }),
                  { status: 400, headers: { "Content-Type": "application/json" } }
                );
              }
              determinedSource = "spotify";
              canonicalUrl = spotifyResult.normalizedUrl;

              // Validate Start Time
              const startParsed = parseTimeString(rawStartTime || "0:00");
              if (!startParsed.valid) {
                return new Response(
                  JSON.stringify({ error: startParsed.error || "Invalid start time format" }),
                  { status: 400, headers: { "Content-Type": "application/json" } }
                );
              }
              validatedStartTime = startParsed.formatted || "0:00";
              validatedStartSeconds = startParsed.seconds !== null ? startParsed.seconds : 0;

              // Validate Optional End Time
              if (rawEndTime && rawEndTime.trim()) {
                const endParsed = parseTimeString(rawEndTime);
                if (!endParsed.valid) {
                  return new Response(
                    JSON.stringify({ error: endParsed.error || "Invalid stop time format" }),
                    { status: 400, headers: { "Content-Type": "application/json" } }
                  );
                }
                validatedEndTime = endParsed.formatted || undefined;
                validatedEndSeconds = endParsed.seconds !== null ? endParsed.seconds : undefined;

                if (
                  validatedEndSeconds !== undefined &&
                  validatedStartSeconds !== undefined &&
                  validatedEndSeconds <= validatedStartSeconds
                ) {
                  return new Response(
                    JSON.stringify({ error: "Stop time must be greater than start time" }),
                    { status: 400, headers: { "Content-Type": "application/json" } }
                  );
                }
              }
            } else if (isGoogleDrive) {
              if (!validateUrlProtocolAndHost(trimmedUrl)) {
                return new Response(
                  JSON.stringify({ error: "Invalid or unsupported URL protocol/host" }),
                  { status: 400, headers: { "Content-Type": "application/json" } }
                );
              }
              const fileId = extractGoogleDriveFileId(trimmedUrl);
              if (!fileId) {
                return new Response(JSON.stringify({ error: "Invalid Google Drive URL" }), {
                  status: 400,
                  headers: { "Content-Type": "application/json" },
                });
              }
              determinedSource = "google-drive";
              canonicalUrl = `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
            } else {
              if (!validateUrlProtocolAndHost(trimmedUrl)) {
                return new Response(
                  JSON.stringify({ error: "Invalid or unsupported URL protocol/host" }),
                  { status: 400, headers: { "Content-Type": "application/json" } }
                );
              }
            }
          } else {
            if (!validateUrlProtocolAndHost(trimmedUrl)) {
              return new Response(
                JSON.stringify({ error: "Invalid or unsupported URL protocol/host" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
              );
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
            description: sanitizePlainText(description || "", 1000),
            artist: type === "song" ? sanitizePlainText(artist || "Unknown Artist", 100) : undefined,
            url: canonicalUrl,
            memoryDate: sanitizePlainText(memoryDate, 20) || new Date().toISOString().split("T")[0],
            category: sanitizePlainText(category || "Favorites", 50),
            startTime: validatedStartTime,
            startSeconds: validatedStartSeconds,
            endTime: validatedEndTime,
            endSeconds: validatedEndSeconds,
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
