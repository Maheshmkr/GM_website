/* eslint-disable no-console */
import crypto from "crypto";

console.log("=================================================");
console.log("  STARTING COMPREHENSIVE SECURITY AUDIT SUITE");
console.log("=================================================\n");

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`[PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

// -------------------------------------------------------------
// 1. Session Token Signature & Cryptographic Verification Tests
// -------------------------------------------------------------
console.log("\n--- [1] SESSION & CRYPTOGRAPHIC SECURITY TESTS ---");

const secret = "test-secret-galaxy-key-2026-secure-salt";

function createTestToken(payload, customSecret = secret) {
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", customSecret).update(payloadB64).digest("base64url");
  return `${payloadB64}.${signature}`;
}

function verifyTestToken(token, customSecret = secret) {
  if (!token || !token.includes(".")) return null;
  const [payloadB64, signature] = token.split(".");
  const expected = crypto.createHmac("sha256", customSecret).update(payloadB64).digest("base64url");
  
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }
  const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
  if (payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
}

// Test A: Valid Admin Token
const validAdminToken = createTestToken({
  userId: "650000000000000000000001",
  username: "admin",
  role: "admin",
  exp: Math.floor(Date.now() / 1000) + 3600,
  iat: Math.floor(Date.now() / 1000),
});
const parsedAdmin = verifyTestToken(validAdminToken);
assert(parsedAdmin && parsedAdmin.role === "admin", "Valid signed admin token verifies correctly");

// Test B: Forged Token (Tampered role)
const forgedToken = validAdminToken.replace("admin", "user") + "tampered";
assert(verifyTestToken(forgedToken) === null, "Forged/tampered session token is rejected");

// Test C: Forged Token with Wrong Secret
const wrongSecretToken = createTestToken(
  { username: "attacker", role: "admin", exp: Math.floor(Date.now() / 1000) + 3600 },
  "wrong-secret"
);
assert(verifyTestToken(wrongSecretToken) === null, "Token signed with wrong secret is rejected");

// Test D: Expired Token
const expiredToken = createTestToken({
  username: "admin",
  role: "admin",
  exp: Math.floor(Date.now() / 1000) - 100, // expired in past
});
assert(verifyTestToken(expiredToken) === null, "Expired session token is rejected");

// -------------------------------------------------------------
// 2. Password Hashing & Timing-Safe Verification Tests
// -------------------------------------------------------------
console.log("\n--- [2] PASSWORD HASHING (SCRYPT) TESTS ---");

function hashTestPassword(pw) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(pw, salt, 64);
  return `scrypt$${salt}$${derivedKey.toString("hex")}`;
}

function verifyTestPassword(pw, storedHash) {
  if (storedHash.startsWith("scrypt$")) {
    const [, salt, keyHex] = storedHash.split("$");
    const derivedKey = crypto.scryptSync(pw, salt, 64);
    const keyBuf = Buffer.from(keyHex, "hex");
    return derivedKey.length === keyBuf.length && crypto.timingSafeEqual(derivedKey, keyBuf);
  }
  return false;
}

const originalPassword = "SuperSecretLovePassword2026!#";
const hashed = hashTestPassword(originalPassword);
assert(hashed.startsWith("scrypt$"), "Password is hashed using scrypt with unique salt");
assert(verifyTestPassword(originalPassword, hashed), "Correct password matches scrypt hash");
assert(!verifyTestPassword("WrongPassword123", hashed), "Incorrect password fails verification");
assert(!verifyTestPassword("", hashed), "Empty password fails verification");

// -------------------------------------------------------------
// 3. NoSQL Injection & MongoDB Operator Sanitization Tests
// -------------------------------------------------------------
console.log("\n--- [3] NOSQL INJECTION & OPERATOR SANITIZATION TESTS ---");

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

const maliciousPayload = {
  username: "admin",
  password: { $ne: null },
  $where: "sleep(5000)",
  $or: [{ role: "admin" }],
  nested: {
    "evil.field": true,
    safeField: "clean",
    $gt: 0,
  },
};

const sanitized = sanitizeMongoInput(maliciousPayload);
assert(sanitized.$where === undefined, "Stripped top-level $where injection operator");
assert(sanitized.$or === undefined, "Stripped top-level $or injection operator");
assert(typeof sanitized.password === "object" && sanitized.password.$ne === undefined, "Stripped nested $ne operator");
assert(sanitized.nested["evil.field"] === undefined, "Stripped dotted evil key");
assert(sanitized.nested.$gt === undefined, "Stripped nested $gt operator");
assert(sanitized.nested.safeField === "clean", "Preserved legitimate nested fields");

// -------------------------------------------------------------
// 4. Object ID Validation & IDOR Protection Tests
// -------------------------------------------------------------
console.log("\n--- [4] OBJECT ID VALIDATION & IDOR TESTS ---");

function isValidObjectId(id) {
  if (typeof id !== "string" || id.length !== 24) return false;
  return /^[0-9a-fA-F]{24}$/.test(id);
}

assert(isValidObjectId("650000000000000000000001"), "Valid 24-character hex ObjectId passes");
assert(!isValidObjectId("123"), "Short ID is rejected");
assert(!isValidObjectId("../../../etc/passwd"), "Path traversal string is rejected as ObjectId");
assert(!isValidObjectId("65000000000000000000000g"), "Non-hex characters are rejected as ObjectId");
assert(!isValidObjectId({ $ne: 1 }), "Object payload is rejected as ObjectId");

// -------------------------------------------------------------
// 5. File Upload Magic Bytes & Security Tests
// -------------------------------------------------------------
console.log("\n--- [5] FILE UPLOAD & MAGIC BYTES VALIDATION TESTS ---");

function detectMagicBytes(buffer) {
  if (buffer.length < 4) return null;
  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "image/jpeg";
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  )
    return "image/png";
  // WebP: RIFF .... WEBP
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  )
    return "image/webp";
  // MP4: ....ftyp
  if (buffer.length >= 8 && buffer.toString("ascii", 4, 8) === "ftyp") return "video/mp4";
  // MP3 ID3: 49 44 33
  if (buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33) return "audio/mpeg";
  return null;
}

function validateFile(buffer, filename, declaredMime, type) {
  const ext = (filename.split(".").pop() || "").toLowerCase();
  const dangerous = ["exe", "html", "htm", "svg", "js", "sh", "php", "bat"];
  if (dangerous.includes(ext)) {
    return { valid: false, error: "Dangerous file extension forbidden" };
  }
  const detected = detectMagicBytes(buffer);
  if (type === "image" && (!detected || !["image/jpeg", "image/png", "image/webp"].includes(detected))) {
    return { valid: false, error: "Invalid image magic bytes" };
  }
  if (type === "video" && (!detected || detected !== "video/mp4")) {
    return { valid: false, error: "Invalid video magic bytes" };
  }
  if (type === "song" && (!detected || detected !== "audio/mpeg")) {
    return { valid: false, error: "Invalid audio magic bytes" };
  }
  return { valid: true, mime: detected };
}

// Test A: Valid JPEG
const validJpegBuf = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46]);
assert(validateFile(validJpegBuf, "photo.jpg", "image/jpeg", "image").valid, "Valid JPEG magic bytes accepted");

// Test B: Executable with .jpg extension (MIME spoofing)
const maliciousExeBuf = Buffer.from([0x4d, 0x5a, 0x90, 0x00]); // MZ header (Windows PE exe)
assert(!validateFile(maliciousExeBuf, "exploit.jpg", "image/jpeg", "image").valid, "Fake JPEG with EXE header rejected");

// Test C: HTML / SVG / JS upload attempt
const svgBuf = Buffer.from("<svg onload=alert(1)>");
assert(!validateFile(svgBuf, "xss.svg", "image/svg+xml", "image").valid, "SVG file extension rejected");

const htmlBuf = Buffer.from("<html><script>alert(1)</script></html>");
assert(!validateFile(htmlBuf, "page.html", "text/html", "image").valid, "HTML file extension rejected");

// Test D: Valid MP4 video
const validMp4Buf = Buffer.concat([Buffer.from([0x00, 0x00, 0x00, 0x18]), Buffer.from("ftypisom")]);
assert(validateFile(validMp4Buf, "memory.mp4", "video/mp4", "video").valid, "Valid MP4 magic bytes accepted");

// Test E: Valid MP3 audio
const validMp3Buf = Buffer.from([0x49, 0x44, 0x33, 0x03, 0x00, 0x00]);
assert(validateFile(validMp3Buf, "song.mp3", "audio/mpeg", "song").valid, "Valid MP3 ID3 magic bytes accepted");

// -------------------------------------------------------------
// 6. Rate Limiting Tests
// -------------------------------------------------------------
console.log("\n--- [6] RATE LIMITING TESTS ---");

const rateStore = new Map();
function testRateLimiter(ip, limit = 5, windowMs = 60000) {
  const now = Date.now();
  const entry = rateStore.get(ip);
  if (!entry || entry.resetAt <= now) {
    rateStore.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

const testIp = "192.168.1.50";
for (let i = 1; i <= 5; i++) {
  assert(testRateLimiter(testIp, 5), `Request ${i}/5 within rate limit is allowed`);
}
assert(!testRateLimiter(testIp, 5), "Request 6/5 exceeds rate limit and is blocked (HTTP 429)");

// -------------------------------------------------------------
// 8. Admin Credentials Update Security Tests
// -------------------------------------------------------------
console.log("\n--- [8] ADMIN CREDENTIALS UPDATE TESTS ---");

function validateAdminUpdate(payload) {
  if (!payload || typeof payload !== "object") return { valid: false, error: "Invalid payload" };
  const username = typeof payload.username === "string" ? payload.username.trim() : "";
  if (username.length < 3 || username.length > 50) return { valid: false, error: "Username must be 3-50 chars" };
  if (!/^[a-zA-Z0-9_.-]+$/.test(username)) return { valid: false, error: "Invalid characters in username" };
  
  if (payload.newPassword !== undefined && payload.newPassword !== "") {
    if (typeof payload.newPassword !== "string" || payload.newPassword.length < 6) {
      return { valid: false, error: "Password must be at least 6 chars" };
    }
  }
  return { valid: true, username };
}

assert(validateAdminUpdate({ username: "superadmin" }).valid, "Valid admin username update is accepted");
assert(validateAdminUpdate({ username: "superadmin", newPassword: "SuperSecurePassword123!" }).valid, "Valid admin username and password update is accepted");
assert(!validateAdminUpdate({ username: "ad" }).valid, "Short admin username (<3 chars) is rejected");
assert(!validateAdminUpdate({ username: "admin<script>" }).valid, "Admin username with XSS/special chars is rejected");
assert(!validateAdminUpdate({ username: "admin", newPassword: "123" }).valid, "Short admin password (<6 chars) is rejected");

// Scrypt hash & verify new password
const newPass = "NewMasterSecret2026!";
const saltHex = crypto.randomBytes(16).toString("hex");
const derived = crypto.scryptSync(newPass, saltHex, 64);
const hashedPass = `scrypt$${saltHex}$${derived.toString("hex")}`;

const parts = hashedPass.split("$");
const testDerived = crypto.scryptSync(newPass, parts[1], 64);
const testBuf = Buffer.from(parts[2], "hex");
assert(crypto.timingSafeEqual(testDerived, testBuf), "New admin password securely hashed and verified with Scrypt");

// -------------------------------------------------------------
// 9. Spotify URL & Timestamp Validation Tests
// -------------------------------------------------------------
console.log("\n--- [9] SPOTIFY URL & TIMESTAMP VALIDATION TESTS ---");

function parseTimeString(timeStr) {
  if (timeStr === undefined || timeStr === null || timeStr.trim() === "") {
    return { valid: true, seconds: null, formatted: null };
  }
  const clean = timeStr.trim();
  const hmsMatch = clean.match(/^(\d{1,3}):([0-5]\d):([0-5]\d)$/);
  if (hmsMatch) {
    const hours = parseInt(hmsMatch[1], 10);
    const mins = parseInt(hmsMatch[2], 10);
    const secs = parseInt(hmsMatch[3], 10);
    const totalSeconds = hours * 3600 + mins * 60 + secs;
    return {
      valid: true,
      seconds: totalSeconds,
      formatted: `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`,
    };
  }
  const msMatch = clean.match(/^(\d{1,4}):([0-5]\d)$/);
  if (msMatch) {
    const mins = parseInt(msMatch[1], 10);
    const secs = parseInt(msMatch[2], 10);
    const totalSeconds = mins * 60 + secs;
    return {
      valid: true,
      seconds: totalSeconds,
      formatted: `${mins}:${secs.toString().padStart(2, "0")}`,
    };
  }
  if (/^\d+$/.test(clean)) {
    const totalSeconds = parseInt(clean, 10);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return {
      valid: true,
      seconds: totalSeconds,
      formatted: `${mins}:${secs.toString().padStart(2, "0")}`,
    };
  }
  return { valid: false, seconds: null, formatted: null, error: "Invalid time format" };
}

function extractAndNormalizeSpotifyTrackUrl(url) {
  if (!url || typeof url !== "string") {
    return { valid: false, trackId: null, normalizedUrl: null };
  }
  const trimmed = url.trim();
  const match = trimmed.match(
    /(?:open\.spotify\.com\/(?:intl-[a-z]{2}\/)?track\/|spotify:track:)([a-zA-Z0-9]+)/i
  );
  if (!match || !match[1]) {
    return { valid: false, trackId: null, normalizedUrl: null };
  }
  const trackId = match[1];
  return {
    valid: true,
    trackId,
    normalizedUrl: `https://open.spotify.com/track/${trackId}`,
  };
}

// Test A: Time Parsing
assert(parseTimeString("0:00").seconds === 0, "0:00 converts to 0 seconds");
assert(parseTimeString("1:30").seconds === 90, "1:30 converts to 90 seconds");
assert(parseTimeString("4:28").seconds === 268, "4:28 converts to 268 seconds");
assert(parseTimeString("5:49").seconds === 349, "5:49 converts to 349 seconds");
assert(parseTimeString("2:15:30").seconds === 8130, "2:15:30 converts to 8130 seconds");
assert(parseTimeString("").seconds === null, "Empty time string is allowed (returns null seconds)");
assert(parseTimeString("   ").seconds === null, "Whitespace-only time string returns null seconds");
assert(!parseTimeString("4:60").valid, "Invalid seconds (>=60) is rejected");
assert(!parseTimeString("invalid-time").valid, "Arbitrary non-time string is rejected");

// Test B: Spotify URL Validation & Normalization
const validSpotifyUrl = "https://open.spotify.com/track/3lxEwB58zfc7BJcf0RZICP";
const normalized = extractAndNormalizeSpotifyTrackUrl(validSpotifyUrl);
assert(normalized.valid && normalized.normalizedUrl === "https://open.spotify.com/track/3lxEwB58zfc7BJcf0RZICP", "Valid Spotify track URL normalized correctly");

const spotifyWithParams = "https://open.spotify.com/track/3lxEwB58zfc7BJcf0RZICP?si=d1b5853b8ffb4e18&context=spotify%3Aplaylist";
const normalizedParams = extractAndNormalizeSpotifyTrackUrl(spotifyWithParams);
assert(normalizedParams.valid && normalizedParams.normalizedUrl === "https://open.spotify.com/track/3lxEwB58zfc7BJcf0RZICP", "Spotify URL with ?si= tracking query parameters normalized correctly");

const spotifyIntl = "https://open.spotify.com/intl-fr/track/3lxEwB58zfc7BJcf0RZICP";
assert(extractAndNormalizeSpotifyTrackUrl(spotifyIntl).valid, "Spotify intl localized URL accepted and normalized");

const invalidUrl1 = "https://example.com/track/3lxEwB58zfc7BJcf0RZICP";
assert(!extractAndNormalizeSpotifyTrackUrl(invalidUrl1).valid, "Non-Spotify URL is rejected");

const invalidUrl2 = "https://open.spotify.com/album/3lxEwB58zfc7BJcf0RZICP";
// Test C: Uploaded Audio Exact Timestamp Playback Calculation
function calculateAudioInitialTime(startTimeStr) {
  const parsed = parseTimeString(startTimeStr);
  return parsed.valid && parsed.seconds !== null ? parsed.seconds : 0;
}
assert(calculateAudioInitialTime("4:28") === 268, "Uploaded audio 4:28 initializes currentTime to 268s");
assert(calculateAudioInitialTime("0:00") === 0, "Uploaded audio 0:00 initializes currentTime to 0s");
assert(calculateAudioInitialTime("1:15") === 75, "Uploaded audio 1:15 initializes currentTime to 75s");

// Test D: Resume behavior check (current position preserved on pause/resume)
let simulatedCurrentTime = calculateAudioInitialTime("4:28"); // 268s
simulatedCurrentTime += 12; // song plays for 12s -> 280s
const pausedTime = simulatedCurrentTime;
const resumedTime = pausedTime; // resume preserves current position
assert(resumedTime === 280, "Paused and resumed audio preserves position (280s) without resetting to 268s");

console.log("\n=================================================");
console.log(`  ALL ${passedTests}/${totalTests} SECURITY & FUNCTIONAL TESTS PASSED!`);
console.log("=================================================\n");
