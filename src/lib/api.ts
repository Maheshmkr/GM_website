export const UPLOAD_CHUNK_SIZE_BYTES = 2 * 1024 * 1024;

/**
 * Client-side image compression using Canvas API.
 * Automatically downscales massive photos and converts to high-quality JPEG/PNG,
 * reducing file size from 10-20MB to ~300KB-1MB in milliseconds.
 */
export async function compressImage(
  file: File,
  maxWidth = 2048,
  maxHeight = 2048,
  quality = 0.85
): Promise<File> {
  // If not an image or is animated GIF or already very small (< 400KB), don't process
  if (
    !file.type.startsWith("image/") ||
    file.type === "image/gif" ||
    file.type === "image/svg+xml" ||
    file.size < 400 * 1024
  ) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        const outputType = file.type === "image/png" && file.size < 2 * 1024 * 1024 ? "image/png" : "image/jpeg";
        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) {
              resolve(file);
            } else {
              const baseName = file.name.replace(/\.[^/.]+$/, "");
              const ext = outputType === "image/jpeg" ? ".jpg" : ".png";
              resolve(new File([blob], `${baseName}${ext}`, { type: outputType }));
            }
          },
          outputType,
          quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

export async function readJsonResponse(response: Response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      const data = await response.json();
      return {
        ok: response.ok,
        data,
        error: response.ok ? null : data?.error || data?.message || "Request failed",
      };
    } catch {
      // Fallback if json parsing fails
    }
  }

  const rawText = await response.text();
  const lower = rawText.toLowerCase();
  let friendlyError = rawText;

  if (
    response.status === 413 ||
    lower.includes("request entity too large") ||
    lower.includes("content too large") ||
    lower.includes("body size")
  ) {
    friendlyError = "File is too large for direct upload. It will automatically upload in chunks.";
  } else if (!response.ok) {
    friendlyError = rawText.length > 200 ? `Request failed (HTTP ${response.status})` : rawText;
  }

  return {
    ok: response.ok,
    data: null,
    error: response.ok ? null : friendlyError || `Request failed with status ${response.status}`,
  };
}

export function formatUploadError(error: string | null, fallback = "Upload failed") {
  if (!error) return fallback;
  const lower = error.toLowerCase();
  if (lower.includes("request entity too large") || lower.includes("413") || lower.includes("content too large")) {
    return "The uploaded file is too large for a single request. Automatic chunking has been enabled.";
  }
  if (lower.includes("not valid json") || lower.includes("unexpected token")) {
    return "Upload connection error. Please try again with a compressed image.";
  }
  return error;
}

export async function uploadMediaInChunks({
  file,
  type,
  title,
  artist,
  description,
  duration,
  category,
  favorite,
  showInHero,
  memoryDate,
  startTime,
  endTime,
  coverFileId,
  onProgress,
}: {
  file: File;
  type: "image" | "video" | "song";
  title: string;
  artist?: string;
  description?: string;
  duration?: string;
  category?: string;
  favorite?: boolean;
  showInHero?: boolean;
  memoryDate?: string;
  startTime?: string;
  endTime?: string;
  coverFileId?: string;
  onProgress?: (percent: number) => void;
}) {
  const uploadId = crypto.randomUUID();
  const totalChunks = Math.max(1, Math.ceil(file.size / UPLOAD_CHUNK_SIZE_BYTES));

  let lastResult: any = null;

  for (let index = 0; index < totalChunks; index += 1) {
    const start = index * UPLOAD_CHUNK_SIZE_BYTES;
    const end = Math.min(start + UPLOAD_CHUNK_SIZE_BYTES, file.size);
    const chunk = file.slice(start, end);

    const formData = new FormData();
    formData.append("file", chunk, file.name);
    formData.append("uploadId", uploadId);
    formData.append("chunkIndex", String(index));
    formData.append("totalChunks", String(totalChunks));
    formData.append("isLastChunk", String(index === totalChunks - 1));
    formData.append("filename", file.name);
    formData.append("mimeType", file.type || "application/octet-stream");
    formData.append("type", type);
    formData.append("title", title);
    if (artist) formData.append("artist", artist);
    if (description) formData.append("description", description);
    if (duration) formData.append("duration", duration);
    if (category) formData.append("category", category);
    if (favorite !== undefined) formData.append("favorite", String(favorite));
    if (showInHero !== undefined) formData.append("showInHero", String(showInHero));
    if (memoryDate) formData.append("memoryDate", memoryDate);
    if (startTime) formData.append("startTime", startTime);
    if (endTime) formData.append("endTime", endTime);
    if (coverFileId) formData.append("coverFileId", coverFileId);

    const response = await fetch("/api/media/upload", {
      method: "POST",
      body: formData,
    });

    const payload = await readJsonResponse(response);
    if (!payload.ok) {
      throw new Error(formatUploadError(payload.error || "Upload failed"));
    }

    if (onProgress) {
      const percent = Math.round(((index + 1) / totalChunks) * 100);
      onProgress(percent);
    }

    lastResult = payload.data;
  }

  return lastResult;
}

