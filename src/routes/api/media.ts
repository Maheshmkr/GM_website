/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { dbConnect } from "@/lib/db";
import { MediaItem } from "@/lib/models";

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

          const items = await MediaItem.find(filter)
            .select("-__v")
            .sort({ createdAt: -1 });

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
