/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from "crypto";
import mongoose from "mongoose";

// ============================================================================
// 1. CONFIGURATION & SECRETS
// ============================================================================

const SESSION_COOKIE_NAME = "auth_session";
const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30 days

// Secret derivation with fallback
function getSecretKey(): string {
  const secret =
    process.env["SESSION_SECRET"] ||
    process.env["JWT_SECRET"] ||
    process.env["ADMIN_PASSWORD"] ||
    "our-shared-galaxy-production-secret-key-32-bytes-secure";
  return secret;
}

// ============================================================================
// 2. CRYPTOGRAPHIC SESSION TOKENS (HMAC-SHA256 SIGNED)
// ============================================================================

export interface SessionPayload {
  userId?: string;
  username: string;
  role: "admin" | "user";
  exp: number; // Unix timestamp in seconds
  iat: number;
}

function base64UrlEncode(data: string | Buffer): string {
  const buf = typeof data === "string" ? Buffer.from(data, "utf8") : data;
  return buf.toString("base64url");
}

function base64UrlDecode(str: string): string {
  return Buffer.from(str, "base64url").toString("utf8");
}

/**
 * Creates a cryptographically signed session token: <payload_b64>.<signature_b64>
 */
export function createSessionToken(user: {
  userId?: string;
  username: string;
  role: "admin" | "user";
}): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    userId: user.userId,
    username: user.username,
    role: user.role,
    iat: now,
    exp: now + SESSION_MAX_AGE_SECONDS,
  };

  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const secret = getSecretKey();
  const signature = crypto.createHmac("sha256", secret).update(payloadB64).digest("base64url");

  return `${payloadB64}.${signature}`;
}

/**
 * Verifies the cryptographically signed session token and returns the payload if valid.
 */
export function verifySessionToken(token: string | null | undefined): SessionPayload | null {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return null;
  }

  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [payloadB64, signature] = parts;
    const secret = getSecretKey();

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(payloadB64)
      .digest("base64url");

    // Timing-safe signature comparison to prevent timing attacks
    const sigBuf = Buffer.from(signature);
    const expectedBuf = Buffer.from(expectedSignature);

    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
      return null;
    }

    const payloadJson = base64UrlDecode(payloadB64);
    const payload = JSON.parse(payloadJson) as SessionPayload;

    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) {
      return null; // Expired token
    }

    if (!payload.role || !["admin", "user"].includes(payload.role)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Formats Set-Cookie header for session token with HttpOnly, SameSite, and Secure flags.
 */
export function createSessionCookie(token: string): string {
  const isProduction = process.env["NODE_ENV"] === "production";
  const secureFlag = isProduction ? "; Secure" : "";
  return `${SESSION_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE_SECONDS}${secureFlag}`;
}

/**
 * Formats Set-Cookie header to clear session on logout.
 */
export function createClearSessionCookie(): string {
  return `${SESSION_COOKIE_NAME}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; HttpOnly; SameSite=Lax`;
}

// ============================================================================
// 3. PASSWORD HASHING (SCRYPT + SALT + TIMING-SAFE EQUAL)
// ============================================================================

/**
 * Hashes a plaintext password using modern Scrypt with a random 16-byte salt.
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `scrypt$${salt}$${derivedKey.toString("hex")}`;
}

/**
 * Timing-safe password verification supporting Scrypt and legacy SHA-256 fallback with migration.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!password || !storedHash) return false;

  try {
    if (storedHash.startsWith("scrypt$")) {
      const parts = storedHash.split("$");
      if (parts.length !== 3) return false;
      const salt = parts[1];
      const keyHex = parts[2];
      const derivedKey = crypto.scryptSync(password, salt, 64);
      const keyBuf = Buffer.from(keyHex, "hex");
      if (derivedKey.length !== keyBuf.length) return false;
      return crypto.timingSafeEqual(derivedKey, keyBuf);
    }

    // Legacy SHA-256 check
    const legacyHash = crypto.createHash("sha256").update(password).digest("hex");
    const legacyBuf = Buffer.from(legacyHash);
    const storedBuf = Buffer.from(storedHash);
    if (legacyBuf.length !== storedBuf.length) return false;
    return crypto.timingSafeEqual(legacyBuf, storedBuf);
  } catch {
    return false;
  }
}

// ============================================================================
// 4. AUTHENTICATION & AUTHORIZATION HELPERS
// ============================================================================

/**
 * Extracts and verifies the current session from Request cookies.
 */
export function getAuthSession(request: Request): SessionPayload | null {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = cookieHeader.split(";").reduce((acc: Record<string, string>, cookie) => {
      const [name, ...valParts] = cookie.trim().split("=");
      if (name) acc[name] = valParts.join("=");
      return acc;
    }, {});

    const sessionToken = cookies[SESSION_COOKIE_NAME];
    return verifySessionToken(sessionToken);
  } catch {
    return null;
  }
}

/**
 * Enforces authenticated session (admin or user). Returns SessionPayload or Response (401).
 */
export function requireAuth(request: Request): { session: SessionPayload } | { errorResponse: Response } {
  const session = getAuthSession(request);
  if (!session) {
    return {
      errorResponse: new Response(
        JSON.stringify({ error: "Authentication required", code: "UNAUTHORIZED" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      ),
    };
  }
  return { session };
}

/**
 * Enforces admin authorization. Returns SessionPayload or Response (401/403).
 */
export function requireAdmin(request: Request): { session: SessionPayload } | { errorResponse: Response } {
  const session = getAuthSession(request);
  if (!session) {
    return {
      errorResponse: new Response(
        JSON.stringify({ error: "Authentication required", code: "UNAUTHORIZED" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      ),
    };
  }

  if (session.role !== "admin") {
    return {
      errorResponse: new Response(
        JSON.stringify({ error: "Admin authorization required", code: "FORBIDDEN" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      ),
    };
  }

  return { session };
}

// ============================================================================
// 5. IN-MEMORY RATE LIMITING (TOKEN BUCKET / SLIDING WINDOW)
// ============================================================================

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000).unref();

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("fastly-client-ip") ||
    "127.0.0.1"
  );
}

export function checkRateLimit(
  request: Request,
  options: { keyPrefix: string; maxRequests: number; windowMs: number }
): { allowed: boolean; remaining: number; retryAfterSeconds?: number } {
  const ip = getClientIp(request);
  const key = `${options.keyPrefix}:${ip}`;
  const now = Date.now();

  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetAt <= now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + options.windowMs,
    });
    return { allowed: true, remaining: options.maxRequests - 1 };
  }

  if (entry.count >= options.maxRequests) {
    const retryAfterSeconds = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  entry.count += 1;
  return { allowed: true, remaining: options.maxRequests - entry.count };
}

// Preconfigured rate limiters
export const authRateLimiter = {
  keyPrefix: "auth_login",
  maxRequests: 5, // 5 attempts
  windowMs: 60 * 1000, // per minute
};

export const uploadRateLimiter = {
  keyPrefix: "upload_api",
  maxRequests: 30, // 30 requests
  windowMs: 60 * 1000, // per minute
};

export const mutationRateLimiter = {
  keyPrefix: "mutation_api",
  maxRequests: 60, // 60 writes
  windowMs: 60 * 1000, // per minute
};

export function createRateLimitResponse(retryAfterSeconds = 60): Response {
  return new Response(
    JSON.stringify({
      error: "Too many requests. Please slow down and try again later.",
      code: "RATE_LIMITED",
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfterSeconds),
      },
    }
  );
}

// ============================================================================
// 6. OBJECT ID & INPUT VALIDATION & SANITIZATION
// ============================================================================

/**
 * Validates strictly whether an input is a valid 24-hex-char MongoDB ObjectId.
 */
export function isValidObjectId(id: unknown): id is string {
  if (typeof id !== "string" || id.length !== 24) return false;
  return mongoose.Types.ObjectId.isValid(id) && new mongoose.Types.ObjectId(id).toString() === id;
}

/**
 * Recursively removes any MongoDB query operators ($gt, $ne, $where, etc.) from untrusted inputs.
 */
export function sanitizeMongoInput<T>(input: T): T {
  if (input === null || typeof input !== "object") {
    return input;
  }

  if (Array.isArray(input)) {
    return input.map((item) => sanitizeMongoInput(item)) as unknown as T;
  }

  const cleanObj: Record<string, any> = {};
  for (const [key, value] of Object.entries(input as Record<string, any>)) {
    // Strip keys starting with $ or containing . to prevent operator injection
    if (key.startsWith("$") || key.includes(".")) {
      continue;
    }
    cleanObj[key] = sanitizeMongoInput(value);
  }
  return cleanObj as T;
}

/**
 * Sanitizes plain text input by trimming and stripping control characters and HTML tags.
 */
export function sanitizePlainText(str: unknown, maxLength = 1000): string {
  if (typeof str !== "string") return "";
  return str
    .replace(/[<>]/g, "") // Strip HTML tags
    .replace(/[\u0000-\u0008\u000B-\u001F\u007F-\u009F]/g, "") // Strip control characters
    .trim()
    .slice(0, maxLength);
}

// ============================================================================
// 7. FILE UPLOAD SECURITY & MAGIC BYTES VALIDATION
// ============================================================================

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  detectedMimeType?: string;
  safeFilename: string;
}

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
export const MAX_AUDIO_SIZE = 50 * 1024 * 1024; // 50 MB
export const MAX_VIDEO_SIZE = 250 * 1024 * 1024; // 250 MB

// Check binary magic bytes for allowed media types
function detectMagicBytes(buffer: Buffer): string | null {
  if (buffer.length < 4) return null;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "image/png";
  }

  // WebP: RIFF .... WEBP
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }

  // GIF: GIF87a / GIF89a
  if (
    buffer.length >= 6 &&
    (buffer.toString("ascii", 0, 6) === "GIF87a" || buffer.toString("ascii", 0, 6) === "GIF89a")
  ) {
    return "image/gif";
  }

  // MP4 / MOV: ....ftyp
  if (buffer.length >= 8 && buffer.toString("ascii", 4, 8) === "ftyp") {
    const brand = buffer.toString("ascii", 8, 12).toLowerCase();
    if (brand.includes("qt")) return "video/quicktime";
    if (brand.includes("m4a")) return "audio/mp4";
    return "video/mp4";
  }

  // WebM / MKV: 1A 45 DF A3 (EBML ID)
  if (buffer[0] === 0x1a && buffer[1] === 0x45 && buffer[2] === 0xdf && buffer[3] === 0xa3) {
    return "video/webm";
  }

  // MP3 with ID3 tag: 49 44 33
  if (buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33) {
    return "audio/mpeg";
  }

  // MP3 raw frame sync: FF FB, FF FA, FF F3, FF F2
  if (buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0) {
    return "audio/mpeg";
  }

  // WAV: RIFF .... WAVE
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WAVE"
  ) {
    return "audio/wav";
  }

  // OGG: OggS
  if (buffer.toString("ascii", 0, 4) === "OggS") {
    return "audio/ogg";
  }

  return null;
}

/**
 * Strictly validates media uploads by size, extension, and binary magic bytes.
 */
export function validateMediaUpload(
  buffer: Buffer,
  originalFilename: string,
  declaredMimeType: string,
  type: "image" | "video" | "song"
): FileValidationResult {
  // Sanitize filename to prevent path traversal (e.g. ../../)
  const cleanBaseName = originalFilename
    .replace(/^.*[\\/]/, "")
    .replace(/[^a-zA-Z0-9._-]/g, "_");
  const ext = (cleanBaseName.split(".").pop() || "").toLowerCase();

  // Reject dangerous extensions immediately
  const dangerousExts = [
    "html",
    "htm",
    "svg",
    "js",
    "mjs",
    "jsx",
    "ts",
    "tsx",
    "exe",
    "bat",
    "cmd",
    "sh",
    "php",
    "py",
    "cgi",
    "pl",
    "jar",
    "vbs",
    "scr",
  ];
  if (dangerousExts.includes(ext)) {
    return {
      valid: false,
      error: `File extension .${ext} is forbidden for security reasons.`,
      safeFilename: cleanBaseName,
    };
  }

  // Validate size & type-specific allowed formats
  if (type === "image") {
    if (buffer.length > MAX_IMAGE_SIZE) {
      return {
        valid: false,
        error: `Image size exceeds the maximum allowed limit of ${(MAX_IMAGE_SIZE / 1024 / 1024).toFixed(0)}MB.`,
        safeFilename: cleanBaseName,
      };
    }

    const allowedExts = ["jpg", "jpeg", "png", "webp", "gif"];
    if (!allowedExts.includes(ext)) {
      return {
        valid: false,
        error: `Invalid image extension: .${ext}. Allowed: JPG, JPEG, PNG, WEBP, GIF.`,
        safeFilename: cleanBaseName,
      };
    }

    const detected = detectMagicBytes(buffer);
    const validImageMimes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!detected || !validImageMimes.includes(detected)) {
      return {
        valid: false,
        error: "File content does not match a valid image signature.",
        safeFilename: cleanBaseName,
      };
    }

    return {
      valid: true,
      detectedMimeType: detected,
      safeFilename: `${crypto.randomUUID()}.${ext === "jpeg" ? "jpg" : ext}`,
    };
  }

  if (type === "video") {
    if (buffer.length > MAX_VIDEO_SIZE) {
      return {
        valid: false,
        error: `Video size exceeds the maximum allowed limit of ${(MAX_VIDEO_SIZE / 1024 / 1024).toFixed(0)}MB.`,
        safeFilename: cleanBaseName,
      };
    }

    const allowedExts = ["mp4", "webm", "mov"];
    if (!allowedExts.includes(ext)) {
      return {
        valid: false,
        error: `Invalid video extension: .${ext}. Allowed: MP4, WEBM, MOV.`,
        safeFilename: cleanBaseName,
      };
    }

    const detected = detectMagicBytes(buffer);
    const validVideoMimes = ["video/mp4", "video/webm", "video/quicktime"];
    if (!detected || !validVideoMimes.includes(detected)) {
      return {
        valid: false,
        error: "File content does not match a valid video signature.",
        safeFilename: cleanBaseName,
      };
    }

    return {
      valid: true,
      detectedMimeType: detected,
      safeFilename: `${crypto.randomUUID()}.${ext}`,
    };
  }

  if (type === "song") {
    if (buffer.length > MAX_AUDIO_SIZE) {
      return {
        valid: false,
        error: `Audio size exceeds the maximum allowed limit of ${(MAX_AUDIO_SIZE / 1024 / 1024).toFixed(0)}MB.`,
        safeFilename: cleanBaseName,
      };
    }

    const allowedExts = ["mp3", "wav", "ogg", "m4a", "webm"];
    if (!allowedExts.includes(ext)) {
      return {
        valid: false,
        error: `Invalid audio extension: .${ext}. Allowed: MP3, WAV, OGG, M4A, WEBM.`,
        safeFilename: cleanBaseName,
      };
    }

    const detected = detectMagicBytes(buffer);
    const validAudioMimes = [
      "audio/mpeg",
      "audio/wav",
      "audio/ogg",
      "audio/mp4",
      "video/webm", // WebM audio container
    ];
    if (!detected || !validAudioMimes.includes(detected)) {
      return {
        valid: false,
        error: "File content does not match a valid audio signature.",
        safeFilename: cleanBaseName,
      };
    }

    return {
      valid: true,
      detectedMimeType: detected === "video/webm" ? "audio/webm" : detected,
      safeFilename: `${crypto.randomUUID()}.${ext}`,
    };
  }

  return {
    valid: false,
    error: "Unsupported media type",
    safeFilename: cleanBaseName,
  };
}

// ============================================================================
// 8. SECURITY HEADERS & CORS HELPERS
// ============================================================================

export function getSecurityHeaders(): Record<string, string> {
  return {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  };
}

export function handleCors(request: Request): { isPreflight: boolean; headers: Record<string, string> } {
  const origin = request.headers.get("origin") || "";
  const allowedOriginEnv = process.env["ALLOWED_ORIGIN"] || "";
  const requestUrl = new URL(request.url);

  // Allow same-origin or configured production origins
  const isAllowed =
    !origin ||
    origin === requestUrl.origin ||
    origin === allowedOriginEnv ||
    origin.endsWith(".vercel.app") ||
    origin.includes("localhost") ||
    origin.includes("127.0.0.1");

  const headers: Record<string, string> = {
    ...getSecurityHeaders(),
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Range, X-Requested-With",
    "Access-Control-Allow-Credentials": "true",
  };

  if (isAllowed && origin) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return {
    isPreflight: request.method === "OPTIONS",
    headers,
  };
}
