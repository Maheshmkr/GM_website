import { createFileRoute } from "@tanstack/react-router";
import { dbConnect } from "@/lib/db";
import { User } from "@/lib/models";
import mongoose from "mongoose";

export const Route = createFileRoute("/api/users/$id")({
  server: {
    handlers: {
      DELETE: async ({ params, request }) => {
        try {
          // Verify admin role
          const cookieHeader = request.headers.get("cookie") || "";
          const cookies = cookieHeader.split(";").reduce((acc: Record<string, string>, cookie) => {
            const [name, value] = cookie.trim().split("=");
            if (name && value) acc[name] = value;
            return acc;
          }, {});
          const role = cookies["auth_role"];
          if (role !== "admin") {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
              status: 403,
              headers: { "Content-Type": "application/json" },
            });
          }

          await dbConnect();
          const { id } = params;

          if (!mongoose.Types.ObjectId.isValid(id)) {
            return new Response(JSON.stringify({ error: "Invalid user ID format" }), {
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
