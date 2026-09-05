import { o as __toESM } from "../_runtime.mjs";
import { a as require_react, o as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { A as Lock, F as Heart, i as User, q as ArrowRight } from "../_libs/lucide-react.mjs";
import { v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-nqSf7xLp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginComponent() {
	const [username, setUsername] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const router = useRouter();
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!password.trim()) {
			toast.error("Please enter a password");
			return;
		}
		setLoading(true);
		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					username,
					password
				})
			});
			const data = await res.json();
			if (res.ok && data.success) {
				toast.success("Welcome back 💖");
				router.invalidate();
				if (data.role === "admin") window.location.href = "/admin";
				else window.location.href = "/";
			} else toast.error(data.error || "Incorrect username or password");
		} catch (err) {
			console.error(err);
			toast.error(err.message || "Something went wrong. Please try again.");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-screen flex items-center justify-center p-4 bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 overflow-hidden pointer-events-none",
			children: [
				0,
				1,
				2,
				3,
				4
			].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {
				className: "animate-float-up absolute bottom-0 size-6 text-primary/10",
				fill: "currentColor",
				style: {
					left: `${15 + i * 20}%`,
					animationDuration: `${12 + i * 3}s`,
					animationDelay: `${i * 1.5}s`
				}
			}, i))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md glass rounded-[32px] p-8 sm:p-10 border border-border shadow-2xl relative z-10 animate-letter-open text-center space-y-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "size-16 rounded-3xl bg-[var(--gradient-love)] text-primary-foreground grid place-items-center shadow-lg animate-pulse",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {
								className: "size-8",
								fill: "currentColor"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-6 text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-display",
							children: "Our Love Story"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: "Enter password to unlock our shared memories"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					className: "space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: username,
								onChange: (e) => setUsername(e.target.value),
								placeholder: "Username...",
								className: "w-full pl-11 pr-4 py-3.5 text-sm bg-surface/30 border border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-sans"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								value: password,
								onChange: (e) => setPassword(e.target.value),
								placeholder: "Enter password...",
								className: "w-full pl-11 pr-4 py-3.5 text-sm bg-surface/30 border border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-sans"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							disabled: loading,
							className: "w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold btn-love shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group transition-all",
							children: [loading ? "Unlocking..." : "Unlock Story", !loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4 group-hover:translate-x-1 transition-transform" })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Made with love, forever and always."
				})
			]
		})]
	});
}
//#endregion
export { LoginComponent as component };
