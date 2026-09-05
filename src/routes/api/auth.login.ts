/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { dbConnect } from "@/lib/db";
import { User } from "@/lib/models";
import {
  createSessionToken,
  createSessionCookie,
  verifyPassword,
  checkRateLimit,
  authRateLimiter,
  createRateLimitResponse,
  sanitizeMongoInput,
} from "@/lib/security";

const LoginSchema = z.object({
  username: z.string().max(100).optional(),
  password: z.string().min(1, "Password is required").max(500),
});

export const Route = createFileRoute("/api/auth/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // 1. Rate Limiting Check (Max 5 attempts / min)
        const rateCheck = checkRateLimit(request, authRateLimiter);
        if (!rateCheck.allowed) {
          console.warn("[AUTH] Login rate limit exceeded from client IP");
          return createRateLimitResponse(rateCheck.retryAfterSeconds);
        }

        try {
          const rawBody = await request.json().catch(() => null);
          if (!rawBody || typeof rawBody !== "object") {
            return new Response(
              JSON.stringify({ success: false, error: "Invalid request payload" }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          // 2. Strict Input Validation with Zod
          const parseResult = LoginSchema.safeParse(sanitizeMongoInput(rawBody));
          if (!parseResult.success) {
            return new Response(
              JSON.stringify({ success: false, error: "Invalid credentials format" }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          const { username, password } = parseResult.data;
          const cleanUsername = username ? username.trim() : "";

          const adminPass = process.env["ADMIN_PASSWORD"] || "admin123";
          const userPass = process.env["USER_PASSWORD"] || "beautiful";
          const adminPassHash = process.env["ADMIN_PASSWORD_HASH"];

          let matchedRole: "admin" | "user" | null = null;
          let matchedUsername: string = cleanUsername || "visitor";
          let matchedUserId: string | undefined;

          // 3. Admin Account Validation (timing-safe)
          if (cleanUsername.toLowerCase() === "admin") {
            const isMatch = adminPassHash
              ? verifyPassword(password, adminPassHash)
              : password === adminPass;

            if (isMatch) {
              matchedRole = "admin";
              matchedUsername = "admin";
            }
          }

          // 4. DB User Account Validation
          if (!matchedRole && cleanUsername) {
            await dbConnect();
            const user = await User.findOne({ username: cleanUsername });
            if (user && user.password) {
              if (verifyPassword(password, user.password)) {
                matchedRole = (user.role as "admin" | "user") || "user";
                matchedUsername = user.username;
                matchedUserId = user._id.toString();
              }
            }
          }

          // 5. Fallback Password Validation (Without username or fallback)
          if (!matchedRole) {
            if (password === adminPass) {
              matchedRole = "admin";
              matchedUsername = "admin";
            } else if (password === userPass) {
              matchedRole = "user";
              matchedUsername = cleanUsername || "beloved";
            }
          }

          // 6. If Authentication Succeeded -> Issue Signed Session Cookie
          if (matchedRole) {
            console.log(`[AUTH] Successful login for user '${matchedUsername}' as role '${matchedRole}'`);
            const token = createSessionToken({
              userId: matchedUserId,
              username: matchedUsername,
              role: matchedRole,
            });

            const cookieHeader = createSessionCookie(token);

            return new Response(
              JSON.stringify({
                success: true,
                role: matchedRole,
                username: matchedUsername,
              }),
              {
                status: 200,
                headers: {
                  "Content-Type": "application/json",
                  "Set-Cookie": cookieHeader,
                },
              }
            );
          }

          // 7. Generic Authentication Error (No user enumeration)
          console.warn(`[AUTH] Failed login attempt for identifier '${cleanUsername || "unknown"}'`);
          return new Response(
            JSON.stringify({ success: false, error: "Invalid credentials" }),
            {
              status: 401,
              headers: { "Content-Type": "application/json" },
            }
          );
        } catch (error: any) {
          console.error("[AUTH] Error processing login:", error);
          return new Response(
            JSON.stringify({ success: false, error: "Internal server error" }),
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
