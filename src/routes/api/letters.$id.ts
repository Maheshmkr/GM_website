/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { dbConnect } from "@/lib/db";
import { Letter } from "@/lib/models";
import {
  requireAdmin,
  isValidObjectId,
  sanitizeMongoInput,
  sanitizePlainText,
} from "@/lib/security";

const UpdateLetterSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  preview: z.string().min(1).max(500).optional(),
  body: z.string().min(1).max(10000).optional(),
  date: z.string().min(1).max(50).optional(),
  category: z.string().max(50).optional(),
  favorite: z.boolean().optional(),
});

export const Route = createFileRoute("/api/letters/$id")({
  server: {
    handlers: {
      PUT: async ({ params, request }) => {
        // 1. Authorization: Admin check
        const auth = requireAdmin(request);
        if ("errorResponse" in auth) {
          return auth.errorResponse;
        }

        try {
          await dbConnect();
          const { id } = params;

          if (!isValidObjectId(id)) {
            return new Response(JSON.stringify({ error: "Invalid letter ID format" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const rawBody = await request.json().catch(() => null);
          if (!rawBody || typeof rawBody !== "object") {
            return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const parsed = UpdateLetterSchema.safeParse(sanitizeMongoInput(rawBody));
          if (!parsed.success) {
            return new Response(
              JSON.stringify({
                error: parsed.error.issues[0]?.message || "Validation failed",
              }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          const updateFields: any = {};
          if (parsed.data.title !== undefined) updateFields.title = sanitizePlainText(parsed.data.title, 200);
          if (parsed.data.preview !== undefined) updateFields.preview = sanitizePlainText(parsed.data.preview, 500);
          if (parsed.data.body !== undefined) updateFields.body = sanitizePlainText(parsed.data.body, 10000);
          if (parsed.data.date !== undefined) updateFields.date = sanitizePlainText(parsed.data.date, 50);
          if (parsed.data.category !== undefined) updateFields.category = sanitizePlainText(parsed.data.category, 50);
          if (parsed.data.favorite !== undefined) updateFields.favorite = parsed.data.favorite;

          const updated = await Letter.findByIdAndUpdate(id, { $set: updateFields }, { new: true });
          if (!updated) {
            return new Response(JSON.stringify({ error: "Letter not found" }), {
              status: 404,
              headers: { "Content-Type": "application/json" },
            });
          }

          return new Response(JSON.stringify(updated), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("Error updating letter:", error);
          return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
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
            return new Response(JSON.stringify({ error: "Invalid letter ID format" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const deleted = await Letter.findByIdAndDelete(id);
          if (!deleted) {
            return new Response(JSON.stringify({ error: "Letter not found" }), {
              status: 404,
              headers: { "Content-Type": "application/json" },
            });
          }

          return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("Error deleting letter:", error);
          return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
