import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { a as require_react, n as useQuery, o as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { F as Coffee, M as Heart, _ as Plane, c as Sparkles, k as LoaderCircle, s as Star, t as X } from "../_libs/lucide-react.mjs";
import { c as timeline, n as girlfriend } from "./site-_zOoiwhn.mjs";
import { t as Reveal } from "./Reveal-DSJJWaqp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Surprise-DK17wOmU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var icons = {
	heart: Heart,
	coffee: Coffee,
	sparkles: Sparkles,
	plane: Plane,
	star: Star
};
function Node({ m }) {
	const Icon = icons[m.icon];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("grid size-14 shrink-0 place-items-center rounded-full border border-border", m.highlight ? "btn-love animate-glow-pulse border-transparent" : "bg-surface-2 text-muted-foreground"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
			className: "size-5",
			fill: m.highlight ? "currentColor" : "none"
		})
	});
}
function Timeline() {
	const { data: serverTimeline = [], isLoading } = useQuery({
		queryKey: ["timeline"],
		queryFn: async () => {
			const res = await fetch("/api/timeline");
			if (!res.ok) throw new Error("Failed to fetch timeline");
			return res.json();
		}
	});
	const milestones = (0, import_react.useMemo)(() => {
		if (serverTimeline.length > 0) return serverTimeline.map((item) => ({
			title: item.title,
			description: item.description || "",
			date: item.memoryDate ? new Date(item.memoryDate).toLocaleDateString("en-GB", {
				day: "2-digit",
				month: "short",
				year: "numeric"
			}) : item.date,
			icon: item.icon || "heart",
			highlight: item.highlight || false,
			image: item.imageFileId ? `/api/media/file/${item.imageFileId}` : void 0
		}));
		return timeline;
	}, [serverTimeline]);
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-center items-center py-20 text-sm text-muted-foreground gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-5 animate-spin text-primary" }), " Loading timeline..."]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-14",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative hidden lg:block",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-0 right-0 top-7 h-px bg-[var(--gradient-love)] opacity-60" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "relative grid gap-4",
				style: { gridTemplateColumns: `repeat(${milestones.length || 1}, minmax(0, 1fr))` },
				children: milestones.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
					as: "li",
					delay: i * 110,
					className: "text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Node, { m })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-5 text-base font-semibold",
							children: m.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mx-auto mt-2 max-w-[15rem] text-sm text-muted-foreground",
							children: m.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: cn("mt-3 text-xs", m.highlight ? "font-semibold text-primary" : "text-muted-foreground"),
							children: m.date
						}),
						m.image && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto mt-4 h-28 w-full overflow-hidden rounded-2xl bg-black/20",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: m.image,
								alt: m.title,
								loading: "lazy",
								className: "size-full object-cover object-center opacity-85 transition-transform duration-500 hover:scale-105 hover:opacity-100"
							})
						})
					]
				}, m.title))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
			className: "relative space-y-8 pl-4 lg:hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-4 left-[2.75rem] top-4 w-px bg-[var(--gradient-love)] opacity-50" }), milestones.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				as: "li",
				delay: i * 90,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Node, { m }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "glass min-w-0 flex-1 rounded-2xl p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-base font-semibold",
								children: m.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: m.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: cn("mt-2 text-xs", m.highlight ? "font-semibold text-primary" : "text-muted-foreground"),
								children: m.date
							}),
							m.image && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 aspect-video max-h-48 w-full overflow-hidden rounded-xl bg-black/20",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: m.image,
									alt: m.title,
									loading: "lazy",
									className: "size-full object-cover object-center"
								})
							})
						]
					})]
				})
			}, m.title))]
		})]
	});
}
function Surprise() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [revealed, setRevealed] = (0, import_react.useState)(false);
	const start = () => {
		setOpen(true);
		window.setTimeout(() => setRevealed(true), 700);
	};
	const close = () => {
		setOpen(false);
		setRevealed(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "section-shell py-16 lg:py-24",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass mx-auto max-w-3xl rounded-[2rem] p-10 text-center sm:p-14",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-[0.3em] text-primary",
					children: "Our story isn't finished yet"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-2xl font-semibold sm:text-3xl",
					children: "I left something here just for you"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: start,
					className: "btn-love mt-8 inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold",
					children: ["Open Your Surprise ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": true,
						children: "💌"
					})]
				})
			]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-[70] grid place-items-center bg-background/95 p-4 backdrop-blur-2xl",
			role: "dialog",
			"aria-modal": "true",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative w-full max-w-lg text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mx-auto h-40 w-64 sm:h-48 sm:w-80",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: cn("absolute inset-x-0 top-0 mx-auto h-0 w-0 origin-top border-x-[128px] border-t-[80px] border-x-transparent transition-transform duration-700 sm:border-x-[160px] sm:border-t-[96px]", revealed ? "rotate-x-180 opacity-0" : "opacity-100"),
								style: {
									borderTopColor: "oklch(0.35 0.12 340)",
									transform: revealed ? "rotateX(180deg)" : void 0
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 rounded-2xl bg-[var(--gradient-love)] opacity-90 shadow-[var(--shadow-glow)]" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: cn("glass absolute inset-x-6 bottom-8 rounded-2xl p-5 transition-all duration-700", revealed ? "-translate-y-24 opacity-100 sm:-translate-y-28" : "translate-y-6 opacity-0"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {
									className: "mx-auto size-5 text-primary",
									fill: "currentColor"
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("mt-14 transition-all duration-700 sm:mt-16", revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-lg leading-relaxed sm:text-xl",
							children: girlfriend.surpriseMessage
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary",
							children: ["I Love You ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {
								className: "size-4",
								fill: "currentColor"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: close,
						"aria-label": "Close surprise",
						className: "glass absolute -top-4 right-0 grid size-10 place-items-center rounded-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
					})
				]
			})
		})]
	});
}
//#endregion
export { Timeline as n, Surprise as t };
