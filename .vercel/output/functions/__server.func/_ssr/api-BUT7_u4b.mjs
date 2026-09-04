//#region node_modules/.nitro/vite/services/ssr/assets/api-BUT7_u4b.js
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
//#endregion
export { readJsonResponse as t };
