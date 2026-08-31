import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/auth/logout")({
  server: {
    handlers: {
      POST: async () => {
        try {
          return new Response(JSON.stringify({ success: true }), {
            headers: {
              "Content-Type": "application/json",
              "Set-Cookie": "auth_role=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0",
            },
          });
        } catch (error: any) {
          console.error("Error logging out:", error);
          return new Response(JSON.stringify({ error: error.message || String(error) }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
