/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { dbConnect } from "@/lib/db";
import { Letter } from "@/lib/models";
import { letters as staticLetters } from "@/data/site";
import {
  requireAdmin,
  checkRateLimit,
  mutationRateLimiter,
  createRateLimitResponse,
  sanitizeMongoInput,
  sanitizePlainText,
} from "@/lib/security";

const LetterSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  preview: z.string().min(1, "Preview is required").max(500),
  body: z.string().min(1, "Body is required").max(10000),
  date: z.string().min(1, "Date is required").max(50),
  category: z.string().max(50).optional(),
  favorite: z.boolean().optional(),
});

export const Route = createFileRoute("/api/letters")({
  server: {
    handlers: {
      GET: async () => {
        try {
          await dbConnect();
          let dbLetters = await Letter.find().select("-__v").sort({ createdAt: -1 });

          // If no letters in DB yet, seed initial letters into MongoDB so they are editable & deletable
          if (dbLetters.length === 0 && staticLetters.length > 0) {
            try {
              const seeded = await Letter.insertMany(
                staticLetters.map((l, i) => ({
                  title: l.title,
                  preview: l.preview,
                  body: l.body,
                  date: l.date,
                  category: "Love",
                  favorite: i === 0,
                }))
              );
              dbLetters = seeded;
            } catch (seedErr) {
              console.warn("Could not seed initial letters:", seedErr);
              return new Response(JSON.stringify(staticLetters), {
                headers: { "Content-Type": "application/json" },
              });
            }
          }

          return new Response(JSON.stringify(dbLetters), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("Error fetching letters:", error);
          return new Response(JSON.stringify(staticLetters), {
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
          await dbConnect();
          const rawBody = await request.json().catch(() => null);
          if (!rawBody || typeof rawBody !== "object") {
            return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          // 3. Schema validation & input sanitization
          const parsed = LetterSchema.safeParse(sanitizeMongoInput(rawBody));
          if (!parsed.success) {
            return new Response(
              JSON.stringify({
                error: parsed.error.issues[0]?.message || "Validation failed",
              }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          const { title, preview, body, date, category, favorite } = parsed.data;

          const letter = new Letter({
            title: sanitizePlainText(title, 200),
            preview: sanitizePlainText(preview, 500),
            body: sanitizePlainText(body, 10000),
            date: sanitizePlainText(date, 50),
            category: sanitizePlainText(category || "Love", 50),
            favorite: !!favorite,
          });

          await letter.save();

          return new Response(JSON.stringify(letter), {
            status: 201,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("Error creating letter:", error);
          return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
