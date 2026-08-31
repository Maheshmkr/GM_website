import { createFileRoute } from "@tanstack/react-router";
import { dbConnect } from "@/lib/db";
import { User } from "@/lib/models";
import crypto from "crypto";

export const Route = createFileRoute("/api/users")({
  server: {
    handlers: {
      GET: async ({ request }) => {
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
          const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
          return new Response(JSON.stringify(users), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("Error listing users:", error);
          return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
      POST: async ({ request }) => {
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

          const body = await request.json();
          const { username, password } = body;

          if (!username || typeof username !== "string" || !username.trim()) {
            return new Response(JSON.stringify({ error: "Username is required" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          if (!password || typeof password !== "string" || !password.trim()) {
            return new Response(JSON.stringify({ error: "Password is required" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const cleanUsername = username.trim();

          await dbConnect();

          // Check if username is "admin" to avoid conflicts with global env admin account
          if (cleanUsername.toLowerCase() === "admin") {
            return new Response(JSON.stringify({ error: "Username 'admin' is reserved" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const existingUser = await User.findOne({ username: cleanUsername });
          if (existingUser) {
            return new Response(JSON.stringify({ error: "Username already exists" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

          const newUser = await User.create({
            username: cleanUsername,
            password: hashedPassword,
            role: "user",
          });

          // Return created user (exclude password from response)
          const responseUser = {
            _id: newUser._id,
            username: newUser.username,
            role: newUser.role,
            createdAt: newUser.createdAt,
          };

          return new Response(JSON.stringify({ success: true, user: responseUser }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("Error creating user:", error);
          return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
