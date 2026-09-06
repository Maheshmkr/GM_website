import { o as __toESM } from "../_runtime.mjs";
import { t as require_main } from "../_libs/dotenv.mjs";
import { t as require_mongoose } from "../_libs/mongoose+mpath+mquery+ms+sift.mjs";
import crypto from "crypto";
//#region node_modules/.nitro/vite/services/ssr/index.js
var import_main = /* @__PURE__ */ __toESM(require_main());
var import_mongoose = /* @__PURE__ */ __toESM(require_mongoose());
var lastCapturedError;
var TTL_MS = 5e3;
function record(error) {
	lastCapturedError = {
		error,
		at: Date.now()
	};
}
var CAUSE_DEPTH_LIMIT = 5;
var DESCRIPTION_LENGTH_LIMIT = 8e3;
function describeError(error) {
	const parts = [];
	let current = error;
	for (let depth = 0; depth < CAUSE_DEPTH_LIMIT && current != null; depth++) {
		if (!(current instanceof Error)) {
			parts.push(typeof current === "string" ? current : safeStringify(current));
			break;
		}
		const label = depth === 0 ? "" : "caused by: ";
		const status = describeStatus(current);
		parts.push(`${label}${current.stack ?? `${current.name}: ${current.message}`}${status}`);
		current = current.cause;
	}
	return parts.join("\n").slice(0, DESCRIPTION_LENGTH_LIMIT);
}
function describeStatus(error) {
	const { status, statusCode } = error;
	const value = status ?? statusCode;
	return typeof value === "number" ? ` (status ${value})` : "";
}
function safeStringify(value) {
	try {
		return JSON.stringify(value) ?? String(value);
	} catch {
		return String(value);
	}
}
function isErrorLike(value) {
	return value instanceof Error;
}
var originalConsoleError = console.error.bind(console);
console.error = (...args) => {
	originalConsoleError(...args.map((arg) => {
		if (!isErrorLike(arg)) return arg;
		record(arg);
		return describeError(arg);
	}));
};
if (typeof globalThis.addEventListener === "function") {
	globalThis.addEventListener("error", (event) => record(event.error ?? event));
	globalThis.addEventListener("unhandledrejection", (event) => record(event.reason));
}
function consumeLastCapturedError() {
	if (!lastCapturedError) return void 0;
	if (Date.now() - lastCapturedError.at > TTL_MS) {
		lastCapturedError = void 0;
		return;
	}
	const { error } = lastCapturedError;
	lastCapturedError = void 0;
	return error;
}
function renderErrorPage() {
	return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #111; color: #fff; }
      .secondary { background: #fff; color: #111; border-color: #d1d5db; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}
import_main.default.config();
var MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
var MONGODB_DB = process.env.MONGODB_DB || "gm-website";
var cached = global.mongoose;
if (!cached) cached = global.mongoose = {
	conn: null,
	promise: null
};
async function dbConnect() {
	if (!MONGODB_URI) throw new Error("MONGODB_URI is not configured. Add it in Vercel → Project → Settings → Environment Variables.");
	if (cached.conn) return cached.conn;
	if (!cached.promise) {
		const opts = {
			bufferCommands: false,
			dbName: MONGODB_DB
		};
		cached.promise = import_mongoose.default.connect(MONGODB_URI, opts).then((m) => {
			console.log("MongoDB Atlas connected successfully");
			return m;
		}).catch((error) => {
			console.error("MongoDB connection failed:", error.message);
			cached.promise = null;
			throw error;
		});
	}
	try {
		cached.conn = await cached.promise;
	} catch (e) {
		cached.promise = null;
		throw e;
	}
	return cached.conn;
}
var SESSION_COOKIE_NAME = "auth_session";
var SESSION_MAX_AGE_SECONDS = 2592e3;
function getSecretKey() {
	return process.env["SESSION_SECRET"] || process.env["JWT_SECRET"] || process.env["ADMIN_PASSWORD"] || "our-shared-galaxy-production-secret-key-32-bytes-secure";
}
function base64UrlEncode(data) {
	return (typeof data === "string" ? Buffer.from(data, "utf8") : data).toString("base64url");
}
function base64UrlDecode(str) {
	return Buffer.from(str, "base64url").toString("utf8");
}
/**
* Creates a cryptographically signed session token: <payload_b64>.<signature_b64>
*/
function createSessionToken(user) {
	const now = Math.floor(Date.now() / 1e3);
	const payload = {
		userId: user.userId,
		username: user.username,
		role: user.role,
		iat: now,
		exp: now + SESSION_MAX_AGE_SECONDS
	};
	const payloadB64 = base64UrlEncode(JSON.stringify(payload));
	const secret = getSecretKey();
	return `${payloadB64}.${crypto.createHmac("sha256", secret).update(payloadB64).digest("base64url")}`;
}
/**
* Verifies the cryptographically signed session token and returns the payload if valid.
*/
function verifySessionToken(token) {
	if (!token || typeof token !== "string" || !token.includes(".")) return null;
	try {
		const parts = token.split(".");
		if (parts.length !== 2) return null;
		const [payloadB64, signature] = parts;
		const secret = getSecretKey();
		const expectedSignature = crypto.createHmac("sha256", secret).update(payloadB64).digest("base64url");
		const sigBuf = Buffer.from(signature);
		const expectedBuf = Buffer.from(expectedSignature);
		if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) return null;
		const payloadJson = base64UrlDecode(payloadB64);
		const payload = JSON.parse(payloadJson);
		const now = Math.floor(Date.now() / 1e3);
		if (!payload.exp || payload.exp < now) return null;
		if (!payload.role || !["admin", "user"].includes(payload.role)) return null;
		return payload;
	} catch {
		return null;
	}
}
/**
* Formats Set-Cookie header for session token with HttpOnly, SameSite, and Secure flags.
*/
function createSessionCookie(token) {
	return `${SESSION_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE_SECONDS}; Secure`;
}
/**
* Formats Set-Cookie header to clear session on logout.
*/
function createClearSessionCookie() {
	return `${SESSION_COOKIE_NAME}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; HttpOnly; SameSite=Lax`;
}
/**
* Hashes a plaintext password using modern Scrypt with a random 16-byte salt.
*/
function hashPassword(password) {
	const salt = crypto.randomBytes(16).toString("hex");
	return `scrypt$${salt}$${crypto.scryptSync(password, salt, 64).toString("hex")}`;
}
/**
* Timing-safe password verification supporting Scrypt and legacy SHA-256 fallback with migration.
*/
function verifyPassword(password, storedHash) {
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
		const legacyHash = crypto.createHash("sha256").update(password).digest("hex");
		const legacyBuf = Buffer.from(legacyHash);
		const storedBuf = Buffer.from(storedHash);
		if (legacyBuf.length !== storedBuf.length) return false;
		return crypto.timingSafeEqual(legacyBuf, storedBuf);
	} catch {
		return false;
	}
}
/**
* Extracts and verifies the current session from Request cookies.
*/
function getAuthSession(request) {
	try {
		const sessionToken = (request.headers.get("cookie") || "").split(";").reduce((acc, cookie) => {
			const [name, ...valParts] = cookie.trim().split("=");
			if (name) acc[name] = valParts.join("=");
			return acc;
		}, {})[SESSION_COOKIE_NAME];
		return verifySessionToken(sessionToken);
	} catch {
		return null;
	}
}
/**
* Enforces admin authorization. Returns SessionPayload or Response (401/403).
*/
function requireAdmin(request) {
	const session = getAuthSession(request);
	if (!session) return { errorResponse: new Response(JSON.stringify({
		error: "Authentication required",
		code: "UNAUTHORIZED"
	}), {
		status: 401,
		headers: { "Content-Type": "application/json" }
	}) };
	if (session.role !== "admin") return { errorResponse: new Response(JSON.stringify({
		error: "Admin authorization required",
		code: "FORBIDDEN"
	}), {
		status: 403,
		headers: { "Content-Type": "application/json" }
	}) };
	return { session };
}
var rateLimitStore = /* @__PURE__ */ new Map();
setInterval(() => {
	const now = Date.now();
	for (const [key, entry] of rateLimitStore.entries()) if (entry.resetAt <= now) rateLimitStore.delete(key);
}, 3e5).unref();
function getClientIp(request) {
	const forwardedFor = request.headers.get("x-forwarded-for");
	if (forwardedFor) return forwardedFor.split(",")[0].trim();
	return request.headers.get("x-real-ip") || request.headers.get("cf-connecting-ip") || request.headers.get("fastly-client-ip") || "127.0.0.1";
}
function checkRateLimit(request, options) {
	const ip = getClientIp(request);
	const key = `${options.keyPrefix}:${ip}`;
	const now = Date.now();
	const entry = rateLimitStore.get(key);
	if (!entry || entry.resetAt <= now) {
		rateLimitStore.set(key, {
			count: 1,
			resetAt: now + options.windowMs
		});
		return {
			allowed: true,
			remaining: options.maxRequests - 1
		};
	}
	if (entry.count >= options.maxRequests) return {
		allowed: false,
		remaining: 0,
		retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1e3))
	};
	entry.count += 1;
	return {
		allowed: true,
		remaining: options.maxRequests - entry.count
	};
}
var authRateLimiter = {
	keyPrefix: "auth_login",
	maxRequests: 5,
	windowMs: 6e4
};
var uploadRateLimiter = {
	keyPrefix: "upload_api",
	maxRequests: 30,
	windowMs: 6e4
};
var mutationRateLimiter = {
	keyPrefix: "mutation_api",
	maxRequests: 60,
	windowMs: 6e4
};
function createRateLimitResponse(retryAfterSeconds = 60) {
	return new Response(JSON.stringify({
		error: "Too many requests. Please slow down and try again later.",
		code: "RATE_LIMITED"
	}), {
		status: 429,
		headers: {
			"Content-Type": "application/json",
			"Retry-After": String(retryAfterSeconds)
		}
	});
}
/**
* Validates strictly whether an input is a valid 24-hex-char MongoDB ObjectId.
*/
function isValidObjectId(id) {
	if (typeof id !== "string" || id.length !== 24) return false;
	return import_mongoose.default.Types.ObjectId.isValid(id) && new import_mongoose.default.Types.ObjectId(id).toString() === id;
}
/**
* Recursively removes any MongoDB query operators ($gt, $ne, $where, etc.) from untrusted inputs.
*/
function sanitizeMongoInput(input) {
	if (input === null || typeof input !== "object") return input;
	if (Array.isArray(input)) return input.map((item) => sanitizeMongoInput(item));
	const cleanObj = {};
	for (const [key, value] of Object.entries(input)) {
		if (key.startsWith("$") || key.includes(".")) continue;
		cleanObj[key] = sanitizeMongoInput(value);
	}
	return cleanObj;
}
/**
* Sanitizes plain text input by trimming and stripping control characters and HTML tags.
*/
function sanitizePlainText(str, maxLength = 1e3) {
	if (typeof str !== "string") return "";
	return str.replace(/[<>]/g, "").replace(/[\u0000-\u0008\u000B-\u001F\u007F-\u009F]/g, "").trim().slice(0, maxLength);
}
var MAX_IMAGE_SIZE = 10485760;
var MAX_AUDIO_SIZE = 52428800;
var MAX_VIDEO_SIZE = 262144e3;
function detectMagicBytes(buffer) {
	if (buffer.length < 4) return null;
	if (buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255) return "image/jpeg";
	if (buffer.length >= 8 && buffer[0] === 137 && buffer[1] === 80 && buffer[2] === 78 && buffer[3] === 71 && buffer[4] === 13 && buffer[5] === 10 && buffer[6] === 26 && buffer[7] === 10) return "image/png";
	if (buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") return "image/webp";
	if (buffer.length >= 6 && (buffer.toString("ascii", 0, 6) === "GIF87a" || buffer.toString("ascii", 0, 6) === "GIF89a")) return "image/gif";
	if (buffer.length >= 8 && buffer.toString("ascii", 4, 8) === "ftyp") {
		const brand = buffer.toString("ascii", 8, 12).toLowerCase();
		if (brand.includes("qt")) return "video/quicktime";
		if (brand.includes("m4a")) return "audio/mp4";
		return "video/mp4";
	}
	if (buffer[0] === 26 && buffer[1] === 69 && buffer[2] === 223 && buffer[3] === 163) return "video/webm";
	if (buffer[0] === 73 && buffer[1] === 68 && buffer[2] === 51) return "audio/mpeg";
	if (buffer[0] === 255 && (buffer[1] & 224) === 224) return "audio/mpeg";
	if (buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WAVE") return "audio/wav";
	if (buffer.toString("ascii", 0, 4) === "OggS") return "audio/ogg";
	return null;
}
/**
* Strictly validates media uploads by size, extension, and binary magic bytes.
*/
function validateMediaUpload(buffer, originalFilename, declaredMimeType, type) {
	const cleanBaseName = originalFilename.replace(/^.*[\\/]/, "").replace(/[^a-zA-Z0-9._-]/g, "_");
	const ext = (cleanBaseName.split(".").pop() || "").toLowerCase();
	if ([
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
		"scr"
	].includes(ext)) return {
		valid: false,
		error: `File extension .${ext} is forbidden for security reasons.`,
		safeFilename: cleanBaseName
	};
	if (type === "image") {
		if (buffer.length > 10485760) return {
			valid: false,
			error: `Image size exceeds the maximum allowed limit of ${(MAX_IMAGE_SIZE / 1024 / 1024).toFixed(0)}MB.`,
			safeFilename: cleanBaseName
		};
		if (![
			"jpg",
			"jpeg",
			"png",
			"webp",
			"gif"
		].includes(ext)) return {
			valid: false,
			error: `Invalid image extension: .${ext}. Allowed: JPG, JPEG, PNG, WEBP, GIF.`,
			safeFilename: cleanBaseName
		};
		const detected = detectMagicBytes(buffer);
		if (!detected || ![
			"image/jpeg",
			"image/png",
			"image/webp",
			"image/gif"
		].includes(detected)) return {
			valid: false,
			error: "File content does not match a valid image signature.",
			safeFilename: cleanBaseName
		};
		return {
			valid: true,
			detectedMimeType: detected,
			safeFilename: `${crypto.randomUUID()}.${ext === "jpeg" ? "jpg" : ext}`
		};
	}
	if (type === "video") {
		if (buffer.length > 262144e3) return {
			valid: false,
			error: `Video size exceeds the maximum allowed limit of ${(MAX_VIDEO_SIZE / 1024 / 1024).toFixed(0)}MB.`,
			safeFilename: cleanBaseName
		};
		if (![
			"mp4",
			"webm",
			"mov"
		].includes(ext)) return {
			valid: false,
			error: `Invalid video extension: .${ext}. Allowed: MP4, WEBM, MOV.`,
			safeFilename: cleanBaseName
		};
		const detected = detectMagicBytes(buffer);
		if (!detected || ![
			"video/mp4",
			"video/webm",
			"video/quicktime"
		].includes(detected)) return {
			valid: false,
			error: "File content does not match a valid video signature.",
			safeFilename: cleanBaseName
		};
		return {
			valid: true,
			detectedMimeType: detected,
			safeFilename: `${crypto.randomUUID()}.${ext}`
		};
	}
	if (type === "song") {
		if (buffer.length > 52428800) return {
			valid: false,
			error: `Audio size exceeds the maximum allowed limit of ${(MAX_AUDIO_SIZE / 1024 / 1024).toFixed(0)}MB.`,
			safeFilename: cleanBaseName
		};
		if (![
			"mp3",
			"wav",
			"ogg",
			"m4a",
			"webm"
		].includes(ext)) return {
			valid: false,
			error: `Invalid audio extension: .${ext}. Allowed: MP3, WAV, OGG, M4A, WEBM.`,
			safeFilename: cleanBaseName
		};
		const detected = detectMagicBytes(buffer);
		if (!detected || ![
			"audio/mpeg",
			"audio/wav",
			"audio/ogg",
			"audio/mp4",
			"video/webm"
		].includes(detected)) return {
			valid: false,
			error: "File content does not match a valid audio signature.",
			safeFilename: cleanBaseName
		};
		return {
			valid: true,
			detectedMimeType: detected === "video/webm" ? "audio/webm" : detected,
			safeFilename: `${crypto.randomUUID()}.${ext}`
		};
	}
	return {
		valid: false,
		error: "Unsupported media type",
		safeFilename: cleanBaseName
	};
}
function getSecurityHeaders() {
	return {
		"X-Content-Type-Options": "nosniff",
		"X-Frame-Options": "SAMEORIGIN",
		"X-XSS-Protection": "1; mode=block",
		"Referrer-Policy": "strict-origin-when-cross-origin",
		"Permissions-Policy": "camera=(), microphone=(), geolocation=()",
		"Strict-Transport-Security": "max-age=31536000; includeSubDomains"
	};
}
function handleCors(request) {
	const origin = request.headers.get("origin") || "";
	const allowedOriginEnv = process.env["ALLOWED_ORIGIN"] || "";
	const requestUrl = new URL(request.url);
	const isAllowed = !origin || origin === requestUrl.origin || origin === allowedOriginEnv || origin.endsWith(".vercel.app") || origin.includes("localhost") || origin.includes("127.0.0.1");
	const headers = {
		...getSecurityHeaders(),
		"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type, Authorization, Range, X-Requested-With",
		"Access-Control-Allow-Credentials": "true"
	};
	if (isAllowed && origin) headers["Access-Control-Allow-Origin"] = origin;
	return {
		isPreflight: request.method === "OPTIONS",
		headers
	};
}
/**
* Validates and converts time strings (e.g. "0:00", "1:30", "4:28", "2:15:30") to total seconds.
*/
function parseTimeString(timeStr) {
	if (timeStr === void 0 || timeStr === null || timeStr.trim() === "") return {
		valid: true,
		seconds: null,
		formatted: null
	};
	const clean = timeStr.trim();
	const hmsMatch = clean.match(/^(\d{1,3}):([0-5]\d):([0-5]\d)$/);
	if (hmsMatch) {
		const hours = parseInt(hmsMatch[1], 10);
		const mins = parseInt(hmsMatch[2], 10);
		const secs = parseInt(hmsMatch[3], 10);
		return {
			valid: true,
			seconds: hours * 3600 + mins * 60 + secs,
			formatted: `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
		};
	}
	const msMatch = clean.match(/^(\d{1,4}):([0-5]\d)$/);
	if (msMatch) {
		const mins = parseInt(msMatch[1], 10);
		const secs = parseInt(msMatch[2], 10);
		return {
			valid: true,
			seconds: mins * 60 + secs,
			formatted: `${mins}:${secs.toString().padStart(2, "0")}`
		};
	}
	if (/^\d+$/.test(clean)) {
		const totalSeconds = parseInt(clean, 10);
		return {
			valid: true,
			seconds: totalSeconds,
			formatted: `${Math.floor(totalSeconds / 60)}:${(totalSeconds % 60).toString().padStart(2, "0")}`
		};
	}
	return {
		valid: false,
		seconds: null,
		formatted: null,
		error: "Invalid time format. Please use M:SS (e.g. 4:28) or H:MM:SS (e.g. 2:15:30)."
	};
}
/**
* Validates and normalizes Spotify track URLs, stripping query parameters.
*/
function extractAndNormalizeSpotifyTrackUrl(url) {
	if (!url || typeof url !== "string") return {
		valid: false,
		trackId: null,
		normalizedUrl: null,
		error: "Spotify URL is required"
	};
	const match = url.trim().match(/(?:open\.spotify\.com\/(?:intl-[a-z]{2}\/)?track\/|spotify:track:)([a-zA-Z0-9]+)/i);
	if (!match || !match[1]) return {
		valid: false,
		trackId: null,
		normalizedUrl: null,
		error: "Invalid Spotify song URL. Please provide a link like https://open.spotify.com/track/..."
	};
	const trackId = match[1];
	return {
		valid: true,
		trackId,
		normalizedUrl: `https://open.spotify.com/track/${trackId}`
	};
}
import_main.default.config();
var serverEntryPromise;
async function getServerEntry() {
	if (!serverEntryPromise) serverEntryPromise = import("./server-CHbSEH5X.mjs").then((m) => m.default ?? m);
	return serverEntryPromise;
}
async function normalizeCatastrophicSsrResponse(response) {
	if (response.status < 500) return response;
	if (!(response.headers.get("content-type") ?? "").includes("application/json")) return response;
	const body = await response.clone().text();
	if (!isH3SwallowedErrorBody(body)) return response;
	console.error(consumeLastCapturedError() ?? /* @__PURE__ */ new Error(`h3 swallowed SSR error: ${body}`));
	return new Response(renderErrorPage(), {
		status: 500,
		headers: { "content-type": "text/html; charset=utf-8" }
	});
}
function isH3SwallowedErrorBody(body) {
	try {
		const payload = JSON.parse(body);
		return payload.unhandled === true && payload.message === "HTTPError";
	} catch {
		return false;
	}
}
var server_default = { async fetch(request, env, ctx) {
	const corsResult = handleCors(request);
	if (corsResult.isPreflight) return new Response(null, {
		status: 204,
		headers: corsResult.headers
	});
	try {
		dbConnect().catch((err) => console.warn("Background DB connection:", err.message));
		const response = await normalizeCatastrophicSsrResponse(await (await getServerEntry()).fetch(request, env, ctx));
		const newHeaders = new Headers(response.headers);
		const secHeaders = getSecurityHeaders();
		for (const [key, val] of Object.entries(secHeaders)) if (!newHeaders.has(key)) newHeaders.set(key, val);
		for (const [key, val] of Object.entries(corsResult.headers)) newHeaders.set(key, val);
		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers: newHeaders
		});
	} catch (error) {
		console.error("Server execution error:", error);
		return new Response(renderErrorPage(), {
			status: 500,
			headers: {
				"content-type": "text/html; charset=utf-8",
				...getSecurityHeaders()
			}
		});
	}
} };
//#endregion
export { validateMediaUpload as _, createSessionCookie as a, dbConnect as b, getAuthSession as c, mutationRateLimiter as d, server_default as default, parseTimeString as f, uploadRateLimiter as g, sanitizePlainText as h, createRateLimitResponse as i, hashPassword as l, sanitizeMongoInput as m, checkRateLimit as n, createSessionToken as o, requireAdmin as p, createClearSessionCookie as r, extractAndNormalizeSpotifyTrackUrl as s, authRateLimiter as t, isValidObjectId as u, verifyPassword as v, renderErrorPage as x, verifySessionToken as y };
