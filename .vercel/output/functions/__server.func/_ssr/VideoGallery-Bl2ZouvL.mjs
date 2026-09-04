import { o as __toESM } from "../_runtime.mjs";
import { t as readJsonResponse } from "./api-BUT7_u4b.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { a as require_react, i as useQueryClient, n as useQuery, o as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { D as LoaderCircle, k as Heart, m as Play, t as X } from "../_libs/lucide-react.mjs";
import "../_libs/sonner.mjs";
import { t as Reveal } from "./Reveal-DSJJWaqp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/VideoGallery-Bl2ZouvL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function VideoGallery({ limit }) {
	const [open, setOpen] = (0, import_react.useState)(null);
	const [favorites, setFavorites] = (0, import_react.useState)({});
	const [showUploader, setShowUploader] = (0, import_react.useState)(false);
	const [file, setFile] = (0, import_react.useState)(null);
	const [previewUrl, setPreviewUrl] = (0, import_react.useState)(null);
	const [title, setTitle] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [duration, setDuration] = (0, import_react.useState)("0:30");
	const [favorite, setFavorite] = (0, import_react.useState)(false);
	const [memoryDate, setMemoryDate] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
	const [status, setStatus] = (0, import_react.useState)("idle");
	const [errorMsg, setErrorMsg] = (0, import_react.useState)("");
	const [showUrlModal, setShowUrlModal] = (0, import_react.useState)(false);
	const [inputUrl, setInputUrl] = (0, import_react.useState)("");
	const [urlTitle, setUrlTitle] = (0, import_react.useState)("");
	const [urlDescription, setUrlDescription] = (0, import_react.useState)("");
	const [urlDuration, setUrlDuration] = (0, import_react.useState)("0:30");
	const [urlDate, setUrlDate] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
	const [urlStatus, setUrlStatus] = (0, import_react.useState)("idle");
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [editDateValue, setEditDateValue] = (0, import_react.useState)("");
	useQueryClient();
	const { data: serverVideos = [], isLoading } = useQuery({
		queryKey: ["videos"],
		queryFn: async () => {
			const res = await fetch("/api/media?type=video");
			const payload = await readJsonResponse(res);
			if (!payload.ok) throw new Error(payload.error || "Failed to fetch videos");
			return payload.data ?? [];
		}
	});
	const mappedVideos = (0, import_react.useMemo)(() => {
		return serverVideos.map((v) => {
			const displayDate = v.memoryDate || v.createdAt || (/* @__PURE__ */ new Date()).toISOString();
			return {
				_id: v._id,
				title: v.title,
				description: v.description || "",
				duration: v.duration || "0:30",
				thumbnail: v.source === "url" ? "" : `/api/media/file/${v.fileId}`,
				src: v.source === "url" ? v.url : `/api/media/file/${v.fileId}`,
				favorite: v.favorite || false,
				rawDate: displayDate.split("T")[0],
				date: displayDate ? new Date(displayDate).toLocaleDateString("en-GB", {
					day: "2-digit",
					month: "short",
					year: "numeric"
				}) : ""
			};
		});
	}, [serverVideos]);
	(0, import_react.useEffect)(() => {
		if (mappedVideos.length > 0) setFavorites((prev) => {
			const nextFavs = { ...prev };
			mappedVideos.forEach((v) => {
				if (v.favorite && nextFavs[v.title] === void 0) nextFavs[v.title] = true;
			});
			return nextFavs;
		});
	}, [mappedVideos]);
	const list = (0, import_react.useMemo)(() => {
		return limit ? mappedVideos.slice(0, limit) : mappedVideos;
	}, [mappedVideos, limit]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4",
			children: list.map((v, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				delay: i * 80,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "glass glass-hover overflow-hidden rounded-3xl flex flex-col justify-between h-full",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setOpen(v),
						className: "group relative block aspect-video w-full",
						"aria-label": `Play ${v.title}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
								src: v.src,
								className: "size-full object-cover pointer-events-none",
								preload: "metadata"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-0 bg-background/35 transition-colors group-hover:bg-background/20" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "btn-love absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
									className: "size-5",
									fill: "currentColor"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "glass absolute bottom-3 right-3 rounded-full px-2.5 py-1 text-[11px] font-medium",
								children: v.duration
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1 p-4 flex-1 justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "truncate text-sm font-semibold",
								children: v.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground line-clamp-1 mt-0.5",
								children: v.description
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between items-center mt-3 pt-2 border-t border-border/10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-1.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground font-medium",
									children: v.date
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setFavorites((f) => ({
										...f,
										[v.title]: !f[v.title]
									})),
									"aria-label": "Favorite video",
									className: "shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {
										className: cn("size-4", favorites[v.title] && "text-primary"),
										fill: favorites[v.title] ? "currentColor" : "none"
									})
								})
							})]
						})]
					})]
				})
			}, v._id + i))
		}),
		isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex justify-center items-center mt-10 text-sm text-muted-foreground gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin text-primary" }), " Loading videos..."]
		}) : list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-10 text-center text-sm text-muted-foreground",
			children: "Nothing here yet — but more videos are coming."
		}) : null,
		open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-[60] grid place-items-center bg-background/90 p-4 backdrop-blur-xl",
			role: "dialog",
			"aria-modal": "true",
			onClick: () => setOpen(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "animate-letter-open glass relative w-full max-w-3xl rounded-3xl p-4",
				onClick: (e) => e.stopPropagation(),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						src: open.src,
						controls: true,
						autoPlay: true,
						playsInline: true,
						className: "aspect-video w-full rounded-2xl bg-black"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-semibold",
							children: open.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: open.description
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setOpen(null),
						"aria-label": "Close",
						className: "glass absolute -top-3 right-2 grid size-10 place-items-center rounded-full cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
					})
				]
			})
		})
	] });
}
//#endregion
export { VideoGallery as t };
