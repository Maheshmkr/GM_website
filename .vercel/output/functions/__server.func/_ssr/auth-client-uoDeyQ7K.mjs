import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-CIHAFgYl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-client-uoDeyQ7K.js
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
	const { getCookie } = await import("./server-DhJ0FVa1.mjs");
	return { role: getCookie("auth_role") || null };
});
//#endregion
export { getSession_createServerFn_handler };
