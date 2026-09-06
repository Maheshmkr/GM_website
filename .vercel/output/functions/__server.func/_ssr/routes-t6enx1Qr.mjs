import { o as __toESM } from "../_runtime.mjs";
import { i as letters, l as videos, n as girlfriend, o as photos, r as heroSlides, s as songs } from "./site-_zOoiwhn.mjs";
import { a as require_jsx_runtime, n as useQuery, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { i as useMusic } from "./MusicProvider-XuC0OULW.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { C as Music, D as Mail, F as Heart, P as Image, n as Video, v as Play } from "../_libs/lucide-react.mjs";
import { t as SectionHeading } from "./SectionHeading-BVG9eVYl.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Reveal } from "./Reveal-DSJJWaqp.mjs";
import { t as Letters } from "./Letters-f4v2tB4-.mjs";
import { t as VideoGallery } from "./VideoGallery-paSXnUnB.mjs";
import { n as Timeline, t as Surprise } from "./Surprise-DK17wOmU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-t6enx1Qr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Hero() {
	const [slide, setSlide] = (0, import_react.useState)(0);
	const [bursts, setBursts] = (0, import_react.useState)([]);
	const [message, setMessage] = (0, import_react.useState)(false);
	const { play } = useMusic();
	(0, import_react.useEffect)(() => {
		const id = window.setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 6500);
		return () => window.clearInterval(id);
	}, []);
	const loveClick = () => {
		const base = Date.now();
		setBursts(Array.from({ length: 12 }, (_, i) => ({
			id: base + i,
			left: 10 + Math.random() * 80,
			dx: (Math.random() - .5) * 120,
			delay: Math.random() * 320
		})));
		setMessage(true);
		window.setTimeout(() => setBursts([]), 2200);
		window.setTimeout(() => setMessage(false), 5e3);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "section-shell grid items-center gap-10 py-8 lg:grid-cols-2 lg:gap-14 lg:py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-4 text-xs uppercase tracking-[0.3em] text-primary",
					children: "A little piece of us ♡"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl",
					children: [
						"Hey ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "gradient-text",
							children: [girlfriend.nickname, ","]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex flex-wrap items-center gap-3",
							children: [girlfriend.heroMessage, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "size-8 text-primary lg:size-10" })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 max-w-md text-base leading-relaxed text-muted-foreground",
					children: girlfriend.heroSubtitle
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-9 flex flex-wrap items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: loveClick,
						className: "btn-love inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {
							className: "size-4",
							fill: "currentColor"
						}), "I Love You"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => play(0),
						className: "group inline-flex items-center gap-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-11 place-items-center rounded-full border border-border transition-colors group-hover:border-primary group-hover:text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
								className: "size-4",
								fill: "currentColor"
							})
						}), "Play Our Song"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cn("mt-6 text-sm text-primary transition-all duration-500", message ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"),
					"aria-live": "polite",
					children: girlfriend.loveMessage
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"aria-hidden": true,
					className: "pointer-events-none absolute inset-x-0 bottom-0 h-0",
					children: bursts.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {
						className: "absolute bottom-0 size-5 text-primary",
						fill: "currentColor",
						style: {
							left: `${b.left}%`,
							animation: `pop-heart 1.8s ease-out ${b.delay}ms forwards`,
							"--dx": `${b.dx}px`
						}
					}, b.id))
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "group relative aspect-[16/10] overflow-hidden rounded-[2rem] border border-border bg-black/20 shadow-[var(--shadow-glow)]",
			children: [heroSlides.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: s.image,
				alt: s.alt,
				width: 1600,
				height: 1e3,
				loading: i === 0 ? "eager" : "lazy",
				className: cn("absolute inset-0 size-full object-cover object-center transition-all duration-[1200ms] ease-out group-hover:scale-105", i === slide ? "opacity-100" : "opacity-0")
			}, s.image)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-background/20" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-5 flex items-center justify-center gap-2",
			children: heroSlides.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setSlide(i),
				"aria-label": `Show photo ${i + 1}`,
				className: cn("h-2 rounded-full transition-all duration-300", i === slide ? "w-6 bg-primary" : "w-2 bg-muted")
			}, s.image))
		})] })]
	});
}
function MemoryCards() {
	const { songs: playlist, play } = useMusic();
	const song = playlist[0] || songs[0];
	const { data: serverPhotos = [] } = useQuery({
		queryKey: ["photos"],
		queryFn: async () => {
			const res = await fetch("/api/media?type=image");
			if (!res.ok) throw new Error("Failed to fetch photos");
			return res.json();
		}
	});
	const { data: serverVideos = [] } = useQuery({
		queryKey: ["videos"],
		queryFn: async () => {
			const res = await fetch("/api/media?type=video");
			if (!res.ok) throw new Error("Failed to fetch videos");
			return res.json();
		}
	});
	const mappedPhotos = (0, import_react.useMemo)(() => {
		if (serverPhotos.length > 0) return serverPhotos.slice(0, 3).map((p) => ({
			image: `/api/media/file/${p.fileId}`,
			caption: p.title
		}));
		return photos.slice(0, 3);
	}, [serverPhotos]);
	const mappedVideos = (0, import_react.useMemo)(() => {
		if (serverVideos.length > 0) return serverVideos.slice(0, 2).map((v) => ({
			thumbnail: `/api/media/file/${v.fileId}`,
			title: v.title
		}));
		return videos.slice(0, 2);
	}, [serverVideos]);
	const totalPhotosCount = serverPhotos.length > 0 ? serverPhotos.length : 24;
	const totalVideosCount = serverVideos.length > 0 ? serverVideos.length : videos.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "section-shell py-16 lg:py-24",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
			title: "A World Made For You",
			subtitle: "Every little memory deserves its own place."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: 0,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/photos",
						className: "glass glass-hover flex h-full flex-col rounded-3xl p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHead, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "size-5" }),
							title: "Photos",
							children: "Beautiful memories we've created together"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex gap-2",
							children: [mappedPhotos.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative aspect-square size-16 flex-1 overflow-hidden rounded-xl bg-black/20",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: p.image,
									alt: p.caption,
									loading: "lazy",
									className: "size-full object-cover object-center"
								})
							}, p.image + p.caption)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "grid size-16 flex-1 place-items-center rounded-xl bg-secondary text-xs font-semibold",
								children: ["+", totalPhotosCount]
							})]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: 90,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/videos",
						className: "glass glass-hover flex h-full flex-col rounded-3xl p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHead, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "size-5" }),
							title: "Videos",
							children: "Moments that make my heart skip a beat"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex gap-2",
							children: [mappedVideos.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative aspect-video h-16 flex-1 overflow-hidden rounded-xl bg-black/20",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: v.thumbnail,
									alt: v.title,
									loading: "lazy",
									className: "size-full object-cover object-center"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute inset-0 grid place-items-center bg-background/40",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
										className: "size-4",
										fill: "currentColor"
									})
								})]
							}, v.title)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "grid h-16 flex-1 place-items-center rounded-xl bg-secondary text-xs font-semibold",
								children: ["+", totalVideosCount]
							})]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: 180,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/songs",
						className: "glass glass-hover flex h-full flex-col rounded-3xl p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHead, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music, { className: "size-5" }),
							title: "Songs",
							children: "Melodies that remind me of you"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex items-center gap-3 rounded-2xl bg-secondary/60 p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "size-11 shrink-0 overflow-hidden rounded-lg bg-black/20",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: song.cover,
										alt: "",
										loading: "lazy",
										className: "size-full object-cover object-center"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-sm font-semibold",
										children: song.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-xs text-muted-foreground",
										children: song.artist
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: (e) => {
										e.preventDefault();
										play(0);
									},
									"aria-label": `Play ${song.title}`,
									className: "btn-love grid size-9 shrink-0 place-items-center rounded-full",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
										className: "size-3.5",
										fill: "currentColor"
									})
								})
							]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					delay: 270,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/letters",
						className: "glass glass-hover flex h-full flex-col rounded-3xl p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHead, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-5" }),
							title: "Letters",
							children: "Words I wish I could say every day"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex items-start gap-3 rounded-2xl bg-secondary/60 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "min-w-0 flex-1 text-sm leading-relaxed text-muted-foreground",
								children: letters[0].preview
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "size-4 shrink-0 text-primary" })]
						})]
					})
				})
			]
		})]
	});
}
function CardHead({ icon, title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "grid size-11 place-items-center rounded-2xl bg-[var(--gradient-love)] text-primary-foreground shadow-[var(--shadow-glow)]",
			children: icon
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "mt-4 text-lg font-semibold",
			children: title
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm leading-relaxed text-muted-foreground",
			children
		})
	] });
}
function Index() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MemoryCards, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "section-shell py-16 lg:py-24",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					title: "Our Videos",
					subtitle: "Little moments captured in motion."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoGallery, { limit: 4 }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/videos",
						className: "btn-love inline-flex rounded-full px-6 py-3 text-sm font-semibold",
						children: "View All Videos"
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "section-shell py-16 lg:py-24",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					title: "Letters For You",
					subtitle: "Words I wish I could say every day."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Letters, { limit: 4 }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/letters",
						className: "btn-love inline-flex rounded-full px-6 py-3 text-sm font-semibold",
						children: "View All Letters"
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "section-shell py-16 lg:py-24",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				title: "Our Journey Timeline",
				subtitle: "A timeline of our beautiful journey together."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timeline, {})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Surprise, {})
	] });
}
//#endregion
export { Index as component };
