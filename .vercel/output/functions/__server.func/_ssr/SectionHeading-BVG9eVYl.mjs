import { o as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { k as Heart } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SectionHeading-BVG9eVYl.js
var import_jsx_runtime = require_jsx_runtime();
function SectionHeading({ title, subtitle }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "inline-flex items-center gap-3 text-2xl font-semibold sm:text-3xl md:text-4xl",
				children: [title, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "size-6 shrink-0 text-primary" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto mt-3 h-px w-24 bg-[var(--gradient-love)]" }),
			subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted-foreground sm:text-base",
				children: subtitle
			})
		]
	});
}
//#endregion
export { SectionHeading as t };
