/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { dbConnect } from "@/lib/db";
import { User } from "@/lib/models";
import {
  requireAdmin,
  hashPassword,
  checkRateLimit,
  mutationRateLimiter,
  createRateLimitResponse,
  sanitizeMongoInput,
  sanitizePlainText,
} from "@/lib/security";

const CreateUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(30),
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
  role: z.enum(["user"]).optional(), // Disallow client-specified admin role creation to prevent privilege escalation
});

export const Route = createFileRoute("/api/users")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        // 1. Authorization: Admin check
        const auth = requireAdmin(request);
        if ("errorResponse" in auth) {
          return auth.errorResponse;
        }

        try {
          await dbConnect();
          const users = await User.find({}, { password: 0, __v: 0 }).sort({ createdAt: -1 });

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
          const rawBody = await request.json().catch(() => null);
          if (!rawBody || typeof rawBody !== "object") {
            return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          // 3. Zod schema validation
          const parsed = CreateUserSchema.safeParse(sanitizeMongoInput(rawBody));
          if (!parsed.success) {
            return new Response(
              JSON.stringify({ error: parsed.error.issues[0]?.message || "Validation failed" }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          const { username, password } = parsed.data;
          const cleanUsername = sanitizePlainText(username, 30).toLowerCase();

          // Reject reserved usernames
          if (cleanUsername === "admin" || cleanUsername === "root" || cleanUsername === "administrator") {
            return new Response(JSON.stringify({ error: "This username is reserved" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          await dbConnect();

          const existingUser = await User.findOne({ username: cleanUsername });
          if (existingUser) {
            return new Response(JSON.stringify({ error: "Username already exists" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          // Hash password with modern Scrypt + random salt
          const hashedPassword = hashPassword(password);

          const newUser = await User.create({
            username: cleanUsername,
            password: hashedPassword,
            role: "user", // Strictly enforce 'user' role
          });

          const responseUser = {
            _id: newUser._id,
            username: newUser.username,
            role: newUser.role,
            createdAt: newUser.createdAt,
          };

          return new Response(JSON.stringify({ success: true, user: responseUser }), {
            status: 201,
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
