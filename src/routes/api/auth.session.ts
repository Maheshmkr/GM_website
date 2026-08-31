import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/auth/session")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const cookieHeader = request.headers.get("cookie") || "";
          const cookies = cookieHeader.split(";").reduce((acc: Record<string, string>, cookie) => {
            const [name, value] = cookie.trim().split("=");
            if (name && value) acc[name] = value;
            return acc;
          }, {});
          const role = (cookies["auth_role"] as "admin" | "user" | null) || null;

          return new Response(
            JSON.stringify({ role }),
            {
              headers: { "Content-Type": "application/json" },
            },
          );
        } catch (error: any) {
          console.error("Error getting auth session:", error);
          return new Response(JSON.stringify({ role: null, error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
