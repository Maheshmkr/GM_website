/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { getAuthSession } from "@/lib/security";

export const Route = createFileRoute("/api/auth/session")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const session = getAuthSession(request);

          return new Response(
            JSON.stringify({
              authenticated: !!session,
              role: session?.role || null,
              username: session?.username || null,
              userId: session?.userId || null,
            }),
            {
              headers: { "Content-Type": "application/json" },
            }
          );
        } catch (error: any) {
          console.error("Error getting auth session:", error);
          return new Response(
            JSON.stringify({
              authenticated: false,
              role: null,
              error: "Failed to retrieve session",
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      },
    },
  },
});
