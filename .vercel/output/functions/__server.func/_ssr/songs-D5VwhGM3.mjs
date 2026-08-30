import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { a as require_react, i as useQueryClient, o as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { C as Link, T as Heart, c as Shuffle, d as Plus, f as Play, g as Pause, h as PenLine, l as Save, o as SkipForward, r as Trash2, s as SkipBack, t as X, u as Repeat } from "../_libs/lucide-react.mjs";
import { t as SectionHeading } from "./SectionHeading-BVG9eVYl.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { n as formatTime, r as useMusic } from "./MusicProvider-CwrFKiWU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/songs-D5VwhGM3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MusicPlayer() {
	const { songs, index, current, playing, progress, duration, shuffle, repeat, favorites, play, toggle, next, prev, seek, toggleShuffle, toggleRepeat, toggleFavorite } = useMusic();
	const queryClient = useQueryClient();
	const [showUploadModal, setShowUploadModal] = (0, import_react.useState)(false);
	const [audioFile, setAudioFile] = (0, import_react.useState)(null);
	const [coverFile, setCoverFile] = (0, import_react.useState)(null);
	const [songTitle, setSongTitle] = (0, import_react.useState)("");
	const [songArtist, setSongArtist] = (0, import_react.useState)("");
	const [songDescription, setSongDescription] = (0, import_react.useState)("");
	const [songDuration, setSongDuration] = (0, import_react.useState)("3:30");
	const [songDate, setSongDate] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
	const [uploadStatus, setUploadStatus] = (0, import_react.useState)("idle");
	const [showUrlModal, setShowUrlModal] = (0, import_react.useState)(false);
	const [inputUrl, setInputUrl] = (0, import_react.useState)("");
	const [urlTitle, setUrlTitle] = (0, import_react.useState)("");
	const [urlArtist, setUrlArtist] = (0, import_react.useState)("");
	const [urlDate, setUrlDate] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
	const [urlStatus, setUrlStatus] = (0, import_react.useState)("idle");
	const [errorMsg, setErrorMsg] = (0, import_react.useState)("");
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [editDateValue, setEditDateValue] = (0, import_react.useState)("");
	const handleAudioChange = (e) => {
		const selected = e.target.files?.[0] || null;
		if (selected) {
			setAudioFile(selected);
			setSongTitle(selected.name.substring(0, selected.name.lastIndexOf(".")) || selected.name);
			setUploadStatus("idle");
			setErrorMsg("");
			setShowUploadModal(true);
		}
	};
	const handleUploadSong = async (e) => {
		e.preventDefault();
		if (!audioFile) return;
		if (!songTitle.trim() || !songArtist.trim()) {
			toast.error("Song Title and Artist are required");
			return;
		}
		setUploadStatus("uploading");
		const formData = new FormData();
		formData.append("file", audioFile);
		if (coverFile) formData.append("coverFile", coverFile);
		formData.append("title", songTitle);
		formData.append("artist", songArtist);
		formData.append("description", songDescription);
		formData.append("duration", songDuration);
		formData.append("type", "song");
		formData.append("memoryDate", songDate);
		try {
			const res = await fetch("/api/media/upload", {
				method: "POST",
				body: formData
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Upload failed");
			setUploadStatus("success");
			toast.success("Song uploaded successfully!");
			setAudioFile(null);
			setCoverFile(null);
			setSongTitle("");
			setSongArtist("");
			setSongDescription("");
			setSongDuration("3:30");
			setSongDate((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
			setShowUploadModal(false);
			const fileInput = document.getElementById("audio-file-input");
			if (fileInput) fileInput.value = "";
			queryClient.invalidateQueries({ queryKey: ["songs"] });
		} catch (err) {
			console.error(err);
			setUploadStatus("failed");
			setErrorMsg(err.message);
			toast.error(`Upload failed: ${err.message}`);
		}
	};
	const handleAddUrlSong = async (e) => {
		e.preventDefault();
		if (!urlTitle.trim() || !urlArtist.trim() || !inputUrl.trim()) {
			toast.error("All fields are required");
			return;
		}
		setUrlStatus("saving");
		try {
			const res = await fetch("/api/media/url", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					title: urlTitle,
					artist: urlArtist,
					url: inputUrl,
					type: "song",
					memoryDate: urlDate
				})
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed to add URL song");
			setUrlStatus("success");
			toast.success("URL song added successfully!");
			setInputUrl("");
			setUrlTitle("");
			setUrlArtist("");
			setUrlDate((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
			setShowUrlModal(false);
			queryClient.invalidateQueries({ queryKey: ["songs"] });
		} catch (err) {
			console.error(err);
			setUrlStatus("failed");
			setErrorMsg(err.message);
			toast.error(`Error: ${err.message}`);
		}
	};
	const handleDeleteSong = async (id, title) => {
		if (confirm(`Are you sure you want to delete "${title}"?`)) try {
			if (!(await fetch(`/api/media/${id}`, { method: "DELETE" })).ok) throw new Error("Delete failed");
			toast.success("Song deleted");
			queryClient.invalidateQueries({ queryKey: ["songs"] });
		} catch (err) {
			toast.error(`Delete failed: ${err.message}`);
		}
	};
	const handleEditDate = (s) => {
		setEditingId(s._id);
		setEditDateValue(s.rawDate);
	};
	const handleSaveDate = async (id) => {
		try {
			if (!(await fetch(`/api/media/edit/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ memoryDate: editDateValue })
			})).ok) throw new Error("Failed to save date");
			toast.success("Song date updated");
			setEditingId(null);
			queryClient.invalidateQueries({ queryKey: ["songs"] });
		} catch (err) {
			toast.error(`Error: ${err.message}`);
		}
	};
	const isAudioUrl = (url) => {
		const cleanUrl = url.toLowerCase().split(/[?#]/)[0];
		return /\.(mp3|wav|ogg|m4a|webm|aac)$/.test(cleanUrl) || cleanUrl.startsWith("http");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-12 grid gap-5 lg:grid-cols-[1fr_1.05fr]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass rounded-3xl p-6 sm:p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center gap-6 sm:flex-row sm:items-start",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: current.cover,
							alt: `${current.title} cover`,
							loading: "lazy",
							className: cn("size-40 shrink-0 rounded-2xl object-cover shadow-[var(--shadow-glow)] transition-transform duration-700", playing && "scale-[1.02]")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1 text-center sm:text-left",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "truncate text-xl font-semibold",
									children: current.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: current.artist
								}),
								current.note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-xs text-primary",
									children: current.note
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => toggleFavorite(current.title),
									"aria-label": "Favorite song",
									className: "mt-4 inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-primary cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {
										className: cn("size-4", favorites[current.title] && "text-primary"),
										fill: favorites[current.title] ? "currentColor" : "none"
									}), "Favorite"]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: 0,
							max: Math.max(1, Math.floor(duration)),
							value: Math.floor(progress),
							onChange: (e) => seek(Number(e.target.value)),
							"aria-label": "Seek",
							className: "h-1.5 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-[oklch(0.66_0.24_350)]",
							style: {
								backgroundImage: "var(--gradient-love)",
								backgroundSize: `${duration ? progress / duration * 100 : 0}% 100%`,
								backgroundRepeat: "no-repeat"
							}
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex justify-between text-xs tabular-nums text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatTime(progress) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatTime(duration) })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex items-center justify-center gap-3 sm:gap-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
								onClick: toggleShuffle,
								active: shuffle,
								label: "Shuffle",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shuffle, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
								onClick: prev,
								label: "Previous song",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipBack, { className: "size-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: toggle,
								"aria-label": playing ? "Pause" : "Play",
								className: cn("btn-love grid size-14 place-items-center rounded-full cursor-pointer", playing && "animate-glow-pulse"),
								children: playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, {
									className: "size-5",
									fill: "currentColor"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
									className: "size-5",
									fill: "currentColor"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
								onClick: next,
								label: "Next song",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipForward, { className: "size-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
								onClick: toggleRepeat,
								active: repeat,
								label: "Repeat",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Repeat, { className: "size-4" })
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass grid content-start gap-1 rounded-3xl p-3 sm:p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between items-center gap-2 mb-3 border-b border-border/20 pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-semibold text-muted-foreground pl-2",
							children: "Playlist"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									const input = document.getElementById("audio-file-input");
									if (input) input.click();
								},
								className: "text-xs font-semibold bg-secondary/80 hover:bg-secondary rounded-full px-3.5 py-1.5 cursor-pointer flex items-center gap-1 border border-border/30",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3 text-primary" }), " Add Song"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setShowUrlModal(true),
								className: "text-xs font-semibold bg-secondary/80 hover:bg-secondary rounded-full px-3.5 py-1.5 cursor-pointer flex items-center gap-1 border border-border/30",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, { className: "size-3 text-primary" }), " Add URL"]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "audio-file-input",
						type: "file",
						accept: "audio/*",
						className: "hidden",
						onChange: handleAudioChange
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid gap-1",
						children: songs.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => play(i),
							className: cn("grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl p-2.5 text-left transition-colors hover:bg-secondary/70", i === index && "bg-secondary"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: s.cover,
									alt: "",
									loading: "lazy",
									className: "size-11 rounded-xl object-cover"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("block truncate text-sm font-medium", i === index && "text-primary"),
										children: s.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block truncate text-xs text-muted-foreground",
										children: s.artist
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-3",
									onClick: (e) => e.stopPropagation(),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {
											className: cn("size-4 cursor-pointer", favorites[s.title] ? "text-primary" : "text-muted-foreground"),
											fill: favorites[s.title] ? "currentColor" : "none",
											onClick: () => toggleFavorite(s.title)
										}),
										editingId === s._id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "date",
													value: editDateValue,
													onChange: (e) => setEditDateValue(e.target.value),
													className: "bg-background text-foreground text-[10px] border border-border rounded px-1 py-0.5 focus:outline-none w-24"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => handleSaveDate(s._id),
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
											className: "flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-muted-foreground font-medium",
												children: s.date || ""
											}), s._id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => handleEditDate(s),
												className: "text-muted-foreground hover:text-primary transition-colors cursor-pointer",
												title: "Edit Date",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "size-3" })
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs tabular-nums text-muted-foreground",
											children: s.duration
										}),
										s._id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => handleDeleteSong(s._id, s.title),
											"aria-label": "Delete song",
											className: "text-muted-foreground hover:text-destructive transition-colors shrink-0 cursor-pointer",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
										})
									]
								})
							]
						}) }, s.title + i))
					})
				]
			}),
			showUploadModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 grid place-items-center bg-background/80 p-4 backdrop-blur-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass rounded-3xl p-6 w-full max-w-md animate-letter-open space-y-4 relative",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setShowUploadModal(false),
							className: "absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-lg font-semibold text-primary",
							children: "🎵 Upload Song File"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "block text-xs font-semibold text-muted-foreground",
							children: ["Selected File: ", audioFile?.name]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleUploadSong,
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-semibold text-muted-foreground mb-1",
									children: "Song Title"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: songTitle,
									onChange: (e) => setSongTitle(e.target.value),
									placeholder: "e.g. Perfect",
									className: "w-full text-sm bg-surface/30 border border-border rounded-xl p-3 text-foreground"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-semibold text-muted-foreground mb-1",
									children: "Artist Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: songArtist,
									onChange: (e) => setSongArtist(e.target.value),
									placeholder: "e.g. Ed Sheeran",
									className: "w-full text-sm bg-surface/30 border border-border rounded-xl p-3 text-foreground"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-semibold text-muted-foreground mb-1",
									children: "Note (optional)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: songDescription,
									onChange: (e) => setSongDescription(e.target.value),
									placeholder: "e.g. Always reminds me of you",
									className: "w-full text-sm bg-surface/30 border border-border rounded-xl p-3 text-foreground"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-semibold text-muted-foreground mb-1",
										children: "Duration (e.g. 4:23)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: songDuration,
										onChange: (e) => setSongDuration(e.target.value),
										className: "w-full text-sm bg-surface/30 border border-border rounded-xl p-3 text-foreground"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-xs font-semibold text-muted-foreground mb-1",
										children: "Memory Date"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "date",
										value: songDate,
										onChange: (e) => setSongDate(e.target.value),
										required: true,
										className: "w-full text-sm bg-surface/30 border border-border rounded-xl p-2.5 text-foreground"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-semibold text-muted-foreground mb-1",
									children: "Album Cover (optional)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									accept: "image/*",
									onChange: (e) => setCoverFile(e.target.files?.[0] || null),
									className: "w-full text-xs text-muted-foreground file:mr-2 file:py-1 file:px-2.5 file:rounded-full file:border-0 file:text-[10px] file:bg-secondary file:text-foreground hover:file:bg-secondary/80 bg-surface/20 border border-border rounded-xl p-1.5"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-end gap-2 pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setShowUploadModal(false),
										className: "rounded-full px-4 py-2 text-xs font-semibold bg-secondary text-foreground hover:bg-secondary/80 cursor-pointer",
										children: "Cancel"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "submit",
										disabled: uploadStatus === "uploading",
										className: "rounded-full px-5 py-2 text-xs font-semibold btn-love disabled:opacity-50 cursor-pointer",
										children: uploadStatus === "uploading" ? "Uploading..." : "Upload Song"
									})]
								})
							]
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
							onClick: () => {
								setShowUrlModal(false);
								setInputUrl("");
								setUrlTitle("");
								setUrlArtist("");
								setUrlStatus("idle");
								setErrorMsg("");
							},
							className: "absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "text-lg font-semibold text-primary flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, { className: "size-5" }), " Add Song URL"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleAddUrlSong,
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-semibold text-muted-foreground mb-1",
									children: "Song URL"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: inputUrl,
									onChange: (e) => setInputUrl(e.target.value),
									placeholder: "https://example.com/song.mp3",
									className: "w-full text-sm bg-surface/30 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none"
								})] }),
								inputUrl.trim() && isAudioUrl(inputUrl) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-xs font-semibold text-muted-foreground text-center",
										children: "Preview:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
										src: inputUrl,
										controls: true,
										className: "w-full mx-auto",
										onError: () => toast.error("Could not load audio preview. Verify the link is correct.")
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-semibold text-muted-foreground mb-1",
									children: "Song Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: urlTitle,
									onChange: (e) => setUrlTitle(e.target.value),
									placeholder: "Song Name",
									className: "w-full text-sm bg-surface/30 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-semibold text-muted-foreground mb-1",
									children: "Artist"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: urlArtist,
									onChange: (e) => setUrlArtist(e.target.value),
									placeholder: "Artist Name",
									className: "w-full text-sm bg-surface/30 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:outline-none"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-semibold text-muted-foreground mb-1",
									children: "Date"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "date",
									value: urlDate,
									onChange: (e) => setUrlDate(e.target.value),
									required: true,
									className: "w-full text-sm bg-surface/30 border border-border rounded-xl p-2.5 text-foreground focus:outline-none"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-end gap-2 pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											setShowUrlModal(false);
											setInputUrl("");
											setUrlTitle("");
											setUrlArtist("");
											setUrlStatus("idle");
											setErrorMsg("");
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
			})
		]
	});
}
function IconButton({ children, onClick, active, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		onClick,
		"aria-label": label,
		className: cn("grid size-10 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer", active && "text-primary"),
		children
	});
}
function SongsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "section-shell py-10 lg:py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
			title: "Songs That Remind Me of You",
			subtitle: "Melodies that speak your name."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MusicPlayer, {})]
	});
}
//#endregion
export { SongsPage as component };
