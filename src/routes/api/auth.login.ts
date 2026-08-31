import { createFileRoute } from "@tanstack/react-router";
import { dbConnect } from "@/lib/db";
import { User } from "@/lib/models";
import crypto from "crypto";

export const Route = createFileRoute("/api/auth/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { username, password } = body;

          if (typeof password !== "string") {
            return new Response(JSON.stringify({ error: "Invalid password format" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const userPass = process.env["USER_PASSWORD"] || "beautiful";
          const adminPass = process.env["ADMIN_PASSWORD"] || "admin123";

          let role: "admin" | "user" | null = null;
          const cleanUsername = typeof username === "string" ? username.trim() : "";

          if (cleanUsername.toLowerCase() === "admin" && password === adminPass) {
            role = "admin";
          } else if (cleanUsername) {
            await dbConnect();
            const user = await User.findOne({ username: cleanUsername });
            if (user) {
              const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
              if (user.password === hashedPassword) {
                role = user.role as "admin" | "user";
              }
            }
            
            // Fallback to environment passwords if DB user doesn't match
            if (!role) {
              if (password === adminPass) {
                role = "admin";
              } else if (password === userPass) {
                role = "user";
              }
            }
          } else {
            // Password-only fallback
            if (password === adminPass) {
              role = "admin";
            } else if (password === userPass) {
              role = "user";
            }
          }

          if (role) {
            const secureFlag = process.env["NODE_ENV"] === "production" ? "; Secure" : "";
            return new Response(JSON.stringify({ success: true, role }), {
              headers: {
                "Content-Type": "application/json",
                "Set-Cookie": `auth_role=${role}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000${secureFlag}`,
              },
            });
          }

          return new Response(JSON.stringify({ success: false, error: "Incorrect username or password" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("Error logging in:", error);
          return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});

