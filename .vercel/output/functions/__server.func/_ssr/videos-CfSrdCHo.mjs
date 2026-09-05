import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as SectionHeading } from "./SectionHeading-BVG9eVYl.mjs";
import { t as VideoGallery } from "./VideoGallery-Bl2ZouvL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/videos-CfSrdCHo.js
var import_jsx_runtime = require_jsx_runtime();
function VideosPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "section-shell py-10 lg:py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
			title: "Our Videos",
			subtitle: "Little moments captured in motion."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoGallery, {})]
	});
}
//#endregion
export { VideosPage as component };
