/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { dbConnect } from "@/lib/db";
import { User } from "@/lib/models";
import { requireAdmin, isValidObjectId } from "@/lib/security";

export const Route = createFileRoute("/api/users/$id")({
  server: {
    handlers: {
      DELETE: async ({ params, request }) => {
        // 1. Authorization: Admin check
        const auth = requireAdmin(request);
        if ("errorResponse" in auth) {
          return auth.errorResponse;
        }

        try {
          await dbConnect();
          const { id } = params;

          if (!isValidObjectId(id)) {
            return new Response(JSON.stringify({ error: "Invalid user ID format" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          // Prevent self-deletion if session userId matches
          if (auth.session.userId === id) {
            return new Response(JSON.stringify({ error: "Cannot delete your own active user account" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const user = await User.findById(id);
          if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), {
              status: 404,
              headers: { "Content-Type": "application/json" },
            });
          }

          await User.findByIdAndDelete(id);

          return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("Error deleting user:", error);
          return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
