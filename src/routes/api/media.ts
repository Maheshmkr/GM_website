/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { dbConnect } from "@/lib/db";
import { MediaItem, Photo } from "@/lib/models";

export const Route = createFileRoute("/api/media")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          await dbConnect();
          const url = new URL(request.url);
          const rawType = url.searchParams.get("type");

          const filter: any = {};
          if (rawType && ["image", "video", "song"].includes(rawType)) {
            filter.type = rawType;
          }

          const items: any[] = await MediaItem.find(filter)
            .select("-__v")
            .sort({ createdAt: -1 })
            .lean();

          if (!rawType || rawType === "image") {
            const legacyPhotos = await Photo.find().select("-__v").sort({ createdAt: -1 }).lean();
            const existingIds = new Set(items.map((it: any) => String(it._id)));
            for (const lp of legacyPhotos) {
              if (!existingIds.has(String(lp._id))) {
                items.push({
                  ...lp,
                  type: "image",
                  source: "upload",
                });
              }
            }
          }

          return new Response(JSON.stringify(items), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("Error fetching media:", error);
          return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
