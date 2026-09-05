import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { a as require_react, o as require_jsx_runtime, r as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { F as Heart, O as LogOut, S as Pause, T as Menu, c as Sparkles, k as LogIn, l as SkipForward, t as X, u as SkipBack, v as Play } from "../_libs/lucide-react.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { _ as useLoaderData, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, j as redirect, l as useLocation, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as require_mongoose } from "../_libs/mongoose+mpath+mquery+ms+sift.mjs";
import { a as createSessionCookie, c as hashPassword, d as requireAdmin, f as sanitizeMongoInput, g as verifyPassword, h as validateMediaUpload, i as createRateLimitResponse, l as isValidObjectId, m as uploadRateLimiter, n as checkRateLimit, o as createSessionToken, p as sanitizePlainText, r as createClearSessionCookie, s as getAuthSession, t as authRateLimiter, u as mutationRateLimiter, v as dbConnect } from "./ssr.mjs";
import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-CIHAFgYl.mjs";
import { i as letters, n as girlfriend } from "./site-_zOoiwhn.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-BxbOTlVT.mjs";
import { n as formatTime, r as useMusic, t as MusicProvider } from "./MusicProvider-CexXRw5f.mjs";
import { a as stringType, i as objectType, n as enumType, r as literalType, t as booleanType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-iKROojVA.js
var import_mongoose = /* @__PURE__ */ __toESM(require_mongoose());
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-pzQAf11U.css";
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "size-11 shrink-0 overflow-hidden rounded-xl bg-black/20 sm:size-12",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: current.cover,
						alt: "",
						loading: "lazy",
						className: "size-full object-cover object-center"
					})
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
var Route$32 = createRootRouteWithContext()({
	loader: async ({ location }) => {
		if (location.pathname === "/login" || location.pathname.startsWith("/api/") || location.pathname.includes(".")) return { role: null };
		const { role } = await getSession();
		if (!role) throw redirect({ to: "/login" });
		if (location.pathname === "/admin" && role !== "admin") throw redirect({ to: "/login" });
		return { role: role || null };
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
	const { queryClient } = Route$32.useRouteContext();
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
var $$splitComponentImporter$8 = () => import("./routes-CKmu2OzX.mjs");
var title$6 = "For You — A Little World Made Just For Us";
var description$6 = "A private collection of our photos, videos, songs, letters and the timeline of our story — made with all my love.";
var Route$31 = createFileRoute("/")({
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
var $$splitComponentImporter$7 = () => import("./admin-BMaWnh1R.mjs");
var Route$30 = createFileRoute("/admin")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./fun-wkuS3tR7.mjs");
var title$5 = "Fun Zone ❤️ — Interactive Character Game";
var description$5 = "Playful interactive cartoon reactions! Select an action like Stone, Hand, Punch, Hit, Slap or Love and tap the picture for fun visual effects.";
var Route$29 = createFileRoute("/fun")({
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
var $$splitComponentImporter$5 = () => import("./letters-CmueGxn_.mjs");
var title$4 = "Letters For You — Open When...";
var description$4 = "Open-when letters written for your low days, your proud days and the days you miss me. Words from my heart.";
var Route$28 = createFileRoute("/letters")({
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
var Route$27 = createFileRoute("/login")({
	loader: async () => {
		const { role } = await getSession();
		if (role === "admin") throw redirect({ to: "/admin" });
		if (role === "user") throw redirect({ to: "/" });
		return {};
	},
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./photos-BO0Kt4e2.mjs");
var title$3 = "Our Beautiful Memories — Photos";
var description$3 = "Every picture holds a special moment with you: our trips, dates, candid smiles and the days I never want to forget.";
var Route$26 = createFileRoute("/photos")({
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
var $$splitComponentImporter$2 = () => import("./songs-DnoZ_WkY.mjs");
var title$2 = "Songs That Remind Me of You";
var description$2 = "Our playlist — the melodies that speak your name, from the first song we danced to onwards.";
var Route$25 = createFileRoute("/songs")({
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
var $$splitComponentImporter$1 = () => import("./timeline-BM-yOlM-.mjs");
var title$1 = "Our Journey Timeline";
var description$1 = "From the day we met to the adventures still ahead — a timeline of our beautiful journey together.";
var Route$24 = createFileRoute("/timeline")({
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
var Route$23 = createFileRoute("/videos")({
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
var LetterSchema$1 = new import_mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	preview: {
		type: String,
		required: true
	},
	body: {
		type: String,
		required: true
	},
	date: {
		type: String,
		required: true
	},
	category: {
		type: String,
		default: "Love"
	},
	favorite: {
		type: Boolean,
		default: false
	}
}, { timestamps: true });
var Letter = import_mongoose.default.models.Letter || import_mongoose.default.model("Letter", LetterSchema$1, "letters");
var LetterSchema = objectType({
	title: stringType().min(1, "Title is required").max(200),
	preview: stringType().min(1, "Preview is required").max(500),
	body: stringType().min(1, "Body is required").max(1e4),
	date: stringType().min(1, "Date is required").max(50),
	category: stringType().max(50).optional(),
	favorite: booleanType().optional()
});
var Route$22 = createFileRoute("/api/letters")({ server: { handlers: {
	GET: async () => {
		try {
			await dbConnect();
			const dbLetters = await Letter.find().select("-__v").sort({ createdAt: -1 });
			if (dbLetters.length === 0) return new Response(JSON.stringify(letters), { headers: { "Content-Type": "application/json" } });
			return new Response(JSON.stringify(dbLetters), { headers: { "Content-Type": "application/json" } });
		} catch (error) {
			console.error("Error fetching letters:", error);
			return new Response(JSON.stringify(letters), { headers: { "Content-Type": "application/json" } });
		}
	},
	POST: async ({ request }) => {
		const auth = requireAdmin(request);
		if ("errorResponse" in auth) return auth.errorResponse;
		const rateCheck = checkRateLimit(request, mutationRateLimiter);
		if (!rateCheck.allowed) return createRateLimitResponse(rateCheck.retryAfterSeconds);
		try {
			await dbConnect();
			const rawBody = await request.json().catch(() => null);
			if (!rawBody || typeof rawBody !== "object") return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			const parsed = LetterSchema.safeParse(sanitizeMongoInput(rawBody));
			if (!parsed.success) return new Response(JSON.stringify({ error: parsed.error.issues[0]?.message || "Validation failed" }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			const { title, preview, body, date, category, favorite } = parsed.data;
			const letter = new Letter({
				title: sanitizePlainText(title, 200),
				preview: sanitizePlainText(preview, 500),
				body: sanitizePlainText(body, 1e4),
				date: sanitizePlainText(date, 50),
				category: sanitizePlainText(category || "Love", 50),
				favorite: !!favorite
			});
			await letter.save();
			return new Response(JSON.stringify(letter), {
				status: 201,
				headers: { "Content-Type": "application/json" }
			});
		} catch (error) {
			console.error("Error creating letter:", error);
			return new Response(JSON.stringify({ error: "Internal server error" }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
		}
	}
} } });
var Route$21 = createFileRoute("/api/media")({ server: { handlers: { GET: async ({ request }) => {
	try {
		await dbConnect();
		const rawType = new URL(request.url).searchParams.get("type");
		const filter = {};
		if (rawType && [
			"image",
			"video",
			"song"
		].includes(rawType)) filter.type = rawType;
		const items = await MediaItem.find(filter).select("-__v").sort({ createdAt: -1 });
		return new Response(JSON.stringify(items), { headers: { "Content-Type": "application/json" } });
	} catch (error) {
		console.error("Error fetching media:", error);
		return new Response(JSON.stringify({ error: "Internal server error" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
} } } });
var Route$20 = createFileRoute("/api/photos")({ server: { handlers: {
	GET: async () => {
		try {
			await dbConnect();
			const photos = await MediaItem.find({ type: "image" }).select("-__v").sort({ createdAt: -1 });
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
		const auth = requireAdmin(request);
		if ("errorResponse" in auth) return auth.errorResponse;
		const rateCheck = checkRateLimit(request, uploadRateLimiter);
		if (!rateCheck.allowed) return createRateLimitResponse(rateCheck.retryAfterSeconds);
		try {
			await dbConnect();
			const formData = await request.formData();
			const file = formData.get("file");
			const rawTitle = formData.get("title");
			const rawDescription = formData.get("description");
			const rawCategory = formData.get("category");
			const rawMemoryDate = formData.get("memoryDate");
			const favorite = formData.get("favorite") === "true";
			if (!file || !(file instanceof File)) return new Response(JSON.stringify({ error: "No image file uploaded" }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			const title = sanitizePlainText(rawTitle, 150);
			if (!title) return new Response(JSON.stringify({ error: "Title is required" }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			const description = sanitizePlainText(rawDescription, 1e3);
			const category = sanitizePlainText(rawCategory, 50) || "Favorites";
			const memoryDate = sanitizePlainText(rawMemoryDate, 20) || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
			const arrayBuffer = await file.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);
			const validation = validateMediaUpload(buffer, file.name, file.type, "image");
			if (!validation.valid) return new Response(JSON.stringify({ error: validation.error }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			const db = import_mongoose.default.connection.db;
			if (!db) return new Response(JSON.stringify({ error: "Database connection unavailable" }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
			const bucket = new import_mongoose.default.mongo.GridFSBucket(db, { bucketName: "media" });
			const fileId = await new Promise((resolve, reject) => {
				const uploadStream = bucket.openUploadStream(validation.safeFilename, { contentType: validation.detectedMimeType || "image/jpeg" });
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
				description,
				filename: validation.safeFilename,
				mimeType: validation.detectedMimeType || "image/jpeg",
				fileSize: buffer.length,
				fileId,
				category,
				favorite,
				memoryDate
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
var Route$19 = createFileRoute("/api/songs")({ server: { handlers: {
	GET: async () => {
		try {
			await dbConnect();
			const songs = await MediaItem.find({ type: "song" }).select("-__v").sort({ createdAt: -1 });
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
		const auth = requireAdmin(request);
		if ("errorResponse" in auth) return auth.errorResponse;
		const rateCheck = checkRateLimit(request, uploadRateLimiter);
		if (!rateCheck.allowed) return createRateLimitResponse(rateCheck.retryAfterSeconds);
		try {
			await dbConnect();
			const formData = await request.formData();
			const file = formData.get("file");
			const coverFile = formData.get("coverFile");
			const rawTitle = formData.get("title");
			const rawArtist = formData.get("artist");
			const rawDescription = formData.get("description");
			const rawDuration = formData.get("duration");
			const rawMemoryDate = formData.get("memoryDate");
			if (!file || !(file instanceof File)) return new Response(JSON.stringify({ error: "No audio file uploaded" }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			const title = sanitizePlainText(rawTitle, 150);
			const artist = sanitizePlainText(rawArtist, 100);
			if (!title || !artist) return new Response(JSON.stringify({ error: "Title and Artist are required" }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			const description = sanitizePlainText(rawDescription, 1e3);
			const duration = sanitizePlainText(rawDuration, 20) || "3:00";
			const memoryDate = sanitizePlainText(rawMemoryDate, 20) || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
			const audioArrayBuffer = await file.arrayBuffer();
			const audioBuffer = Buffer.from(audioArrayBuffer);
			const audioValidation = validateMediaUpload(audioBuffer, file.name, file.type, "song");
			if (!audioValidation.valid) return new Response(JSON.stringify({ error: audioValidation.error }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			const db = import_mongoose.default.connection.db;
			if (!db) return new Response(JSON.stringify({ error: "Database connection unavailable" }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
			const bucket = new import_mongoose.default.mongo.GridFSBucket(db, { bucketName: "media" });
			const fileId = await new Promise((resolve, reject) => {
				const uploadStream = bucket.openUploadStream(audioValidation.safeFilename, { contentType: audioValidation.detectedMimeType || "audio/mpeg" });
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
			if (coverFile && coverFile instanceof File && coverFile.size > 0) {
				const coverArrayBuffer = await coverFile.arrayBuffer();
				const coverBuffer = Buffer.from(coverArrayBuffer);
				const coverValidation = validateMediaUpload(coverBuffer, coverFile.name, coverFile.type, "image");
				if (coverValidation.valid) coverFileId = await new Promise((resolve, reject) => {
					const uploadStream = bucket.openUploadStream(coverValidation.safeFilename, { contentType: coverValidation.detectedMimeType || "image/jpeg" });
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
			const song = new MediaItem({
				type: "song",
				source: "upload",
				title,
				artist,
				description,
				filename: audioValidation.safeFilename,
				mimeType: audioValidation.detectedMimeType || "audio/mpeg",
				fileSize: audioBuffer.length,
				fileId,
				coverFileId,
				duration,
				memoryDate
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
var Route$18 = createFileRoute("/api/timeline")({ server: { handlers: {
	GET: async () => {
		try {
			await dbConnect();
			const milestones = await Timeline.find().select("-__v").sort({
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
		const auth = requireAdmin(request);
		if ("errorResponse" in auth) return auth.errorResponse;
		const rateCheck = checkRateLimit(request, mutationRateLimiter);
		if (!rateCheck.allowed) return createRateLimitResponse(rateCheck.retryAfterSeconds);
		try {
			await dbConnect();
			const formData = await request.formData();
			const rawTitle = formData.get("title");
			const rawDescription = formData.get("description");
			const rawDate = formData.get("date");
			const rawMemoryDate = formData.get("memoryDate");
			const rawLocation = formData.get("location");
			const rawIcon = formData.get("icon");
			const highlight = formData.get("highlight") === "true";
			const imageFile = formData.get("imageFile");
			const videoFile = formData.get("videoFile");
			const title = sanitizePlainText(rawTitle, 150);
			const date = sanitizePlainText(rawDate, 50);
			if (!title) return new Response(JSON.stringify({ error: "Title is required" }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			const description = sanitizePlainText(rawDescription, 1e3);
			const memoryDate = sanitizePlainText(rawMemoryDate, 20) || (date && !isNaN(Date.parse(date)) ? new Date(date).toISOString().split("T")[0] : void 0);
			const location = sanitizePlainText(rawLocation, 100);
			const icon = [
				"heart",
				"coffee",
				"sparkles",
				"plane",
				"star"
			].includes(rawIcon || "") ? rawIcon : "heart";
			const db = import_mongoose.default.connection.db;
			if (!db) return new Response(JSON.stringify({ error: "Database connection unavailable" }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
			const bucket = new import_mongoose.default.mongo.GridFSBucket(db, { bucketName: "media" });
			let imageFileId;
			if (imageFile && imageFile instanceof File && imageFile.size > 0) {
				const imageArrayBuffer = await imageFile.arrayBuffer();
				const imageBuffer = Buffer.from(imageArrayBuffer);
				const imageValidation = validateMediaUpload(imageBuffer, imageFile.name, imageFile.type, "image");
				if (!imageValidation.valid) return new Response(JSON.stringify({ error: imageValidation.error }), {
					status: 400,
					headers: { "Content-Type": "application/json" }
				});
				imageFileId = await new Promise((resolve, reject) => {
					const uploadStream = bucket.openUploadStream(imageValidation.safeFilename, { contentType: imageValidation.detectedMimeType || "image/jpeg" });
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
			let videoFileId;
			if (videoFile && videoFile instanceof File && videoFile.size > 0) {
				const videoArrayBuffer = await videoFile.arrayBuffer();
				const videoBuffer = Buffer.from(videoArrayBuffer);
				const videoValidation = validateMediaUpload(videoBuffer, videoFile.name, videoFile.type, "video");
				if (!videoValidation.valid) return new Response(JSON.stringify({ error: videoValidation.error }), {
					status: 400,
					headers: { "Content-Type": "application/json" }
				});
				videoFileId = await new Promise((resolve, reject) => {
					const uploadStream = bucket.openUploadStream(videoValidation.safeFilename, { contentType: videoValidation.detectedMimeType || "video/mp4" });
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
			const milestone = new Timeline({
				title,
				description,
				date: date || (memoryDate ? new Date(memoryDate).toLocaleDateString("en-GB", {
					day: "2-digit",
					month: "short",
					year: "numeric"
				}) : ""),
				memoryDate,
				location,
				imageFileId,
				videoFileId,
				icon,
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
var CreateUserSchema = objectType({
	username: stringType().min(3, "Username must be at least 3 characters").max(30),
	password: stringType().min(6, "Password must be at least 6 characters").max(100),
	role: enumType(["user"]).optional()
});
var Route$17 = createFileRoute("/api/users")({ server: { handlers: {
	GET: async ({ request }) => {
		const auth = requireAdmin(request);
		if ("errorResponse" in auth) return auth.errorResponse;
		try {
			await dbConnect();
			const users = await User$1.find({}, {
				password: 0,
				__v: 0
			}).sort({ createdAt: -1 });
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
		const auth = requireAdmin(request);
		if ("errorResponse" in auth) return auth.errorResponse;
		const rateCheck = checkRateLimit(request, mutationRateLimiter);
		if (!rateCheck.allowed) return createRateLimitResponse(rateCheck.retryAfterSeconds);
		try {
			const rawBody = await request.json().catch(() => null);
			if (!rawBody || typeof rawBody !== "object") return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			const parsed = CreateUserSchema.safeParse(sanitizeMongoInput(rawBody));
			if (!parsed.success) return new Response(JSON.stringify({ error: parsed.error.issues[0]?.message || "Validation failed" }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			const { username, password } = parsed.data;
			const cleanUsername = sanitizePlainText(username, 30).toLowerCase();
			if (cleanUsername === "admin" || cleanUsername === "root" || cleanUsername === "administrator") return new Response(JSON.stringify({ error: "This username is reserved" }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			await dbConnect();
			if (await User$1.findOne({ username: cleanUsername })) return new Response(JSON.stringify({ error: "Username already exists" }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			const hashedPassword = hashPassword(password);
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
			}), {
				status: 201,
				headers: { "Content-Type": "application/json" }
			});
		} catch (error) {
			console.error("Error creating user:", error);
			return new Response(JSON.stringify({ error: "Internal server error" }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
		}
	}
} } });
var Route$16 = createFileRoute("/api/videos")({ server: { handlers: {
	GET: async () => {
		try {
			await dbConnect();
			const videos = await MediaItem.find({ type: "video" }).select("-__v").sort({ createdAt: -1 });
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
		const auth = requireAdmin(request);
		if ("errorResponse" in auth) return auth.errorResponse;
		const rateCheck = checkRateLimit(request, uploadRateLimiter);
		if (!rateCheck.allowed) return createRateLimitResponse(rateCheck.retryAfterSeconds);
		try {
			await dbConnect();
			const formData = await request.formData();
			const file = formData.get("file");
			const rawTitle = formData.get("title");
			const rawDescription = formData.get("description");
			const rawDuration = formData.get("duration");
			const rawMemoryDate = formData.get("memoryDate");
			const favorite = formData.get("favorite") === "true";
			if (!file || !(file instanceof File)) return new Response(JSON.stringify({ error: "No video file uploaded" }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			const title = sanitizePlainText(rawTitle, 150);
			if (!title) return new Response(JSON.stringify({ error: "Title is required" }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			const description = sanitizePlainText(rawDescription, 1e3);
			const duration = sanitizePlainText(rawDuration, 20) || "0:30";
			const memoryDate = sanitizePlainText(rawMemoryDate, 20) || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
			const arrayBuffer = await file.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);
			const validation = validateMediaUpload(buffer, file.name, file.type, "video");
			if (!validation.valid) return new Response(JSON.stringify({ error: validation.error }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			const db = import_mongoose.default.connection.db;
			if (!db) return new Response(JSON.stringify({ error: "Database connection unavailable" }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
			const bucket = new import_mongoose.default.mongo.GridFSBucket(db, { bucketName: "media" });
			const fileId = await new Promise((resolve, reject) => {
				const uploadStream = bucket.openUploadStream(validation.safeFilename, { contentType: validation.detectedMimeType || "video/mp4" });
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
				description,
				filename: validation.safeFilename,
				mimeType: validation.detectedMimeType || "video/mp4",
				fileSize: buffer.length,
				fileId,
				favorite,
				duration,
				memoryDate
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
var UpdateAdminSchema = objectType({
	username: stringType().min(3, "Admin username must be at least 3 characters").max(50, "Admin username must be at most 50 characters").regex(/^[a-zA-Z0-9_.-]+$/, "Username can only contain letters, numbers, hyphens, and underscores"),
	newPassword: stringType().min(6, "New password must be at least 6 characters").max(100, "New password must be at most 100 characters").optional().or(literalType(""))
});
var Route$15 = createFileRoute("/api/auth/admin")({ server: { handlers: {
	GET: async ({ request }) => {
		const auth = requireAdmin(request);
		if ("errorResponse" in auth) return auth.errorResponse;
		try {
			await dbConnect();
			let adminUser = auth.session.userId ? await User$1.findById(auth.session.userId) : null;
			if (!adminUser) adminUser = await User$1.findOne({ role: "admin" });
			return new Response(JSON.stringify({
				success: true,
				username: adminUser?.username || auth.session.username || "admin",
				hasDbRecord: !!adminUser
			}), { headers: { "Content-Type": "application/json" } });
		} catch (error) {
			console.error("Error retrieving admin info:", error);
			return new Response(JSON.stringify({ error: "Internal server error" }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
		}
	},
	POST: async ({ request }) => {
		const auth = requireAdmin(request);
		if ("errorResponse" in auth) return auth.errorResponse;
		const rateCheck = checkRateLimit(request, mutationRateLimiter);
		if (!rateCheck.allowed) return createRateLimitResponse(rateCheck.retryAfterSeconds);
		try {
			const rawBody = await request.json().catch(() => null);
			if (!rawBody || typeof rawBody !== "object") return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			const parsed = UpdateAdminSchema.safeParse(sanitizeMongoInput(rawBody));
			if (!parsed.success) return new Response(JSON.stringify({ error: parsed.error.issues[0]?.message || "Validation failed" }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			const { username, newPassword } = parsed.data;
			const cleanUsername = sanitizePlainText(username, 50).trim();
			await dbConnect();
			let adminUser = auth.session.userId ? await User$1.findById(auth.session.userId) : null;
			if (!adminUser) adminUser = await User$1.findOne({ role: "admin" });
			const conflictingUser = await User$1.findOne({ username: cleanUsername });
			if (conflictingUser && (!adminUser || conflictingUser._id.toString() !== adminUser._id.toString())) return new Response(JSON.stringify({ error: "That username is already taken by another account" }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			if (adminUser) {
				adminUser.username = cleanUsername;
				adminUser.role = "admin";
				if (newPassword && newPassword.trim()) adminUser.password = hashPassword(newPassword.trim());
				await adminUser.save();
			} else {
				const passwordToHash = newPassword && newPassword.trim() ? newPassword.trim() : process.env["ADMIN_PASSWORD"] || "admin123";
				adminUser = await User$1.create({
					username: cleanUsername,
					password: hashPassword(passwordToHash),
					role: "admin"
				});
			}
			const newToken = createSessionToken({
				userId: adminUser._id.toString(),
				username: cleanUsername,
				role: "admin"
			});
			const cookie = createSessionCookie(newToken);
			console.log(`[AUTH] Admin credentials updated for '${cleanUsername}'`);
			return new Response(JSON.stringify({
				success: true,
				message: "Admin credentials updated successfully!",
				username: cleanUsername
			}), { headers: {
				"Content-Type": "application/json",
				"Set-Cookie": cookie
			} });
		} catch (error) {
			console.error("Error updating admin credentials:", error);
			return new Response(JSON.stringify({ error: "Internal server error" }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
		}
	}
} } });
var LoginSchema = objectType({
	username: stringType().max(100).optional(),
	password: stringType().min(1, "Password is required").max(500)
});
var Route$14 = createFileRoute("/api/auth/login")({ server: { handlers: { POST: async ({ request }) => {
	const rateCheck = checkRateLimit(request, authRateLimiter);
	if (!rateCheck.allowed) {
		console.warn("[AUTH] Login rate limit exceeded from client IP");
		return createRateLimitResponse(rateCheck.retryAfterSeconds);
	}
	try {
		const rawBody = await request.json().catch(() => null);
		if (!rawBody || typeof rawBody !== "object") return new Response(JSON.stringify({
			success: false,
			error: "Invalid request payload"
		}), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const parseResult = LoginSchema.safeParse(sanitizeMongoInput(rawBody));
		if (!parseResult.success) return new Response(JSON.stringify({
			success: false,
			error: "Invalid credentials format"
		}), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const { username, password } = parseResult.data;
		const cleanUsername = username ? username.trim() : "";
		const adminPass = process.env["ADMIN_PASSWORD"] || "admin123";
		const userPass = process.env["USER_PASSWORD"] || "beautiful";
		const adminPassHash = process.env["ADMIN_PASSWORD_HASH"];
		let matchedRole = null;
		let matchedUsername = cleanUsername || "visitor";
		let matchedUserId;
		if (cleanUsername) {
			await dbConnect();
			const user = await User$1.findOne({ username: { $regex: new RegExp(`^${cleanUsername.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") } });
			if (user && user.password) {
				if (verifyPassword(password, user.password)) {
					matchedRole = user.role || "user";
					matchedUsername = user.username;
					matchedUserId = user._id.toString();
				}
			}
		}
		if (!matchedRole && cleanUsername.toLowerCase() === "admin") {
			if (adminPassHash ? verifyPassword(password, adminPassHash) : password === adminPass) {
				matchedRole = "admin";
				matchedUsername = "admin";
			}
		}
		if (!matchedRole) {
			if (password === adminPass) {
				matchedRole = "admin";
				matchedUsername = "admin";
			} else if (password === userPass) {
				matchedRole = "user";
				matchedUsername = cleanUsername || "beloved";
			}
		}
		if (matchedRole) {
			console.log(`[AUTH] Successful login for user '${matchedUsername}' as role '${matchedRole}'`);
			const token = createSessionToken({
				userId: matchedUserId,
				username: matchedUsername,
				role: matchedRole
			});
			const cookieHeader = createSessionCookie(token);
			return new Response(JSON.stringify({
				success: true,
				role: matchedRole,
				username: matchedUsername
			}), {
				status: 200,
				headers: {
					"Content-Type": "application/json",
					"Set-Cookie": cookieHeader
				}
			});
		}
		console.warn(`[AUTH] Failed login attempt for identifier '${cleanUsername || "unknown"}'`);
		return new Response(JSON.stringify({
			success: false,
			error: "Invalid credentials"
		}), {
			status: 401,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		console.error("[AUTH] Error processing login:", error);
		return new Response(JSON.stringify({
			success: false,
			error: "Internal server error"
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
} } } });
var Route$13 = createFileRoute("/api/auth/logout")({ server: { handlers: { POST: async () => {
	try {
		const clearCookie = createClearSessionCookie();
		return new Response(JSON.stringify({ success: true }), { headers: {
			"Content-Type": "application/json",
			"Set-Cookie": clearCookie
		} });
	} catch (error) {
		console.error("Error logging out:", error);
		return new Response(JSON.stringify({ error: "Internal server error" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
} } } });
var Route$12 = createFileRoute("/api/auth/session")({ server: { handlers: { GET: async ({ request }) => {
	try {
		const session = getAuthSession(request);
		return new Response(JSON.stringify({
			authenticated: !!session,
			role: session?.role || null,
			username: session?.username || null,
			userId: session?.userId || null
		}), { headers: { "Content-Type": "application/json" } });
	} catch (error) {
		console.error("Error getting auth session:", error);
		return new Response(JSON.stringify({
			authenticated: false,
			role: null,
			error: "Failed to retrieve session"
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
var Route$11 = createFileRoute("/api/fun/stages")({ server: { handlers: {
	GET: async () => {
		try {
			await dbConnect();
			const stageData = (await FunZoneStage.find({}).select("-__v").sort({ stage: 1 })).map((s) => ({
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
		const auth = requireAdmin(request);
		if ("errorResponse" in auth) return auth.errorResponse;
		const rateCheck = checkRateLimit(request, mutationRateLimiter);
		if (!rateCheck.allowed) return createRateLimitResponse(rateCheck.retryAfterSeconds);
		try {
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
			if (!file || !(file instanceof File)) return new Response(JSON.stringify({ error: "No image file provided" }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			const arrayBuffer = await file.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);
			const validation = validateMediaUpload(buffer, file.name, file.type, "image");
			if (!validation.valid) return new Response(JSON.stringify({ error: validation.error }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			const db = import_mongoose.default.connection.db;
			if (!db) return new Response(JSON.stringify({ error: "Database connection unavailable" }), {
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
			const fileId = await new Promise((resolve, reject) => {
				const uploadStream = bucket.openUploadStream(validation.safeFilename, { contentType: validation.detectedMimeType || "image/jpeg" });
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
				title: sanitizePlainText(title, 100),
				filename: validation.safeFilename,
				mimeType: validation.detectedMimeType || "image/jpeg",
				fileSize: buffer.length,
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
		const auth = requireAdmin(request);
		if ("errorResponse" in auth) return auth.errorResponse;
		try {
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
			if (!db) return new Response(JSON.stringify({ error: "Database connection unavailable" }), {
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
				message: `Stage ${stageNum} image deleted successfully`,
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
var UpdateLetterSchema = objectType({
	title: stringType().min(1).max(200).optional(),
	preview: stringType().min(1).max(500).optional(),
	body: stringType().min(1).max(1e4).optional(),
	date: stringType().min(1).max(50).optional(),
	category: stringType().max(50).optional(),
	favorite: booleanType().optional()
});
var Route$10 = createFileRoute("/api/letters/$id")({ server: { handlers: {
	PUT: async ({ params, request }) => {
		const auth = requireAdmin(request);
		if ("errorResponse" in auth) return auth.errorResponse;
		try {
			await dbConnect();
			const { id } = params;
			if (!isValidObjectId(id)) return new Response(JSON.stringify({ error: "Invalid letter ID format" }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			const rawBody = await request.json().catch(() => null);
			if (!rawBody || typeof rawBody !== "object") return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			const parsed = UpdateLetterSchema.safeParse(sanitizeMongoInput(rawBody));
			if (!parsed.success) return new Response(JSON.stringify({ error: parsed.error.issues[0]?.message || "Validation failed" }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			const updateFields = {};
			if (parsed.data.title !== void 0) updateFields.title = sanitizePlainText(parsed.data.title, 200);
			if (parsed.data.preview !== void 0) updateFields.preview = sanitizePlainText(parsed.data.preview, 500);
			if (parsed.data.body !== void 0) updateFields.body = sanitizePlainText(parsed.data.body, 1e4);
			if (parsed.data.date !== void 0) updateFields.date = sanitizePlainText(parsed.data.date, 50);
			if (parsed.data.category !== void 0) updateFields.category = sanitizePlainText(parsed.data.category, 50);
			if (parsed.data.favorite !== void 0) updateFields.favorite = parsed.data.favorite;
			const updated = await Letter.findByIdAndUpdate(id, { $set: updateFields }, { new: true });
			if (!updated) return new Response(JSON.stringify({ error: "Letter not found" }), {
				status: 404,
				headers: { "Content-Type": "application/json" }
			});
			return new Response(JSON.stringify(updated), { headers: { "Content-Type": "application/json" } });
		} catch (error) {
			console.error("Error updating letter:", error);
			return new Response(JSON.stringify({ error: "Internal server error" }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
		}
	},
	DELETE: async ({ params, request }) => {
		const auth = requireAdmin(request);
		if ("errorResponse" in auth) return auth.errorResponse;
		try {
			await dbConnect();
			const { id } = params;
			if (!isValidObjectId(id)) return new Response(JSON.stringify({ error: "Invalid letter ID format" }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			if (!await Letter.findByIdAndDelete(id)) return new Response(JSON.stringify({ error: "Letter not found" }), {
				status: 404,
				headers: { "Content-Type": "application/json" }
			});
			return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
		} catch (error) {
			console.error("Error deleting letter:", error);
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
			if (!isValidObjectId(id)) return new Response(JSON.stringify({ error: "Invalid media file ID format" }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			const db = import_mongoose.default.connection.db;
			if (!db) return new Response(JSON.stringify({ error: "Database connection unavailable" }), {
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
			if (rangeHeader && fileSize > 0) {
				const parts = rangeHeader.replace(/bytes=/, "").split("-");
				const start = parseInt(parts[0], 10) || 0;
				const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
				const safeEnd = Math.min(end, fileSize - 1);
				const chunksize = safeEnd - start + 1;
				const downloadStream = bucket.openDownloadStream(objectId, {
					start,
					end: safeEnd + 1
				});
				const readable = new ReadableStream({
					start(controller) {
						downloadStream.on("data", (chunk) => controller.enqueue(chunk));
						downloadStream.on("end", () => controller.close());
						downloadStream.on("error", (err) => controller.error(err));
					},
					cancel() {
						downloadStream.destroy();
					}
				});
				return new Response(readable, {
					status: 206,
					headers: {
						"Content-Range": `bytes ${start}-${safeEnd}/${fileSize}`,
						"Accept-Ranges": "bytes",
						"Content-Length": chunksize.toString(),
						"Content-Type": contentType,
						"X-Content-Type-Options": "nosniff"
					}
				});
			} else {
				const downloadStream = bucket.openDownloadStream(objectId);
				const readable = new ReadableStream({
					start(controller) {
						downloadStream.on("data", (chunk) => controller.enqueue(chunk));
						downloadStream.on("end", () => controller.close());
						downloadStream.on("error", (err) => controller.error(err));
					},
					cancel() {
						downloadStream.destroy();
					}
				});
				return new Response(readable, {
					status: 200,
					headers: {
						"Content-Length": fileSize.toString(),
						"Content-Type": contentType,
						"Accept-Ranges": "bytes",
						"X-Content-Type-Options": "nosniff"
					}
				});
			}
		} catch (error) {
			console.error("Error streaming media from GridFS:", error);
			return new Response(JSON.stringify({ error: "Internal server error" }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
		}
	},
	DELETE: async ({ params, request }) => {
		const auth = requireAdmin(request);
		if ("errorResponse" in auth) return auth.errorResponse;
		try {
			await dbConnect();
			const { id } = params;
			if (!isValidObjectId(id)) return new Response(JSON.stringify({ error: "Invalid document ID format" }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			const mediaItem = await MediaItem.findById(id);
			if (!mediaItem) return new Response(JSON.stringify({ error: "Media item not found" }), {
				status: 404,
				headers: { "Content-Type": "application/json" }
			});
			if (mediaItem.source === "upload") {
				const db = import_mongoose.default.connection.db;
				if (db) {
					const bucket = new import_mongoose.default.mongo.GridFSBucket(db, { bucketName: "media" });
					if (mediaItem.fileId) try {
						await bucket.delete(new import_mongoose.default.Types.ObjectId(mediaItem.fileId));
					} catch (err) {
						console.warn("GridFS file deletion warning:", err);
					}
					if (mediaItem.coverFileId) try {
						await bucket.delete(new import_mongoose.default.Types.ObjectId(mediaItem.coverFileId));
					} catch (err) {
						console.warn("GridFS cover deletion warning:", err);
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
	}
} } });
var Route$8 = createFileRoute("/api/media/upload")({ server: { handlers: { POST: async ({ request }) => {
	const auth = requireAdmin(request);
	if ("errorResponse" in auth) return auth.errorResponse;
	const rateCheck = checkRateLimit(request, uploadRateLimiter);
	if (!rateCheck.allowed) return createRateLimitResponse(rateCheck.retryAfterSeconds);
	try {
		await dbConnect();
		const formData = await request.formData();
		const file = formData.get("file");
		const rawTitle = formData.get("title");
		const rawArtist = formData.get("artist");
		const rawType = formData.get("type");
		const rawCategory = formData.get("category");
		const rawDescription = formData.get("description");
		const rawMemoryDate = formData.get("memoryDate");
		const favorite = formData.get("favorite") === "true";
		if (!file || !(file instanceof File)) return new Response(JSON.stringify({ error: "No file uploaded" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const title = sanitizePlainText(rawTitle, 150);
		if (!title) return new Response(JSON.stringify({ error: "Title is required" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		if (!rawType || ![
			"image",
			"video",
			"song"
		].includes(rawType)) return new Response(JSON.stringify({ error: "Invalid or missing media type" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const type = rawType;
		const artist = sanitizePlainText(rawArtist, 100);
		const description = sanitizePlainText(rawDescription, 1e3);
		const category = sanitizePlainText(rawCategory, 50) || "Favorites";
		const memoryDate = sanitizePlainText(rawMemoryDate, 20) || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
		const uploadIdRaw = formData.get("uploadId");
		const uploadId = sanitizePlainText(uploadIdRaw, 100);
		const chunkIndex = parseInt(formData.get("chunkIndex"), 10);
		const totalChunks = parseInt(formData.get("totalChunks"), 10);
		const isLastChunk = formData.get("isLastChunk") === "true";
		const filename = sanitizePlainText(formData.get("filename"), 200) || file.name;
		const mimeType = sanitizePlainText(formData.get("mimeType"), 100) || file.type;
		if (!uploadId || isNaN(chunkIndex) || isNaN(totalChunks) || chunkIndex < 0 || totalChunks <= 0 || chunkIndex >= totalChunks) return new Response(JSON.stringify({ error: "Invalid chunk upload parameters" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		if (totalChunks > 200) return new Response(JSON.stringify({ error: "Total chunks exceed allowed limit" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		const db = import_mongoose.default.connection.db;
		if (!db) return new Response(JSON.stringify({ error: "Database connection unavailable" }), {
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
		if (chunks.length < totalChunks) {
			await UploadChunk.deleteMany({ uploadId });
			return new Response(JSON.stringify({ error: `Chunk assembly failed. Only ${chunks.length}/${totalChunks} chunks received.` }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
		}
		const finalBuffer = Buffer.concat(chunks.map((c) => c.data));
		const validation = validateMediaUpload(finalBuffer, filename, mimeType, type);
		if (!validation.valid) {
			await UploadChunk.deleteMany({ uploadId });
			return new Response(JSON.stringify({ error: validation.error }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
		}
		const bucket = new import_mongoose.default.mongo.GridFSBucket(db, { bucketName: "media" });
		const fileId = await new Promise((resolve, reject) => {
			const uploadStream = bucket.openUploadStream(validation.safeFilename, { contentType: validation.detectedMimeType || mimeType });
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
			description,
			filename: validation.safeFilename,
			mimeType: validation.detectedMimeType || mimeType,
			fileSize: finalBuffer.length,
			fileId,
			category,
			favorite,
			memoryDate
		});
		await mediaItem.save();
		await UploadChunk.deleteMany({ uploadId });
		return new Response(JSON.stringify(mediaItem), {
			status: 201,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		console.error("Error uploading media chunk:", error);
		return new Response(JSON.stringify({ error: "Internal server error" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
} } } });
var MediaUrlSchema = objectType({
	title: stringType().min(1, "Title is required").max(150),
	url: stringType().url("Valid URL is required").max(2e3),
	type: enumType([
		"image",
		"video",
		"song"
	]),
	artist: stringType().max(100).optional(),
	category: stringType().max(50).optional(),
	memoryDate: stringType().max(20).optional(),
	sourceType: enumType([
		"url",
		"spotify",
		"google-drive"
	]).optional()
});
function extractSpotifyTrackId(url) {
	const match = url.match(/(?:open\.spotify\.com\/(?:intl-[a-z]{2}\/)?track\/|spotify:track:)([a-zA-Z0-9]{22})/i);
	return match ? match[1] : null;
}
function extractGoogleDriveFileId(url) {
	const match = url.match(/(?:\/file\/d\/|[?&]id=)([a-zA-Z0-9_-]{20,})/i);
	return match ? match[1] : null;
}
function validateUrlProtocolAndHost(urlString) {
	try {
		const parsed = new URL(urlString);
		if (!["http:", "https:"].includes(parsed.protocol)) return false;
		const hostname = parsed.hostname.toLowerCase();
		if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1" || hostname.startsWith("10.") || hostname.startsWith("192.168.") || hostname.startsWith("172.16.") || hostname.startsWith("169.254.") || hostname.endsWith(".internal") || hostname.endsWith(".local")) return false;
		return true;
	} catch {
		return false;
	}
}
var Route$7 = createFileRoute("/api/media/url")({ server: { handlers: { POST: async ({ request }) => {
	const auth = requireAdmin(request);
	if ("errorResponse" in auth) return auth.errorResponse;
	const rateCheck = checkRateLimit(request, mutationRateLimiter);
	if (!rateCheck.allowed) return createRateLimitResponse(rateCheck.retryAfterSeconds);
	try {
		await dbConnect();
		const rawBody = await request.json().catch(() => null);
		if (!rawBody || typeof rawBody !== "object") return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const parsed = MediaUrlSchema.safeParse(sanitizeMongoInput(rawBody));
		if (!parsed.success) return new Response(JSON.stringify({ error: parsed.error.issues[0]?.message || "Validation failed" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const { title, url, type, artist, category, memoryDate, sourceType } = parsed.data;
		if (!validateUrlProtocolAndHost(url)) return new Response(JSON.stringify({ error: "Invalid or unsupported URL protocol/host" }), {
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
			} else if (isGoogleDrive) {
				const fileId = extractGoogleDriveFileId(trimmedUrl);
				if (!fileId) return new Response(JSON.stringify({ error: "Invalid Google Drive URL" }), {
					status: 400,
					headers: { "Content-Type": "application/json" }
				});
				determinedSource = "google-drive";
				canonicalUrl = `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
			}
		}
		if (await MediaItem.findOne({
			type,
			url: canonicalUrl
		})) return new Response(JSON.stringify({ error: "This media URL has already been added." }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const mediaItem = new MediaItem({
			type,
			source: determinedSource,
			title: sanitizePlainText(title, 150),
			artist: type === "song" ? sanitizePlainText(artist || "Unknown Artist", 100) : void 0,
			url: canonicalUrl,
			memoryDate: sanitizePlainText(memoryDate, 20) || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
			category: sanitizePlainText(category || "Favorites", 50)
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
var Route$6 = createFileRoute("/api/photos/$id")({ server: { handlers: { DELETE: async ({ params, request }) => {
	const auth = requireAdmin(request);
	if ("errorResponse" in auth) return auth.errorResponse;
	try {
		await dbConnect();
		const { id } = params;
		if (!isValidObjectId(id)) return new Response(JSON.stringify({ error: "Invalid photo ID format" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const item = await MediaItem.findById(id) || await Photo.findById(id);
		if (!item) return new Response(JSON.stringify({ error: "Photo not found" }), {
			status: 404,
			headers: { "Content-Type": "application/json" }
		});
		const db = import_mongoose.default.connection.db;
		if (db && item.fileId) {
			const bucket = new import_mongoose.default.mongo.GridFSBucket(db, { bucketName: "media" });
			try {
				await bucket.delete(new import_mongoose.default.Types.ObjectId(item.fileId));
			} catch (err) {
				console.warn("GridFS file deletion warning (may already be deleted):", err);
			}
		}
		await MediaItem.findByIdAndDelete(id);
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
var Route$5 = createFileRoute("/api/songs/$id")({ server: { handlers: { DELETE: async ({ params, request }) => {
	const auth = requireAdmin(request);
	if ("errorResponse" in auth) return auth.errorResponse;
	try {
		await dbConnect();
		const { id } = params;
		if (!isValidObjectId(id)) return new Response(JSON.stringify({ error: "Invalid song ID format" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const item = await MediaItem.findById(id) || await Song.findById(id);
		if (!item) return new Response(JSON.stringify({ error: "Song not found" }), {
			status: 404,
			headers: { "Content-Type": "application/json" }
		});
		const db = import_mongoose.default.connection.db;
		if (db) {
			const bucket = new import_mongoose.default.mongo.GridFSBucket(db, { bucketName: "media" });
			if (item.fileId) try {
				await bucket.delete(new import_mongoose.default.Types.ObjectId(item.fileId));
			} catch (err) {
				console.warn("GridFS audio file deletion warning:", err);
			}
			if (item.coverFileId) try {
				await bucket.delete(new import_mongoose.default.Types.ObjectId(item.coverFileId));
			} catch (err) {
				console.warn("GridFS cover file deletion warning:", err);
			}
		}
		await MediaItem.findByIdAndDelete(id);
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
		const auth = requireAdmin(request);
		if ("errorResponse" in auth) return auth.errorResponse;
		try {
			await dbConnect();
			const { id } = params;
			if (!isValidObjectId(id)) return new Response(JSON.stringify({ error: "Invalid timeline ID format" }), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
			const milestone = await Timeline.findById(id);
			if (!milestone) return new Response(JSON.stringify({ error: "Timeline item not found" }), {
				status: 404,
				headers: { "Content-Type": "application/json" }
			});
			const formData = await request.formData();
			const rawTitle = formData.get("title");
			const rawDescription = formData.get("description");
			const rawDate = formData.get("date");
			const rawMemoryDate = formData.get("memoryDate");
			const rawLocation = formData.get("location");
			const rawIcon = formData.get("icon");
			const highlight = formData.get("highlight") === "true";
			const imageFile = formData.get("imageFile");
			const videoFile = formData.get("videoFile");
			const deleteImage = formData.get("deleteImage") === "true";
			const deleteVideo = formData.get("deleteVideo") === "true";
			if (rawTitle !== null) {
				const cleanTitle = sanitizePlainText(rawTitle, 150);
				if (cleanTitle) milestone.title = cleanTitle;
			}
			if (rawDescription !== null) milestone.description = sanitizePlainText(rawDescription, 1e3);
			if (rawDate !== null) milestone.date = sanitizePlainText(rawDate, 50);
			if (rawMemoryDate !== null) milestone.memoryDate = sanitizePlainText(rawMemoryDate, 20);
			if (rawLocation !== null) milestone.location = sanitizePlainText(rawLocation, 100);
			if (rawIcon !== null) {
				if ([
					"heart",
					"coffee",
					"sparkles",
					"plane",
					"star"
				].includes(rawIcon)) milestone.icon = rawIcon;
			}
			milestone.highlight = highlight;
			const db = import_mongoose.default.connection.db;
			if (!db) return new Response(JSON.stringify({ error: "Database connection unavailable" }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
			const bucket = new import_mongoose.default.mongo.GridFSBucket(db, { bucketName: "media" });
			if (deleteImage || imageFile && imageFile instanceof File && imageFile.size > 0) {
				if (milestone.imageFileId) {
					try {
						await bucket.delete(new import_mongoose.default.Types.ObjectId(milestone.imageFileId));
					} catch (err) {
						console.warn("GridFS old image delete warning:", err);
					}
					milestone.imageFileId = void 0;
				}
			}
			if (imageFile && imageFile instanceof File && imageFile.size > 0) {
				const imageArrayBuffer = await imageFile.arrayBuffer();
				const imageBuffer = Buffer.from(imageArrayBuffer);
				const imageValidation = validateMediaUpload(imageBuffer, imageFile.name, imageFile.type, "image");
				if (!imageValidation.valid) return new Response(JSON.stringify({ error: imageValidation.error }), {
					status: 400,
					headers: { "Content-Type": "application/json" }
				});
				milestone.imageFileId = await new Promise((resolve, reject) => {
					const uploadStream = bucket.openUploadStream(imageValidation.safeFilename, { contentType: imageValidation.detectedMimeType || "image/jpeg" });
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
			if (deleteVideo || videoFile && videoFile instanceof File && videoFile.size > 0) {
				if (milestone.videoFileId) {
					try {
						await bucket.delete(new import_mongoose.default.Types.ObjectId(milestone.videoFileId));
					} catch (err) {
						console.warn("GridFS old video delete warning:", err);
					}
					milestone.videoFileId = void 0;
				}
			}
			if (videoFile && videoFile instanceof File && videoFile.size > 0) {
				const videoArrayBuffer = await videoFile.arrayBuffer();
				const videoBuffer = Buffer.from(videoArrayBuffer);
				const videoValidation = validateMediaUpload(videoBuffer, videoFile.name, videoFile.type, "video");
				if (!videoValidation.valid) return new Response(JSON.stringify({ error: videoValidation.error }), {
					status: 400,
					headers: { "Content-Type": "application/json" }
				});
				milestone.videoFileId = await new Promise((resolve, reject) => {
					const uploadStream = bucket.openUploadStream(videoValidation.safeFilename, { contentType: videoValidation.detectedMimeType || "video/mp4" });
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
	DELETE: async ({ params, request }) => {
		const auth = requireAdmin(request);
		if ("errorResponse" in auth) return auth.errorResponse;
		try {
			await dbConnect();
			const { id } = params;
			if (!isValidObjectId(id)) return new Response(JSON.stringify({ error: "Invalid timeline ID format" }), {
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
					await bucket.delete(new import_mongoose.default.Types.ObjectId(milestone.imageFileId));
				} catch (err) {
					console.warn("GridFS image delete warning:", err);
				}
				if (milestone.videoFileId) try {
					await bucket.delete(new import_mongoose.default.Types.ObjectId(milestone.videoFileId));
				} catch (err) {
					console.warn("GridFS video delete warning:", err);
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
	const auth = requireAdmin(request);
	if ("errorResponse" in auth) return auth.errorResponse;
	try {
		await dbConnect();
		const { id } = params;
		if (!isValidObjectId(id)) return new Response(JSON.stringify({ error: "Invalid user ID format" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		if (auth.session.userId === id) return new Response(JSON.stringify({ error: "Cannot delete your own active user account" }), {
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
var Route$2 = createFileRoute("/api/videos/$id")({ server: { handlers: { DELETE: async ({ params, request }) => {
	const auth = requireAdmin(request);
	if ("errorResponse" in auth) return auth.errorResponse;
	try {
		await dbConnect();
		const { id } = params;
		if (!isValidObjectId(id)) return new Response(JSON.stringify({ error: "Invalid video ID format" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const item = await MediaItem.findById(id) || await Video$1.findById(id);
		if (!item) return new Response(JSON.stringify({ error: "Video not found" }), {
			status: 404,
			headers: { "Content-Type": "application/json" }
		});
		const db = import_mongoose.default.connection.db;
		if (db && item.fileId) {
			const bucket = new import_mongoose.default.mongo.GridFSBucket(db, { bucketName: "media" });
			try {
				await bucket.delete(new import_mongoose.default.Types.ObjectId(item.fileId));
			} catch (err) {
				console.warn("GridFS file deletion warning (may already be deleted):", err);
			}
		}
		await MediaItem.findByIdAndDelete(id);
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
var EditMediaSchema = objectType({
	title: stringType().min(1).max(150).optional(),
	artist: stringType().max(100).optional(),
	memoryDate: stringType().max(20).optional(),
	category: stringType().max(50).optional(),
	favorite: booleanType().optional()
});
var Route$1 = createFileRoute("/api/media/edit/$id")({ server: { handlers: { PUT: async ({ params, request }) => {
	const auth = requireAdmin(request);
	if ("errorResponse" in auth) return auth.errorResponse;
	try {
		await dbConnect();
		const { id } = params;
		if (!isValidObjectId(id)) return new Response(JSON.stringify({ error: "Invalid document ID format" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const rawBody = await request.json().catch(() => null);
		if (!rawBody || typeof rawBody !== "object") return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const parsed = EditMediaSchema.safeParse(sanitizeMongoInput(rawBody));
		if (!parsed.success) return new Response(JSON.stringify({ error: parsed.error.issues[0]?.message || "Validation failed" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const updateData = {};
		if (parsed.data.title !== void 0) updateData.title = sanitizePlainText(parsed.data.title, 150);
		if (parsed.data.artist !== void 0) updateData.artist = sanitizePlainText(parsed.data.artist, 100);
		if (parsed.data.memoryDate !== void 0) updateData.memoryDate = sanitizePlainText(parsed.data.memoryDate, 20);
		if (parsed.data.category !== void 0) updateData.category = sanitizePlainText(parsed.data.category, 50);
		if (parsed.data.favorite !== void 0) updateData.favorite = parsed.data.favorite;
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
		if (!isValidObjectId(fileId)) return new Response(JSON.stringify({ error: "Invalid file ID format" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const db = import_mongoose.default.connection.db;
		if (!db) return new Response(JSON.stringify({ error: "Database connection unavailable" }), {
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
		if (rangeHeader && fileSize > 0) {
			const parts = rangeHeader.replace(/bytes=/, "").split("-");
			const start = parseInt(parts[0], 10) || 0;
			const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
			const safeEnd = Math.min(end, fileSize - 1);
			const chunksize = safeEnd - start + 1;
			const downloadStream = bucket.openDownloadStream(objectId, {
				start,
				end: safeEnd + 1
			});
			const readable = new ReadableStream({
				start(controller) {
					downloadStream.on("data", (chunk) => controller.enqueue(chunk));
					downloadStream.on("end", () => controller.close());
					downloadStream.on("error", (err) => controller.error(err));
				},
				cancel() {
					downloadStream.destroy();
				}
			});
			return new Response(readable, {
				status: 206,
				headers: {
					"Content-Range": `bytes ${start}-${safeEnd}/${fileSize}`,
					"Accept-Ranges": "bytes",
					"Content-Length": chunksize.toString(),
					"Content-Type": contentType,
					"X-Content-Type-Options": "nosniff"
				}
			});
		} else {
			const downloadStream = bucket.openDownloadStream(objectId);
			const readable = new ReadableStream({
				start(controller) {
					downloadStream.on("data", (chunk) => controller.enqueue(chunk));
					downloadStream.on("end", () => controller.close());
					downloadStream.on("error", (err) => controller.error(err));
				},
				cancel() {
					downloadStream.destroy();
				}
			});
			return new Response(readable, {
				status: 200,
				headers: {
					"Content-Length": fileSize.toString(),
					"Content-Type": contentType,
					"Accept-Ranges": "bytes",
					"X-Content-Type-Options": "nosniff"
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
var IndexRoute = Route$31.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$32
});
var AdminRoute = Route$30.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$32
});
var FunRoute = Route$29.update({
	id: "/fun",
	path: "/fun",
	getParentRoute: () => Route$32
});
var LettersRoute = Route$28.update({
	id: "/letters",
	path: "/letters",
	getParentRoute: () => Route$32
});
var LoginRoute = Route$27.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$32
});
var PhotosRoute = Route$26.update({
	id: "/photos",
	path: "/photos",
	getParentRoute: () => Route$32
});
var SongsRoute = Route$25.update({
	id: "/songs",
	path: "/songs",
	getParentRoute: () => Route$32
});
var TimelineRoute = Route$24.update({
	id: "/timeline",
	path: "/timeline",
	getParentRoute: () => Route$32
});
var VideosRoute = Route$23.update({
	id: "/videos",
	path: "/videos",
	getParentRoute: () => Route$32
});
var ApiLettersRoute = Route$22.update({
	id: "/api/letters",
	path: "/api/letters",
	getParentRoute: () => Route$32
});
var ApiMediaRoute = Route$21.update({
	id: "/api/media",
	path: "/api/media",
	getParentRoute: () => Route$32
});
var ApiPhotosRoute = Route$20.update({
	id: "/api/photos",
	path: "/api/photos",
	getParentRoute: () => Route$32
});
var ApiSongsRoute = Route$19.update({
	id: "/api/songs",
	path: "/api/songs",
	getParentRoute: () => Route$32
});
var ApiTimelineRoute = Route$18.update({
	id: "/api/timeline",
	path: "/api/timeline",
	getParentRoute: () => Route$32
});
var ApiUsersRoute = Route$17.update({
	id: "/api/users",
	path: "/api/users",
	getParentRoute: () => Route$32
});
var ApiVideosRoute = Route$16.update({
	id: "/api/videos",
	path: "/api/videos",
	getParentRoute: () => Route$32
});
var ApiAuthAdminRoute = Route$15.update({
	id: "/api/auth/admin",
	path: "/api/auth/admin",
	getParentRoute: () => Route$32
});
var ApiAuthLoginRoute = Route$14.update({
	id: "/api/auth/login",
	path: "/api/auth/login",
	getParentRoute: () => Route$32
});
var ApiAuthLogoutRoute = Route$13.update({
	id: "/api/auth/logout",
	path: "/api/auth/logout",
	getParentRoute: () => Route$32
});
var ApiAuthSessionRoute = Route$12.update({
	id: "/api/auth/session",
	path: "/api/auth/session",
	getParentRoute: () => Route$32
});
var ApiFunStagesRoute = Route$11.update({
	id: "/api/fun/stages",
	path: "/api/fun/stages",
	getParentRoute: () => Route$32
});
var ApiLettersIdRoute = Route$10.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => ApiLettersRoute
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
var ApiMediaEditIdRoute = Route$1.update({
	id: "/edit/$id",
	path: "/edit/$id",
	getParentRoute: () => ApiMediaRoute
});
var ApiMediaFileFileIdRoute = Route.update({
	id: "/file/$fileId",
	path: "/file/$fileId",
	getParentRoute: () => ApiMediaRoute
});
var ApiLettersRouteChildren = { ApiLettersIdRoute };
var ApiLettersRouteWithChildren = ApiLettersRoute._addFileChildren(ApiLettersRouteChildren);
var ApiMediaRouteChildren = {
	ApiMediaIdRoute,
	ApiMediaUploadRoute,
	ApiMediaUrlRoute,
	ApiMediaEditIdRoute,
	ApiMediaFileFileIdRoute
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
	ApiLettersRoute: ApiLettersRouteWithChildren,
	ApiMediaRoute: ApiMediaRouteWithChildren,
	ApiPhotosRoute: ApiPhotosRouteWithChildren,
	ApiSongsRoute: ApiSongsRouteWithChildren,
	ApiTimelineRoute: ApiTimelineRouteWithChildren,
	ApiUsersRoute: ApiUsersRouteWithChildren,
	ApiVideosRoute: ApiVideosRoute._addFileChildren(ApiVideosRouteChildren),
	ApiAuthAdminRoute,
	ApiAuthLoginRoute,
	ApiAuthLogoutRoute,
	ApiAuthSessionRoute,
	ApiFunStagesRoute
};
var routeTree = Route$32._addFileChildren(rootRouteChildren)._addFileTypes();
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
