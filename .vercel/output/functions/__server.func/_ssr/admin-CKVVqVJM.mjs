import { o as __toESM } from "../_runtime.mjs";
import { t as readJsonResponse } from "./api-BUT7_u4b.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, o as require_react, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { r as parseDuration } from "./MusicProvider-RkXNWREC.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { A as Lock, C as Music, D as Mail, E as MapPin, F as Heart, G as Camera, H as CircleCheck, I as Film, K as Calendar, L as Eye, M as Link, N as KeyRound, P as Image, R as EyeOff, V as Clock, _ as Plus, a as Upload, b as Pen, c as Sparkles, f as Shield, j as LoaderCircle, o as Trash2, p as ShieldCheck, r as Users, t as X, v as Play, w as Music4, z as ExternalLink } from "../_libs/lucide-react.mjs";
import { t as SectionHeading } from "./SectionHeading-BVG9eVYl.mjs";
import { t as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-CKVVqVJM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminPage() {
	const [activeTab, setActiveTab] = (0, import_react.useState)("photos");
	const queryClient = useQueryClient();
	const { data: photos = [], isLoading: loadingPhotos } = useQuery({
		queryKey: ["photos"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/media?type=image");
				const payload = await readJsonResponse(res);
				if (!payload.ok) return [];
				return Array.isArray(payload.data) ? payload.data : [];
			} catch (err) {
				console.error("Error fetching photos:", err);
				return [];
			}
		}
	});
	const { data: videos = [], isLoading: loadingVideos } = useQuery({
		queryKey: ["videos"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/media?type=video");
				const payload = await readJsonResponse(res);
				if (!payload.ok) return [];
				return Array.isArray(payload.data) ? payload.data : [];
			} catch (err) {
				console.error("Error fetching videos:", err);
				return [];
			}
		}
	});
	const { data: songs = [], isLoading: loadingSongs } = useQuery({
		queryKey: ["songs"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/media?type=song");
				const payload = await readJsonResponse(res);
				if (!payload.ok) return [];
				return Array.isArray(payload.data) ? payload.data : [];
			} catch (err) {
				console.error("Error fetching songs:", err);
				return [];
			}
		}
	});
	const { data: timeline = [], isLoading: loadingTimeline } = useQuery({
		queryKey: ["timeline"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/timeline");
				const payload = await readJsonResponse(res);
				if (!payload.ok) return [];
				return Array.isArray(payload.data) ? payload.data : [];
			} catch (err) {
				console.error("Error fetching timeline:", err);
				return [];
			}
		}
	});
	const { data: letters = [], isLoading: loadingLetters } = useQuery({
		queryKey: ["letters"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/letters");
				const payload = await readJsonResponse(res);
				if (!payload.ok) return [];
				return Array.isArray(payload.data) ? payload.data : [];
			} catch (err) {
				console.error("Error fetching letters:", err);
				return [];
			}
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "section-shell py-10 lg:py-16 min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				title: "Admin Management Dashboard",
				subtitle: "Manage the memories, songs, videos, letters, and journey timeline stored in MongoDB."
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
						id: "letters",
						label: "Letters 💌",
						icon: Mail
					},
					{
						id: "fun",
						label: "Fun Zone Images",
						icon: Sparkles
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
					activeTab === "letters" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LettersManager, {
						letters,
						isLoading: loadingLetters,
						queryClient
					}),
					activeTab === "fun" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FunZoneManager, { queryClient }),
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "size-16 shrink-0 rounded-xl overflow-hidden border border-border bg-black/20",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: `/api/media/${p.fileId}`,
								alt: p.title,
								className: "size-full object-cover object-center"
							})
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
	const safeSongs = Array.isArray(songs) ? songs : [];
	const [file, setFile] = (0, import_react.useState)(null);
	const [coverFile, setCoverFile] = (0, import_react.useState)(null);
	const [uploadTitle, setUploadTitle] = (0, import_react.useState)("");
	const [uploadArtist, setUploadArtist] = (0, import_react.useState)("");
	const [uploadDescription, setUploadDescription] = (0, import_react.useState)("");
	const [uploadDuration, setUploadDuration] = (0, import_react.useState)("3:30");
	const [uploadDate, setUploadDate] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [isSpotifyModalOpen, setIsSpotifyModalOpen] = (0, import_react.useState)(false);
	const [editingSpotifyId, setEditingSpotifyId] = (0, import_react.useState)(null);
	const [editingSongSource, setEditingSongSource] = (0, import_react.useState)("spotify");
	const [spotifyUrl, setSpotifyUrl] = (0, import_react.useState)("");
	const [spotifyTitle, setSpotifyTitle] = (0, import_react.useState)("");
	const [spotifyArtist, setSpotifyArtist] = (0, import_react.useState)("");
	const [spotifyStartTime, setSpotifyStartTime] = (0, import_react.useState)("0:00");
	const [spotifyEndTime, setSpotifyEndTime] = (0, import_react.useState)("");
	const [spotifyDate, setSpotifyDate] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
	const [savingSpotify, setSavingSpotify] = (0, import_react.useState)(false);
	const [driveUrl, setDriveUrl] = (0, import_react.useState)("");
	const [driveTitle, setDriveTitle] = (0, import_react.useState)("");
	const [driveArtist, setDriveArtist] = (0, import_react.useState)("");
	const [driveDate, setDriveDate] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
	const [addingDrive, setAddingDrive] = (0, import_react.useState)(false);
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
		if (!uploadTitle.trim() || !uploadArtist.trim()) {
			toast.error("Title and Artist are required");
			return;
		}
		setUploading(true);
		const formData = new FormData();
		formData.append("file", file);
		if (coverFile) formData.append("coverFile", coverFile);
		formData.append("title", uploadTitle);
		formData.append("artist", uploadArtist);
		formData.append("description", uploadDescription);
		formData.append("duration", uploadDuration);
		formData.append("startTime", "0:00");
		formData.append("memoryDate", uploadDate);
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
			setUploadTitle("");
			setUploadArtist("");
			setUploadDescription("");
			setUploadDuration("3:30");
			setUploadDate((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
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
	const handleOpenAddSpotify = () => {
		setEditingSpotifyId(null);
		setEditingSongSource("spotify");
		setSpotifyUrl("");
		setSpotifyTitle("");
		setSpotifyArtist("");
		setSpotifyStartTime("0:00");
		setSpotifyEndTime("");
		setSpotifyDate((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
		setIsSpotifyModalOpen(true);
	};
	const handleOpenEditSong = (song) => {
		setEditingSpotifyId(song._id);
		setEditingSongSource(song.source || (song.fileId ? "upload" : "spotify"));
		setSpotifyUrl(song.url || "");
		setSpotifyTitle(song.title || "");
		setSpotifyArtist(song.artist || "");
		setSpotifyStartTime(song.startTime || "0:00");
		setSpotifyEndTime(song.endTime || "");
		setSpotifyDate(song.memoryDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
		setIsSpotifyModalOpen(true);
	};
	const handleSpotifyUrlChange = async (urlVal) => {
		setSpotifyUrl(urlVal);
		if (urlVal.includes("spotify.com/track/") || urlVal.startsWith("spotify:track:")) try {
			const cleanUrl = urlVal.trim();
			const oembedRes = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(cleanUrl)}`);
			if (oembedRes.ok) {
				const data = await oembedRes.json();
				if (data.title && !spotifyTitle) setSpotifyTitle(data.title);
				if (data.author_name && !spotifyArtist) setSpotifyArtist(data.author_name);
			}
		} catch (_) {}
	};
	const handleSaveSpotify = async (e) => {
		e.preventDefault();
		if (editingSongSource === "spotify" && !editingSpotifyId && !spotifyUrl.trim()) {
			toast.error("Please paste a Spotify URL");
			return;
		}
		if (!spotifyTitle.trim() || !spotifyArtist.trim()) {
			toast.error("Song Title and Artist are required");
			return;
		}
		if (!spotifyStartTime.trim()) {
			toast.error("Start playing time is required (e.g. 0:00 or 4:28)");
			return;
		}
		setSavingSpotify(true);
		try {
			if (editingSpotifyId) {
				const payload = {
					title: spotifyTitle,
					artist: spotifyArtist,
					memoryDate: spotifyDate,
					startTime: spotifyStartTime,
					endTime: spotifyEndTime || void 0
				};
				if (spotifyUrl.trim()) payload.url = spotifyUrl.trim();
				const res = await fetch(`/api/media/edit/${editingSpotifyId}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload)
				});
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Failed to update song");
				toast.success("Song updated successfully!");
			} else {
				const res = await fetch("/api/media/url", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						type: "song",
						sourceType: "spotify",
						url: spotifyUrl,
						title: spotifyTitle,
						artist: spotifyArtist,
						memoryDate: spotifyDate,
						startTime: spotifyStartTime,
						endTime: spotifyEndTime || void 0
					})
				});
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Failed to add Spotify song");
				toast.success("Spotify song added successfully!");
			}
			setIsSpotifyModalOpen(false);
			setEditingSpotifyId(null);
			setSpotifyUrl("");
			setSpotifyTitle("");
			setSpotifyArtist("");
			setSpotifyStartTime("0:00");
			setSpotifyEndTime("");
			queryClient.invalidateQueries({ queryKey: ["songs"] });
		} catch (err) {
			console.error(err);
			toast.error(err.message || "Failed to save Spotify song");
		} finally {
			setSavingSpotify(false);
		}
	};
	const handleAddDrive = async (e) => {
		e.preventDefault();
		if (!driveUrl.trim()) {
			toast.error("Please paste a Google Drive URL");
			return;
		}
		if (!driveTitle.trim() || !driveArtist.trim()) {
			toast.error("Song Title and Artist are required");
			return;
		}
		setAddingDrive(true);
		try {
			const res = await fetch("/api/media/url", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					type: "song",
					sourceType: "google-drive",
					url: driveUrl,
					title: driveTitle,
					artist: driveArtist,
					memoryDate: driveDate
				})
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed to add Google Drive song");
			toast.success("Google Drive song added successfully!");
			setDriveUrl("");
			setDriveTitle("");
			setDriveArtist("");
			setDriveDate((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
			queryClient.invalidateQueries({ queryKey: ["songs"] });
		} catch (err) {
			console.error(err);
			toast.error(err.message);
		} finally {
			setAddingDrive(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-8 lg:grid-cols-[1fr_1.5fr]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "text-lg font-semibold flex items-center gap-2 mb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-5 text-primary" }), " ADD SONG"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mb-6",
						children: "Upload from computer or add external Spotify / Google Drive tracks."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border border-emerald-500/30 bg-emerald-500/5 rounded-3xl p-6 relative overflow-hidden backdrop-blur-md",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
									className: "text-base font-semibold text-emerald-400 flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-5" }), " Spotify Music Link"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
									children: "Featured"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mb-5 leading-relaxed",
								children: "Link any song from Spotify with custom start and stop timestamps (e.g. 4:28)."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: handleOpenAddSpotify,
								className: "w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-full py-3 text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer active:scale-98",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music4, { className: "size-4" }), " ♫ Add Spotify Link"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border border-border/60 bg-surface/20 rounded-2xl p-5 space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
							className: "text-sm font-semibold text-foreground flex items-center gap-2 border-b border-border/40 pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music, { className: "size-4 text-primary" }), " Upload from Computer"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleUpload,
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-semibold text-muted-foreground mb-1",
									children: "Choose Song File (MP3, WAV, OGG, WEBM)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "song-file",
									type: "file",
									accept: "audio/*",
									onChange: (e) => setFile(e.target.files?.[0] || null),
									className: "w-full text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-secondary file:text-foreground hover:file:bg-secondary/80 bg-surface/50 border border-border rounded-xl p-2"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-semibold text-muted-foreground mb-1",
									children: "Album Art / Cover (JPEG, PNG, optional)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "cover-file",
									type: "file",
									accept: "image/*",
									onChange: (e) => setCoverFile(e.target.files?.[0] || null),
									className: "w-full text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-secondary file:text-foreground hover:file:bg-secondary/80 bg-surface/50 border border-border rounded-xl p-2"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-semibold text-muted-foreground mb-1",
										children: "Song Title"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										placeholder: "e.g. Perfect",
										value: uploadTitle,
										onChange: (e) => setUploadTitle(e.target.value),
										className: "w-full text-xs bg-surface/50 border border-border rounded-xl p-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-semibold text-muted-foreground mb-1",
										children: "Artist"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										placeholder: "e.g. Ed Sheeran",
										value: uploadArtist,
										onChange: (e) => setUploadArtist(e.target.value),
										className: "w-full text-xs bg-surface/50 border border-border rounded-xl p-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-semibold text-muted-foreground mb-1",
										children: "Memory Date"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "date",
										value: uploadDate,
										onChange: (e) => setUploadDate(e.target.value),
										className: "w-full text-xs bg-surface/50 border border-border rounded-xl p-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-semibold text-muted-foreground mb-1",
										children: "Duration (e.g. 4:23)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										placeholder: "e.g. 4:23",
										value: uploadDuration,
										onChange: (e) => setUploadDuration(e.target.value),
										className: "w-full text-xs bg-surface/50 border border-border rounded-xl p-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-semibold text-muted-foreground mb-1",
									children: "Note / Description"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									placeholder: "This song always reminds me of...",
									value: uploadDescription,
									onChange: (e) => setUploadDescription(e.target.value),
									rows: 2,
									className: "w-full text-xs bg-surface/50 border border-border rounded-xl p-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									disabled: uploading,
									className: "w-full btn-love rounded-full py-2.5 text-xs font-semibold flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer",
									children: uploading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), " Uploading..."] }) : "Upload Song"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border border-border/60 bg-surface/20 rounded-2xl p-5 space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
							className: "text-sm font-semibold text-foreground flex items-center gap-2 border-b border-border/40 pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, { className: "size-4 text-blue-400" }), " Add Google Drive Song"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleAddDrive,
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-semibold text-muted-foreground mb-1",
									children: "Paste Google Drive Shared URL"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									placeholder: "https://drive.google.com/file/d/FILE_ID/view?usp=sharing",
									value: driveUrl,
									onChange: (e) => setDriveUrl(e.target.value),
									className: "w-full text-xs bg-surface/50 border border-border rounded-xl p-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-semibold text-muted-foreground mb-1",
										children: "Song Title"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										placeholder: "Song Title",
										value: driveTitle,
										onChange: (e) => setDriveTitle(e.target.value),
										className: "w-full text-xs bg-surface/50 border border-border rounded-xl p-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-semibold text-muted-foreground mb-1",
										children: "Artist"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										placeholder: "Artist",
										value: driveArtist,
										onChange: (e) => setDriveArtist(e.target.value),
										className: "w-full text-xs bg-surface/50 border border-border rounded-xl p-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-semibold text-muted-foreground mb-1",
									children: "Memory Date"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "date",
									value: driveDate,
									onChange: (e) => setDriveDate(e.target.value),
									className: "w-full text-xs bg-surface/50 border border-border rounded-xl p-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									disabled: addingDrive,
									className: "w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full py-2.5 text-xs font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-colors cursor-pointer",
									children: addingDrive ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), " Adding..."] }) : "Add Google Drive Song"
								})
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t lg:border-t-0 lg:border-l border-border/30 pt-6 lg:pt-0 lg:pl-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between items-center mb-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "text-lg font-semibold flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music4, { className: "size-5 text-primary" }), " Saved Music & Tracks"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mt-0.5",
						children: "All active songs stored in MongoDB database"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs font-medium text-muted-foreground bg-secondary/80 border border-border px-3 py-1 rounded-full",
						children: [safeSongs.length, " records"]
					})]
				}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-center py-20 text-muted-foreground text-sm gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-5 animate-spin text-primary" }), " Loading songs..."]
				}) : safeSongs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-center py-20 text-muted-foreground text-sm bg-surface/20 border border-dashed border-border rounded-2xl p-6",
					children: "No songs found in MongoDB. Use the forms to add songs."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: safeSongs.map((s) => {
						const isSpotify = s.source === "spotify" || s.url && s.url.includes("spotify.com");
						const isDrive = s.source === "google-drive" || s.url && s.url.includes("drive.google.com");
						const sourceLabel = isSpotify ? "Spotify" : isDrive ? "Google Drive" : s.source === "upload" ? "Computer Upload" : "External Link";
						const sourceBadgeColor = isSpotify ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : isDrive ? "bg-blue-500/20 text-blue-400 border-blue-500/30" : "bg-secondary text-foreground/80 border-border/40";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("border rounded-2xl p-4 flex flex-col justify-between relative group transition-all duration-200", isSpotify ? "bg-emerald-500/5 border-emerald-500/25 hover:border-emerald-500/50 shadow-sm" : "bg-surface/30 border-border hover:border-border/80"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-3.5 items-start",
								children: [s.coverFileId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "size-16 shrink-0 rounded-xl overflow-hidden border border-border bg-black/20",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: `/api/media/${s.coverFileId}`,
										alt: s.title,
										className: "size-full object-cover object-center"
									})
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: cn("size-14 rounded-xl border flex items-center justify-center shrink-0", isSpotify ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400" : "bg-secondary border-border text-primary"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music4, { className: "size-6" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "font-semibold text-sm truncate text-foreground flex items-center gap-1.5",
											children: isSpotify ? `♫ ${s.title}` : s.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground truncate mt-0.5",
											children: ["by ", s.artist]
										}),
										isSpotify && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-1 text-[11px] text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-emerald-400 font-medium",
												children: ["Starts at: ", s.startTime || "0:00"]
											}), s.endTime && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-emerald-400/80 font-medium",
												children: [" • Ends at: ", s.endTime]
											})]
										}),
										s.memoryDate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[10px] text-muted-foreground/80 font-medium mt-1",
											children: ["📅 ", s.memoryDate]
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 pt-3 border-t border-border/40 flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("text-[10px] px-2.5 py-0.5 rounded-full font-medium border", sourceBadgeColor),
									children: sourceLabel
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [
										isSpotify && s.url ? (() => {
											const startSec = typeof s.startSeconds === "number" && s.startSeconds > 0 ? s.startSeconds : s.startTime ? parseDuration(s.startTime) : 0;
											const spotifyLink = startSec > 0 ? `${s.url}${s.url.includes("?") ? "&" : "?"}t=${startSec}` : s.url;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
												href: spotifyLink,
												target: "_blank",
												rel: "noopener noreferrer",
												className: "inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-full px-2.5 py-1 transition-colors",
												title: "Open in Spotify",
												children: ["Open in Spotify ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3" })]
											});
										})() : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: s.source === "upload" ? `/api/media/file/${s.fileId}` : s.url,
											target: "_blank",
											rel: "noreferrer",
											className: "inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-full px-2.5 py-1 transition-colors",
											title: "Listen / Preview Audio",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-3" }), " Listen"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => handleOpenEditSong(s),
											className: "p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors cursor-pointer",
											title: "Edit Song",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "size-3.5" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => {
												if (confirm(`Are you sure you want to delete "${s.title}"?`)) deleteMutation.mutate(s._id);
											},
											className: "p-1.5 text-destructive/80 hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors cursor-pointer",
											title: "Delete Record",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
										})
									]
								})]
							})]
						}, s._id);
					})
				})]
			}),
			isSpotifyModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-lg bg-surface border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between pb-2 border-b border-border/40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "text-lg font-bold text-foreground flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music4, { className: "size-5 text-emerald-400" }), editingSpotifyId ? editingSongSource === "upload" ? "Edit Uploaded Song" : "Edit Spotify Song" : "Add Spotify Link"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setIsSpotifyModalOpen(false),
							className: "p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSaveSpotify,
						className: "space-y-4",
						children: [
							editingSongSource === "spotify" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block text-xs font-semibold text-muted-foreground mb-1.5",
									children: ["Spotify URL ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-emerald-400",
										children: "*"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									placeholder: "Paste Spotify song link (e.g. https://open.spotify.com/track/3lxEwB58zfc7BJcf0RZICP)",
									value: spotifyUrl,
									onChange: (e) => handleSpotifyUrlChange(e.target.value),
									className: "w-full text-xs sm:text-sm bg-surface/80 border border-border/80 rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono",
									required: !editingSpotifyId
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-muted-foreground mt-1",
									children: "💡 Spotify controls external playback behavior. For exact timestamp playback on this site, you can also upload the audio file directly."
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block text-xs font-semibold text-muted-foreground mb-1.5",
									children: ["Song Title ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-emerald-400",
										children: "*"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									placeholder: "e.g. Paal Pappali",
									value: spotifyTitle,
									onChange: (e) => setSpotifyTitle(e.target.value),
									className: "w-full text-xs sm:text-sm bg-surface/80 border border-border/80 rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all",
									required: true
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block text-xs font-semibold text-muted-foreground mb-1.5",
									children: ["Artist ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-emerald-400",
										children: "*"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									placeholder: "e.g. Anirudh Ravichander",
									value: spotifyArtist,
									onChange: (e) => setSpotifyArtist(e.target.value),
									className: "w-full text-xs sm:text-sm bg-surface/80 border border-border/80 rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all",
									required: true
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block text-xs font-semibold text-foreground mb-1",
										children: ["Start playing at ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-emerald-400",
											children: "*"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										placeholder: "e.g. 4:28 or 0:00",
										value: spotifyStartTime,
										onChange: (e) => setSpotifyStartTime(e.target.value),
										className: "w-full text-xs sm:text-sm bg-surface/90 border border-border rounded-xl p-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono",
										required: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-muted-foreground mt-1 leading-tight",
										children: "Example: 4:28 means the song starts at 4 minutes 28 seconds."
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block text-xs font-semibold text-foreground mb-1",
										children: ["Stop playing at ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground font-normal",
											children: "(optional)"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										placeholder: "e.g. 5:49",
										value: spotifyEndTime,
										onChange: (e) => setSpotifyEndTime(e.target.value),
										className: "w-full text-xs sm:text-sm bg-surface/90 border border-border rounded-xl p-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-muted-foreground mt-1 leading-tight",
										children: "Leave empty to play until the song ends."
									})
								] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-muted-foreground mb-1.5",
								children: "Memory Date"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								value: spotifyDate,
								onChange: (e) => setSpotifyDate(e.target.value),
								className: "w-full text-xs sm:text-sm bg-surface/80 border border-border/80 rounded-xl p-3 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2 flex flex-col sm:flex-row gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setIsSpotifyModalOpen(false),
									className: "w-full sm:w-1/3 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full py-3 text-sm font-semibold transition-all cursor-pointer",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									disabled: savingSpotify,
									className: "w-full sm:w-2/3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full py-3 text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer disabled:opacity-50",
									children: savingSpotify ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), " Saving..."] }) : "Save Song"
								})]
							})
						]
					})]
				})
			})
		]
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
	const [adminUsername, setAdminUsername] = (0, import_react.useState)("");
	const [adminPassword, setAdminPassword] = (0, import_react.useState)("");
	const [confirmAdminPassword, setConfirmAdminPassword] = (0, import_react.useState)("");
	const [showAdminPass, setShowAdminPass] = (0, import_react.useState)(false);
	const [updatingAdmin, setUpdatingAdmin] = (0, import_react.useState)(false);
	const { data: users = [], isLoading } = useQuery({
		queryKey: ["users"],
		queryFn: async () => {
			const res = await fetch("/api/users");
			const payload = await readJsonResponse(res);
			if (!payload.ok) throw new Error(payload.error || "Failed to fetch users");
			return payload.data ?? [];
		}
	});
	const { data: adminProfile } = useQuery({
		queryKey: ["adminProfile"],
		queryFn: async () => {
			const res = await fetch("/api/auth/admin");
			const payload = await readJsonResponse(res);
			if (payload.ok && payload.data) return payload.data;
			return { username: "admin" };
		}
	});
	(0, import_react.useEffect)(() => {
		if (adminProfile?.username && !adminUsername) setAdminUsername(adminProfile.username);
	}, [adminProfile]);
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
	const updateAdminMutation = useMutation({
		mutationFn: async (payload) => {
			const res = await fetch("/api/auth/admin", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload)
			});
			const data = await readJsonResponse(res);
			if (!data.ok) throw new Error(data.error || "Failed to update admin credentials");
			return data;
		},
		onSuccess: (data) => {
			toast.success(data?.data?.message || data?.message || "Admin credentials updated successfully!");
			setAdminPassword("");
			setConfirmAdminPassword("");
			queryClient.invalidateQueries({ queryKey: ["adminProfile"] });
			queryClient.invalidateQueries({ queryKey: ["users"] });
			queryClient.invalidateQueries({ queryKey: ["auth-session"] });
		},
		onError: (err) => {
			toast.error(err.message || "Error updating admin credentials");
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
			queryClient.invalidateQueries({ queryKey: ["adminProfile"] });
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
		} catch {} finally {
			setCreating(false);
		}
	};
	const handleUpdateAdmin = async (e) => {
		e.preventDefault();
		const cleanUser = (adminUsername || adminProfile?.username || "admin").trim();
		if (!cleanUser) {
			toast.error("Admin username is required");
			return;
		}
		if (adminPassword) {
			if (adminPassword.length < 6) {
				toast.error("New password must be at least 6 characters");
				return;
			}
			if (adminPassword !== confirmAdminPassword) {
				toast.error("Passwords do not match");
				return;
			}
		}
		setUpdatingAdmin(true);
		try {
			await updateAdminMutation.mutateAsync({
				username: cleanUser,
				newPassword: adminPassword || void 0
			});
		} catch {} finally {
			setUpdatingAdmin(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-8 lg:grid-cols-[1.1fr_1.4fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-surface/40 border border-primary/20 rounded-3xl p-6 shadow-sm relative overflow-hidden backdrop-blur-md",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "text-base font-semibold flex items-center gap-2 text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-5 text-primary" }), "Admin Credentials & Security"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[11px] font-medium text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "size-3" }), " Master Admin"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mb-5 leading-relaxed",
						children: "Change your administrator login username and password. This will update the primary admin credentials for logging into the admin dashboard."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleUpdateAdmin,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-muted-foreground mb-1.5",
								children: "Admin Username"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								placeholder: "e.g. admin or custom username",
								value: adminUsername,
								onChange: (e) => setAdminUsername(e.target.value),
								className: "w-full text-sm bg-surface/80 border border-border/80 rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block text-xs font-semibold text-muted-foreground mb-1.5",
									children: ["New Admin Password ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-normal text-muted-foreground",
										children: "(leave blank to keep current)"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: showAdminPass ? "text" : "password",
										placeholder: "Enter new password (min 6 chars)...",
										value: adminPassword,
										onChange: (e) => setAdminPassword(e.target.value),
										className: "w-full text-sm bg-surface/80 border border-border/80 rounded-xl p-3 pr-10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setShowAdminPass(!showAdminPass),
										className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1",
										children: showAdminPass ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" })
									})]
								})]
							}),
							adminPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-muted-foreground mb-1.5",
								children: "Confirm New Admin Password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: showAdminPass ? "text" : "password",
								placeholder: "Re-enter new password...",
								value: confirmAdminPassword,
								onChange: (e) => setConfirmAdminPassword(e.target.value),
								className: "w-full text-sm bg-surface/80 border border-border/80 rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
							})] }) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: updatingAdmin,
								className: "w-full btn-love rounded-full py-3 text-sm font-semibold flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 mt-2",
								children: updatingAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), " Saving Admin Changes..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-4" }), " Save Admin Credentials"] })
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-surface/30 border border-border/60 rounded-3xl p-6 backdrop-blur-md",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "text-base font-semibold flex items-center gap-2 mb-2 text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-5 text-primary" }), " Create Standard User Account"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mb-5",
						children: "Create standard viewer accounts with restricted permissions for visitors."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleCreate,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-muted-foreground mb-1.5",
								children: "Username"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								placeholder: "e.g. lovebird",
								value: username,
								onChange: (e) => setUsername(e.target.value),
								className: "w-full text-sm bg-surface/80 border border-border/80 rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-muted-foreground mb-1.5",
								children: "Password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								placeholder: "Enter account password...",
								value: password,
								onChange: (e) => setPassword(e.target.value),
								className: "w-full text-sm bg-surface/80 border border-border/80 rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: creating,
								className: "w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border rounded-full py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50",
								children: creating ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), " Creating Account..."] }) : "Create Standard User"
							})
						]
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-t lg:border-t-0 lg:border-l border-border/40 pt-6 lg:pt-0 lg:pl-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between items-center mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "text-lg font-semibold flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-5 text-primary" }), " Registered Accounts"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground mt-0.5",
					children: "Overview of all active administrator and user accounts"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs font-medium text-muted-foreground bg-secondary/80 border border-border px-3 py-1 rounded-full",
					children: [users.length, " accounts"]
				})]
			}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-center py-20 text-muted-foreground text-sm gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-5 animate-spin text-primary" }), " Loading user accounts..."]
			}) : users.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-center py-20 text-muted-foreground text-sm bg-surface/20 border border-dashed border-border rounded-2xl p-6",
				children: "No database user accounts found. Use the forms to create accounts."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4",
				children: users.map((u) => {
					const isAdmin = u.role === "admin";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("border rounded-2xl p-4 flex justify-between items-center relative group transition-all duration-200", isAdmin ? "bg-primary/5 border-primary/30 hover:border-primary/50 shadow-sm" : "bg-surface/30 border-border hover:border-border/80"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex items-center gap-3.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: cn("size-10 rounded-xl flex items-center justify-center shrink-0", isAdmin ? "bg-primary/15 text-primary" : "bg-secondary text-secondary-foreground"),
								children: isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "font-semibold text-sm truncate text-foreground",
										children: u.username
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border", isAdmin ? "bg-primary/15 text-primary border-primary/30" : "bg-secondary text-muted-foreground border-border"),
										children: u.role
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] text-muted-foreground mt-0.5",
									children: ["Created: ", new Date(u.createdAt).toLocaleDateString(void 0, {
										year: "numeric",
										month: "short",
										day: "numeric"
									})]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								if (confirm(`Are you sure you want to delete account "${u.username}"?`)) deleteMutation.mutate(u._id);
							},
							className: "p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors",
							title: "Delete Account",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
						}) })]
					}, u._id);
				})
			})]
		})]
	});
}
var STAGES_CONFIG = [
	{
		stage: 1,
		title: "Stage 1 — Normal",
		description: "Initial character appearance (default / no damage).",
		color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30",
		badge: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
	},
	{
		stage: 2,
		title: "Stage 2 — Small Injury",
		description: "Slight scratch or minor impact reaction.",
		color: "from-amber-500/20 to-yellow-500/10 border-amber-500/30",
		badge: "text-amber-400 bg-amber-500/10 border-amber-500/30"
	},
	{
		stage: 3,
		title: "Stage 3 — Bruise",
		description: "Cheek bruise or visible scratch mark.",
		color: "from-orange-500/20 to-amber-500/10 border-orange-500/30",
		badge: "text-orange-400 bg-orange-500/10 border-orange-500/30"
	},
	{
		stage: 4,
		title: "Stage 4 — Bandage",
		description: "Bandage on forehead/cheek or noticeable wound.",
		color: "from-rose-500/20 to-red-500/10 border-rose-500/30",
		badge: "text-rose-400 bg-rose-500/10 border-rose-500/30"
	},
	{
		stage: 5,
		title: "Stage 5 — Maximum Injury",
		description: "Exaggerated cartoon knockout, dizzy stars, heavy bandages.",
		color: "from-purple-500/20 to-pink-500/10 border-purple-500/30",
		badge: "text-purple-400 bg-purple-500/10 border-purple-500/30"
	}
];
function FunZoneManager({ queryClient }) {
	const [uploadingStage, setUploadingStage] = (0, import_react.useState)(null);
	const [deletingStage, setDeletingStage] = (0, import_react.useState)(null);
	const { data: stages = [], isLoading } = useQuery({
		queryKey: ["fun-stages"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/fun/stages");
				if (!res.ok) return [];
				return await res.json();
			} catch (err) {
				console.error("Error fetching fun zone stages:", err);
				return [];
			}
		}
	});
	const handleStageFileUpload = async (stageNum, e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		if (![
			"image/jpeg",
			"image/png",
			"image/webp",
			"image/gif"
		].includes(file.type)) {
			toast.error("Please upload a valid image (JPEG, PNG, WebP, GIF).");
			return;
		}
		if (file.size > 10485760) {
			toast.error("Image file size must be under 10MB.");
			return;
		}
		setUploadingStage(stageNum);
		const formData = new FormData();
		formData.append("stage", String(stageNum));
		formData.append("file", file);
		try {
			const res = await fetch("/api/fun/stages", {
				method: "POST",
				body: formData
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed to upload stage image");
			toast.success(`Stage ${stageNum} image updated successfully!`);
			queryClient.invalidateQueries({ queryKey: ["fun-stages"] });
		} catch (err) {
			console.error(err);
			toast.error(`Upload error: ${err.message}`);
		} finally {
			setUploadingStage(null);
			e.target.value = "";
		}
	};
	const handleDeleteStage = async (stageNum, title) => {
		if (!confirm(`Are you sure you want to delete the image for "${title}"?\n\nThis will permanently remove it from MongoDB storage.`)) return;
		setDeletingStage(stageNum);
		try {
			const res = await fetch(`/api/fun/stages?stage=${stageNum}`, { method: "DELETE" });
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed to delete stage image");
			toast.success(`Stage ${stageNum} image deleted from storage & database!`);
			queryClient.invalidateQueries({ queryKey: ["fun-stages"] });
		} catch (err) {
			console.error(err);
			toast.error(`Delete error: ${err.message}`);
		} finally {
			setDeletingStage(null);
		}
	};
	const getStageData = (stageNum) => {
		return stages.find((s) => s.stage === stageNum);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
			className: "text-2xl font-bold flex items-center gap-2.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-6 text-primary animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "💥 Fun Zone Images" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground mt-1.5 max-w-2xl",
			children: "Upload the finished character images for each of the 5 damage stages. You can re-upload, replace, or permanently delete images stored in MongoDB GridFS."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass px-4 py-2 rounded-2xl flex items-center gap-2 text-xs font-semibold self-start sm:self-auto",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted-foreground",
				children: "Configured:"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-primary font-bold",
				children: [stages.length, " / 5 Stages"]
			})]
		})]
	}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center py-20 text-muted-foreground gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-8 animate-spin text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm",
			children: "Loading Fun Zone stage configurations..."
		})]
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
		children: STAGES_CONFIG.map((config) => {
			const stageData = getStageData(config.stage);
			const isCurrentUploading = uploadingStage === config.stage;
			const isCurrentDeleting = deletingStage === config.stage;
			const inputId = `fun-stage-upload-${config.stage}`;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("relative flex flex-col justify-between rounded-3xl p-5 border bg-gradient-to-b transition-all duration-300 shadow-lg backdrop-blur-xl", config.color, stageData ? "border-white/20 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]" : "border-dashed border-white/10"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2 mb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs font-black uppercase tracking-wider text-muted-foreground",
								children: ["STAGE ", config.stage]
							}), stageData ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3" }), " Set"]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary/80 text-muted-foreground",
								children: "Not Set"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-bold text-base text-foreground leading-tight",
							children: config.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-1 min-h-[32px] line-clamp-2",
							children: config.description
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "my-4 flex flex-col items-center justify-center",
						children: stageData ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative w-full aspect-[4/5] rounded-2xl overflow-hidden glass border border-white/20 shadow-inner group",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: stageData.url,
									alt: config.title,
									className: "w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => handleDeleteStage(config.stage, config.title),
									disabled: isCurrentDeleting || isCurrentUploading,
									title: "Delete image from DB",
									className: "absolute top-2.5 right-2.5 size-7 rounded-full bg-destructive/85 text-white flex items-center justify-center shadow-lg hover:bg-destructive transition-all opacity-0 group-hover:opacity-100 cursor-pointer hover:scale-110 disabled:opacity-50",
									children: isCurrentDeleting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 pointer-events-none",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] font-medium text-white truncate",
										children: stageData.filename
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[10px] text-white/70",
										children: [(stageData.fileSize / 1024).toFixed(0), " KB"]
									})]
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-full aspect-[4/5] rounded-2xl border-2 border-dashed border-white/15 flex flex-col items-center justify-center text-center p-4 bg-black/20",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "size-10 text-muted-foreground/40 mb-2" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-muted-foreground",
									children: "No image uploaded"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-muted-foreground/60 mt-0.5",
									children: "JPG, PNG, WebP up to 10MB"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "file",
						id: inputId,
						accept: "image/jpeg,image/png,image/webp,image/gif",
						className: "hidden",
						disabled: isCurrentUploading || isCurrentDeleting,
						onChange: (e) => handleStageFileUpload(config.stage, e)
					}), stageData ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: inputId,
							className: cn("flex-1 glass hover:bg-white/15 text-foreground py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all border border-white/15 hover:scale-[1.02] active:scale-[0.98]", (isCurrentUploading || isCurrentDeleting) && "opacity-60 cursor-not-allowed pointer-events-none"),
							children: isCurrentUploading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Replacing..." })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Replace" })] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => handleDeleteStage(config.stage, config.title),
							disabled: isCurrentDeleting || isCurrentUploading,
							title: `Delete ${config.title} from MongoDB storage`,
							className: cn("glass hover:bg-destructive/20 text-destructive border border-destructive/30 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]", (isCurrentDeleting || isCurrentUploading) && "opacity-60 cursor-not-allowed"),
							children: [isCurrentDeleting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "Delete"
							})]
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: inputId,
						className: cn("w-full btn-love py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]", isCurrentUploading && "opacity-60 cursor-not-allowed"),
						children: isCurrentUploading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin text-white" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Uploading..." })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Upload Image" })] })
					})] })
				]
			}, config.stage);
		})
	})] });
}
function LettersManager({ letters, isLoading, queryClient }) {
	const [showModal, setShowModal] = (0, import_react.useState)(false);
	const [editingLetter, setEditingLetter] = (0, import_react.useState)(null);
	const [title, setTitle] = (0, import_react.useState)("");
	const [preview, setPreview] = (0, import_react.useState)("");
	const [body, setBody] = (0, import_react.useState)("");
	const [date, setDate] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("Love");
	const [favorite, setFavorite] = (0, import_react.useState)(false);
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const [deletingId, setDeletingId] = (0, import_react.useState)(null);
	const [readingLetter, setReadingLetter] = (0, import_react.useState)(null);
	const openAddModal = () => {
		setEditingLetter(null);
		setTitle("");
		setPreview("");
		setBody("");
		setDate((/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric"
		}));
		setCategory("Love");
		setFavorite(false);
		setShowModal(true);
	};
	const openEditModal = (letter) => {
		setEditingLetter(letter);
		setTitle(letter.title);
		setPreview(letter.preview);
		setBody(letter.body);
		setDate(letter.date);
		setCategory(letter.category || "Love");
		setFavorite(!!letter.favorite);
		setShowModal(true);
	};
	const handleSaveLetter = async (e) => {
		e.preventDefault();
		if (!title.trim() || !preview.trim() || !body.trim()) {
			toast.error("Please fill in the title, preview teaser, and letter body.");
			return;
		}
		setIsSubmitting(true);
		try {
			if (editingLetter && editingLetter._id) {
				const res = await fetch(`/api/letters/${editingLetter._id}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						title: title.trim(),
						preview: preview.trim(),
						body: body.trim(),
						date: date.trim() || "Forever",
						category: category.trim() || "Love",
						favorite
					})
				});
				const payload = await readJsonResponse(res);
				if (!payload.ok) throw new Error(payload.error || "Failed to update letter");
				toast.success("Letter updated with love 💌");
			} else {
				const res = await fetch("/api/letters", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						title: title.trim(),
						preview: preview.trim(),
						body: body.trim(),
						date: date.trim() || "Forever",
						category: category.trim() || "Love",
						favorite
					})
				});
				const payload = await readJsonResponse(res);
				if (!payload.ok) throw new Error(payload.error || "Failed to save letter");
				toast.success("New love letter created 💖");
			}
			setShowModal(false);
			queryClient.invalidateQueries({ queryKey: ["letters"] });
		} catch (err) {
			console.error(err);
			toast.error(err.message || "Something went wrong saving the letter.");
		} finally {
			setIsSubmitting(false);
		}
	};
	const handleDeleteLetter = async (letter) => {
		if (!letter._id) {
			toast.info("Static sample letters are preserved in site data.");
			return;
		}
		if (!confirm(`Are you sure you want to delete the letter "${letter.title}"?`)) return;
		setDeletingId(letter._id);
		try {
			const res = await fetch(`/api/letters/${letter._id}`, { method: "DELETE" });
			const payload = await readJsonResponse(res);
			if (!payload.ok) throw new Error(payload.error || "Failed to delete letter");
			toast.success("Letter deleted from database.");
			queryClient.invalidateQueries({ queryKey: ["letters"] });
		} catch (err) {
			console.error(err);
			toast.error(err.message || "Failed to delete letter.");
		} finally {
			setDeletingId(null);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-xl font-bold flex items-center gap-2 text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-5 text-primary" }), " Love Letters & Open-When Notes"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground mt-1",
					children: "Write heartfelt words, open-when notes, and sweet messages for your special one."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: openAddModal,
					className: "btn-love px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105 transition-all",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Write New Letter" })]
				})]
			}),
			isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-center py-16 text-muted-foreground gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-5 animate-spin text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm",
					children: "Loading heartfelt letters..."
				})]
			}),
			!isLoading && letters.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center py-16 glass rounded-3xl border border-white/10 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "size-14 rounded-2xl bg-primary/10 text-primary grid place-items-center mx-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-7" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-semibold text-lg",
						children: "No Letters Yet"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground max-w-sm mx-auto",
						children: "Write your very first letter to fill this space with your loving memories."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: openAddModal,
						className: "btn-love px-5 py-2.5 rounded-full text-xs font-semibold inline-flex items-center gap-2 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Write First Letter"]
					})
				]
			}),
			!isLoading && letters.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
				children: letters.map((letter, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass glass-hover rounded-3xl p-6 flex flex-col justify-between border border-border relative group shadow-sm hover:shadow-xl transition-all",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-10 place-items-center rounded-2xl bg-[var(--gradient-love)] text-primary-foreground shadow-md",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [letter.favorite && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "size-7 rounded-full bg-primary/15 text-primary grid place-items-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "size-3.5 fill-current" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-semibold px-2.5 py-1 rounded-full bg-surface/50 border border-border text-muted-foreground",
									children: letter.category || "Love"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-4 text-base font-bold text-foreground leading-snug line-clamp-1",
							children: letter.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-muted-foreground line-clamp-3 leading-relaxed",
							children: letter.preview
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 pt-4 border-t border-border/50 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-muted-foreground font-medium",
							children: letter.date
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setReadingLetter(letter),
									className: "glass hover:bg-primary/20 text-primary size-8 rounded-full grid place-items-center cursor-pointer transition-all hover:scale-105",
									title: "Read Letter",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => openEditModal(letter),
									className: "glass hover:bg-white/20 size-8 rounded-full grid place-items-center text-foreground cursor-pointer transition-all hover:scale-105",
									title: "Edit Letter",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "size-3.5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => handleDeleteLetter(letter),
									disabled: deletingId === letter._id,
									className: "glass hover:bg-destructive/20 text-destructive size-8 rounded-full grid place-items-center cursor-pointer transition-all hover:scale-105 disabled:opacity-50",
									title: "Delete Letter",
									children: deletingId === letter._id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
								})
							]
						})]
					})]
				}, letter._id || `letter-${idx}`))
			}),
			showModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-[70] grid place-items-center bg-background/90 p-4 backdrop-blur-xl animate-fade-in",
				role: "dialog",
				"aria-modal": "true",
				onClick: () => setShowModal(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass animate-letter-open relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl p-6 sm:p-8 border border-border shadow-2xl",
					onClick: (e) => e.stopPropagation(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-border/50 pb-4 mb-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "size-8 rounded-xl bg-[var(--gradient-love)] text-primary-foreground grid place-items-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-lg font-bold text-foreground",
								children: editingLetter ? "Edit Love Letter" : "Write New Love Letter"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setShowModal(false),
							className: "glass size-8 rounded-full grid place-items-center text-muted-foreground hover:text-foreground cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSaveLetter,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-muted-foreground mb-1.5",
								children: "Letter Title *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: title,
								onChange: (e) => setTitle(e.target.value),
								placeholder: "e.g. Open When You Miss Me",
								className: "w-full px-4 py-2.5 text-sm bg-surface/40 border border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30",
								required: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-muted-foreground mb-1.5",
								children: "Preview Teaser *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: preview,
								onChange: (e) => setPreview(e.target.value),
								placeholder: "e.g. Just close your eyes for a second and take a breath...",
								className: "w-full px-4 py-2.5 text-sm bg-surface/40 border border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30",
								required: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-muted-foreground mb-1.5",
								children: "Full Letter Body *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: body,
								onChange: (e) => setBody(e.target.value),
								placeholder: "Write your long, sweet message here. Separate paragraphs with double newlines...",
								rows: 6,
								className: "w-full px-4 py-2.5 text-sm bg-surface/40 border border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 font-sans",
								required: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-semibold text-muted-foreground mb-1.5",
									children: "Date Display"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: date,
									onChange: (e) => setDate(e.target.value),
									placeholder: "e.g. May 12, 2024",
									className: "w-full px-4 py-2.5 text-sm bg-surface/40 border border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-semibold text-muted-foreground mb-1.5",
									children: "Category"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: category,
									onChange: (e) => setCategory(e.target.value),
									placeholder: "e.g. Love, Open When...",
									className: "w-full px-4 py-2.5 text-sm bg-surface/40 border border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									id: "letter-favorite",
									checked: favorite,
									onChange: (e) => setFavorite(e.target.checked),
									className: "size-4 rounded accent-primary cursor-pointer"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									htmlFor: "letter-favorite",
									className: "text-xs font-medium text-foreground cursor-pointer flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "size-3.5 text-primary fill-primary/30" }), " Mark as Highlight / Favorite"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-end gap-2 pt-4 border-t border-border/50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setShowModal(false),
									className: "glass px-4 py-2.5 rounded-2xl text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									disabled: isSubmitting,
									className: "btn-love px-5 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50",
									children: isSubmitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin" }), " Saving..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "size-3.5 fill-current" }), " Save Letter"] })
								})]
							})
						]
					})]
				})
			}),
			readingLetter && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-[70] grid place-items-center bg-background/90 p-4 backdrop-blur-xl animate-fade-in",
				role: "dialog",
				"aria-modal": "true",
				onClick: () => setReadingLetter(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass animate-letter-open relative max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-3xl p-7 sm:p-9 border border-border shadow-2xl",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-[0.25em] text-primary font-bold",
							children: readingLetter.category || "Words from my heart"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-2 text-2xl font-bold text-foreground",
							children: readingLetter.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground",
							children: readingLetter.body.split("\n\n").map((p, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: p }, idx))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: readingLetter.date }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-primary font-semibold",
								children: "Always yours ♡"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setReadingLetter(null),
							className: "glass absolute right-4 top-4 size-9 rounded-full grid place-items-center text-muted-foreground hover:text-foreground cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
						})
					]
				})
			})
		]
	});
}
//#endregion
export { AdminPage as component };
