import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { a as require_react, o as require_jsx_runtime, r as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { C as Menu, D as LogIn, E as LogOut, M as Heart, b as Pause, c as Sparkles, g as Play, l as SkipForward, t as X, u as SkipBack } from "../_libs/lucide-react.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { _ as useLoaderData, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, j as redirect, l as useLocation, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-CIHAFgYl.mjs";
import { n as girlfriend } from "./site-_zOoiwhn.mjs";
import { t as require_mongoose } from "../_libs/mongoose+mpath+mquery+ms+sift.mjs";
import { t as dbConnect } from "./ssr.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-C3F4qZFO.mjs";
import { n as formatTime, r as useMusic, t as MusicProvider } from "./MusicProvider-CexXRw5f.mjs";
import crypto from "crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/router-B79-B8g-.js
var import_mongoose = /* @__PURE__ */ __toESM(require_mongoose());
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-CaoPgwAu.css";
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
	},
	{
		to: "/fun",
		label: "Fun Zone 🎮"
	}
];
function Navbar() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [scrolled, setScrolled] = (0, import_react.useState)(false);
	const role = useLoaderData({ strict: false })?.role;
	const router = useRouter();
	const handleLogout = async () => {
		await fetch("/api/auth/logout", { method: "POST" });
		router.invalidate();
		window.location.href = "/login";
	};
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
						role ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "glass hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-medium sm:inline-flex",
							children: role === "admin" ? "Admin 🛠️" : "For You 💖"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleLogout,
							className: "glass rounded-full px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 cursor-pointer flex items-center gap-1.5",
							title: "Logout",
							suppressHydrationWarning: true,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "Logout"
							})]
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/login",
							className: "glass rounded-full px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary/60 transition-colors flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Login" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							"aria-label": "Sparkle",
							className: "glass grid size-10 place-items-center rounded-full text-primary transition-transform hover:rotate-12",
							suppressHydrationWarning: true,
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
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "glass animate-letter-open grid gap-1 rounded-2xl p-2",
				children: [links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: l.to,
					activeOptions: { exact: l.to === "/" },
					onClick: () => setOpen(false),
					className: "block rounded-xl px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-primary",
					children: l.label
				}) }, l.to)), role ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: async () => {
						setOpen(false);
						await handleLogout();
					},
					className: "w-full text-left rounded-xl px-4 py-3 text-sm text-destructive hover:bg-secondary/40 transition-colors flex items-center gap-2 cursor-pointer font-medium",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), "Logout"]
				}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/login",
					onClick: () => setOpen(false),
					className: "block rounded-xl px-4 py-3 text-sm text-foreground transition-colors hover:bg-secondary flex items-center gap-2 font-medium",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "size-4" }), "Login"]
				}) })]
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
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getSession = createServerFn({ method: "GET" }).handler(createSsrRpc("fa53db6d7d99485381d3938c052e3e0d28ade00339fe126c775ad001a03de872"));
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
var Route$29 = createRootRouteWithContext()({
	loader: async ({ location }) => {
		if (location.pathname === "/login" || location.pathname.startsWith("/api/") || location.pathname.includes(".")) return { role: null };
		const { role } = await getSession();
		if (!role) throw redirect({ to: "/login" });
		if (location.pathname === "/admin" && role !== "admin") throw redirect({ to: "/" });
		return { role };
	},
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
	const { queryClient } = Route$29.useRouteContext();
	if (useLocation().pathname === "/login") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ambience, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "relative z-10 min-h-screen flex items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
		})]
	});
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
var $$splitComponentImporter$8 = () => import("./routes-BB-aimTf.mjs");
var title$6 = "For You — A Little World Made Just For Us";
var description$6 = "A private collection of our photos, videos, songs, letters and the timeline of our story — made with all my love.";
var Route$28 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: title$6 },
		{
			name: "description",
			content: description$6
		},
		{
			property: "og:title",
			content: title$6
		},
		{
			property: "og:description",
			content: description$6
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./admin-BR4-nR0-.mjs");
var Route$27 = createFileRoute("/admin")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./fun-f4YPNlf8.mjs");
var title$5 = "Fun Zone ❤️ — Interactive Character Game";
var description$5 = "Playful interactive cartoon reactions! Select an action like Stone, Hand, Punch, Hit, Slap or Love and tap the picture for fun visual effects.";
var Route$26 = createFileRoute("/fun")({
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
var $$splitComponentImporter$5 = () => import("./letters-D-rYiPjL.mjs");
var title$4 = "Letters For You — Open When...";
var description$4 = "Open-when letters written for your low days, your proud days and the days you miss me. Words from my heart.";
var Route$25 = createFileRoute("/letters")({
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
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./login-nqSf7xLp.mjs");
var Route$24 = createFileRoute("/login")({
	loader: async () => {
		const { role } = await getSession();
		if (role === "admin") throw redirect({ to: "/admin" });
		if (role === "user") throw redirect({ to: "/" });
		return {};
	},
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./photos-Xp2frrei.mjs");
var title$3 = "Our Beautiful Memories — Photos";
var description$3 = "Every picture holds a special moment with you: our trips, dates, candid smiles and the days I never want to forget.";
var Route$23 = createFileRoute("/photos")({
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
var $$splitComponentImporter$2 = () => import("./songs-CrU0o9R2.mjs");
var title$2 = "Songs That Remind Me of You";
var description$2 = "Our playlist — the melodies that speak your name, from the first song we danced to onwards.";
var Route$22 = createFileRoute("/songs")({
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
var $$splitComponentImporter$1 = () => import("./timeline-Di7wUNyD.mjs");
var title$1 = "Our Journey Timeline";
var description$1 = "From the day we met to the adventures still ahead — a timeline of our beautiful journey together.";
var Route$21 = createFileRoute("/timeline")({
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
var $$splitComponentImporter = () => import("./videos-CfSrdCHo.mjs");
var title = "Our Videos — Moments In Motion";
var description = "Little moments captured in motion: sunset dates, your laugh, our first trip and the candid clips I keep rewatching.";
var Route$20 = createFileRoute("/videos")({
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
		enum: [
			"upload",
			"url",
			"spotify",
			"google-drive"
		],
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
	memoryDate: { type: String },
	description: { type: String },
	duration: { type: String },
	coverFileId: { type: import_mongoose.Schema.Types.ObjectId }
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
var UploadChunk = import_mongoose.default.models.UploadChunk || import_mongoose.default.model("UploadChunk", UploadChunkSchema, "uploadChunks");
var UserSchema = new import_mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		trim: true
	},
	password: {
		type: String,
		required: true
	},
	role: {
		type: String,
		enum: ["admin", "user"],
		default: "user"
	}
}, { timestamps: true });
var User$1 = import_mongoose.default.models.User || import_mongoose.default.model("User", UserSchema, "users");
var FunZoneStageSchema = new import_mongoose.Schema({
	stage: {
		type: Number,
		required: true,
		unique: true,
		min: 1,
		max: 5
	},
	title: {
		type: String,
		required: true
	},
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
	}
}, { timestamps: true });
var FunZoneStage = import_mongoose.default.models.FunZoneStage || import_mongoose.default.model("FunZoneStage", FunZoneStageSchema, "funZoneStages");
var Route$19 = createFileRoute("/api/media")({ server: { handlers: { GET: async ({ request }) => {
	try {
		await dbConnect();
		const type = new URL(request.url).searchParams.get("type");
		const filter = {};
		if (type) filter.type = type;
		const items = await MediaItem.find(filter).sort({ createdAt: -1 });
		return new Response(JSON.stringify(items), { headers: { "Content-Type": "application/json" } });
	} catch (error) {
		console.error("Error fetching media:", error);
		return new Response(JSON.stringify({ error: "Internal server error" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
} } } });
var Route$18 = createFileRoute("/api/photos")({ server: { handlers: {
	GET: async () => {
		try {
			await dbConnect();
			const photos = await MediaItem.find({ type: "image" }).sort({ createdAt: -1 });
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
			const photo = new MediaItem({
				type: "image",
				source: "upload",
				title,
				description: description || "",
				filename: file.name,
				mimeType: file.type,
				fileSize: file.size,
				fileId,
				category: category || "Favorites",
				favorite,
				memoryDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
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
var Route$17 = createFileRoute("/api/songs")({ server: { handlers: {
	GET: async () => {
		try {
			await dbConnect();
			const songs = await MediaItem.find({ type: "song" }).sort({ createdAt: -1 });
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
			const memoryDate = formData.get("memoryDate");
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
			const song = new MediaItem({
				type: "song",
				source: "upload",
				title,
				artist,
				description: description || "",
				filename: file.name,
				mimeType: file.type || "audio/mpeg",
				fileSize: file.size,
				fileId,
				coverFileId,
				duration: duration || "3:00",
				memoryDate: memoryDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
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
var Route$16 = createFileRoute("/api/timeline")({ server: { handlers: {
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
var Route$15 = createFileRoute("/api/users")({ server: { handlers: {
	GET: async ({ request }) => {
		try {
			if ((request.headers.get("cookie") || "").split(";").reduce((acc, cookie) => {
				const [name, value] = cookie.trim().split("=");
				if (name && value) acc[name] = value;
				return acc;
			}, {})["auth_role"] !== "admin") return new Response(JSON.stringify({ error: "Unauthorized" }), {
				status: 403,
				headers: { "Content-Type": "application/json" }
			});
			await dbConnect();
			const users = await User$1.find({}, { password: 0 }).sort({ createdAt: -1 });
			return new Response(JSON.stringify(users), { headers: { "Content-Type": "application/json" } });
		} catch (error) {
			console.error("Error listing users:", error);
			return new Response(JSON.stringify({ error: "Internal server error" }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
		}
	},
	POST: async ({ request }) => {
		try {
			if ((request.headers.get("cookie") || "").split(";").reduce((acc, cookie) => {
				const [name, value] = cookie.trim().split("=");
				if (name && value) acc[name] = value;
				return acc;
			}, {})["auth_role"] !== "admin") return new Response(JSON.stringify({ error: "Unauthorized" }), {
				status: 403,
				headers: { "Content-Type": "application/json" }
			});
			const { username, password } = await request.json();
			if (!username || typeof username !== "string" || !username.trim()) return new Response(JSON.stringify({ error: "Username is required" }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			if (!password || typeof password !== "string" || !password.trim()) return new Response(JSON.stringify({ error: "Password is required" }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			const cleanUsername = username.trim();
			await dbConnect();
			if (cleanUsername.toLowerCase() === "admin") return new Response(JSON.stringify({ error: "Username 'admin' is reserved" }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			if (await User$1.findOne({ username: cleanUsername })) return new Response(JSON.stringify({ error: "Username already exists" }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
			const newUser = await User$1.create({
				username: cleanUsername,
				password: hashedPassword,
				role: "user"
			});
			const responseUser = {
				_id: newUser._id,
				username: newUser.username,
				role: newUser.role,
				createdAt: newUser.createdAt
			};
			return new Response(JSON.stringify({
				success: true,
				user: responseUser
			}), { headers: { "Content-Type": "application/json" } });
		} catch (error) {
			console.error("Error creating user:", error);
			return new Response(JSON.stringify({ error: "Internal server error" }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
		}
	}
} } });
var Route$14 = createFileRoute("/api/videos")({ server: { handlers: {
	GET: async () => {
		try {
			await dbConnect();
			const videos = await MediaItem.find({ type: "video" }).sort({ createdAt: -1 });
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
			const video = new MediaItem({
				type: "video",
				source: "upload",
				title,
				description: description || "",
				filename: file.name,
				mimeType: file.type,
				fileSize: file.size,
				fileId,
				favorite,
				duration: duration || "0:30",
				memoryDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
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
var Route$13 = createFileRoute("/api/auth/login")({ server: { handlers: { POST: async ({ request }) => {
	try {
		const { username, password } = await request.json();
		if (typeof password !== "string") return new Response(JSON.stringify({ error: "Invalid password format" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const userPass = process.env["USER_PASSWORD"] || "beautiful";
		const adminPass = process.env["ADMIN_PASSWORD"] || "admin123";
		let role = null;
		const cleanUsername = typeof username === "string" ? username.trim() : "";
		if (cleanUsername.toLowerCase() === "admin" && password === adminPass) role = "admin";
		else if (cleanUsername) {
			await dbConnect();
			const user = await User$1.findOne({ username: cleanUsername });
			if (user) {
				const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
				if (user.password === hashedPassword) role = user.role;
			}
			if (!role) {
				if (password === adminPass) role = "admin";
				else if (password === userPass) role = "user";
			}
		} else if (password === adminPass) role = "admin";
		else if (password === userPass) role = "user";
		if (role) return new Response(JSON.stringify({
			success: true,
			role
		}), { headers: {
			"Content-Type": "application/json",
			"Set-Cookie": `auth_role=${role}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000; Secure`
		} });
		return new Response(JSON.stringify({
			success: false,
			error: "Incorrect username or password"
		}), {
			status: 401,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		console.error("Error logging in:", error);
		return new Response(JSON.stringify({ error: "Internal server error" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
} } } });
var Route$12 = createFileRoute("/api/auth/logout")({ server: { handlers: { POST: async () => {
	try {
		return new Response(JSON.stringify({ success: true }), { headers: {
			"Content-Type": "application/json",
			"Set-Cookie": "auth_role=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0"
		} });
	} catch (error) {
		console.error("Error logging out:", error);
		return new Response(JSON.stringify({ error: error.message || String(error) }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
} } } });
var Route$11 = createFileRoute("/api/auth/session")({ server: { handlers: { GET: async ({ request }) => {
	try {
		const role = (request.headers.get("cookie") || "").split(";").reduce((acc, cookie) => {
			const [name, value] = cookie.trim().split("=");
			if (name && value) acc[name] = value;
			return acc;
		}, {})["auth_role"] || null;
		return new Response(JSON.stringify({ role }), { headers: { "Content-Type": "application/json" } });
	} catch (error) {
		console.error("Error getting auth session:", error);
		return new Response(JSON.stringify({
			role: null,
			error: error.message
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
} } } });
var STAGE_TITLES = {
	1: "Stage 1 — Normal",
	2: "Stage 2 — Small Injury",
	3: "Stage 3 — Bruise",
	4: "Stage 4 — Bandage",
	5: "Stage 5 — Maximum Injury"
};
var Route$10 = createFileRoute("/api/fun/stages")({ server: { handlers: {
	GET: async () => {
		try {
			await dbConnect();
			const stageData = (await FunZoneStage.find({}).sort({ stage: 1 })).map((s) => ({
				_id: s._id,
				stage: s.stage,
				title: s.title || STAGE_TITLES[s.stage] || `Stage ${s.stage}`,
				filename: s.filename,
				mimeType: s.mimeType,
				fileSize: s.fileSize,
				fileId: s.fileId,
				url: `/api/media/file/${s.fileId}`,
				updatedAt: s.updatedAt
			}));
			return new Response(JSON.stringify(stageData), { headers: { "Content-Type": "application/json" } });
		} catch (error) {
			console.error("Error fetching fun zone stages:", error);
			return new Response(JSON.stringify({ error: "Internal server error" }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
		}
	},
	POST: async ({ request }) => {
		try {
			if ((request.headers.get("cookie") || "").split(";").reduce((acc, cookie) => {
				const [name, value] = cookie.trim().split("=");
				if (name && value) acc[name] = value;
				return acc;
			}, {})["auth_role"] !== "admin") return new Response(JSON.stringify({ error: "Unauthorized" }), {
				status: 403,
				headers: { "Content-Type": "application/json" }
			});
			await dbConnect();
			const formData = await request.formData();
			const file = formData.get("file");
			const stageStr = formData.get("stage");
			if (!stageStr) return new Response(JSON.stringify({ error: "Stage number is required" }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			const stageNum = parseInt(stageStr, 10);
			if (isNaN(stageNum) || stageNum < 1 || stageNum > 5) return new Response(JSON.stringify({ error: "Stage must be a number between 1 and 5" }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			if (!file) return new Response(JSON.stringify({ error: "No image file provided" }), {
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
			const db = import_mongoose.default.connection.db;
			if (!db) return new Response(JSON.stringify({ error: "Database connection failed" }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
			const bucket = new import_mongoose.default.mongo.GridFSBucket(db, { bucketName: "media" });
			const existingStage = await FunZoneStage.findOne({ stage: stageNum });
			if (existingStage && existingStage.fileId) try {
				await bucket.delete(new import_mongoose.default.Types.ObjectId(existingStage.fileId));
			} catch (cleanupErr) {
				console.warn("Could not delete old stage file from GridFS:", cleanupErr);
			}
			const arrayBuffer = await file.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);
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
			const title = STAGE_TITLES[stageNum] || `Stage ${stageNum}`;
			const updatedStage = await FunZoneStage.findOneAndUpdate({ stage: stageNum }, {
				stage: stageNum,
				title,
				filename: file.name,
				mimeType: file.type,
				fileSize: file.size,
				fileId
			}, {
				upsert: true,
				new: true,
				setDefaultsOnInsert: true
			});
			return new Response(JSON.stringify({
				success: true,
				stage: {
					_id: updatedStage._id,
					stage: updatedStage.stage,
					title: updatedStage.title,
					filename: updatedStage.filename,
					mimeType: updatedStage.mimeType,
					fileSize: updatedStage.fileSize,
					fileId: updatedStage.fileId,
					url: `/api/media/file/${updatedStage.fileId}`,
					updatedAt: updatedStage.updatedAt
				}
			}), {
				status: 200,
				headers: { "Content-Type": "application/json" }
			});
		} catch (error) {
			console.error("Error uploading fun zone stage image:", error);
			return new Response(JSON.stringify({ error: "Internal server error" }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
		}
	},
	DELETE: async ({ request }) => {
		try {
			if ((request.headers.get("cookie") || "").split(";").reduce((acc, cookie) => {
				const [name, value] = cookie.trim().split("=");
				if (name && value) acc[name] = value;
				return acc;
			}, {})["auth_role"] !== "admin") return new Response(JSON.stringify({ error: "Unauthorized" }), {
				status: 403,
				headers: { "Content-Type": "application/json" }
			});
			await dbConnect();
			const stageStr = new URL(request.url).searchParams.get("stage");
			if (!stageStr) return new Response(JSON.stringify({ error: "Stage parameter is required" }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			const stageNum = parseInt(stageStr, 10);
			if (isNaN(stageNum) || stageNum < 1 || stageNum > 5) return new Response(JSON.stringify({ error: "Invalid stage number (must be 1-5)" }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			const db = import_mongoose.default.connection.db;
			if (!db) return new Response(JSON.stringify({ error: "Database connection failed" }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
			const existingStage = await FunZoneStage.findOne({ stage: stageNum });
			if (!existingStage) return new Response(JSON.stringify({ error: `Stage ${stageNum} image not found in database` }), {
				status: 404,
				headers: { "Content-Type": "application/json" }
			});
			if (existingStage.fileId) try {
				await new import_mongoose.default.mongo.GridFSBucket(db, { bucketName: "media" }).delete(new import_mongoose.default.Types.ObjectId(existingStage.fileId));
			} catch (cleanupErr) {
				console.warn("Could not delete stage file from GridFS:", cleanupErr);
			}
			await FunZoneStage.deleteOne({ stage: stageNum });
			return new Response(JSON.stringify({
				success: true,
				message: `Stage ${stageNum} image deleted successfully from database and storage`,
				stage: stageNum
			}), {
				status: 200,
				headers: { "Content-Type": "application/json" }
			});
		} catch (error) {
			console.error("Error deleting fun zone stage image:", error);
			return new Response(JSON.stringify({ error: "Internal server error" }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
		}
	}
} } });
var Route$9 = createFileRoute("/api/media/$id")({ server: { handlers: {
	GET: async ({ request, params }) => {
		try {
			await dbConnect();
			const { id } = params;
			if (!import_mongoose.default.Types.ObjectId.isValid(id)) return new Response(JSON.stringify({ error: "Invalid file ID format" }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			const db = import_mongoose.default.connection.db;
			if (!db) return new Response(JSON.stringify({ error: "Database connection failed" }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
			const objectId = new import_mongoose.default.Types.ObjectId(id);
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
	},
	DELETE: async ({ params }) => {
		try {
			await dbConnect();
			const { id } = params;
			console.log(`[DELETE /api/media/${id}] Deletion requested.`);
			if (!import_mongoose.default.Types.ObjectId.isValid(id)) {
				console.warn(`[DELETE /api/media/${id}] Invalid ID format.`);
				return new Response(JSON.stringify({ error: "Invalid document ID format" }), {
					status: 400,
					headers: { "Content-Type": "application/json" }
				});
			}
			const mediaItem = await MediaItem.findById(id);
			if (!mediaItem) {
				console.warn(`[DELETE /api/media/${id}] Media item not found in DB.`);
				return new Response(JSON.stringify({ error: "Media item not found" }), {
					status: 404,
					headers: { "Content-Type": "application/json" }
				});
			}
			if (mediaItem.source === "upload") {
				const db = import_mongoose.default.connection.db;
				if (db) {
					const bucket = new import_mongoose.default.mongo.GridFSBucket(db, { bucketName: "media" });
					if (mediaItem.fileId) try {
						await bucket.delete(mediaItem.fileId);
					} catch (err) {
						console.warn("GridFS file delete failed during media item deletion:", err);
					}
					if (mediaItem.coverFileId) try {
						await bucket.delete(mediaItem.coverFileId);
					} catch (err) {
						console.warn("GridFS cover art file delete failed during media item deletion:", err);
					}
				}
			}
			await MediaItem.findByIdAndDelete(id);
			console.log(`[DELETE /api/media/${id}] Document and attachments deleted successfully.`);
			return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
		} catch (error) {
			console.error("Error deleting media item:", error);
			return new Response(JSON.stringify({ error: "Internal server error" }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
		}
	}
} } });
var Route$8 = createFileRoute("/api/media/upload")({ server: { handlers: { POST: async ({ request }) => {
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
		const uploadId = formData.get("uploadId");
		const chunkIndex = parseInt(formData.get("chunkIndex"), 10);
		const totalChunks = parseInt(formData.get("totalChunks"), 10);
		const isLastChunk = formData.get("isLastChunk") === "true";
		const filename = formData.get("filename") || file.name;
		const mimeType = formData.get("mimeType") || file.type;
		if (!uploadId || isNaN(chunkIndex) || isNaN(totalChunks)) return new Response(JSON.stringify({ error: "Missing chunk upload parameters" }), {
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
		await new UploadChunk({
			uploadId,
			chunkIndex,
			filename,
			contentType: mimeType || "application/octet-stream",
			type,
			data: buffer
		}).save();
		if (!isLastChunk) return new Response(JSON.stringify({
			success: true,
			message: `Chunk ${chunkIndex + 1}/${totalChunks} uploaded successfully`
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
		const chunks = await UploadChunk.find({ uploadId }).sort({ chunkIndex: 1 });
		if (chunks.length < totalChunks) return new Response(JSON.stringify({ error: `Chunk assembly failed. Only ${chunks.length}/${totalChunks} chunks received.` }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const finalBuffer = Buffer.concat(chunks.map((c) => c.data));
		const bucket = new import_mongoose.default.mongo.GridFSBucket(db, { bucketName: "media" });
		const fileId = await new Promise((resolve, reject) => {
			const uploadStream = bucket.openUploadStream(filename, { contentType: mimeType || (type === "song" ? "audio/mpeg" : type === "video" ? "video/mp4" : "image/jpeg") });
			uploadStream.on("finish", () => {
				resolve(uploadStream.id);
			});
			uploadStream.on("error", (err) => {
				reject(err);
			});
			uploadStream.write(finalBuffer);
			uploadStream.end();
		});
		const mediaItem = new MediaItem({
			type,
			source: "upload",
			title,
			artist: type === "song" ? artist || "Unknown Artist" : void 0,
			filename,
			mimeType: mimeType || (type === "song" ? "audio/mpeg" : type === "video" ? "video/mp4" : "image/jpeg"),
			fileSize: finalBuffer.length,
			fileId,
			category: category || "Favorites",
			favorite,
			memoryDate: memoryDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
		});
		await mediaItem.save();
		await UploadChunk.deleteMany({ uploadId });
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
function extractSpotifyTrackId(url) {
	const match = url.match(/(?:open\.spotify\.com\/(?:intl-[a-z]{2}\/)?track\/|spotify:track:)([a-zA-Z0-9]{22})/i);
	return match ? match[1] : null;
}
function extractGoogleDriveFileId(url) {
	const match = url.match(/(?:\/file\/d\/|[?&]id=)([a-zA-Z0-9_-]{20,})/i);
	return match ? match[1] : null;
}
var Route$7 = createFileRoute("/api/media/url")({ server: { handlers: { POST: async ({ request }) => {
	try {
		await dbConnect();
		const { title, artist, url, type, memoryDate, category, sourceType } = await request.json();
		if (!type || ![
			"image",
			"video",
			"song"
		].includes(type)) return new Response(JSON.stringify({ error: "Invalid or missing media type" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		if (!url || !url.trim()) return new Response(JSON.stringify({ error: "Media URL is required" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const trimmedUrl = url.trim();
		const lowerUrl = trimmedUrl.toLowerCase();
		let determinedSource = "url";
		let canonicalUrl = trimmedUrl;
		if (type === "song") {
			const isSpotify = sourceType === "spotify" || lowerUrl.includes("spotify.com") || lowerUrl.startsWith("spotify:track:");
			const isGoogleDrive = sourceType === "google-drive" || lowerUrl.includes("drive.google.com") || lowerUrl.includes("docs.google.com");
			if (isSpotify) {
				const trackId = extractSpotifyTrackId(trimmedUrl);
				if (!trackId) return new Response(JSON.stringify({ error: "Invalid Spotify song URL" }), {
					status: 400,
					headers: { "Content-Type": "application/json" }
				});
				determinedSource = "spotify";
				canonicalUrl = `https://open.spotify.com/track/${trackId}`;
				if (await MediaItem.findOne({
					type: "song",
					$or: [{ url: canonicalUrl }, { url: { $regex: trackId } }]
				})) return new Response(JSON.stringify({ error: "This song has already been added." }), {
					status: 400,
					headers: { "Content-Type": "application/json" }
				});
			} else if (isGoogleDrive) {
				const fileId = extractGoogleDriveFileId(trimmedUrl);
				if (!fileId) return new Response(JSON.stringify({ error: "Invalid Google Drive URL" }), {
					status: 400,
					headers: { "Content-Type": "application/json" }
				});
				determinedSource = "google-drive";
				canonicalUrl = `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
				if (await MediaItem.findOne({
					type: "song",
					$or: [{ url: canonicalUrl }, { url: { $regex: fileId } }]
				})) return new Response(JSON.stringify({ error: "This song has already been added." }), {
					status: 400,
					headers: { "Content-Type": "application/json" }
				});
			} else {
				try {
					new URL(trimmedUrl);
				} catch (_) {
					return new Response(JSON.stringify({ error: "Please enter a valid URL." }), {
						status: 400,
						headers: { "Content-Type": "application/json" }
					});
				}
				if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be") || lowerUrl.includes("instagram.com") || lowerUrl.includes("soundcloud.com")) return new Response(JSON.stringify({ error: "This URL cannot be played directly as an audio file. Please use a Spotify URL, Google Drive URL, or direct audio link." }), {
					status: 400,
					headers: { "Content-Type": "application/json" }
				});
				if (await MediaItem.findOne({
					type: "song",
					url: canonicalUrl
				})) return new Response(JSON.stringify({ error: "This song has already been added." }), {
					status: 400,
					headers: { "Content-Type": "application/json" }
				});
			}
		} else {
			try {
				new URL(trimmedUrl);
			} catch (_) {
				return new Response(JSON.stringify({ error: "Please enter a valid URL." }), {
					status: 400,
					headers: { "Content-Type": "application/json" }
				});
			}
			if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be") || lowerUrl.includes("spotify.com") || lowerUrl.includes("instagram.com") || lowerUrl.includes("soundcloud.com")) return new Response(JSON.stringify({ error: type === "video" ? "This URL cannot be played directly as a video file. Please use a direct video URL." : "This URL cannot be rendered directly as an image. Please use a direct image URL." }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
		}
		if (!title || !title.trim()) return new Response(JSON.stringify({ error: "Title is required" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		if (type === "song" && (!artist || !artist.trim())) return new Response(JSON.stringify({ error: "Artist name is required for songs" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const mediaItem = new MediaItem({
			type,
			source: determinedSource,
			title: title.trim(),
			artist: type === "song" ? artist ? artist.trim() : "Unknown Artist" : void 0,
			url: canonicalUrl,
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
		return new Response(JSON.stringify({ error: error.message || "Internal server error" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
} } } });
var Route$6 = createFileRoute("/api/photos/$id")({ server: { handlers: { DELETE: async ({ params }) => {
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
var Route$5 = createFileRoute("/api/songs/$id")({ server: { handlers: { DELETE: async ({ params }) => {
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
var Route$4 = createFileRoute("/api/timeline/$id")({ server: { handlers: {
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
var Route$3 = createFileRoute("/api/users/$id")({ server: { handlers: { DELETE: async ({ params, request }) => {
	try {
		if ((request.headers.get("cookie") || "").split(";").reduce((acc, cookie) => {
			const [name, value] = cookie.trim().split("=");
			if (name && value) acc[name] = value;
			return acc;
		}, {})["auth_role"] !== "admin") return new Response(JSON.stringify({ error: "Unauthorized" }), {
			status: 403,
			headers: { "Content-Type": "application/json" }
		});
		await dbConnect();
		const { id } = params;
		if (!import_mongoose.default.Types.ObjectId.isValid(id)) return new Response(JSON.stringify({ error: "Invalid user ID format" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		if (!await User$1.findById(id)) return new Response(JSON.stringify({ error: "User not found" }), {
			status: 404,
			headers: { "Content-Type": "application/json" }
		});
		await User$1.findByIdAndDelete(id);
		return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
	} catch (error) {
		console.error("Error deleting user:", error);
		return new Response(JSON.stringify({ error: "Internal server error" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
} } } });
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
var IndexRoute = Route$28.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$29
});
var AdminRoute = Route$27.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$29
});
var FunRoute = Route$26.update({
	id: "/fun",
	path: "/fun",
	getParentRoute: () => Route$29
});
var LettersRoute = Route$25.update({
	id: "/letters",
	path: "/letters",
	getParentRoute: () => Route$29
});
var LoginRoute = Route$24.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$29
});
var PhotosRoute = Route$23.update({
	id: "/photos",
	path: "/photos",
	getParentRoute: () => Route$29
});
var SongsRoute = Route$22.update({
	id: "/songs",
	path: "/songs",
	getParentRoute: () => Route$29
});
var TimelineRoute = Route$21.update({
	id: "/timeline",
	path: "/timeline",
	getParentRoute: () => Route$29
});
var VideosRoute = Route$20.update({
	id: "/videos",
	path: "/videos",
	getParentRoute: () => Route$29
});
var ApiMediaRoute = Route$19.update({
	id: "/api/media",
	path: "/api/media",
	getParentRoute: () => Route$29
});
var ApiPhotosRoute = Route$18.update({
	id: "/api/photos",
	path: "/api/photos",
	getParentRoute: () => Route$29
});
var ApiSongsRoute = Route$17.update({
	id: "/api/songs",
	path: "/api/songs",
	getParentRoute: () => Route$29
});
var ApiTimelineRoute = Route$16.update({
	id: "/api/timeline",
	path: "/api/timeline",
	getParentRoute: () => Route$29
});
var ApiUsersRoute = Route$15.update({
	id: "/api/users",
	path: "/api/users",
	getParentRoute: () => Route$29
});
var ApiVideosRoute = Route$14.update({
	id: "/api/videos",
	path: "/api/videos",
	getParentRoute: () => Route$29
});
var ApiAuthLoginRoute = Route$13.update({
	id: "/api/auth/login",
	path: "/api/auth/login",
	getParentRoute: () => Route$29
});
var ApiAuthLogoutRoute = Route$12.update({
	id: "/api/auth/logout",
	path: "/api/auth/logout",
	getParentRoute: () => Route$29
});
var ApiAuthSessionRoute = Route$11.update({
	id: "/api/auth/session",
	path: "/api/auth/session",
	getParentRoute: () => Route$29
});
var ApiFunStagesRoute = Route$10.update({
	id: "/api/fun/stages",
	path: "/api/fun/stages",
	getParentRoute: () => Route$29
});
var ApiMediaIdRoute = Route$9.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => ApiMediaRoute
});
var ApiMediaUploadRoute = Route$8.update({
	id: "/upload",
	path: "/upload",
	getParentRoute: () => ApiMediaRoute
});
var ApiMediaUrlRoute = Route$7.update({
	id: "/url",
	path: "/url",
	getParentRoute: () => ApiMediaRoute
});
var ApiPhotosIdRoute = Route$6.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => ApiPhotosRoute
});
var ApiSongsIdRoute = Route$5.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => ApiSongsRoute
});
var ApiTimelineIdRoute = Route$4.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => ApiTimelineRoute
});
var ApiUsersIdRoute = Route$3.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => ApiUsersRoute
});
var ApiVideosIdRoute = Route$2.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => ApiVideosRoute
});
var ApiMediaRouteChildren = {
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
var ApiUsersRouteChildren = { ApiUsersIdRoute };
var ApiUsersRouteWithChildren = ApiUsersRoute._addFileChildren(ApiUsersRouteChildren);
var ApiVideosRouteChildren = { ApiVideosIdRoute };
var rootRouteChildren = {
	IndexRoute,
	AdminRoute,
	FunRoute,
	LettersRoute,
	LoginRoute,
	PhotosRoute,
	SongsRoute,
	TimelineRoute,
	VideosRoute,
	ApiMediaRoute: ApiMediaRouteWithChildren,
	ApiPhotosRoute: ApiPhotosRouteWithChildren,
	ApiSongsRoute: ApiSongsRouteWithChildren,
	ApiTimelineRoute: ApiTimelineRouteWithChildren,
	ApiUsersRoute: ApiUsersRouteWithChildren,
	ApiVideosRoute: ApiVideosRoute._addFileChildren(ApiVideosRouteChildren),
	ApiAuthLoginRoute,
	ApiAuthLogoutRoute,
	ApiAuthSessionRoute,
	ApiFunStagesRoute
};
var routeTree = Route$29._addFileChildren(rootRouteChildren)._addFileTypes();
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
