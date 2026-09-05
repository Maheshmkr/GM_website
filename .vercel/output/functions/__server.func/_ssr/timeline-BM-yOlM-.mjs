import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as SectionHeading } from "./SectionHeading-BVG9eVYl.mjs";
import { n as Timeline, t as Surprise } from "./Surprise-DK17wOmU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/timeline-BM-yOlM-.js
var import_jsx_runtime = require_jsx_runtime();
function TimelinePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "section-shell py-10 lg:py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				title: "Our Journey Timeline",
				subtitle: "A timeline of our beautiful journey together."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timeline, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-14 text-center text-sm text-muted-foreground",
				children: "More memories to come..."
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Surprise, {})] });
}
//#endregion
export { TimelinePage as component };
