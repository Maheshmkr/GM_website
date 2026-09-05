import "./lib/error-capture";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { dbConnect } from "./lib/db";
import { handleCors, getSecurityHeaders } from "./lib/security";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    // 1. Handle CORS preflight requests
    const corsResult = handleCors(request);
    if (corsResult.isPreflight) {
      return new Response(null, {
        status: 204,
        headers: corsResult.headers,
      });
    }

    try {
      await dbConnect(); // Establish DB connection before accepting requests
      const handler = await getServerEntry();
      const rawResponse = await handler.fetch(request, env, ctx);
      const response = await normalizeCatastrophicSsrResponse(rawResponse);

      // 2. Inject security headers and CORS headers into every response
      const newHeaders = new Headers(response.headers);
      const secHeaders = getSecurityHeaders();
      for (const [key, val] of Object.entries(secHeaders)) {
        if (!newHeaders.has(key)) {
          newHeaders.set(key, val);
        }
      }
      for (const [key, val] of Object.entries(corsResult.headers)) {
        newHeaders.set(key, val);
      }

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    } catch (error) {
      console.error("Server execution error:", error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: {
          "content-type": "text/html; charset=utf-8",
          ...getSecurityHeaders(),
        },
      });
    }
  },
};
