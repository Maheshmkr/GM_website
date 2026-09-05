import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { a as require_react, i as useQueryClient, o as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { M as Heart, b as Pause, d as Shuffle, f as Save, g as Play, l as SkipForward, m as Repeat, t as X, u as SkipBack, y as PenLine } from "../_libs/lucide-react.mjs";
import { t as SectionHeading } from "./SectionHeading-BVG9eVYl.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { n as formatTime, r as useMusic } from "./MusicProvider-CexXRw5f.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/songs-DnoZ_WkY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MusicPlayer() {
	const { songs, index, current, playing, progress, duration, shuffle, repeat, favorites, play, toggle, next, prev, seek, toggleShuffle, toggleRepeat, toggleFavorite } = useMusic();
	const queryClient = useQueryClient();
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [editDateValue, setEditDateValue] = (0, import_react.useState)("");
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-12 grid gap-5 lg:grid-cols-[1fr_1.05fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass rounded-3xl p-6 sm:p-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center gap-6 sm:flex-row sm:items-start",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "size-40 shrink-0 overflow-hidden rounded-2xl bg-black/20 shadow-[var(--shadow-glow)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: current.cover,
						alt: `${current.title} cover`,
						loading: "lazy",
						className: cn("size-full object-cover object-center transition-transform duration-700", playing && "scale-[1.02]")
					})
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
						current.date && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted-foreground/80 font-medium",
							children: ["📅 ", current.date]
						}),
						current.note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-primary",
							children: current.note
						}),
						current.source && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("text-[10px] px-2.5 py-0.5 rounded-full font-medium border inline-block", current.source === "spotify" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : current.source === "google-drive" ? "bg-blue-500/20 text-blue-400 border-blue-500/30" : "bg-secondary text-foreground/80 border-border/40"),
								children: current.source === "spotify" ? "Spotify" : current.source === "google-drive" ? "Google Drive" : "Computer Upload"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => toggleFavorite(current.title),
							"aria-label": "Favorite song",
							className: "mt-3 inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-primary cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {
								className: cn("size-4", favorites[current.title] && "text-primary"),
								fill: favorites[current.title] ? "currentColor" : "none"
							}), "Favorite"]
						})
					]
				})]
			}), (() => {
				const isSpotify = current.source === "spotify" || current.url && current.url.includes("spotify.com");
				const spotifyMatch = isSpotify ? (current.url || current.audio || "").match(/(?:open\.spotify\.com\/(?:intl-[a-z]{2}\/)?track\/|spotify:track:)([a-zA-Z0-9]{22})/i) : null;
				const spotifyTrackId = spotifyMatch ? spotifyMatch[1] : null;
				if (isSpotify && spotifyTrackId) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 rounded-2xl overflow-hidden border border-emerald-500/30 bg-black/40 shadow-lg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
						src: `https://open.spotify.com/embed/track/${spotifyTrackId}?utm_source=generator&theme=0`,
						width: "100%",
						height: "152",
						frameBorder: "0",
						allow: "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture",
						loading: "lazy",
						title: current.title,
						className: "w-full rounded-2xl"
					})
				});
				const isDrive = current.source === "google-drive" || current.url && current.url.includes("drive.google.com");
				const driveMatch = isDrive ? (current.url || current.audio || "").match(/(?:\/file\/d\/|[?&]id=)([a-zA-Z0-9_-]{20,})/i) : null;
				const driveFileId = driveMatch ? driveMatch[1] : null;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
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
					}),
					isDrive && driveFileId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 p-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-blue-300 mb-2 font-medium",
							children: "Google Drive Audio Stream"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
							src: `https://drive.google.com/file/d/${driveFileId}/preview`,
							width: "100%",
							height: "60",
							className: "rounded-xl border border-border/40",
							title: current.title
						})]
					})
				] });
			})()]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass grid content-start gap-1 rounded-3xl p-3 sm:p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-between items-center gap-2 mb-3 border-b border-border/20 pb-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm font-semibold text-muted-foreground pl-2",
					children: "Playlist"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-1",
				children: songs.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => play(i),
					className: cn("grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl p-2.5 text-left transition-colors hover:bg-secondary/70", i === index && "bg-secondary"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "size-11 shrink-0 overflow-hidden rounded-xl bg-black/20",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: s.cover,
								alt: "",
								loading: "lazy",
								className: "size-full object-cover object-center"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("block truncate text-sm font-medium", i === index && "text-primary"),
								children: s.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "block truncate text-xs text-muted-foreground flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.artist }), s.source && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("text-[9px] px-1.5 py-0.2 rounded font-medium border", s.source === "spotify" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : s.source === "google-drive" ? "bg-blue-500/20 text-blue-400 border-blue-500/30" : "bg-secondary/80 text-muted-foreground border-border/40"),
									children: s.source === "spotify" ? "Spotify" : s.source === "google-drive" ? "Drive" : "Upload"
								})]
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
								})
							]
						})
					]
				}) }, s.title + i))
			})]
		})]
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
