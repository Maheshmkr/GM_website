import { o as __toESM } from "../_runtime.mjs";
import { t as readJsonResponse } from "./api-DhUICLV2.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { a as require_react, i as useQueryClient, n as useQuery, o as require_jsx_runtime, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { A as Film, E as LoaderCircle, I as Camera, L as Calendar, N as Clock, S as MapPin, a as Trash2, b as Music4, g as Pen, j as ExternalLink, k as Heart, m as Play, p as Plus, r as Users, t as X, y as Music } from "../_libs/lucide-react.mjs";
import { t as SectionHeading } from "./SectionHeading-BVG9eVYl.mjs";
import { t as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-GaAk68KQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminPage() {
	const [activeTab, setActiveTab] = (0, import_react.useState)("photos");
	const queryClient = useQueryClient();
	const { data: photos = [], isLoading: loadingPhotos } = useQuery({
		queryKey: ["photos"],
		queryFn: async () => {
			const res = await fetch("/api/media?type=image");
			const payload = await readJsonResponse(res);
			if (!payload.ok) throw new Error(payload.error || "Failed to fetch photos");
			return payload.data ?? [];
		}
	});
	const { data: videos = [], isLoading: loadingVideos } = useQuery({
		queryKey: ["videos"],
		queryFn: async () => {
			const res = await fetch("/api/media?type=video");
			const payload = await readJsonResponse(res);
			if (!payload.ok) throw new Error(payload.error || "Failed to fetch videos");
			return payload.data ?? [];
		}
	});
	const { data: songs = [], isLoading: loadingSongs } = useQuery({
		queryKey: ["songs"],
		queryFn: async () => {
			const res = await fetch("/api/media?type=song");
			const payload = await readJsonResponse(res);
			if (!payload.ok) throw new Error(payload.error || "Failed to fetch songs");
			return payload.data ?? [];
		}
	});
	const { data: timeline = [], isLoading: loadingTimeline } = useQuery({
		queryKey: ["timeline"],
		queryFn: async () => {
			const res = await fetch("/api/timeline");
			const payload = await readJsonResponse(res);
			if (!payload.ok) throw new Error(payload.error || "Failed to fetch timeline");
			return payload.data ?? [];
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "section-shell py-10 lg:py-16 min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				title: "Admin Management Dashboard",
				subtitle: "Manage the memories, songs, videos, and journey timeline stored in MongoDB."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 flex flex-wrap justify-center gap-2",
				children: [
					{
						id: "photos",
						label: "Photos",
						icon: Camera
					},
					{
						id: "videos",
						label: "Videos",
						icon: Film
					},
					{
						id: "songs",
						label: "Songs",
						icon: Music
					},
					{
						id: "timeline",
						label: "Timeline",
						icon: Calendar
					},
					{
						id: "users",
						label: "Users",
						icon: Users
					}
				].map((t) => {
					const Icon = t.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTab(t.id),
						className: cn("flex items-center gap-2 rounded-full px-5 py-2.5 text-sm transition-all", activeTab === t.id ? "btn-love font-semibold" : "glass text-muted-foreground hover:text-foreground"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), t.label]
					}, t.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12 glass rounded-3xl p-6 lg:p-8",
				children: [
					activeTab === "photos" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotosManager, {
						photos,
						isLoading: loadingPhotos,
						queryClient
					}),
					activeTab === "videos" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideosManager, {
						videos,
						isLoading: loadingVideos,
						queryClient
					}),
					activeTab === "songs" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SongsManager, {
						songs,
						isLoading: loadingSongs,
						queryClient
					}),
					activeTab === "timeline" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimelineManager, {
						timeline,
						isLoading: loadingTimeline,
						queryClient
					}),
					activeTab === "users" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsersManager, { queryClient })
				]
			})
		]
	});
}
function PhotosManager({ photos, isLoading, queryClient }) {
	const [file, setFile] = (0, import_react.useState)(null);
	const [title, setTitle] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("Favorites");
	const [favorite, setFavorite] = (0, import_react.useState)(false);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const deleteMutation = useMutation({
		mutationFn: async (id) => {
			const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
			if (!res.ok) throw new Error("Delete failed");
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["photos"] });
			toast.success("Photo deleted successfully");
		},
		onError: (err) => {
			toast.error(`Delete failed: ${err.message}`);
		}
	});
	const handleUpload = async (e) => {
		e.preventDefault();
		if (!file) {
			toast.error("Please select an image file");
			return;
		}
		if (!title.trim()) {
			toast.error("Title is required");
			return;
		}
		setUploading(true);
		const formData = new FormData();
		formData.append("file", file);
		formData.append("title", title);
		formData.append("description", description);
		formData.append("category", category);
		formData.append("favorite", String(favorite));
		try {
			const res = await fetch("/api/photos", {
				method: "POST",
				body: formData
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Upload failed");
			toast.success("Photo uploaded successfully!");
			setFile(null);
			setTitle("");
			setDescription("");
			setCategory("Favorites");
			setFavorite(false);
			const fileInput = document.getElementById("photo-file");
			if (fileInput) fileInput.value = "";
			queryClient.invalidateQueries({ queryKey: ["photos"] });
		} catch (err) {
			console.error(err);
			toast.error(`Upload error: ${err.message}`);
		} finally {
			setUploading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-8 lg:grid-cols-[1fr_2fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
			className: "text-lg font-semibold flex items-center gap-2 mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-5 text-primary" }), " Add Photo"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleUpload,
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-xs font-semibold text-muted-foreground mb-1",
					children: "Select File (JPEG, PNG, WEBP, GIF)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "photo-file",
					type: "file",
					accept: "image/*",
					onChange: (e) => setFile(e.target.files?.[0] || null),
					className: "w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-secondary file:text-foreground hover:file:bg-secondary/80 bg-surface/50 border border-border rounded-xl p-2.5"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-xs font-semibold text-muted-foreground mb-1",
					children: "Title"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "text",
					placeholder: "e.g. Sunset Date",
					value: title,
					onChange: (e) => setTitle(e.target.value),
					className: "w-full text-sm bg-surface/50 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-xs font-semibold text-muted-foreground mb-1",
					children: "Description / Caption"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					placeholder: "A beautiful evening by the sea...",
					value: description,
					onChange: (e) => setDescription(e.target.value),
					rows: 3,
					className: "w-full text-sm bg-surface/50 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-semibold text-muted-foreground mb-1",
						children: "Category"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: category,
						onChange: (e) => setCategory(e.target.value),
						className: "w-full text-sm bg-surface/50 border border-border rounded-xl p-3 text-foreground focus:outline-none focus:ring-1 focus:ring-primary",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "Favorites",
								children: "Favorites"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "Trips",
								children: "Trips"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "Dates",
								children: "Dates"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "Candid",
								children: "Candid"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "Special",
								children: "Special"
							})
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-center gap-2 border border-border bg-surface/30 rounded-xl px-3 mt-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							id: "photo-fav",
							checked: favorite,
							onChange: (e) => setFavorite(e.target.checked),
							className: "rounded accent-primary size-4"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							htmlFor: "photo-fav",
							className: "text-xs font-semibold text-muted-foreground select-none cursor-pointer flex items-center gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {
									className: "size-3 text-primary",
									fill: favorite ? "currentColor" : "none"
								}),
								" ",
								"Favorite"
							]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					disabled: uploading,
					className: "w-full btn-love rounded-full py-3 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50",
					children: uploading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), " Uploading..."] }) : "Upload Photo"
				})
			]
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-l border-border/30 pl-0 lg:pl-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
				className: "text-lg font-semibold mb-6 flex justify-between items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Uploaded Photos" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs font-normal text-muted-foreground bg-secondary/80 px-2.5 py-1 rounded-full",
					children: [photos.length, " records"]
				})]
			}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-center py-20 text-muted-foreground text-sm gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-5 animate-spin" }), " Loading photos..."]
			}) : photos.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-center py-20 text-muted-foreground text-sm",
				children: "No photos found in MongoDB. Use the form to upload."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: photos.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-surface/30 border border-border rounded-2xl p-4 flex gap-4 items-start relative group",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: `/api/media/${p.fileId}`,
							alt: p.title,
							className: "size-16 rounded-xl object-cover border border-border"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
									className: "font-semibold text-sm truncate flex items-center gap-1",
									children: [p.title, p.favorite && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {
										className: "size-3 text-primary",
										fill: "currentColor"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground truncate mt-0.5",
									children: p.description || "No description"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-1.5 mt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] bg-secondary px-2 py-0.5 rounded-full text-foreground/80 font-medium",
										children: p.category
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[10px] bg-secondary/40 px-2 py-0.5 rounded-full text-muted-foreground",
										children: [(p.fileSize / 1024).toFixed(0), " KB"]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-surface/90 rounded-full p-1 border border-border shadow-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: `/api/media/${p.fileId}`,
								target: "_blank",
								rel: "noreferrer",
								className: "p-1 hover:text-primary transition-colors",
								title: "View Media",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									if (confirm("Are you sure you want to delete this photo?")) deleteMutation.mutate(p._id);
								},
								className: "p-1 text-destructive hover:text-destructive/80 transition-colors",
								title: "Delete Record",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
							})]
						})
					]
				}, p._id))
			})]
		})]
	});
}
function VideosManager({ videos, isLoading, queryClient }) {
	const [file, setFile] = (0, import_react.useState)(null);
	const [title, setTitle] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [duration, setDuration] = (0, import_react.useState)("0:30");
	const [favorite, setFavorite] = (0, import_react.useState)(false);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const deleteMutation = useMutation({
		mutationFn: async (id) => {
			const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
			if (!res.ok) throw new Error("Delete failed");
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["videos"] });
			toast.success("Video deleted successfully");
		},
		onError: (err) => {
			toast.error(`Delete failed: ${err.message}`);
		}
	});
	const handleUpload = async (e) => {
		e.preventDefault();
		if (!file) {
			toast.error("Please select a video file");
			return;
		}
		if (!title.trim()) {
			toast.error("Title is required");
			return;
		}
		setUploading(true);
		const formData = new FormData();
		formData.append("file", file);
		formData.append("title", title);
		formData.append("description", description);
		formData.append("duration", duration);
		formData.append("favorite", String(favorite));
		try {
			const res = await fetch("/api/videos", {
				method: "POST",
				body: formData
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Upload failed");
			toast.success("Video uploaded successfully!");
			setFile(null);
			setTitle("");
			setDescription("");
			setDuration("0:30");
			setFavorite(false);
			const fileInput = document.getElementById("video-file");
			if (fileInput) fileInput.value = "";
			queryClient.invalidateQueries({ queryKey: ["videos"] });
		} catch (err) {
			console.error(err);
			toast.error(`Upload error: ${err.message}`);
		} finally {
			setUploading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-8 lg:grid-cols-[1fr_2fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
			className: "text-lg font-semibold flex items-center gap-2 mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-5 text-primary" }), " Add Video"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleUpload,
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-xs font-semibold text-muted-foreground mb-1",
					children: "Select Video File (MP4, WEBM, MOV)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "video-file",
					type: "file",
					accept: "video/*",
					onChange: (e) => setFile(e.target.files?.[0] || null),
					className: "w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-secondary file:text-foreground hover:file:bg-secondary/80 bg-surface/50 border border-border rounded-xl p-2.5"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-xs font-semibold text-muted-foreground mb-1",
					children: "Title"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "text",
					placeholder: "e.g. Laughing in the Rain",
					value: title,
					onChange: (e) => setTitle(e.target.value),
					className: "w-full text-sm bg-surface/50 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-xs font-semibold text-muted-foreground mb-1",
					children: "Description"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					placeholder: "Captured this cute little moment...",
					value: description,
					onChange: (e) => setDescription(e.target.value),
					rows: 3,
					className: "w-full text-sm bg-surface/50 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-semibold text-muted-foreground mb-1",
						children: "Duration (e.g. 0:45)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						placeholder: "e.g. 0:45",
						value: duration,
						onChange: (e) => setDuration(e.target.value),
						className: "w-full text-sm bg-surface/50 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-center gap-2 border border-border bg-surface/30 rounded-xl px-3 mt-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							id: "video-fav",
							checked: favorite,
							onChange: (e) => setFavorite(e.target.checked),
							className: "rounded accent-primary size-4"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							htmlFor: "video-fav",
							className: "text-xs font-semibold text-muted-foreground select-none cursor-pointer flex items-center gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {
									className: "size-3 text-primary",
									fill: favorite ? "currentColor" : "none"
								}),
								" ",
								"Favorite"
							]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					disabled: uploading,
					className: "w-full btn-love rounded-full py-3 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50",
					children: uploading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), " Uploading..."] }) : "Upload Video"
				})
			]
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-l border-border/30 pl-0 lg:pl-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
				className: "text-lg font-semibold mb-6 flex justify-between items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Uploaded Videos" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs font-normal text-muted-foreground bg-secondary/80 px-2.5 py-1 rounded-full",
					children: [videos.length, " records"]
				})]
			}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-center py-20 text-muted-foreground text-sm gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-5 animate-spin" }), " Loading videos..."]
			}) : videos.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-center py-20 text-muted-foreground text-sm",
				children: "No videos found in MongoDB. Use the form to upload."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: videos.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-surface/30 border border-border rounded-2xl p-4 flex gap-4 items-start relative group",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "size-16 rounded-xl bg-black/60 border border-border flex items-center justify-center shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Film, { className: "size-6 text-primary" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
									className: "font-semibold text-sm truncate flex items-center gap-1",
									children: [v.title, v.favorite && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {
										className: "size-3 text-primary",
										fill: "currentColor"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground truncate mt-0.5",
									children: v.description || "No description"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-1.5 mt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[10px] bg-secondary px-2 py-0.5 rounded-full text-foreground/80 font-medium flex items-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-2.5" }),
											" ",
											v.duration
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[10px] bg-secondary/40 px-2 py-0.5 rounded-full text-muted-foreground",
										children: [(v.fileSize / 1024 / 1024).toFixed(1), " MB"]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-surface/90 rounded-full p-1 border border-border shadow-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: `/api/media/${v.fileId}`,
								target: "_blank",
								rel: "noreferrer",
								className: "p-1 hover:text-primary transition-colors",
								title: "Play Media",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-3.5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									if (confirm("Are you sure you want to delete this video?")) deleteMutation.mutate(v._id);
								},
								className: "p-1 text-destructive hover:text-destructive/80 transition-colors",
								title: "Delete Record",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
							})]
						})
					]
				}, v._id))
			})]
		})]
	});
}
function SongsManager({ songs, isLoading, queryClient }) {
	const [file, setFile] = (0, import_react.useState)(null);
	const [coverFile, setCoverFile] = (0, import_react.useState)(null);
	const [title, setTitle] = (0, import_react.useState)("");
	const [artist, setArtist] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [duration, setDuration] = (0, import_react.useState)("3:30");
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const deleteMutation = useMutation({
		mutationFn: async (id) => {
			const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
			if (!res.ok) throw new Error("Delete failed");
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["songs"] });
			toast.success("Song deleted successfully");
		},
		onError: (err) => {
			toast.error(`Delete failed: ${err.message}`);
		}
	});
	const handleUpload = async (e) => {
		e.preventDefault();
		if (!file) {
			toast.error("Please select an audio file");
			return;
		}
		if (!title.trim() || !artist.trim()) {
			toast.error("Title and Artist are required");
			return;
		}
		setUploading(true);
		const formData = new FormData();
		formData.append("file", file);
		if (coverFile) formData.append("coverFile", coverFile);
		formData.append("title", title);
		formData.append("artist", artist);
		formData.append("description", description);
		formData.append("duration", duration);
		try {
			const res = await fetch("/api/songs", {
				method: "POST",
				body: formData
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Upload failed");
			toast.success("Song uploaded successfully!");
			setFile(null);
			setCoverFile(null);
			setTitle("");
			setArtist("");
			setDescription("");
			setDuration("3:30");
			const fileInput = document.getElementById("song-file");
			if (fileInput) fileInput.value = "";
			const coverInput = document.getElementById("cover-file");
			if (coverInput) coverInput.value = "";
			queryClient.invalidateQueries({ queryKey: ["songs"] });
		} catch (err) {
			console.error(err);
			toast.error(`Upload error: ${err.message}`);
		} finally {
			setUploading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-8 lg:grid-cols-[1fr_2fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
			className: "text-lg font-semibold flex items-center gap-2 mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-5 text-primary" }), " Add Song"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleUpload,
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-xs font-semibold text-muted-foreground mb-1",
					children: "Select Audio File (MP3, WAV, OGG, WEBM)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "song-file",
					type: "file",
					accept: "audio/*",
					onChange: (e) => setFile(e.target.files?.[0] || null),
					className: "w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-secondary file:text-foreground hover:file:bg-secondary/80 bg-surface/50 border border-border rounded-xl p-2.5"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-xs font-semibold text-muted-foreground mb-1",
					children: "Select Album Art / Cover (JPEG, PNG, optional)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "cover-file",
					type: "file",
					accept: "image/*",
					onChange: (e) => setCoverFile(e.target.files?.[0] || null),
					className: "w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-secondary file:text-foreground hover:file:bg-secondary/80 bg-surface/50 border border-border rounded-xl p-2.5"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-semibold text-muted-foreground mb-1",
						children: "Song Title"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						placeholder: "e.g. Perfect",
						value: title,
						onChange: (e) => setTitle(e.target.value),
						className: "w-full text-sm bg-surface/50 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-semibold text-muted-foreground mb-1",
						children: "Artist"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						placeholder: "e.g. Ed Sheeran",
						value: artist,
						onChange: (e) => setArtist(e.target.value),
						className: "w-full text-sm bg-surface/50 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-xs font-semibold text-muted-foreground mb-1",
					children: "Note / Personal Message"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					placeholder: "This song always reminds me of that trip...",
					value: description,
					onChange: (e) => setDescription(e.target.value),
					rows: 2,
					className: "w-full text-sm bg-surface/50 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-xs font-semibold text-muted-foreground mb-1",
					children: "Duration (e.g. 4:23)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "text",
					placeholder: "e.g. 4:23",
					value: duration,
					onChange: (e) => setDuration(e.target.value),
					className: "w-full text-sm bg-surface/50 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					disabled: uploading,
					className: "w-full btn-love rounded-full py-3 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50",
					children: uploading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), " Uploading..."] }) : "Upload Song"
				})
			]
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-l border-border/30 pl-0 lg:pl-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
				className: "text-lg font-semibold mb-6 flex justify-between items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Uploaded Songs" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs font-normal text-muted-foreground bg-secondary/80 px-2.5 py-1 rounded-full",
					children: [songs.length, " records"]
				})]
			}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-center py-20 text-muted-foreground text-sm gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-5 animate-spin" }), " Loading songs..."]
			}) : songs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-center py-20 text-muted-foreground text-sm",
				children: "No songs found in MongoDB. Use the form to upload."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: songs.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-surface/30 border border-border rounded-2xl p-4 flex gap-4 items-start relative group",
					children: [
						s.coverFileId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: `/api/media/${s.coverFileId}`,
							alt: s.title,
							className: "size-16 rounded-xl object-cover border border-border shrink-0"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "size-16 rounded-xl bg-secondary border border-border flex items-center justify-center shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music4, { className: "size-6 text-primary" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-semibold text-sm truncate",
									children: s.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground truncate mt-0.5",
									children: ["by ", s.artist]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[10px] text-muted-foreground/60 italic truncate mt-1",
									children: [
										"\"",
										s.description || "No description",
										"\""
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-1.5 mt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] bg-secondary px-2 py-0.5 rounded-full text-foreground/80 font-medium",
										children: s.duration
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[10px] bg-secondary/40 px-2 py-0.5 rounded-full text-muted-foreground",
										children: [(s.fileSize / 1024 / 1024).toFixed(1), " MB"]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-surface/90 rounded-full p-1 border border-border shadow-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: `/api/media/${s.fileId}`,
								target: "_blank",
								rel: "noreferrer",
								className: "p-1 hover:text-primary transition-colors",
								title: "Listen/Download",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									if (confirm("Are you sure you want to delete this song?")) deleteMutation.mutate(s._id);
								},
								className: "p-1 text-destructive hover:text-destructive/80 transition-colors",
								title: "Delete Record",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
							})]
						})
					]
				}, s._id))
			})]
		})]
	});
}
function TimelineManager({ timeline, isLoading, queryClient }) {
	const [imageFile, setImageFile] = (0, import_react.useState)(null);
	const [videoFile, setVideoFile] = (0, import_react.useState)(null);
	const [title, setTitle] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [date, setDate] = (0, import_react.useState)("");
	const [location, setLocation] = (0, import_react.useState)("");
	const [icon, setIcon] = (0, import_react.useState)("heart");
	const [highlight, setHighlight] = (0, import_react.useState)(false);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [editingItem, setEditingItem] = (0, import_react.useState)(null);
	const [editImageFile, setEditImageFile] = (0, import_react.useState)(null);
	const [editVideoFile, setEditVideoFile] = (0, import_react.useState)(null);
	const [deleteOldImage, setDeleteOldImage] = (0, import_react.useState)(false);
	const [deleteOldVideo, setDeleteOldVideo] = (0, import_react.useState)(false);
	const deleteMutation = useMutation({
		mutationFn: async (id) => {
			const res = await fetch(`/api/timeline/${id}`, { method: "DELETE" });
			if (!res.ok) throw new Error("Delete failed");
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["timeline"] });
			toast.success("Timeline item deleted successfully");
		},
		onError: (err) => {
			toast.error(`Delete failed: ${err.message}`);
		}
	});
	const handleUpload = async (e) => {
		e.preventDefault();
		if (!title.trim() || !date.trim()) {
			toast.error("Title and Date are required");
			return;
		}
		setUploading(true);
		const formData = new FormData();
		formData.append("title", title);
		formData.append("description", description);
		formData.append("date", date);
		formData.append("location", location);
		formData.append("icon", icon);
		formData.append("highlight", String(highlight));
		if (imageFile) formData.append("imageFile", imageFile);
		if (videoFile) formData.append("videoFile", videoFile);
		try {
			const res = await fetch("/api/timeline", {
				method: "POST",
				body: formData
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Creation failed");
			toast.success("Timeline milestone added!");
			setTitle("");
			setDescription("");
			setDate("");
			setLocation("");
			setIcon("heart");
			setHighlight(false);
			setImageFile(null);
			setVideoFile(null);
			const imgInput = document.getElementById("timeline-img");
			if (imgInput) imgInput.value = "";
			const vidInput = document.getElementById("timeline-vid");
			if (vidInput) vidInput.value = "";
			queryClient.invalidateQueries({ queryKey: ["timeline"] });
		} catch (err) {
			console.error(err);
			toast.error(`Error: ${err.message}`);
		} finally {
			setUploading(false);
		}
	};
	const handleUpdate = async (e) => {
		e.preventDefault();
		if (!editingItem) return;
		setUploading(true);
		const formData = new FormData();
		formData.append("title", editingItem.title);
		formData.append("description", editingItem.description);
		formData.append("date", editingItem.date);
		formData.append("location", editingItem.location || "");
		formData.append("icon", editingItem.icon);
		formData.append("highlight", String(editingItem.highlight));
		if (editImageFile) formData.append("imageFile", editImageFile);
		if (editVideoFile) formData.append("videoFile", editVideoFile);
		if (deleteOldImage) formData.append("deleteImage", "true");
		if (deleteOldVideo) formData.append("deleteVideo", "true");
		try {
			const res = await fetch(`/api/timeline/${editingItem._id}`, {
				method: "PUT",
				body: formData
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Update failed");
			toast.success("Timeline milestone updated!");
			setEditingItem(null);
			setEditImageFile(null);
			setEditVideoFile(null);
			setDeleteOldImage(false);
			setDeleteOldVideo(false);
			queryClient.invalidateQueries({ queryKey: ["timeline"] });
		} catch (err) {
			console.error(err);
			toast.error(`Update error: ${err.message}`);
		} finally {
			setUploading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-8 lg:grid-cols-[1fr_2fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: editingItem ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex justify-between items-center mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
				className: "text-lg font-semibold flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "size-5 text-primary" }), " Edit Milestone"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setEditingItem(null),
				className: "text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 glass px-2 py-1 rounded-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3" }), " Cancel"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleUpdate,
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-xs font-semibold text-muted-foreground mb-1",
					children: "Title"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "text",
					value: editingItem.title,
					onChange: (e) => setEditingItem({
						...editingItem,
						title: e.target.value
					}),
					className: "w-full text-sm bg-surface/50 border border-border rounded-xl p-3 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-xs font-semibold text-muted-foreground mb-1",
					children: "Date Description"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "text",
					placeholder: "e.g. 14 Feb 2023 or Forever",
					value: editingItem.date,
					onChange: (e) => setEditingItem({
						...editingItem,
						date: e.target.value
					}),
					className: "w-full text-sm bg-surface/50 border border-border rounded-xl p-3 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-xs font-semibold text-muted-foreground mb-1",
					children: "Description"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: editingItem.description,
					onChange: (e) => setEditingItem({
						...editingItem,
						description: e.target.value
					}),
					rows: 2,
					className: "w-full text-sm bg-surface/50 border border-border rounded-xl p-3 text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-xs font-semibold text-muted-foreground mb-1",
					children: "Location"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "text",
					placeholder: "e.g. Central Park",
					value: editingItem.location || "",
					onChange: (e) => setEditingItem({
						...editingItem,
						location: e.target.value
					}),
					className: "w-full text-sm bg-surface/50 border border-border rounded-xl p-3 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-surface/20 border border-border/50 rounded-xl p-3.5 space-y-3.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-xs font-bold text-muted-foreground",
							children: "Media Attachments"
						}),
						editingItem.imageFileId && !deleteOldImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-border/20 pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-muted-foreground truncate max-w-[70%]",
								children: [
									"Attached Image: `/api/media/$",
									editingItem.imageFileId,
									"`"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setDeleteOldImage(true),
								className: "text-xs text-destructive hover:underline",
								children: "Remove"
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-[10px] font-bold text-muted-foreground/75 mb-1",
							children: "Replace Image"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							accept: "image/*",
							onChange: (e) => {
								setEditImageFile(e.target.files?.[0] || null);
								setDeleteOldImage(true);
							},
							className: "w-full text-xs text-muted-foreground"
						})] }),
						editingItem.videoFileId && !deleteOldVideo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-muted-foreground truncate max-w-[70%]",
								children: [
									"Attached Video: `/api/media/$",
									editingItem.videoFileId,
									"`"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setDeleteOldVideo(true),
								className: "text-xs text-destructive hover:underline",
								children: "Remove"
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-[10px] font-bold text-muted-foreground/75 mb-1",
							children: "Replace Video"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							accept: "video/*",
							onChange: (e) => {
								setEditVideoFile(e.target.files?.[0] || null);
								setDeleteOldVideo(true);
							},
							className: "w-full text-xs text-muted-foreground"
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-semibold text-muted-foreground mb-1",
						children: "Icon"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: editingItem.icon,
						onChange: (e) => setEditingItem({
							...editingItem,
							icon: e.target.value
						}),
						className: "w-full text-sm bg-surface/50 border border-border rounded-xl p-3 text-foreground focus:outline-none",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "heart",
								children: "Heart"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "coffee",
								children: "Coffee"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "sparkles",
								children: "Sparkles"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "plane",
								children: "Plane"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "star",
								children: "Star"
							})
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-center gap-2 border border-border bg-surface/30 rounded-xl px-3 mt-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							id: "edit-timeline-highlight",
							checked: editingItem.highlight,
							onChange: (e) => setEditingItem({
								...editingItem,
								highlight: e.target.checked
							}),
							className: "rounded accent-primary size-4"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "edit-timeline-highlight",
							className: "text-xs font-semibold text-muted-foreground select-none cursor-pointer",
							children: "Highlight Glow"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					disabled: uploading,
					className: "w-full btn-love rounded-full py-3 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50",
					children: uploading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : "Save Changes"
				})
			]
		})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
			className: "text-lg font-semibold flex items-center gap-2 mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-5 text-primary" }), " Add Timeline Item"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleUpload,
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-xs font-semibold text-muted-foreground mb-1",
					children: "Title"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "text",
					placeholder: "e.g. First Time We Met",
					value: title,
					onChange: (e) => setTitle(e.target.value),
					className: "w-full text-sm bg-surface/50 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-xs font-semibold text-muted-foreground mb-1",
					children: "Date (e.g. 12 May 2024 or Forever)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "text",
					placeholder: "e.g. 12 Jan 2023",
					value: date,
					onChange: (e) => setDate(e.target.value),
					className: "w-full text-sm bg-surface/50 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-xs font-semibold text-muted-foreground mb-1",
					children: "Description"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					placeholder: "A short note about this milestone...",
					value: description,
					onChange: (e) => setDescription(e.target.value),
					rows: 2,
					className: "w-full text-sm bg-surface/50 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-xs font-semibold text-muted-foreground mb-1",
					children: "Location (optional)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "text",
					placeholder: "e.g. Paris, France",
					value: location,
					onChange: (e) => setLocation(e.target.value),
					className: "w-full text-sm bg-surface/50 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-semibold text-muted-foreground mb-1",
						children: "Upload Photo (optional)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "timeline-img",
						type: "file",
						accept: "image/*",
						onChange: (e) => setImageFile(e.target.files?.[0] || null),
						className: "w-full text-xs text-muted-foreground bg-surface/30 p-2 rounded-lg border border-border"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-semibold text-muted-foreground mb-1",
						children: "Upload Video (optional)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "timeline-vid",
						type: "file",
						accept: "video/*",
						onChange: (e) => setVideoFile(e.target.files?.[0] || null),
						className: "w-full text-xs text-muted-foreground bg-surface/30 p-2 rounded-lg border border-border"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-semibold text-muted-foreground mb-1",
						children: "Icon Type"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: icon,
						onChange: (e) => setIcon(e.target.value),
						className: "w-full text-sm bg-surface/50 border border-border rounded-xl p-3 text-foreground focus:outline-none",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "heart",
								children: "Heart ❤️"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "coffee",
								children: "Coffee ☕"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "sparkles",
								children: "Sparkles ✨"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "plane",
								children: "Plane ✈️"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "star",
								children: "Star ⭐"
							})
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-center gap-2 border border-border bg-surface/30 rounded-xl px-3 mt-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							id: "timeline-highlight",
							checked: highlight,
							onChange: (e) => setHighlight(e.target.checked),
							className: "rounded accent-primary size-4"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "timeline-highlight",
							className: "text-xs font-semibold text-muted-foreground select-none cursor-pointer",
							children: "Highlight Glow"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					disabled: uploading,
					className: "w-full btn-love rounded-full py-3 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50",
					children: uploading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : "Add Milestone"
				})
			]
		})] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-l border-border/30 pl-0 lg:pl-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
				className: "text-lg font-semibold mb-6 flex justify-between items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Timeline Milestones" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs font-normal text-muted-foreground bg-secondary/80 px-2.5 py-1 rounded-full",
					children: [timeline.length, " records"]
				})]
			}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-center py-20 text-muted-foreground text-sm gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-5 animate-spin" }), " Loading timeline..."]
			}) : timeline.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-center py-20 text-muted-foreground text-sm",
				children: "No milestones found in MongoDB. Use the form to add."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-4",
				children: timeline.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-surface/30 border border-border rounded-2xl p-4 flex gap-4 items-start relative group",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "size-12 rounded-full border border-border flex items-center justify-center bg-secondary shrink-0 text-primary font-bold",
							children: [
								item.icon === "heart" && "❤️",
								item.icon === "coffee" && "☕",
								item.icon === "sparkles" && "✨",
								item.icon === "plane" && "✈️",
								item.icon === "star" && "⭐"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
									className: "font-semibold text-sm truncate flex items-center gap-1.5",
									children: [item.title, item.highlight && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 bg-primary rounded-full animate-ping" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground mt-0.5",
									children: item.description || "No description"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-2 mt-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] bg-secondary px-2.5 py-0.5 rounded-full text-foreground/80 font-medium",
											children: ["📅 ", item.date]
										}),
										item.location && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] bg-secondary/50 px-2.5 py-0.5 rounded-full text-muted-foreground flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-2.5" }),
												" ",
												item.location
											]
										}),
										item.imageFileId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] bg-primary/20 text-primary px-2.5 py-0.5 rounded-full font-medium",
											children: "🖼️ Image"
										}),
										item.videoFileId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] bg-primary/20 text-primary px-2.5 py-0.5 rounded-full font-medium",
											children: "🎥 Video"
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-surface/90 rounded-full p-1 border border-border shadow-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									setEditingItem(item);
									setDeleteOldImage(false);
									setDeleteOldVideo(false);
								},
								className: "p-1 hover:text-primary transition-colors",
								title: "Edit Record",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "size-3.5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									if (confirm("Are you sure you want to delete this milestone?")) deleteMutation.mutate(item._id);
								},
								className: "p-1 text-destructive hover:text-destructive/80 transition-colors",
								title: "Delete Record",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
							})]
						})
					]
				}, item._id))
			})]
		})]
	});
}
function UsersManager({ queryClient }) {
	const [username, setUsername] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [creating, setCreating] = (0, import_react.useState)(false);
	const { data: users = [], isLoading } = useQuery({
		queryKey: ["users"],
		queryFn: async () => {
			const res = await fetch("/api/users");
			const payload = await readJsonResponse(res);
			if (!payload.ok) throw new Error(payload.error || "Failed to fetch users");
			return payload.data ?? [];
		}
	});
	const createMutation = useMutation({
		mutationFn: async (userData) => {
			const res = await fetch("/api/users", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(userData)
			});
			const payload = await readJsonResponse(res);
			if (!payload.ok) throw new Error(payload.error || "Create user failed");
			return payload.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
			toast.success("User created successfully!");
			setUsername("");
			setPassword("");
		},
		onError: (err) => {
			toast.error(`Error creating user: ${err.message}`);
		}
	});
	const deleteMutation = useMutation({
		mutationFn: async (id) => {
			const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
			const payload = await readJsonResponse(res);
			if (!payload.ok) throw new Error(payload.error || "Delete user failed");
			return payload;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
			toast.success("User deleted successfully!");
		},
		onError: (err) => {
			toast.error(`Error deleting user: ${err.message}`);
		}
	});
	const handleCreate = async (e) => {
		e.preventDefault();
		if (!username.trim()) {
			toast.error("Username is required");
			return;
		}
		if (!password.trim()) {
			toast.error("Password is required");
			return;
		}
		setCreating(true);
		try {
			await createMutation.mutateAsync({
				username,
				password
			});
		} catch (err) {} finally {
			setCreating(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-8 lg:grid-cols-[1fr_2fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
			className: "text-lg font-semibold flex items-center gap-2 mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-5 text-primary" }), " Create User Account"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleCreate,
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-xs font-semibold text-muted-foreground mb-1",
					children: "Username"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "text",
					placeholder: "e.g. lovebird",
					value: username,
					onChange: (e) => setUsername(e.target.value),
					className: "w-full text-sm bg-surface/50 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-xs font-semibold text-muted-foreground mb-1",
					children: "Password"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "password",
					placeholder: "Enter account password...",
					value: password,
					onChange: (e) => setPassword(e.target.value),
					className: "w-full text-sm bg-surface/50 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					disabled: creating,
					className: "w-full btn-love rounded-full py-3 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50",
					children: creating ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), " Creating..."] }) : "Create User"
				})
			]
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-l border-border/30 pl-0 lg:pl-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
				className: "text-lg font-semibold mb-6 flex justify-between items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "User Accounts" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs font-normal text-muted-foreground bg-secondary/80 px-2.5 py-1 rounded-full",
					children: [users.length, " accounts"]
				})]
			}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-center py-20 text-muted-foreground text-sm gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-5 animate-spin" }), " Loading user accounts..."]
			}) : users.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-center py-20 text-muted-foreground text-sm",
				children: "No database user accounts found. Use the form to create one."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: users.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-surface/30 border border-border rounded-2xl p-4 flex justify-between items-center relative group",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
								className: "font-semibold text-sm truncate flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4 text-primary" }), u.username]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[10px] text-muted-foreground mt-1",
								children: ["Role: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-foreground capitalize font-medium",
									children: u.role
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[9px] text-muted-foreground mt-0.5",
								children: ["Created: ", new Date(u.createdAt).toLocaleDateString()]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							if (confirm(`Are you sure you want to delete user "${u.username}"?`)) deleteMutation.mutate(u._id);
						},
						className: "p-2 text-destructive hover:bg-destructive/10 rounded-full transition-colors",
						title: "Delete Account",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
					}) })]
				}, u._id))
			})]
		})]
	});
}
//#endregion
export { AdminPage as component };
