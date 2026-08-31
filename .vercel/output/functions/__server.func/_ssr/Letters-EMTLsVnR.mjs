import { o as __toESM } from "../_runtime.mjs";
import { a as require_react, o as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { C as Mail, k as Heart, t as X } from "../_libs/lucide-react.mjs";
import { r as letters } from "./site-DayVGLaA.mjs";
import { t as Reveal } from "./Reveal-DSJJWaqp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Letters-EMTLsVnR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Letters({ limit }) {
	const [open, setOpen] = (0, import_react.useState)(null);
	const list = limit ? letters.slice(0, limit) : letters;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4",
		children: list.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
			delay: i * 80,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setOpen(l),
				className: "glass glass-hover flex h-full w-full flex-col rounded-3xl p-6 text-left",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-10 place-items-center rounded-2xl bg-[var(--gradient-love)] text-primary-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-4 text-base font-semibold leading-snug",
						children: l.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 flex-1 text-sm leading-relaxed text-muted-foreground",
						children: l.preview
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mt-5 flex items-center justify-between text-xs text-muted-foreground",
						children: [l.date, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "size-3.5 text-primary" })]
					})
				]
			})
		}, l.title))
	}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[60] grid place-items-center bg-background/90 p-4 backdrop-blur-xl",
		role: "dialog",
		"aria-modal": "true",
		onClick: () => setOpen(null),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "animate-letter-open glass relative max-h-[80vh] w-full max-w-xl overflow-y-auto rounded-3xl p-7 sm:p-9",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"aria-hidden": true,
					className: "pointer-events-none absolute inset-0 overflow-hidden rounded-3xl",
					children: [
						0,
						1,
						2,
						3,
						4
					].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {
						className: "animate-float-up absolute bottom-0 size-3 text-primary",
						fill: "currentColor",
						style: {
							left: `${12 + i * 19}%`,
							animationDuration: `${9 + i * 2}s`,
							animationDelay: `${i * 1.4}s`,
							"--heart-opacity": .25
						}
					}, i))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-[0.25em] text-primary",
					children: "Words from my heart"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-3 text-2xl font-semibold",
					children: open.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground",
					children: open.body.split("\n\n").map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: p }, p))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-7 text-sm text-primary",
					children: "Always yours ♡"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setOpen(null),
					"aria-label": "Close letter",
					className: "glass absolute right-4 top-4 grid size-9 place-items-center rounded-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
				})
			]
		})
	})] });
}
//#endregion
export { Letters as t };
