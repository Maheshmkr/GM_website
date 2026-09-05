import { _ as verifySessionToken } from "./ssr.mjs";
import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-CIHAFgYl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-client-DM3HDy-5.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getSession_createServerFn_handler = createServerRpc({
	id: "fa53db6d7d99485381d3938c052e3e0d28ade00339fe126c775ad001a03de872",
	name: "getSession",
	filename: "src/lib/auth-client.ts"
}, (opts) => getSession.__executeServer(opts));
var getSession = createServerFn({ method: "GET" }).handler(getSession_createServerFn_handler, async () => {
	const { getCookie } = await import("./server-gTMmBsco.mjs");
	const sessionCookie = getCookie("auth_session");
	const session = verifySessionToken(sessionCookie);
	return {
		role: session?.role || null,
		username: session?.username || null,
		userId: session?.userId || null
	};
});
//#endregion
export { getSession_createServerFn_handler };
