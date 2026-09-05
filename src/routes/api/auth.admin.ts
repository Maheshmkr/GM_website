/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { dbConnect } from "@/lib/db";
import { User } from "@/lib/models";
import {
  requireAdmin,
  hashPassword,
  createSessionToken,
  createSessionCookie,
  checkRateLimit,
  mutationRateLimiter,
  createRateLimitResponse,
  sanitizeMongoInput,
  sanitizePlainText,
} from "@/lib/security";

const UpdateAdminSchema = z.object({
  username: z
    .string()
    .min(3, "Admin username must be at least 3 characters")
    .max(50, "Admin username must be at most 50 characters")
    .regex(/^[a-zA-Z0-9_.-]+$/, "Username can only contain letters, numbers, hyphens, and underscores"),
  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters")
    .max(100, "New password must be at most 100 characters")
    .optional()
    .or(z.literal("")),
});

export const Route = createFileRoute("/api/auth/admin")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        // 1. Authorization: Admin only
        const auth = requireAdmin(request);
        if ("errorResponse" in auth) {
          return auth.errorResponse;
        }

        try {
          await dbConnect();
          let adminUser = auth.session.userId ? await User.findById(auth.session.userId) : null;
          if (!adminUser) {
            adminUser = await User.findOne({ role: "admin" });
          }

          return new Response(
            JSON.stringify({
              success: true,
              username: adminUser?.username || auth.session.username || "admin",
              hasDbRecord: !!adminUser,
            }),
            {
              headers: { "Content-Type": "application/json" },
            }
          );
        } catch (error: any) {
          console.error("Error retrieving admin info:", error);
          return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },

      POST: async ({ request }) => {
        // 1. Authorization: Admin only
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

          // 3. Schema validation
          const parsed = UpdateAdminSchema.safeParse(sanitizeMongoInput(rawBody));
          if (!parsed.success) {
            return new Response(
              JSON.stringify({ error: parsed.error.issues[0]?.message || "Validation failed" }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          const { username, newPassword } = parsed.data;
          const cleanUsername = sanitizePlainText(username, 50).trim();

          await dbConnect();

          // 4. Find existing admin user or check if username is taken by another account
          let adminUser = auth.session.userId ? await User.findById(auth.session.userId) : null;
          if (!adminUser) {
            adminUser = await User.findOne({ role: "admin" });
          }

          const conflictingUser = await User.findOne({ username: cleanUsername });
          if (conflictingUser && (!adminUser || conflictingUser._id.toString() !== adminUser._id.toString())) {
            return new Response(
              JSON.stringify({ error: "That username is already taken by another account" }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          // 5. Update or Create the Admin record in DB
          if (adminUser) {
            adminUser.username = cleanUsername;
            adminUser.role = "admin";
            if (newPassword && newPassword.trim()) {
              adminUser.password = hashPassword(newPassword.trim());
            }
            await adminUser.save();
          } else {
            const passwordToHash =
              newPassword && newPassword.trim()
                ? newPassword.trim()
                : process.env["ADMIN_PASSWORD"] || "admin123";

            adminUser = await User.create({
              username: cleanUsername,
              password: hashPassword(passwordToHash),
              role: "admin",
            });
          }

          // 6. Issue updated session cookie
          const newToken = createSessionToken({
            userId: adminUser._id.toString(),
            username: cleanUsername,
            role: "admin",
          });
          const cookie = createSessionCookie(newToken);

          console.log(`[AUTH] Admin credentials updated for '${cleanUsername}'`);

          return new Response(
            JSON.stringify({
              success: true,
              message: "Admin credentials updated successfully!",
              username: cleanUsername,
            }),
            {
              headers: {
                "Content-Type": "application/json",
                "Set-Cookie": cookie,
              },
            }
          );
        } catch (error: any) {
          console.error("Error updating admin credentials:", error);
          return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
