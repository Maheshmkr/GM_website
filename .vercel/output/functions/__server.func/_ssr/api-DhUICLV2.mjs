//#region node_modules/.nitro/vite/services/ssr/assets/api-DhUICLV2.js
var UPLOAD_CHUNK_SIZE_BYTES = 2097152;
async function readJsonResponse(response) {
	if ((response.headers.get("content-type") || "").includes("application/json")) {
		const data = await response.json();
		return {
			ok: response.ok,
			data,
			error: response.ok ? null : data?.error || data?.message || "Request failed"
		};
	}
	const rawText = await response.text();
	return {
		ok: response.ok,
		data: null,
		error: response.ok ? null : rawText || `Request failed with status ${response.status}`
	};
}
function formatUploadError(error, fallback = "Upload failed") {
	if (!error) return fallback;
	const lower = error.toLowerCase();
	if (lower.includes("request entity too large") || lower.includes("413")) return "The uploaded file is too large for the current upload method. Please try a smaller file.";
	if (lower.includes("not valid json") || lower.includes("unexpected token")) return "Upload failed. Please try again with a smaller file.";
	return error;
}
async function uploadMediaInChunks({ file, type, title, artist, description, category, favorite, memoryDate }) {
	const uploadId = crypto.randomUUID();
	const totalChunks = Math.max(1, Math.ceil(file.size / UPLOAD_CHUNK_SIZE_BYTES));
	let lastResult = null;
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
		if (category) formData.append("category", category);
		if (favorite !== void 0) formData.append("favorite", String(favorite));
		if (memoryDate) formData.append("memoryDate", memoryDate);
		const payload = await readJsonResponse(await fetch("/api/media/upload", {
			method: "POST",
			body: formData
		}));
		if (!payload.ok) throw new Error(formatUploadError(payload.error || "Upload failed"));
		lastResult = payload.data;
	}
	return lastResult;
}
//#endregion
export { uploadMediaInChunks as n, readJsonResponse as t };
