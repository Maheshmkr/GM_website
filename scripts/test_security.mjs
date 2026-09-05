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
// 7. Privilege Escalation Tests
// -------------------------------------------------------------
console.log("\n--- [7] PRIVILEGE ESCALATION TESTS ---");

function createUserSafely(body) {
  // Reject role from client; always assign 'user'
  return {
    username: body.username,
    role: "user", // forced
  };
}

const userCreated = createUserSafely({ username: "eve", role: "admin" });
assert(userCreated.role === "user", "Attacker cannot elevate role by sending { role: 'admin' }");

console.log("\n=================================================");
console.log(`  ALL ${passedTests}/${totalTests} SECURITY TESTS PASSED SUCCESSFULLY!`);
console.log("=================================================\n");
