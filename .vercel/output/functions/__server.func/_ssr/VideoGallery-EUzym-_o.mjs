import { o as __toESM } from "../_runtime.mjs";
import { n as uploadMediaInChunks, t as readJsonResponse } from "./api-DhUICLV2.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { a as require_react, i as useQueryClient, n as useQuery, o as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { C as Link, E as Film, S as LoaderCircle, T as Heart, f as Play, h as PenLine, l as Save, r as Trash2, t as X } from "../_libs/lucide-react.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { t as Reveal } from "./Reveal-DSJJWaqp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/VideoGallery-EUzym-_o.js
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
	const queryClient = useQueryClient();
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
	const handleFileChange = (e) => {
		const selected = e.target.files?.[0] || null;
		if (selected) {
			setFile(selected);
			setTitle(selected.name.substring(0, selected.name.lastIndexOf(".")) || selected.name);
			setPreviewUrl(URL.createObjectURL(selected));
			setStatus("idle");
			setErrorMsg("");
		}
	};
	const handleUpload = async (e) => {
		e.preventDefault();
		if (!file) return;
		setStatus("uploading");
		try {
			await uploadMediaInChunks({
				file,
				type: "video",
				title,
				description,
				category: "Favorites",
				favorite,
				memoryDate
			});
			setStatus("success");
			toast.success("Video uploaded successfully!");
			setFile(null);
			setPreviewUrl(null);
			setTitle("");
			setDescription("");
			setDuration("0:30");
			setFavorite(false);
			setMemoryDate((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
			setShowUploader(false);
			queryClient.invalidateQueries({ queryKey: ["videos"] });
		} catch (err) {
			console.error(err);
			setStatus("failed");
			setErrorMsg(err.message);
			toast.error(`Upload failed: ${err.message}`);
		}
	};
	const handleUrlSubmit = async (e) => {
		e.preventDefault();
		if (!inputUrl.trim() || !urlTitle.trim()) {
			toast.error("URL and Title are required");
			return;
		}
		setUrlStatus("saving");
		try {
			const res = await fetch("/api/media/url", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					title: urlTitle,
					description: urlDescription,
					duration: urlDuration,
					url: inputUrl,
					type: "video",
					memoryDate: urlDate
				})
			});
			const payload = await readJsonResponse(res);
			if (!payload.ok) throw new Error(payload.error || "Failed to add URL video");
			setUrlStatus("success");
			toast.success("Video URL added successfully!");
			setInputUrl("");
			setUrlTitle("");
			setUrlDescription("");
			setUrlDuration("0:30");
			setUrlDate((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
			setShowUrlModal(false);
			queryClient.invalidateQueries({ queryKey: ["videos"] });
		} catch (err) {
			console.error(err);
			setUrlStatus("failed");
			setErrorMsg(err.message);
			toast.error(`Error: ${err.message}`);
		}
	};
	const handleDelete = async (v) => {
		if (confirm("Are you sure you want to delete this video?")) try {
			if (!(await fetch(`/api/media/${v._id}`, { method: "DELETE" })).ok) throw new Error("Delete failed");
			toast.success("Video deleted");
			queryClient.invalidateQueries({ queryKey: ["videos"] });
		} catch (err) {
			toast.error(`Delete failed: ${err.message}`);
		}
	};
	const handleEditDate = (v) => {
		setEditingId(v._id);
		setEditDateValue(v.rawDate);
	};
	const handleSaveDate = async (id) => {
		try {
			if (!(await fetch(`/api/media/edit/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ memoryDate: editDateValue })
			})).ok) throw new Error("Failed to save date");
			toast.success("Video date updated");
			setEditingId(null);
			queryClient.invalidateQueries({ queryKey: ["videos"] });
		} catch (err) {
			toast.error(`Error: ${err.message}`);
		}
	};
	const isVidUrl = (url) => {
		const cleanUrl = url.toLowerCase().split(/[?#]/)[0];
		return /\.(mp4|webm|mov|qt)$/.test(cleanUrl) || cleanUrl.startsWith("http");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		!limit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 flex justify-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => {
					setShowUploader(!showUploader);
					if (showUrlModal) setShowUrlModal(false);
				},
				className: "rounded-full px-6 py-2.5 text-sm font-semibold btn-love flex items-center gap-2 cursor-pointer",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Film, { className: "size-4" }), showUploader ? "Close Uploader" : "Add Video"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => {
					setShowUrlModal(!showUrlModal);
					if (showUploader) setShowUploader(false);
				},
				className: "rounded-full px-6 py-2.5 text-sm font-semibold btn-love flex items-center gap-2 cursor-pointer",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, { className: "size-4" }), "Add URL"]
			})]
		}),
		showUploader && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "glass rounded-3xl p-6 mt-6 max-w-xl mx-auto animate-letter-open",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleUpload,
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-md font-semibold text-primary",
						children: "Upload New Video"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-semibold text-muted-foreground mb-1",
						children: "Choose Video File (MP4, WEBM, MOV)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "file",
						accept: "video/*",
						onChange: handleFileChange,
						className: "w-full text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-secondary file:text-foreground bg-surface/50 border border-border rounded-xl p-2"
					})] }),
					previewUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "block text-xs font-semibold text-muted-foreground",
								children: ["Selected: ", file?.name]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
								src: previewUrl,
								controls: true,
								className: "max-h-48 rounded-2xl aspect-video mx-auto border border-border bg-black"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-muted-foreground mb-1",
								children: "Title"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: title,
								onChange: (e) => setTitle(e.target.value),
								placeholder: "Enter video title...",
								className: "w-full text-sm bg-surface/35 border border-border rounded-xl p-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-muted-foreground mb-1",
								children: "Description"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: description,
								onChange: (e) => setDescription(e.target.value),
								placeholder: "Enter short description...",
								rows: 2,
								className: "w-full text-sm bg-surface/35 border border-border rounded-xl p-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none resize-none"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-semibold text-muted-foreground mb-1",
									children: "Duration (e.g. 1:12)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: duration,
									onChange: (e) => setDuration(e.target.value),
									placeholder: "e.g. 0:45",
									className: "w-full text-sm bg-surface/35 border border-border rounded-xl p-2.5 text-foreground focus:outline-none"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-semibold text-muted-foreground mb-1",
									children: "Memory Date"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "date",
									value: memoryDate,
									onChange: (e) => setMemoryDate(e.target.value),
									required: true,
									className: "w-full text-sm bg-surface/35 border border-border rounded-xl p-2 text-foreground focus:outline-none"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 border border-border bg-surface/20 rounded-xl px-3 py-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									id: "video-fav-chk",
									checked: favorite,
									onChange: (e) => setFavorite(e.target.checked),
									className: "rounded accent-primary size-4"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									htmlFor: "video-fav-chk",
									className: "text-xs font-semibold text-muted-foreground select-none cursor-pointer",
									children: "Mark Favorite"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-end gap-2 pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										setFile(null);
										setPreviewUrl(null);
										setTitle("");
										setDescription("");
									},
									className: "rounded-full px-4 py-2 text-xs font-semibold bg-secondary text-foreground hover:bg-secondary/80 cursor-pointer",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									disabled: status === "uploading",
									className: "rounded-full px-5 py-2 text-xs font-semibold btn-love disabled:opacity-50 cursor-pointer",
									children: status === "uploading" ? "Uploading..." : "Upload Video"
								})]
							})
						]
					}),
					status === "success" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-green-500 text-center font-medium",
						children: "Success ✓"
					}),
					status === "failed" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-red-500 text-center font-medium",
						children: ["✕ ", errorMsg]
					})
				]
			})
		}),
		showUrlModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 grid place-items-center bg-background/80 p-4 backdrop-blur-md",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass rounded-3xl p-6 w-full max-w-md animate-letter-open space-y-4 relative",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setShowUrlModal(false),
						className: "absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "text-lg font-semibold text-primary flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, { className: "size-5" }), " Add Video URL"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleUrlSubmit,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-muted-foreground mb-1",
								children: "Video URL"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: inputUrl,
								onChange: (e) => setInputUrl(e.target.value),
								placeholder: "https://example.com/video.mp4",
								className: "w-full text-sm bg-surface/30 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none"
							})] }),
							inputUrl.trim() && isVidUrl(inputUrl) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-xs font-semibold text-muted-foreground text-center",
									children: "Preview:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
									src: inputUrl,
									controls: true,
									className: "max-h-36 rounded-xl aspect-video mx-auto border border-border bg-black/40",
									onError: () => toast.error("Could not load video stream. Confirm URL matches a direct video file.")
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-muted-foreground mb-1",
								children: "Title"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: urlTitle,
								onChange: (e) => setUrlTitle(e.target.value),
								placeholder: "Enter Title...",
								className: "w-full text-sm bg-surface/30 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-muted-foreground mb-1",
								children: "Description (optional)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: urlDescription,
								onChange: (e) => setUrlDescription(e.target.value),
								placeholder: "Enter description...",
								className: "w-full text-sm bg-surface/30 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-semibold text-muted-foreground mb-1",
									children: "Duration (e.g. 0:30)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: urlDuration,
									onChange: (e) => setUrlDuration(e.target.value),
									className: "w-full text-sm bg-surface/30 border border-border rounded-xl p-3 text-foreground focus:outline-none"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-semibold text-muted-foreground mb-1",
									children: "Date"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "date",
									value: urlDate,
									onChange: (e) => setUrlDate(e.target.value),
									required: true,
									className: "w-full text-sm bg-surface/30 border border-border rounded-xl p-2.5 text-foreground focus:outline-none"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-end gap-2 pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										setShowUrlModal(false);
										setInputUrl("");
										setUrlTitle("");
										setUrlStatus("idle");
									},
									className: "rounded-full px-4 py-2 text-xs font-semibold bg-secondary text-foreground hover:bg-secondary/80 cursor-pointer",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									disabled: urlStatus === "saving",
									className: "rounded-full px-5 py-2 text-xs font-semibold btn-love disabled:opacity-50 cursor-pointer",
									children: urlStatus === "saving" ? "Saving..." : "Add to Page"
								})]
							})
						]
					}),
					urlStatus === "failed" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-red-500 text-center font-medium",
						children: "✕ Please enter a valid URL."
					})
				]
			})
		}),
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
							children: [editingId === v._id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1",
								onClick: (e) => e.stopPropagation(),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "date",
										value: editDateValue,
										onChange: (e) => setEditDateValue(e.target.value),
										className: "bg-background text-foreground text-[10px] border border-border rounded px-1 py-0.5 focus:outline-none w-24"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handleSaveDate(v._id),
										className: "p-1 rounded bg-primary/20 hover:bg-primary/40 text-primary cursor-pointer",
										title: "Save Date",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "size-3" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setEditingId(null),
										className: "p-1 rounded bg-secondary hover:bg-secondary/80 text-foreground cursor-pointer",
										title: "Cancel",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3" })
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground font-medium",
									children: v.date
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: (e) => {
										e.stopPropagation();
										handleEditDate(v);
									},
									className: "text-muted-foreground hover:text-primary transition-colors cursor-pointer pointer-events-auto opacity-0 group-hover:opacity-100",
									title: "Edit Date",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "size-3" })
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
								}), !limit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: (e) => {
										e.stopPropagation();
										handleDelete(v);
									},
									"aria-label": "Delete video",
									className: "shrink-0 text-muted-foreground hover:text-destructive transition-colors cursor-pointer",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
								})]
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
