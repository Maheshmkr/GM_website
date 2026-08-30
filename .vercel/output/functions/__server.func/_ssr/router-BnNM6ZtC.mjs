import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { a as require_react, o as require_jsx_runtime, r as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { T as Heart, a as Sparkles, f as Play, g as Pause, o as SkipForward, s as SkipBack, t as X, y as Menu } from "../_libs/lucide-react.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { c as HeadContent, d as Outlet, f as lazyRouteComponent, g as useRouter, h as Link, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as girlfriend } from "./site-DayVGLaA.mjs";
import { n as formatTime, r as useMusic, t as MusicProvider } from "./MusicProvider-DUZxdxlu.mjs";
import { t as require_mongoose } from "../_libs/mongoose+mpath+mquery+ms+sift.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BnNM6ZtC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_mongoose = /* @__PURE__ */ __toESM(require_mongoose());
var styles_default = "/assets/styles-C2Ba1vxi.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
/** Floating hearts + star sparkles background. Purely decorative. */
function Ambience() {
	const hearts = (0, import_react.useMemo)(() => Array.from({ length: 14 }, (_, i) => ({
		id: i,
		left: (i * 7.3 + i * 13 % 9) % 98,
		size: 10 + i * 5 % 22,
		duration: 18 + i * 7 % 16,
		delay: -(i * 3.1) % 20,
		opacity: .08 + i % 5 * .04
	})), []);
	const stars = (0, import_react.useMemo)(() => Array.from({ length: 40 }, (_, i) => ({
		id: i,
		left: i * 17.7 % 100,
		top: i * 29.3 % 100,
		size: i % 3 === 0 ? 2 : 1,
		duration: 2 + i % 5,
		delay: -(i % 7)
	})), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"aria-hidden": true,
		className: "pointer-events-none fixed inset-0 z-0 overflow-hidden",
		children: [stars.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "animate-twinkle absolute rounded-full bg-foreground",
			style: {
				left: `${s.left}%`,
				top: `${s.top}%`,
				width: s.size,
				height: s.size,
				animationDuration: `${s.duration}s`,
				animationDelay: `${s.delay}s`
			}
		}, `s-${s.id}`)), hearts.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {
			className: "animate-float-up absolute bottom-[-10vh] text-primary",
			fill: "currentColor",
			style: {
				left: `${h.left}%`,
				width: h.size,
				height: h.size,
				animationDuration: `${h.duration}s`,
				animationDelay: `${h.delay}s`,
				"--heart-opacity": h.opacity,
				filter: "drop-shadow(0 0 10px currentColor)"
			}
		}, `h-${h.id}`))]
	});
}
var links = [
	{
		to: "/",
		label: "Home"
	},
	{
		to: "/photos",
		label: "Photos"
	},
	{
		to: "/videos",
		label: "Videos"
	},
	{
		to: "/songs",
		label: "Songs"
	},
	{
		to: "/letters",
		label: "Letters"
	},
	{
		to: "/timeline",
		label: "Timeline"
	}
];
function Navbar() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [scrolled, setScrolled] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const onScroll = () => setScrolled(window.scrollY > 12);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: `fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "border-b border-border bg-background/70 backdrop-blur-xl" : "bg-transparent"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
			className: "section-shell grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-4 lg:flex lg:justify-between",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					onClick: () => setOpen(false),
					className: "flex min-w-0 items-center gap-2 text-lg font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate",
						children: "For You"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "size-4 shrink-0 text-primary" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "hidden items-center gap-1 lg:flex",
					children: links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: l.to,
						activeOptions: { exact: l.to === "/" },
						className: "relative rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-primary [&[data-status=active]>span]:scale-x-100",
						children: [l.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-x-3.5 -bottom-0.5 h-0.5 scale-x-0 rounded-full bg-[var(--gradient-love)] transition-transform duration-300" })]
					}) }, l.to))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-end gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "glass hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-medium sm:inline-flex",
							children: ["For You ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								"aria-hidden": true,
								children: "💖"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							"aria-label": "Sparkle",
							className: "glass grid size-10 place-items-center rounded-full text-primary transition-transform hover:rotate-12",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							"aria-label": "Open menu",
							"aria-expanded": open,
							onClick: () => setOpen((o) => !o),
							className: "glass grid size-10 place-items-center rounded-full lg:hidden",
							children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-4" })
						})
					]
				})
			]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "section-shell pb-4 lg:hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "glass animate-letter-open grid gap-1 rounded-2xl p-2",
				children: links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: l.to,
					activeOptions: { exact: l.to === "/" },
					onClick: () => setOpen(false),
					className: "block rounded-xl px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-primary",
					children: l.label
				}) }, l.to))
			})
		})]
	});
}
function Footer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "relative mt-24 overflow-hidden border-t border-border py-14 pb-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "section-shell text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-5 flex items-center justify-center gap-3",
					children: [
						0,
						1,
						2
					].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {
						className: "animate-twinkle size-4 text-primary",
						fill: "currentColor",
						style: {
							animationDuration: `${2.5 + i}s`,
							animationDelay: `${i * .4}s`,
							filter: "drop-shadow(0 0 12px currentColor)"
						}
					}, i))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-base font-medium",
					children: ["Made with all my love, just for you ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-primary",
						children: "♡"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: girlfriend.finalMessage
				})
			]
		})
	});
}
function MiniPlayer() {
	const { current, playing, hasStarted, progress, duration, toggle, next, prev, favorites, toggleFavorite } = useMusic();
	if (!hasStarted) return null;
	const pct = duration ? progress / duration * 100 : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-x-0 bottom-0 z-40 px-3 pb-3 sm:px-5 sm:pb-5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass mx-auto flex max-w-3xl items-center gap-3 rounded-2xl p-2.5 sm:gap-4 sm:p-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: current.cover,
					alt: "",
					loading: "lazy",
					className: "size-11 shrink-0 rounded-xl object-cover sm:size-12"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm font-semibold",
							children: current.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-xs text-muted-foreground",
							children: current.artist
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1.5 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-1 flex-1 overflow-hidden rounded-full bg-secondary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full bg-[var(--gradient-love)] transition-[width] duration-500",
									style: { width: `${pct}%` }
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden text-[11px] tabular-nums text-muted-foreground sm:block",
								children: formatTime(progress)
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 items-center gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => toggleFavorite(current.title),
							"aria-label": "Favorite song",
							className: "hidden size-9 place-items-center rounded-full hover:bg-secondary sm:grid",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {
								className: cn("size-4", favorites[current.title] && "text-primary"),
								fill: favorites[current.title] ? "currentColor" : "none"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: prev,
							"aria-label": "Previous song",
							className: "hidden size-9 place-items-center rounded-full hover:bg-secondary sm:grid",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipBack, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: toggle,
							"aria-label": playing ? "Pause" : "Play",
							className: "btn-love grid size-10 place-items-center rounded-full",
							children: playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, {
								className: "size-4",
								fill: "currentColor"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
								className: "size-4",
								fill: "currentColor"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: next,
							"aria-label": "Next song",
							className: "grid size-9 place-items-center rounded-full hover:bg-secondary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipForward, { className: "size-4" })
						})
					]
				})
			]
		})
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$22 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{
				name: "author",
				content: "For You"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap"
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$22.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MusicProvider, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ambience, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "relative z-10 pt-24",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniPlayer, {})
		] })
	});
}
var $$splitComponentImporter$6 = () => import("./routes--wC3pO02.mjs");
var title$5 = "For You — A Little World Made Just For Us";
var description$5 = "A private collection of our photos, videos, songs, letters and the timeline of our story — made with all my love.";
var Route$21 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: title$5 },
		{
			name: "description",
			content: description$5
		},
		{
			property: "og:title",
			content: title$5
		},
		{
			property: "og:description",
			content: description$5
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./admin-Dzsj-r3W.mjs");
var Route$20 = createFileRoute("/admin")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./letters-NDH4JAyn.mjs");
var title$4 = "Letters For You — Open When...";
var description$4 = "Open-when letters written for your low days, your proud days and the days you miss me. Words from my heart.";
var Route$19 = createFileRoute("/letters")({
	head: () => ({ meta: [
		{ title: title$4 },
		{
			name: "description",
			content: description$4
		},
		{
			property: "og:title",
			content: title$4
		},
		{
			property: "og:description",
			content: description$4
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./photos-DRlVlXB6.mjs");
var title$3 = "Our Beautiful Memories — Photos";
var description$3 = "Every picture holds a special moment with you: our trips, dates, candid smiles and the days I never want to forget.";
var Route$18 = createFileRoute("/photos")({
	head: () => ({ meta: [
		{ title: title$3 },
		{
			name: "description",
			content: description$3
		},
		{
			property: "og:title",
			content: title$3
		},
		{
			property: "og:description",
			content: description$3
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./songs-2KSuGnWm.mjs");
var title$2 = "Songs That Remind Me of You";
var description$2 = "Our playlist — the melodies that speak your name, from the first song we danced to onwards.";
var Route$17 = createFileRoute("/songs")({
	head: () => ({ meta: [
		{ title: title$2 },
		{
			name: "description",
			content: description$2
		},
		{
			property: "og:title",
			content: title$2
		},
		{
			property: "og:description",
			content: description$2
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./timeline-C-CXXoax.mjs");
var title$1 = "Our Journey Timeline";
var description$1 = "From the day we met to the adventures still ahead — a timeline of our beautiful journey together.";
var Route$16 = createFileRoute("/timeline")({
	head: () => ({ meta: [
		{ title: title$1 },
		{
			name: "description",
			content: description$1
		},
		{
			property: "og:title",
			content: title$1
		},
		{
			property: "og:description",
			content: description$1
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./videos-DbelLYCV.mjs");
var title = "Our Videos — Moments In Motion";
var description = "Little moments captured in motion: sunset dates, your laugh, our first trip and the candid clips I keep rewatching.";
var Route$15 = createFileRoute("/videos")({
	head: () => ({ meta: [
		{ title },
		{
			name: "description",
			content: description
		},
		{
			property: "og:title",
			content: title
		},
		{
			property: "og:description",
			content: description
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var MONGODB_URI = process.env.MONGODB_URI;
var MONGODB_DB = process.env.MONGODB_DB || "gm-website";
var cached = global.mongoose;
if (!cached) cached = global.mongoose = {
	conn: null,
	promise: null
};
async function dbConnect() {
	if (!MONGODB_URI) throw new Error("MONGODB_URI is not configured. Add it in Vercel → Project → Settings → Environment Variables.");
	if (cached.conn) return cached.conn;
	if (!cached.promise) {
		const opts = {
			bufferCommands: false,
			dbName: MONGODB_DB
		};
		cached.promise = import_mongoose.default.connect(MONGODB_URI, opts).then((m) => {
			console.log("Connected to MongoDB successfully");
			return m;
		});
	}
	try {
		cached.conn = await cached.promise;
	} catch (e) {
		cached.promise = null;
		throw e;
	}
	return cached.conn;
}
var PhotoSchema = new import_mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	description: { type: String },
	filename: {
		type: String,
		required: true
	},
	mimeType: {
		type: String,
		required: true
	},
	fileSize: {
		type: Number,
		required: true
	},
	fileId: {
		type: import_mongoose.Schema.Types.ObjectId,
		required: true
	},
	category: {
		type: String,
		default: "Favorites"
	},
	favorite: {
		type: Boolean,
		default: false
	}
}, { timestamps: true });
var VideoSchema = new import_mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	description: { type: String },
	filename: {
		type: String,
		required: true
	},
	mimeType: {
		type: String,
		required: true
	},
	fileSize: {
		type: Number,
		required: true
	},
	fileId: {
		type: import_mongoose.Schema.Types.ObjectId,
		required: true
	},
	favorite: {
		type: Boolean,
		default: false
	},
	duration: {
		type: String,
		default: "0:30"
	}
}, { timestamps: true });
var SongSchema = new import_mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	artist: {
		type: String,
		required: true
	},
	description: { type: String },
	filename: {
		type: String,
		required: true
	},
	mimeType: {
		type: String,
		required: true
	},
	fileSize: {
		type: Number,
		required: true
	},
	fileId: {
		type: import_mongoose.Schema.Types.ObjectId,
		required: true
	},
	coverFileId: { type: import_mongoose.Schema.Types.ObjectId },
	duration: {
		type: String,
		default: "3:00"
	}
}, { timestamps: true });
var TimelineSchema = new import_mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	description: { type: String },
	date: {
		type: String,
		required: true
	},
	memoryDate: { type: String },
	location: { type: String },
	imageFileId: { type: import_mongoose.Schema.Types.ObjectId },
	videoFileId: { type: import_mongoose.Schema.Types.ObjectId },
	icon: {
		type: String,
		enum: [
			"heart",
			"coffee",
			"sparkles",
			"plane",
			"star"
		],
		default: "heart"
	},
	highlight: {
		type: Boolean,
		default: false
	}
}, { timestamps: true });
var Photo = import_mongoose.default.models.Photo || import_mongoose.default.model("Photo", PhotoSchema, "photos");
var Video$1 = import_mongoose.default.models.Video || import_mongoose.default.model("Video", VideoSchema, "videos");
var Song = import_mongoose.default.models.Song || import_mongoose.default.model("Song", SongSchema, "songs");
var Timeline = import_mongoose.default.models.Timeline || import_mongoose.default.model("Timeline", TimelineSchema, "timelines");
var MediaItemSchema = new import_mongoose.Schema({
	type: {
		type: String,
		enum: [
			"image",
			"video",
			"song"
		],
		required: true
	},
	source: {
		type: String,
		enum: ["upload", "url"],
		required: true
	},
	title: {
		type: String,
		required: true
	},
	artist: { type: String },
	filename: { type: String },
	mimeType: { type: String },
	fileSize: { type: Number },
	fileId: { type: import_mongoose.Schema.Types.ObjectId },
	url: { type: String },
	category: {
		type: String,
		default: "Favorites"
	},
	favorite: {
		type: Boolean,
		default: false
	},
	memoryDate: { type: String }
}, { timestamps: true });
var MediaItem = import_mongoose.default.models.MediaItem || import_mongoose.default.model("MediaItem", MediaItemSchema, "mediaItems");
var UploadChunkSchema = new import_mongoose.Schema({
	uploadId: {
		type: String,
		required: true
	},
	chunkIndex: {
		type: Number,
		required: true
	},
	filename: {
		type: String,
		required: true
	},
	contentType: {
		type: String,
		required: true
	},
	type: {
		type: String,
		enum: [
			"image",
			"video",
			"song"
		],
		required: true
	},
	data: {
		type: Buffer,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
}, { collection: "uploadChunks" });
import_mongoose.default.models.UploadChunk || import_mongoose.default.model("UploadChunk", UploadChunkSchema, "uploadChunks");
var Route$14 = createFileRoute("/api/media")({ server: { handlers: { GET: async ({ request }) => {
	try {
		await dbConnect();
		const type = new URL(request.url).searchParams.get("type");
		const filter = {};
		if (type) filter.type = type;
		const items = await MediaItem.find(filter).sort({ createdAt: -1 });
		return new Response(JSON.stringify({
			success: true,
			data: items
		}), { headers: { "Content-Type": "application/json" } });
	} catch (error) {
		console.error("Error fetching media:", error);
		return new Response(JSON.stringify({ error: "Internal server error" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
} } } });
var Route$13 = createFileRoute("/api/photos")({ server: { handlers: {
	GET: async () => {
		try {
			await dbConnect();
			const photos = await Photo.find().sort({ createdAt: -1 });
			return new Response(JSON.stringify(photos), { headers: { "Content-Type": "application/json" } });
		} catch (error) {
			console.error("Error fetching photos:", error);
			return new Response(JSON.stringify({ error: "Internal server error" }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
		}
	},
	POST: async ({ request }) => {
		try {
			await dbConnect();
			const formData = await request.formData();
			const file = formData.get("file");
			const title = formData.get("title");
			const description = formData.get("description");
			const category = formData.get("category");
			const favorite = formData.get("favorite") === "true";
			if (!file) return new Response(JSON.stringify({ error: "No file uploaded" }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			if (!title) return new Response(JSON.stringify({ error: "Title is required" }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			if (![
				"image/jpeg",
				"image/png",
				"image/webp",
				"image/gif"
			].includes(file.type)) return new Response(JSON.stringify({ error: `Invalid MIME type: ${file.type}. Allowed: JPEG, PNG, WEBP, GIF.` }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			const ext = file.name.split(".").pop()?.toLowerCase();
			if (!ext || ![
				"jpg",
				"jpeg",
				"png",
				"webp",
				"gif"
			].includes(ext)) return new Response(JSON.stringify({ error: `Invalid file extension. Allowed: jpg, jpeg, png, webp, gif.` }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			if (file.size > 10485760) return new Response(JSON.stringify({ error: `File size exceeds the limit of 10MB (actual: ${(file.size / 1024 / 1024).toFixed(2)}MB)` }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			const arrayBuffer = await file.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);
			const db = import_mongoose.default.connection.db;
			if (!db) return new Response(JSON.stringify({ error: "Database connection failed" }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
			const bucket = new import_mongoose.default.mongo.GridFSBucket(db, { bucketName: "media" });
			const fileId = await new Promise((resolve, reject) => {
				const uploadStream = bucket.openUploadStream(file.name, { contentType: file.type });
				uploadStream.on("finish", () => {
					resolve(uploadStream.id);
				});
				uploadStream.on("error", (err) => {
					reject(err);
				});
				uploadStream.write(buffer);
				uploadStream.end();
			});
			const photo = new Photo({
				title,
				description: description || "",
				filename: file.name,
				mimeType: file.type,
				fileSize: file.size,
				fileId,
				category: category || "Favorites",
				favorite
			});
			await photo.save();
			return new Response(JSON.stringify(photo), {
				status: 201,
				headers: { "Content-Type": "application/json" }
			});
		} catch (error) {
			console.error("Error uploading photo:", error);
			return new Response(JSON.stringify({ error: "Internal server error" }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
		}
	}
} } });
var Route$12 = createFileRoute("/api/songs")({ server: { handlers: {
	GET: async () => {
		try {
			await dbConnect();
			const songs = await Song.find().sort({ createdAt: -1 });
			return new Response(JSON.stringify(songs), { headers: { "Content-Type": "application/json" } });
		} catch (error) {
			console.error("Error fetching songs:", error);
			return new Response(JSON.stringify({ error: "Internal server error" }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
		}
	},
	POST: async ({ request }) => {
		try {
			await dbConnect();
			const formData = await request.formData();
			const file = formData.get("file");
			const coverFile = formData.get("coverFile");
			const title = formData.get("title");
			const artist = formData.get("artist");
			const description = formData.get("description");
			const duration = formData.get("duration");
			if (!file) return new Response(JSON.stringify({ error: "No audio file uploaded" }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			if (!title || !artist) return new Response(JSON.stringify({ error: "Title and Artist are required" }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			if (![
				"audio/mpeg",
				"audio/wav",
				"audio/ogg",
				"audio/webm",
				"audio/mp3",
				"audio/x-m4a"
			].includes(file.type) && !file.name.endsWith(".mp3") && !file.name.endsWith(".m4a")) return new Response(JSON.stringify({ error: `Invalid audio MIME type: ${file.type}. Allowed: MP3, WAV, OGG, WEBM.` }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			if (file.size > 20971520) return new Response(JSON.stringify({ error: `Audio file size exceeds the limit of 20MB` }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			const db = import_mongoose.default.connection.db;
			if (!db) return new Response(JSON.stringify({ error: "Database connection failed" }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
			const bucket = new import_mongoose.default.mongo.GridFSBucket(db, { bucketName: "media" });
			const audioArrayBuffer = await file.arrayBuffer();
			const audioBuffer = Buffer.from(audioArrayBuffer);
			const fileId = await new Promise((resolve, reject) => {
				const uploadStream = bucket.openUploadStream(file.name, { contentType: file.type || "audio/mpeg" });
				uploadStream.on("finish", () => {
					resolve(uploadStream.id);
				});
				uploadStream.on("error", (err) => {
					reject(err);
				});
				uploadStream.write(audioBuffer);
				uploadStream.end();
			});
			let coverFileId;
			if (coverFile && coverFile.size > 0) {
				if ([
					"image/jpeg",
					"image/png",
					"image/webp",
					"image/gif"
				].includes(coverFile.type) || coverFile.name.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
					const coverArrayBuffer = await coverFile.arrayBuffer();
					const coverBuffer = Buffer.from(coverArrayBuffer);
					coverFileId = await new Promise((resolve, reject) => {
						const uploadStream = bucket.openUploadStream(coverFile.name, { contentType: coverFile.type || "image/jpeg" });
						uploadStream.on("finish", () => {
							resolve(uploadStream.id);
						});
						uploadStream.on("error", (err) => {
							reject(err);
						});
						uploadStream.write(coverBuffer);
						uploadStream.end();
					});
				}
			}
			const song = new Song({
				title,
				artist,
				description: description || "",
				filename: file.name,
				mimeType: file.type || "audio/mpeg",
				fileSize: file.size,
				fileId,
				coverFileId,
				duration: duration || "3:00"
			});
			await song.save();
			return new Response(JSON.stringify(song), {
				status: 201,
				headers: { "Content-Type": "application/json" }
			});
		} catch (error) {
			console.error("Error uploading song:", error);
			return new Response(JSON.stringify({ error: "Internal server error" }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
		}
	}
} } });
var Route$11 = createFileRoute("/api/timeline")({ server: { handlers: {
	GET: async () => {
		try {
			await dbConnect();
			const milestones = await Timeline.find().sort({
				memoryDate: 1,
				date: 1,
				createdAt: 1
			});
			return new Response(JSON.stringify(milestones), { headers: { "Content-Type": "application/json" } });
		} catch (error) {
			console.error("Error fetching timeline:", error);
			return new Response(JSON.stringify({ error: "Internal server error" }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
		}
	},
	POST: async ({ request }) => {
		try {
			await dbConnect();
			const formData = await request.formData();
			const title = formData.get("title");
			const description = formData.get("description");
			const date = formData.get("date");
			const memoryDate = formData.get("memoryDate");
			const location = formData.get("location");
			const icon = formData.get("icon");
			const highlight = formData.get("highlight") === "true";
			const imageFile = formData.get("imageFile");
			const videoFile = formData.get("videoFile");
			if (!title || !date) return new Response(JSON.stringify({ error: "Title and Date are required" }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			const db = import_mongoose.default.connection.db;
			if (!db) return new Response(JSON.stringify({ error: "Database connection failed" }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
			const bucket = new import_mongoose.default.mongo.GridFSBucket(db, { bucketName: "media" });
			let imageFileId;
			if (imageFile && imageFile.size > 0) {
				if ([
					"image/jpeg",
					"image/png",
					"image/webp",
					"image/gif"
				].includes(imageFile.type) || imageFile.name.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
					const imageArrayBuffer = await imageFile.arrayBuffer();
					const imageBuffer = Buffer.from(imageArrayBuffer);
					imageFileId = await new Promise((resolve, reject) => {
						const uploadStream = bucket.openUploadStream(imageFile.name, { contentType: imageFile.type || "image/jpeg" });
						uploadStream.on("finish", () => {
							resolve(uploadStream.id);
						});
						uploadStream.on("error", (err) => {
							reject(err);
						});
						uploadStream.write(imageBuffer);
						uploadStream.end();
					});
				}
			}
			let videoFileId;
			if (videoFile && videoFile.size > 0) {
				if ([
					"video/mp4",
					"video/webm",
					"video/quicktime"
				].includes(videoFile.type) || videoFile.name.match(/\.(mp4|webm|mov)$/i)) {
					const videoArrayBuffer = await videoFile.arrayBuffer();
					const videoBuffer = Buffer.from(videoArrayBuffer);
					videoFileId = await new Promise((resolve, reject) => {
						const uploadStream = bucket.openUploadStream(videoFile.name, { contentType: videoFile.type || "video/mp4" });
						uploadStream.on("finish", () => {
							resolve(uploadStream.id);
						});
						uploadStream.on("error", (err) => {
							reject(err);
						});
						uploadStream.write(videoBuffer);
						uploadStream.end();
					});
				}
			}
			const milestone = new Timeline({
				title,
				description: description || "",
				date: date || (memoryDate ? new Date(memoryDate).toLocaleDateString("en-GB", {
					day: "2-digit",
					month: "short",
					year: "numeric"
				}) : ""),
				memoryDate: memoryDate || (date && !isNaN(Date.parse(date)) ? new Date(date).toISOString().split("T")[0] : void 0),
				location: location || "",
				imageFileId,
				videoFileId,
				icon: icon || "heart",
				highlight
			});
			await milestone.save();
			return new Response(JSON.stringify(milestone), {
				status: 201,
				headers: { "Content-Type": "application/json" }
			});
		} catch (error) {
			console.error("Error creating timeline item:", error);
			return new Response(JSON.stringify({ error: "Internal server error" }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
		}
	}
} } });
var Route$10 = createFileRoute("/api/videos")({ server: { handlers: {
	GET: async () => {
		try {
			await dbConnect();
			const videos = await Video$1.find().sort({ createdAt: -1 });
			return new Response(JSON.stringify(videos), { headers: { "Content-Type": "application/json" } });
		} catch (error) {
			console.error("Error fetching videos:", error);
			return new Response(JSON.stringify({ error: "Internal server error" }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
		}
	},
	POST: async ({ request }) => {
		try {
			await dbConnect();
			const formData = await request.formData();
			const file = formData.get("file");
			const title = formData.get("title");
			const description = formData.get("description");
			const favorite = formData.get("favorite") === "true";
			const duration = formData.get("duration");
			if (!file) return new Response(JSON.stringify({ error: "No file uploaded" }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			if (!title) return new Response(JSON.stringify({ error: "Title is required" }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			if (![
				"video/mp4",
				"video/webm",
				"video/quicktime"
			].includes(file.type)) return new Response(JSON.stringify({ error: `Invalid MIME type: ${file.type}. Allowed: MP4, WEBM, QuickTime.` }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			const ext = file.name.split(".").pop()?.toLowerCase();
			if (!ext || ![
				"mp4",
				"webm",
				"mov",
				"qt"
			].includes(ext)) return new Response(JSON.stringify({ error: `Invalid file extension. Allowed: mp4, webm, mov, qt.` }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			if (file.size > 104857600) return new Response(JSON.stringify({ error: `File size exceeds the limit of 100MB (actual: ${(file.size / 1024 / 1024).toFixed(2)}MB)` }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			const arrayBuffer = await file.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);
			const db = import_mongoose.default.connection.db;
			if (!db) return new Response(JSON.stringify({ error: "Database connection failed" }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
			const bucket = new import_mongoose.default.mongo.GridFSBucket(db, { bucketName: "media" });
			const fileId = await new Promise((resolve, reject) => {
				const uploadStream = bucket.openUploadStream(file.name, { contentType: file.type });
				uploadStream.on("finish", () => {
					resolve(uploadStream.id);
				});
				uploadStream.on("error", (err) => {
					reject(err);
				});
				uploadStream.write(buffer);
				uploadStream.end();
			});
			const video = new Video$1({
				title,
				description: description || "",
				filename: file.name,
				mimeType: file.type,
				fileSize: file.size,
				fileId,
				favorite,
				duration: duration || "0:30"
			});
			await video.save();
			return new Response(JSON.stringify(video), {
				status: 201,
				headers: { "Content-Type": "application/json" }
			});
		} catch (error) {
			console.error("Error uploading video:", error);
			return new Response(JSON.stringify({ error: "Internal server error" }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
		}
	}
} } });
var Route$9 = createFileRoute("/api/media/$fileId")({ server: { handlers: { GET: async ({ request, params }) => {
	try {
		await dbConnect();
		const { fileId } = params;
		if (!import_mongoose.default.Types.ObjectId.isValid(fileId)) return new Response(JSON.stringify({ error: "Invalid file ID format" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const db = import_mongoose.default.connection.db;
		if (!db) return new Response(JSON.stringify({ error: "Database connection failed" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
		const objectId = new import_mongoose.default.Types.ObjectId(fileId);
		const file = await db.collection("media.files").findOne({ _id: objectId });
		if (!file) return new Response(JSON.stringify({ error: "Media file not found" }), {
			status: 404,
			headers: { "Content-Type": "application/json" }
		});
		const contentType = file.contentType || "application/octet-stream";
		const fileSize = file.length;
		const bucket = new import_mongoose.default.mongo.GridFSBucket(db, { bucketName: "media" });
		const rangeHeader = request.headers.get("range");
		if (rangeHeader) {
			const parts = rangeHeader.replace(/bytes=/, "").split("-");
			const start = parseInt(parts[0], 10);
			const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
			const chunksize = end - start + 1;
			const downloadStream = bucket.openDownloadStream(objectId, {
				start,
				end: end + 1
			});
			const readable = new ReadableStream({
				start(controller) {
					downloadStream.on("data", (chunk) => {
						controller.enqueue(chunk);
					});
					downloadStream.on("end", () => {
						controller.close();
					});
					downloadStream.on("error", (err) => {
						controller.error(err);
					});
				},
				cancel() {
					downloadStream.destroy();
				}
			});
			return new Response(readable, {
				status: 206,
				headers: {
					"Content-Range": `bytes ${start}-${end}/${fileSize}`,
					"Accept-Ranges": "bytes",
					"Content-Length": chunksize.toString(),
					"Content-Type": contentType
				}
			});
		} else {
			const downloadStream = bucket.openDownloadStream(objectId);
			const readable = new ReadableStream({
				start(controller) {
					downloadStream.on("data", (chunk) => {
						controller.enqueue(chunk);
					});
					downloadStream.on("end", () => {
						controller.close();
					});
					downloadStream.on("error", (err) => {
						controller.error(err);
					});
				},
				cancel() {
					downloadStream.destroy();
				}
			});
			return new Response(readable, {
				status: 200,
				headers: {
					"Content-Length": fileSize.toString(),
					"Content-Type": contentType
				}
			});
		}
	} catch (error) {
		console.error("Error fetching media from GridFS:", error);
		return new Response(JSON.stringify({ error: "Internal server error" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
} } } });
var Route$8 = createFileRoute("/api/media/$id")({ server: { handlers: { DELETE: async ({ params }) => {
	try {
		await dbConnect();
		const { id } = params;
		if (!import_mongoose.default.Types.ObjectId.isValid(id)) return new Response(JSON.stringify({ error: "Invalid document ID format" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const mediaItem = await MediaItem.findById(id);
		if (!mediaItem) return new Response(JSON.stringify({ error: "Media item not found" }), {
			status: 404,
			headers: { "Content-Type": "application/json" }
		});
		if (mediaItem.source === "upload" && mediaItem.fileId) {
			const db = import_mongoose.default.connection.db;
			if (db) {
				const bucket = new import_mongoose.default.mongo.GridFSBucket(db, { bucketName: "media" });
				try {
					await bucket.delete(mediaItem.fileId);
				} catch (err) {
					console.warn("GridFS file delete failed during media item deletion:", err);
				}
			}
		}
		await MediaItem.findByIdAndDelete(id);
		return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
	} catch (error) {
		console.error("Error deleting media item:", error);
		return new Response(JSON.stringify({ error: "Internal server error" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
} } } });
var Route$7 = createFileRoute("/api/media/upload")({ server: { handlers: { POST: async ({ request }) => {
	try {
		await dbConnect();
		const formData = await request.formData();
		const file = formData.get("file");
		const title = formData.get("title");
		const artist = formData.get("artist");
		const type = formData.get("type");
		const category = formData.get("category");
		const favorite = formData.get("favorite") === "true";
		const memoryDate = formData.get("memoryDate");
		if (!file) return new Response(JSON.stringify({ error: "No file uploaded" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		if (!title || !title.trim()) return new Response(JSON.stringify({ error: "Title is required" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		if (!type || ![
			"image",
			"video",
			"song"
		].includes(type)) return new Response(JSON.stringify({ error: "Invalid or missing media type" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const ext = file.name.split(".").pop()?.toLowerCase();
		if (type === "image") {
			if (![
				"image/jpeg",
				"image/png",
				"image/webp",
				"image/gif"
			].includes(file.type) && (!ext || ![
				"jpg",
				"jpeg",
				"png",
				"webp",
				"gif"
			].includes(ext))) return new Response(JSON.stringify({ error: `Invalid image type: ${file.type}. Allowed formats: JPG, JPEG, PNG, WEBP, GIF.` }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			if (file.size > 10485760) return new Response(JSON.stringify({ error: "Image size exceeds the limit of 10MB" }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
		} else if (type === "video") {
			if (![
				"video/mp4",
				"video/webm",
				"video/quicktime"
			].includes(file.type) && (!ext || ![
				"mp4",
				"webm",
				"mov"
			].includes(ext))) return new Response(JSON.stringify({ error: `Invalid video type: ${file.type}. Allowed formats: MP4, WEBM, MOV.` }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			if (file.size > 104857600) return new Response(JSON.stringify({ error: "Video size exceeds the limit of 100MB" }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
		} else if (type === "song") {
			if (![
				"audio/mpeg",
				"audio/wav",
				"audio/ogg",
				"audio/x-m4a",
				"audio/mp3",
				"audio/webm",
				"audio/m4a"
			].includes(file.type) && (!ext || ![
				"mp3",
				"wav",
				"ogg",
				"m4a",
				"webm"
			].includes(ext))) return new Response(JSON.stringify({ error: `Invalid audio type: ${file.type}. Allowed formats: MP3, WAV, OGG, M4A, WEBM.` }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			if (file.size > 20971520) return new Response(JSON.stringify({ error: "Audio file size exceeds the limit of 20MB" }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
		}
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		const db = import_mongoose.default.connection.db;
		if (!db) return new Response(JSON.stringify({ error: "Database connection failed" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
		const bucket = new import_mongoose.default.mongo.GridFSBucket(db, { bucketName: "media" });
		const fileId = await new Promise((resolve, reject) => {
			const uploadStream = bucket.openUploadStream(file.name, { contentType: file.type || (type === "song" ? "audio/mpeg" : type === "video" ? "video/mp4" : "image/jpeg") });
			uploadStream.on("finish", () => {
				resolve(uploadStream.id);
			});
			uploadStream.on("error", (err) => {
				reject(err);
			});
			uploadStream.write(buffer);
			uploadStream.end();
		});
		const mediaItem = new MediaItem({
			type,
			source: "upload",
			title,
			artist: type === "song" ? artist || "Unknown Artist" : void 0,
			filename: file.name,
			mimeType: file.type || (type === "song" ? "audio/mpeg" : type === "video" ? "video/mp4" : "image/jpeg"),
			fileSize: file.size,
			fileId,
			category: category || "Favorites",
			favorite,
			memoryDate: memoryDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
		});
		await mediaItem.save();
		return new Response(JSON.stringify(mediaItem), {
			status: 201,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		console.error("Error uploading media item:", error);
		return new Response(JSON.stringify({ error: "Internal server error" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
} } } });
var Route$6 = createFileRoute("/api/media/url")({ server: { handlers: { POST: async ({ request }) => {
	try {
		await dbConnect();
		const { title, artist, url, type, memoryDate, category } = await request.json();
		if (!type || ![
			"image",
			"video",
			"song"
		].includes(type)) return new Response(JSON.stringify({ error: "Invalid or missing media type" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		if (!title || !title.trim()) return new Response(JSON.stringify({ error: "Title is required" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		if (type === "song" && (!artist || !artist.trim())) return new Response(JSON.stringify({ error: "Artist name is required for songs" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		if (!url || !url.trim()) return new Response(JSON.stringify({ error: "Media URL is required" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		try {
			new URL(url);
		} catch (_) {
			return new Response(JSON.stringify({ error: "Please enter a valid URL." }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
		}
		const lowerUrl = url.toLowerCase();
		if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be") || lowerUrl.includes("spotify.com") || lowerUrl.includes("instagram.com") || lowerUrl.includes("soundcloud.com")) {
			let errorMsg = "This URL cannot be played directly.";
			if (type === "song") errorMsg = "This URL cannot be played directly as an audio file. Please use a direct audio URL.";
			else if (type === "video") errorMsg = "This URL cannot be played directly as a video file. Please use a direct video URL.";
			else if (type === "image") errorMsg = "This URL cannot be rendered directly as an image. Please use a direct image URL.";
			return new Response(JSON.stringify({ error: errorMsg }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
		}
		const mediaItem = new MediaItem({
			type,
			source: "url",
			title,
			artist: type === "song" ? artist : void 0,
			url,
			memoryDate: memoryDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
			category: category || "Favorites"
		});
		await mediaItem.save();
		return new Response(JSON.stringify(mediaItem), {
			status: 201,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		console.error("Error creating URL media item:", error);
		return new Response(JSON.stringify({ error: "Internal server error" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
} } } });
var Route$5 = createFileRoute("/api/photos/$id")({ server: { handlers: { DELETE: async ({ params }) => {
	try {
		await dbConnect();
		const { id } = params;
		if (!import_mongoose.default.Types.ObjectId.isValid(id)) return new Response(JSON.stringify({ error: "Invalid document ID format" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const photo = await Photo.findById(id);
		if (!photo) return new Response(JSON.stringify({ error: "Photo not found" }), {
			status: 404,
			headers: { "Content-Type": "application/json" }
		});
		const db = import_mongoose.default.connection.db;
		if (db && photo.fileId) {
			const bucket = new import_mongoose.default.mongo.GridFSBucket(db, { bucketName: "media" });
			try {
				await bucket.delete(photo.fileId);
			} catch (err) {
				console.warn("GridFS file delete failed (it may have been deleted already):", err);
			}
		}
		await Photo.findByIdAndDelete(id);
		return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
	} catch (error) {
		console.error("Error deleting photo:", error);
		return new Response(JSON.stringify({ error: "Internal server error" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
} } } });
var Route$4 = createFileRoute("/api/songs/$id")({ server: { handlers: { DELETE: async ({ params }) => {
	try {
		await dbConnect();
		const { id } = params;
		if (!import_mongoose.default.Types.ObjectId.isValid(id)) return new Response(JSON.stringify({ error: "Invalid document ID format" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const song = await Song.findById(id);
		if (!song) return new Response(JSON.stringify({ error: "Song not found" }), {
			status: 404,
			headers: { "Content-Type": "application/json" }
		});
		const db = import_mongoose.default.connection.db;
		if (db) {
			const bucket = new import_mongoose.default.mongo.GridFSBucket(db, { bucketName: "media" });
			if (song.fileId) try {
				await bucket.delete(song.fileId);
			} catch (err) {
				console.warn("GridFS audio file delete failed:", err);
			}
			if (song.coverFileId) try {
				await bucket.delete(song.coverFileId);
			} catch (err) {
				console.warn("GridFS cover file delete failed:", err);
			}
		}
		await Song.findByIdAndDelete(id);
		return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
	} catch (error) {
		console.error("Error deleting song:", error);
		return new Response(JSON.stringify({ error: "Internal server error" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
} } } });
var Route$3 = createFileRoute("/api/timeline/$id")({ server: { handlers: {
	PUT: async ({ request, params }) => {
		try {
			await dbConnect();
			const { id } = params;
			if (!import_mongoose.default.Types.ObjectId.isValid(id)) return new Response(JSON.stringify({ error: "Invalid document ID format" }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			const milestone = await Timeline.findById(id);
			if (!milestone) return new Response(JSON.stringify({ error: "Timeline item not found" }), {
				status: 404,
				headers: { "Content-Type": "application/json" }
			});
			const formData = await request.formData();
			const title = formData.get("title");
			const description = formData.get("description");
			const date = formData.get("date");
			const memoryDate = formData.get("memoryDate");
			const location = formData.get("location");
			const icon = formData.get("icon");
			const highlight = formData.get("highlight") === "true";
			const imageFile = formData.get("imageFile");
			const videoFile = formData.get("videoFile");
			const deleteImage = formData.get("deleteImage") === "true";
			const deleteVideo = formData.get("deleteVideo") === "true";
			if (title) milestone.title = title;
			if (description !== null) milestone.description = description;
			if (date) milestone.date = date;
			else if (memoryDate) milestone.date = new Date(memoryDate).toLocaleDateString("en-GB", {
				day: "2-digit",
				month: "short",
				year: "numeric"
			});
			if (memoryDate) milestone.memoryDate = memoryDate;
			if (location !== null) milestone.location = location;
			if (icon) milestone.icon = icon;
			milestone.highlight = highlight;
			const db = import_mongoose.default.connection.db;
			if (!db) return new Response(JSON.stringify({ error: "Database connection failed" }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
			const bucket = new import_mongoose.default.mongo.GridFSBucket(db, { bucketName: "media" });
			if (deleteImage || imageFile && imageFile.size > 0) {
				if (milestone.imageFileId) {
					try {
						await bucket.delete(milestone.imageFileId);
					} catch (err) {
						console.warn("GridFS old image delete failed:", err);
					}
					milestone.imageFileId = void 0;
				}
			}
			if (imageFile && imageFile.size > 0) {
				if ([
					"image/jpeg",
					"image/png",
					"image/webp",
					"image/gif"
				].includes(imageFile.type) || imageFile.name.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
					const imageArrayBuffer = await imageFile.arrayBuffer();
					const imageBuffer = Buffer.from(imageArrayBuffer);
					milestone.imageFileId = await new Promise((resolve, reject) => {
						const uploadStream = bucket.openUploadStream(imageFile.name, { contentType: imageFile.type || "image/jpeg" });
						uploadStream.on("finish", () => {
							resolve(uploadStream.id);
						});
						uploadStream.on("error", (err) => {
							reject(err);
						});
						uploadStream.write(imageBuffer);
						uploadStream.end();
					});
				}
			}
			if (deleteVideo || videoFile && videoFile.size > 0) {
				if (milestone.videoFileId) {
					try {
						await bucket.delete(milestone.videoFileId);
					} catch (err) {
						console.warn("GridFS old video delete failed:", err);
					}
					milestone.videoFileId = void 0;
				}
			}
			if (videoFile && videoFile.size > 0) {
				if ([
					"video/mp4",
					"video/webm",
					"video/quicktime"
				].includes(videoFile.type) || videoFile.name.match(/\.(mp4|webm|mov)$/i)) {
					const videoArrayBuffer = await videoFile.arrayBuffer();
					const videoBuffer = Buffer.from(videoArrayBuffer);
					milestone.videoFileId = await new Promise((resolve, reject) => {
						const uploadStream = bucket.openUploadStream(videoFile.name, { contentType: videoFile.type || "video/mp4" });
						uploadStream.on("finish", () => {
							resolve(uploadStream.id);
						});
						uploadStream.on("error", (err) => {
							reject(err);
						});
						uploadStream.write(videoBuffer);
						uploadStream.end();
					});
				}
			}
			await milestone.save();
			return new Response(JSON.stringify(milestone), { headers: { "Content-Type": "application/json" } });
		} catch (error) {
			console.error("Error updating timeline item:", error);
			return new Response(JSON.stringify({ error: "Internal server error" }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
		}
	},
	DELETE: async ({ params }) => {
		try {
			await dbConnect();
			const { id } = params;
			if (!import_mongoose.default.Types.ObjectId.isValid(id)) return new Response(JSON.stringify({ error: "Invalid document ID format" }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			const milestone = await Timeline.findById(id);
			if (!milestone) return new Response(JSON.stringify({ error: "Timeline item not found" }), {
				status: 404,
				headers: { "Content-Type": "application/json" }
			});
			const db = import_mongoose.default.connection.db;
			if (db) {
				const bucket = new import_mongoose.default.mongo.GridFSBucket(db, { bucketName: "media" });
				if (milestone.imageFileId) try {
					await bucket.delete(milestone.imageFileId);
				} catch (err) {
					console.warn("GridFS image delete failed:", err);
				}
				if (milestone.videoFileId) try {
					await bucket.delete(milestone.videoFileId);
				} catch (err) {
					console.warn("GridFS video delete failed:", err);
				}
			}
			await Timeline.findByIdAndDelete(id);
			return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
		} catch (error) {
			console.error("Error deleting timeline item:", error);
			return new Response(JSON.stringify({ error: "Internal server error" }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
		}
	}
} } });
var Route$2 = createFileRoute("/api/videos/$id")({ server: { handlers: { DELETE: async ({ params }) => {
	try {
		await dbConnect();
		const { id } = params;
		if (!import_mongoose.default.Types.ObjectId.isValid(id)) return new Response(JSON.stringify({ error: "Invalid document ID format" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const video = await Video$1.findById(id);
		if (!video) return new Response(JSON.stringify({ error: "Video not found" }), {
			status: 404,
			headers: { "Content-Type": "application/json" }
		});
		const db = import_mongoose.default.connection.db;
		if (db && video.fileId) {
			const bucket = new import_mongoose.default.mongo.GridFSBucket(db, { bucketName: "media" });
			try {
				await bucket.delete(video.fileId);
			} catch (err) {
				console.warn("GridFS file delete failed (it may have been deleted already):", err);
			}
		}
		await Video$1.findByIdAndDelete(id);
		return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
	} catch (error) {
		console.error("Error deleting video:", error);
		return new Response(JSON.stringify({ error: "Internal server error" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
} } } });
var Route$1 = createFileRoute("/api/media/edit/$id")({ server: { handlers: { PUT: async ({ params, request }) => {
	try {
		await dbConnect();
		const { id } = params;
		const { title, artist, memoryDate, category, favorite } = await request.json();
		if (!import_mongoose.default.Types.ObjectId.isValid(id)) return new Response(JSON.stringify({ error: "Invalid document ID format" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const updateData = {};
		if (title !== void 0) updateData.title = title;
		if (artist !== void 0) updateData.artist = artist;
		if (memoryDate !== void 0) updateData.memoryDate = memoryDate;
		if (category !== void 0) updateData.category = category;
		if (favorite !== void 0) updateData.favorite = favorite;
		const updatedItem = await MediaItem.findByIdAndUpdate(id, { $set: updateData }, { new: true });
		if (!updatedItem) return new Response(JSON.stringify({ error: "Media item not found" }), {
			status: 404,
			headers: { "Content-Type": "application/json" }
		});
		return new Response(JSON.stringify(updatedItem), { headers: { "Content-Type": "application/json" } });
	} catch (error) {
		console.error("Error updating media item:", error);
		return new Response(JSON.stringify({ error: "Internal server error" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
} } } });
var Route = createFileRoute("/api/media/file/$fileId")({ server: { handlers: { GET: async ({ request, params }) => {
	try {
		await dbConnect();
		const { fileId } = params;
		if (!import_mongoose.default.Types.ObjectId.isValid(fileId)) return new Response(JSON.stringify({ error: "Invalid file ID format" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const db = import_mongoose.default.connection.db;
		if (!db) return new Response(JSON.stringify({ error: "Database connection failed" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
		const objectId = new import_mongoose.default.Types.ObjectId(fileId);
		const file = await db.collection("media.files").findOne({ _id: objectId });
		if (!file) return new Response(JSON.stringify({ error: "Media file not found" }), {
			status: 404,
			headers: { "Content-Type": "application/json" }
		});
		const contentType = file.contentType || "application/octet-stream";
		const fileSize = file.length;
		const bucket = new import_mongoose.default.mongo.GridFSBucket(db, { bucketName: "media" });
		const rangeHeader = request.headers.get("range");
		if (rangeHeader) {
			const parts = rangeHeader.replace(/bytes=/, "").split("-");
			const start = parseInt(parts[0], 10);
			const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
			const chunksize = end - start + 1;
			const downloadStream = bucket.openDownloadStream(objectId, {
				start,
				end: end + 1
			});
			const readable = new ReadableStream({
				start(controller) {
					downloadStream.on("data", (chunk) => {
						controller.enqueue(chunk);
					});
					downloadStream.on("end", () => {
						controller.close();
					});
					downloadStream.on("error", (err) => {
						controller.error(err);
					});
				},
				cancel() {
					downloadStream.destroy();
				}
			});
			return new Response(readable, {
				status: 206,
				headers: {
					"Content-Range": `bytes ${start}-${end}/${fileSize}`,
					"Accept-Ranges": "bytes",
					"Content-Length": chunksize.toString(),
					"Content-Type": contentType
				}
			});
		} else {
			const downloadStream = bucket.openDownloadStream(objectId);
			const readable = new ReadableStream({
				start(controller) {
					downloadStream.on("data", (chunk) => {
						controller.enqueue(chunk);
					});
					downloadStream.on("end", () => {
						controller.close();
					});
					downloadStream.on("error", (err) => {
						controller.error(err);
					});
				},
				cancel() {
					downloadStream.destroy();
				}
			});
			return new Response(readable, {
				status: 200,
				headers: {
					"Content-Length": fileSize.toString(),
					"Content-Type": contentType
				}
			});
		}
	} catch (error) {
		console.error("Error fetching media from GridFS:", error);
		return new Response(JSON.stringify({ error: "Internal server error" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
} } } });
var IndexRoute = Route$21.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$22
});
var AdminRoute = Route$20.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$22
});
var LettersRoute = Route$19.update({
	id: "/letters",
	path: "/letters",
	getParentRoute: () => Route$22
});
var PhotosRoute = Route$18.update({
	id: "/photos",
	path: "/photos",
	getParentRoute: () => Route$22
});
var SongsRoute = Route$17.update({
	id: "/songs",
	path: "/songs",
	getParentRoute: () => Route$22
});
var TimelineRoute = Route$16.update({
	id: "/timeline",
	path: "/timeline",
	getParentRoute: () => Route$22
});
var VideosRoute = Route$15.update({
	id: "/videos",
	path: "/videos",
	getParentRoute: () => Route$22
});
var ApiMediaRoute = Route$14.update({
	id: "/api/media",
	path: "/api/media",
	getParentRoute: () => Route$22
});
var ApiPhotosRoute = Route$13.update({
	id: "/api/photos",
	path: "/api/photos",
	getParentRoute: () => Route$22
});
var ApiSongsRoute = Route$12.update({
	id: "/api/songs",
	path: "/api/songs",
	getParentRoute: () => Route$22
});
var ApiTimelineRoute = Route$11.update({
	id: "/api/timeline",
	path: "/api/timeline",
	getParentRoute: () => Route$22
});
var ApiVideosRoute = Route$10.update({
	id: "/api/videos",
	path: "/api/videos",
	getParentRoute: () => Route$22
});
var ApiMediaFileIdRoute = Route$9.update({
	id: "/$fileId",
	path: "/$fileId",
	getParentRoute: () => ApiMediaRoute
});
var ApiMediaIdRoute = Route$8.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => ApiMediaRoute
});
var ApiMediaUploadRoute = Route$7.update({
	id: "/upload",
	path: "/upload",
	getParentRoute: () => ApiMediaRoute
});
var ApiMediaUrlRoute = Route$6.update({
	id: "/url",
	path: "/url",
	getParentRoute: () => ApiMediaRoute
});
var ApiPhotosIdRoute = Route$5.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => ApiPhotosRoute
});
var ApiSongsIdRoute = Route$4.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => ApiSongsRoute
});
var ApiTimelineIdRoute = Route$3.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => ApiTimelineRoute
});
var ApiVideosIdRoute = Route$2.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => ApiVideosRoute
});
var ApiMediaRouteChildren = {
	ApiMediaFileIdRoute,
	ApiMediaIdRoute,
	ApiMediaUploadRoute,
	ApiMediaUrlRoute,
	ApiMediaEditIdRoute: Route$1.update({
		id: "/edit/$id",
		path: "/edit/$id",
		getParentRoute: () => ApiMediaRoute
	}),
	ApiMediaFileFileIdRoute: Route.update({
		id: "/file/$fileId",
		path: "/file/$fileId",
		getParentRoute: () => ApiMediaRoute
	})
};
var ApiMediaRouteWithChildren = ApiMediaRoute._addFileChildren(ApiMediaRouteChildren);
var ApiPhotosRouteChildren = { ApiPhotosIdRoute };
var ApiPhotosRouteWithChildren = ApiPhotosRoute._addFileChildren(ApiPhotosRouteChildren);
var ApiSongsRouteChildren = { ApiSongsIdRoute };
var ApiSongsRouteWithChildren = ApiSongsRoute._addFileChildren(ApiSongsRouteChildren);
var ApiTimelineRouteChildren = { ApiTimelineIdRoute };
var ApiTimelineRouteWithChildren = ApiTimelineRoute._addFileChildren(ApiTimelineRouteChildren);
var ApiVideosRouteChildren = { ApiVideosIdRoute };
var rootRouteChildren = {
	IndexRoute,
	AdminRoute,
	LettersRoute,
	PhotosRoute,
	SongsRoute,
	TimelineRoute,
	VideosRoute,
	ApiMediaRoute: ApiMediaRouteWithChildren,
	ApiPhotosRoute: ApiPhotosRouteWithChildren,
	ApiSongsRoute: ApiSongsRouteWithChildren,
	ApiTimelineRoute: ApiTimelineRouteWithChildren,
	ApiVideosRoute: ApiVideosRoute._addFileChildren(ApiVideosRouteChildren)
};
var routeTree = Route$22._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
