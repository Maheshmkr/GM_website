import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { a as require_react, i as useQueryClient, n as useQuery, o as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { A as ChevronRight, C as Link, M as Camera, S as LoaderCircle, T as Heart, h as PenLine, j as ChevronLeft, l as Save, r as Trash2, t as X } from "../_libs/lucide-react.mjs";
import { t as SectionHeading } from "./SectionHeading-BVG9eVYl.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { i as photoCategories } from "./site-DayVGLaA.mjs";
import { t as Reveal } from "./Reveal-DSJJWaqp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/photos-CTBI8iap.js
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
	const queryClient = useQueryClient();
	const { data: serverPhotos = [], isLoading } = useQuery({
		queryKey: ["photos"],
		queryFn: async () => {
			const res = await fetch("/api/media?type=image");
			if (!res.ok) throw new Error("Failed to fetch photos");
			return res.json();
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
		const formData = new FormData();
		formData.append("file", file);
		formData.append("title", title);
		formData.append("type", "image");
		formData.append("category", category);
		formData.append("favorite", String(favorite));
		formData.append("memoryDate", memoryDate);
		try {
			const res = await fetch("/api/media/upload", {
				method: "POST",
				body: formData
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Upload failed");
			setStatus("success");
			toast.success("Image uploaded successfully!");
			setFile(null);
			setPreviewUrl(null);
			setTitle("");
			setCategory("Favorites");
			setFavorite(false);
			setMemoryDate((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
			setShowUploader(false);
			queryClient.invalidateQueries({ queryKey: ["photos"] });
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
					url: inputUrl,
					type: "image",
					category: urlCategory,
					memoryDate: urlDate
				})
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed to add URL image");
			setUrlStatus("success");
			toast.success("Image URL added successfully!");
			setInputUrl("");
			setUrlTitle("");
			setUrlCategory("Favorites");
			setUrlDate((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
			setShowUrlModal(false);
			queryClient.invalidateQueries({ queryKey: ["photos"] });
		} catch (err) {
			console.error(err);
			setUrlStatus("failed");
			setErrorMsg(err.message);
			toast.error(`Error: ${err.message}`);
		}
	};
	const handleDelete = async (p) => {
		if (confirm("Are you sure you want to delete this memory?")) try {
			if (!(await fetch(`/api/media/${p._id}`, { method: "DELETE" })).ok) throw new Error("Delete failed");
			toast.success("Memory deleted");
			queryClient.invalidateQueries({ queryKey: ["photos"] });
		} catch (err) {
			toast.error(`Delete failed: ${err.message}`);
		}
	};
	const handleEditDate = (p) => {
		setEditingId(p._id);
		setEditDateValue(p.rawDate);
	};
	const handleSaveDate = async (id) => {
		try {
			if (!(await fetch(`/api/media/edit/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ memoryDate: editDateValue })
			})).ok) throw new Error("Failed to save date");
			toast.success("Memory date updated");
			setEditingId(null);
			queryClient.invalidateQueries({ queryKey: ["photos"] });
		} catch (err) {
			toast.error(`Error: ${err.message}`);
		}
	};
	const isImgUrl = (url) => {
		const cleanUrl = url.toLowerCase().split(/[?#]/)[0];
		return /\.(jpeg|jpg|gif|png|webp)$/.test(cleanUrl) || cleanUrl.startsWith("http");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-10 flex flex-wrap justify-center gap-2 items-center",
			children: [photoCategories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setFilter(c),
				className: cn("rounded-full px-4 py-2 text-sm transition-all", filter === c ? "btn-love font-semibold" : "glass text-muted-foreground hover:text-foreground"),
				children: c
			}, c)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2 ml-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => {
						setShowUploader(!showUploader);
						if (showUrlModal) setShowUrlModal(false);
					},
					className: "rounded-full px-5 py-2 text-sm font-semibold btn-love flex items-center gap-2 cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-4" }), showUploader ? "Close Uploader" : "Add Image"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => {
						setShowUrlModal(!showUrlModal);
						if (showUploader) setShowUploader(false);
					},
					className: "rounded-full px-5 py-2 text-sm font-semibold btn-love flex items-center gap-2 cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, { className: "size-4" }), "Add URL"]
				})]
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
						children: "Upload New Memory"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-xs font-semibold text-muted-foreground mb-1",
						children: "Choose Image File"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "file",
						accept: "image/*",
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: previewUrl,
								alt: "Preview",
								className: "max-h-48 rounded-2xl object-cover border border-border mx-auto"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-muted-foreground mb-1",
								children: "Title / Caption"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: title,
								onChange: (e) => setTitle(e.target.value),
								placeholder: "Enter caption...",
								className: "w-full text-sm bg-surface/35 border border-border rounded-xl p-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-semibold text-muted-foreground mb-1",
									children: "Category"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: category,
									onChange: (e) => setCategory(e.target.value),
									className: "w-full text-sm bg-surface/35 border border-border rounded-xl p-2.5 text-foreground focus:outline-none",
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
									id: "gallery-fav",
									checked: favorite,
									onChange: (e) => setFavorite(e.target.checked),
									className: "rounded accent-primary size-4"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									htmlFor: "gallery-fav",
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
									},
									className: "rounded-full px-4 py-2 text-xs font-semibold bg-secondary text-foreground hover:bg-secondary/80 cursor-pointer",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									disabled: status === "uploading",
									className: "rounded-full px-5 py-2 text-xs font-semibold btn-love disabled:opacity-50 cursor-pointer",
									children: status === "uploading" ? "Uploading..." : "Upload Image"
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
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, { className: "size-5" }), " Add Image URL"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleUrlSubmit,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-muted-foreground mb-1",
								children: "Image URL"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: inputUrl,
								onChange: (e) => setInputUrl(e.target.value),
								placeholder: "https://example.com/photo.jpg",
								className: "w-full text-sm bg-surface/30 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none"
							})] }),
							inputUrl.trim() && isImgUrl(inputUrl) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-xs font-semibold text-muted-foreground text-center",
									children: "Preview:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: inputUrl,
									alt: "Pasted preview",
									className: "max-h-36 rounded-xl object-contain mx-auto border border-border bg-black/40",
									onError: () => toast.error("Could not render image preview. Check CORS or URL path.")
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-semibold text-muted-foreground mb-1",
									children: "Category"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: urlCategory,
									onChange: (e) => setUrlCategory(e.target.value),
									className: "w-full text-sm bg-surface/30 border border-border rounded-xl p-3 text-foreground focus:outline-none",
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
			className: "mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4",
			children: list.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				delay: i % 6 * 70,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
					className: "group relative break-inside-avoid overflow-hidden rounded-3xl border border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setOpenIndex(i),
							className: "block w-full text-left",
							"aria-label": `Open ${p.caption}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: p.image,
									alt: p.caption,
									loading: "lazy",
									className: "w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pointer-events-none absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent opacity-80 transition-opacity group-hover:opacity-100" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
									className: "absolute inset-x-0 bottom-0 p-5 pr-14",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-semibold truncate",
										children: p.caption
									}), editingId === p._id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 flex items-center gap-1.5 pointer-events-auto",
										onClick: (e) => e.stopPropagation(),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "date",
												value: editDateValue,
												onChange: (e) => setEditDateValue(e.target.value),
												className: "bg-background/90 text-foreground text-[10px] border border-border rounded px-1 py-0.5 focus:outline-none"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => handleSaveDate(p._id),
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
										className: "flex items-center gap-2 mt-0.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: p.date
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: (e) => {
												e.stopPropagation();
												handleEditDate(p);
											},
											className: "text-muted-foreground hover:text-primary transition-colors cursor-pointer pointer-events-auto opacity-0 group-hover:opacity-100",
											title: "Edit Date",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "size-3" })
										})]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setFavorites((f) => ({
								...f,
								[p.caption]: !f[p.caption]
							})),
							"aria-label": "Favorite photo",
							className: "glass absolute right-4 top-4 grid size-9 place-items-center rounded-full pointer-events-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {
								className: cn("size-4", favorites[p.caption] && "text-primary"),
								fill: favorites[p.caption] ? "currentColor" : "none"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: (e) => {
								e.stopPropagation();
								handleDelete(p);
							},
							"aria-label": "Delete photo",
							className: "glass absolute left-4 top-4 grid size-9 place-items-center rounded-full text-destructive hover:bg-destructive/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer pointer-events-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
						})
					]
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: active.image,
						alt: active.caption,
						className: "max-h-[72vh] w-full rounded-3xl object-contain mx-auto"
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
