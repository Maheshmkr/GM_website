import { o as __toESM } from "../_runtime.mjs";
import { t as readJsonResponse } from "./api-BUT7_u4b.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { a as require_react, i as useQueryClient, n as useQuery, o as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { M as Heart, R as ChevronRight, k as LoaderCircle, t as X, z as ChevronLeft } from "../_libs/lucide-react.mjs";
import { t as SectionHeading } from "./SectionHeading-BVG9eVYl.mjs";
import "../_libs/sonner.mjs";
import { a as photoCategories } from "./site-_zOoiwhn.mjs";
import { t as Reveal } from "./Reveal-DSJJWaqp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/photos-BO0Kt4e2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PhotoGallery() {
	const [filter, setFilter] = (0, import_react.useState)("All");
	const [openIndex, setOpenIndex] = (0, import_react.useState)(null);
	const [favorites, setFavorites] = (0, import_react.useState)({});
	const [showUploader, setShowUploader] = (0, import_react.useState)(false);
	const [file, setFile] = (0, import_react.useState)(null);
	const [previewUrl, setPreviewUrl] = (0, import_react.useState)(null);
	const [title, setTitle] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("Favorites");
	const [favorite, setFavorite] = (0, import_react.useState)(false);
	const [memoryDate, setMemoryDate] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
	const [status, setStatus] = (0, import_react.useState)("idle");
	const [errorMsg, setErrorMsg] = (0, import_react.useState)("");
	const [showUrlModal, setShowUrlModal] = (0, import_react.useState)(false);
	const [inputUrl, setInputUrl] = (0, import_react.useState)("");
	const [urlTitle, setUrlTitle] = (0, import_react.useState)("");
	const [urlCategory, setUrlCategory] = (0, import_react.useState)("Favorites");
	const [urlDate, setUrlDate] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
	const [urlStatus, setUrlStatus] = (0, import_react.useState)("idle");
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [editDateValue, setEditDateValue] = (0, import_react.useState)("");
	useQueryClient();
	const { data: serverPhotos = [], isLoading } = useQuery({
		queryKey: ["photos"],
		queryFn: async () => {
			const res = await fetch("/api/media?type=image");
			const payload = await readJsonResponse(res);
			if (!payload.ok) throw new Error(payload.error || "Failed to fetch photos");
			return payload.data ?? [];
		}
	});
	const mappedPhotos = (0, import_react.useMemo)(() => {
		return serverPhotos.map((p) => {
			const displayDate = p.memoryDate || p.createdAt || (/* @__PURE__ */ new Date()).toISOString();
			return {
				_id: p._id,
				image: p.source === "url" ? p.url : `/api/media/file/${p.fileId}`,
				category: p.category || "Special",
				caption: p.title || p.description || "",
				date: displayDate ? new Date(displayDate).toLocaleDateString("en-GB", {
					day: "2-digit",
					month: "short",
					year: "numeric"
				}) : "",
				rawDate: displayDate.split("T")[0],
				favorite: p.favorite || false
			};
		});
	}, [serverPhotos]);
	(0, import_react.useEffect)(() => {
		if (mappedPhotos.length > 0) setFavorites((prev) => {
			const nextFavs = { ...prev };
			mappedPhotos.forEach((p) => {
				if (p.favorite && nextFavs[p.caption] === void 0) nextFavs[p.caption] = true;
			});
			return nextFavs;
		});
	}, [mappedPhotos]);
	const list = (0, import_react.useMemo)(() => {
		if (filter === "All") return mappedPhotos;
		if (filter === "Favorites") return mappedPhotos.filter((p) => favorites[p.caption]);
		return mappedPhotos.filter((p) => p.category === filter);
	}, [
		filter,
		mappedPhotos,
		favorites
	]);
	const active = openIndex === null ? null : list[openIndex];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-10 flex flex-wrap justify-center gap-2 items-center",
			children: photoCategories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setFilter(c),
				className: cn("rounded-full px-4 py-2 text-sm transition-all", filter === c ? "btn-love font-semibold" : "glass text-muted-foreground hover:text-foreground"),
				children: c
			}, c))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
			children: list.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				delay: i % 6 * 70,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
					className: "group relative overflow-hidden rounded-3xl border border-border bg-surface/30 flex flex-col",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setOpenIndex(i),
						className: "block w-full text-left",
						"aria-label": `Open ${p.caption}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative w-full aspect-[4/3] overflow-hidden bg-black/30",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: p.image,
								alt: p.caption,
								loading: "lazy",
								className: "w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.06]"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pointer-events-none absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-80 transition-opacity group-hover:opacity-100" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
							className: "p-4 pr-14",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold truncate",
								children: p.caption
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-2 mt-0.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: p.date
								})
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setFavorites((f) => ({
							...f,
							[p.caption]: !f[p.caption]
						})),
						"aria-label": "Favorite photo",
						className: "glass absolute right-3 top-3 grid size-9 place-items-center rounded-full pointer-events-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {
							className: cn("size-4", favorites[p.caption] && "text-primary"),
							fill: favorites[p.caption] ? "currentColor" : "none"
						})
					})]
				})
			}, p._id + i))
		}),
		isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex justify-center items-center mt-14 text-sm text-muted-foreground gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin text-primary" }), " Loading memories..."]
		}) : list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-14 text-center text-sm text-muted-foreground",
			children: "Nothing here yet — but more memories are coming."
		}) : null,
		active && openIndex !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-[60] grid place-items-center bg-background/90 p-4 backdrop-blur-xl",
			role: "dialog",
			"aria-modal": "true",
			onClick: () => setOpenIndex(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "animate-letter-open relative w-full max-w-4xl",
				onClick: (e) => e.stopPropagation(),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative max-h-[72vh] w-full flex items-center justify-center overflow-hidden rounded-3xl bg-black/40",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: active.image,
							alt: active.caption,
							className: "max-h-[72vh] max-w-full w-auto h-auto rounded-3xl object-contain mx-auto"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-base font-semibold",
							children: active.caption
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: active.date
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setOpenIndex(null),
						"aria-label": "Close",
						className: "glass absolute -top-2 right-0 grid size-10 place-items-center rounded-full sm:-right-2 cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setOpenIndex((i) => ((i ?? 0) - 1 + list.length) % list.length),
						"aria-label": "Previous photo",
						className: "glass absolute left-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setOpenIndex((i) => ((i ?? 0) + 1) % list.length),
						"aria-label": "Next photo",
						className: "glass absolute right-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-5" })
					})
				]
			})
		})
	] });
}
function PhotosPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "section-shell py-10 lg:py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
			title: "Our Beautiful Memories",
			subtitle: "Every picture holds a special moment with you."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoGallery, {})]
	});
}
//#endregion
export { PhotosPage as component };
