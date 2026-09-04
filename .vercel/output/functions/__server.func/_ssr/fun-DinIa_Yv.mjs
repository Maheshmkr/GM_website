import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { a as require_react, o as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { A as Image, V as ArrowLeft, f as RotateCcw, s as Sparkles } from "../_libs/lucide-react.mjs";
import { t as SectionHeading } from "./SectionHeading-BVG9eVYl.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { o as photos, t as funZoneConfig } from "./site-_zOoiwhn.mjs";
import { t as Reveal } from "./Reveal-DSJJWaqp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fun-DinIa_Yv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ACTIONS = [
	{
		id: "stone",
		label: "Stone",
		icon: "🪨",
		description: "Throw a cartoon stone!",
		color: "hover:border-amber-500/60 hover:shadow-amber-500/20"
	},
	{
		id: "hand",
		label: "Hand",
		icon: "✋",
		description: "Give a quick tap!",
		color: "hover:border-sky-500/60 hover:shadow-sky-500/20"
	},
	{
		id: "punch",
		label: "Punch",
		icon: "👊",
		description: "Deliver a knockout POW!",
		color: "hover:border-rose-500/60 hover:shadow-rose-500/20"
	},
	{
		id: "hit",
		label: "Hit",
		icon: "💥",
		description: "Fast cartoon impact!",
		color: "hover:border-yellow-500/60 hover:shadow-yellow-500/20"
	},
	{
		id: "slap",
		label: "Slap",
		icon: "👋",
		description: "Playful cheek smack!",
		color: "hover:border-pink-500/60 hover:shadow-pink-500/20"
	},
	{
		id: "love",
		label: "Love",
		icon: "❤️",
		description: "Shower with hearts & love!",
		color: "hover:border-primary/80 hover:shadow-primary/30"
	}
];
function FunActions({ selectedAction, onSelectAction, onReset, isReacting }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center gap-4 w-full",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "glass w-full rounded-3xl p-3 sm:p-4 shadow-xl border border-white/10 backdrop-blur-2xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3",
				children: ACTIONS.map((act) => {
					const isSelected = selectedAction === act.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => onSelectAction(act.id),
						"aria-label": `Select ${act.label} action`,
						"aria-pressed": isSelected,
						title: act.description,
						className: cn("group relative flex flex-col items-center justify-center rounded-2xl py-3 px-2 transition-all duration-300 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-primary", isSelected ? "bg-primary/20 border-2 border-primary shadow-[0_0_20px_rgba(244,114,182,0.4)] scale-105" : "glass hover:bg-white/10 hover:scale-102 border border-white/5", act.color),
						children: [
							isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[9px] text-white shadow-md animate-pulse",
								children: "✓"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-2xl sm:text-3xl transition-transform duration-300 group-hover:scale-110",
								children: act.icon
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("mt-1 text-xs font-semibold tracking-wide transition-colors", isSelected ? "text-primary" : "text-foreground/80 group-hover:text-foreground"),
								children: act.label
							})
						]
					}, act.id);
				})
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between w-full px-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted-foreground font-medium",
				children: selectedAction ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1.5 text-primary font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: ACTIONS.find((a) => a.id === selectedAction)?.icon }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [ACTIONS.find((a) => a.id === selectedAction)?.label, " action ready!"] })]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tip: Select an action button above to start." })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: onReset,
				disabled: !selectedAction && !isReacting,
				"aria-label": "Reset action and restore picture",
				className: cn("glass rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary", selectedAction || isReacting ? "text-destructive hover:bg-destructive/15 border-destructive/30 hover:scale-105" : "text-muted-foreground/40 opacity-50 cursor-not-allowed border-white/5"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Reset" })]
			})]
		})]
	});
}
var ACTION_COMIC_TEXTS = {
	stone: {
		text: "BONK!",
		color: "from-amber-400 to-orange-500",
		subText: "🪨 Dust Everywhere!"
	},
	hand: {
		text: "THWACK!",
		color: "from-sky-400 to-indigo-500",
		subText: "✋ Ouch!"
	},
	punch: {
		text: "POW!",
		color: "from-rose-500 to-red-600",
		subText: "💥 Knockout!"
	},
	hit: {
		text: "BAM!",
		color: "from-amber-300 to-yellow-500",
		subText: "⚡ Direct Hit!"
	},
	slap: {
		text: "SMACK!",
		color: "from-pink-400 to-rose-500",
		subText: "👋 Red Cheek!"
	},
	love: {
		text: "LOVE! ❤️",
		color: "from-pink-400 to-purple-500",
		subText: "💕 So Much Love!"
	}
};
var ACTION_PARTICLES = {
	stone: [
		"🪨",
		"✨",
		"💨",
		"💥",
		"⭐"
	],
	hand: [
		"✋",
		"💥",
		"💫",
		"✨",
		"⚡"
	],
	punch: [
		"💥",
		"👊",
		"⭐",
		"💫",
		"✨",
		"⚡"
	],
	hit: [
		"💥",
		"⚡",
		"✨",
		"🔥",
		"⭐"
	],
	slap: [
		"👋",
		"💥",
		"💨",
		"✨",
		"⭐"
	],
	love: [
		"❤️",
		"💖",
		"💕",
		"✨",
		"💗",
		"🥰"
	]
};
function ImpactEffect({ action, clickPos, triggerId }) {
	const [particles, setParticles] = (0, import_react.useState)([]);
	const [activeText, setActiveText] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!action || triggerId === 0) return;
		const comicInfo = ACTION_COMIC_TEXTS[action];
		const particleTemplates = ACTION_PARTICLES[action];
		const posX = clickPos?.x ?? 50;
		const posY = clickPos?.y ?? 50;
		setActiveText({
			...comicInfo,
			x: posX,
			y: posY
		});
		const count = action === "love" ? 18 : 14;
		const newParticles = Array.from({ length: count }, (_, i) => {
			const angle = i / count * 2 * Math.PI + (Math.random() * .4 - .2);
			const distance = 40 + Math.random() * 90;
			return {
				id: Date.now() + i,
				x: posX,
				y: posY,
				size: 18 + Math.random() * 16,
				dx: Math.cos(angle) * distance,
				dy: Math.sin(angle) * distance - (action === "love" ? 40 : 10),
				rotation: Math.random() * 360 - 180,
				content: particleTemplates[i % particleTemplates.length]
			};
		});
		setParticles(newParticles);
		const timer = setTimeout(() => {
			setParticles([]);
			setActiveText(null);
		}, 850);
		return () => clearTimeout(timer);
	}, [
		action,
		clickPos,
		triggerId
	]);
	if (!action || triggerId === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "aria-hidden pointer-events-none absolute inset-0 z-30 overflow-hidden rounded-3xl",
		children: [activeText && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute z-40 -translate-x-1/2 -translate-y-1/2 text-center",
			style: {
				left: `${activeText.x}%`,
				top: `${Math.max(15, activeText.y - 10)}%`
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `animate-comic-pop inline-block rounded-2xl bg-gradient-to-r ${activeText.color} px-5 py-2 text-2xl font-black tracking-wider text-white shadow-2xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] md:text-4xl`,
				children: activeText.text
			}), activeText.subText && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 text-xs font-bold text-white/90 drop-shadow md:text-sm",
				children: activeText.subText
			})]
		}), particles.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute select-none transition-all duration-700 ease-out",
			style: {
				left: `${p.x}%`,
				top: `${p.y}%`,
				fontSize: `${p.size}px`,
				transform: `translate(-50%, -50%) translate(${p.dx}px, ${p.dy}px) rotate(${p.rotation}deg)`,
				opacity: 0,
				animation: "particle-burst 0.75s ease-out forwards",
				filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.4))"
			},
			children: p.content
		}, p.id))]
	});
}
function DamageOverlay({ damageLevel }) {
	if (damageLevel <= 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "aria-hidden pointer-events-none absolute inset-0 z-15 overflow-hidden rounded-2xl select-none",
		children: [
			damageLevel >= 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-[48%] right-[18%] w-14 h-14 rounded-full bg-rose-600/40 blur-md" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute top-[50%] right-[22%] w-10 h-6 flex items-center justify-center -rotate-12 drop-shadow",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					viewBox: "0 0 40 24",
					className: "w-full h-full text-red-500 fill-none stroke-current stroke-[2.5]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M 5,12 Q 15,4 25,12 T 35,8",
						strokeLinecap: "round"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M 12,18 L 24,6",
						strokeLinecap: "round"
					})]
				})
			})] }),
			damageLevel >= 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-[42%] left-[18%] w-16 h-16 rounded-full bg-gradient-to-br from-purple-700/60 via-indigo-600/50 to-rose-600/40 blur-[2px] border border-purple-400/40 shadow-inner" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute top-[46%] left-[22%] w-9 h-6 rotate-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					viewBox: "0 0 30 20",
					className: "w-full h-full text-amber-300 stroke-current stroke-2 fill-none",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M 4,6 L 24,14",
						strokeLinecap: "round"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M 8,16 L 22,4",
						strokeLinecap: "round"
					})]
				})
			})] }),
			damageLevel >= 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute top-[18%] left-[30%] w-[40%] h-[11%] -rotate-6 bg-gradient-to-r from-amber-100 via-stone-100 to-amber-100 border-2 border-amber-300/90 rounded-lg shadow-lg flex items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-7 h-full bg-amber-200/70 border-x border-amber-300/70 flex items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] font-bold text-amber-800/80 select-none",
						children: "✚"
					})
				})
			}) }),
			damageLevel >= 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute top-[54%] right-[16%] w-10 h-10 flex items-center justify-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute w-9 h-3.5 bg-amber-100 border-2 border-amber-300/90 rounded rotate-45 shadow-md" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute w-9 h-3.5 bg-amber-100 border-2 border-amber-300/90 rounded -rotate-45 shadow-md" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute top-[72%] left-[40%] w-14 h-7 opacity-90",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					viewBox: "0 0 40 20",
					className: "w-full h-full text-rose-500 fill-none stroke-current stroke-[2.5]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M 6,10 L 18,14",
						strokeLinecap: "round"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M 22,6 L 34,12",
						strokeLinecap: "round"
					})]
				})
			})] }),
			damageLevel >= 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute top-[2%] inset-x-0 flex justify-center items-center gap-2 animate-bounce",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xl animate-spin",
							children: "💫"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-2xl animate-pulse",
							children: "⭐"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xl animate-spin",
							children: "💫"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute top-[40%] left-[14%] w-9 h-9 flex items-center justify-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute w-8 h-3 bg-yellow-100 border border-yellow-400 rounded rotate-30 shadow-sm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute w-8 h-3 bg-yellow-100 border border-yellow-400 rounded -rotate-60 shadow-sm" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute top-[24%] right-[12%] text-2xl animate-pulse",
					children: "💧"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute top-[4%] right-[4%] bg-red-600/90 text-white font-black text-[10px] tracking-wider px-2 py-0.5 rounded-full border border-red-300 shadow-lg animate-pulse",
					children: "MAX DAMAGE! 😵"
				})
			] })
		]
	});
}
function FunCharacter({ imageSrc, characterName, selectedAction, isReacting, activeAction, damageLevel, onTap, triggerId }) {
	const [clickPos, setClickPos] = (0, import_react.useState)(null);
	const containerRef = (0, import_react.useRef)(null);
	const handlePointerDown = (e) => {
		if (!containerRef.current) return;
		const rect = containerRef.current.getBoundingClientRect();
		let clientX = 0;
		let clientY = 0;
		if ("touches" in e) {
			if (e.touches.length > 0) {
				clientX = e.touches[0].clientX;
				clientY = e.touches[0].clientY;
			}
		} else {
			clientX = e.clientX;
			clientY = e.clientY;
		}
		const pos = {
			x: Math.max(10, Math.min(90, (clientX - rect.left) / rect.width * 100)),
			y: Math.max(10, Math.min(90, (clientY - rect.top) / rect.height * 100))
		};
		setClickPos(pos);
		onTap(pos);
	};
	const getAnimationClass = () => {
		if (!isReacting || !activeAction) return "";
		switch (activeAction) {
			case "stone": return "animate-stone-shake";
			case "hand": return "animate-hand-thwack";
			case "punch": return "animate-punch-pop";
			case "hit": return "animate-hit-shake";
			case "slap": return "animate-slap-smack";
			case "love": return "animate-love-bounce";
			default: return "";
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "relative flex flex-col items-center justify-center w-full max-w-md mx-auto my-3 sm:my-5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("relative w-full aspect-[4/5] sm:aspect-square rounded-3xl p-3 sm:p-4 transition-all duration-500", "glass border border-white/15 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)]", selectedAction === "love" && isReacting && "shadow-[0_0_80px_rgba(244,114,182,0.6)] border-primary/60", selectedAction === "punch" && isReacting && "shadow-[0_0_80px_rgba(239,68,68,0.6)] border-red-500/60", selectedAction === "stone" && isReacting && "shadow-[0_0_80px_rgba(245,158,11,0.6)] border-amber-500/60"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: containerRef,
				onClick: handlePointerDown,
				role: "button",
				tabIndex: 0,
				"aria-label": `Character ${characterName}. Click or tap to react!`,
				onKeyDown: (e) => {
					if (e.key === "Enter" || e.key === " ") {
						setClickPos({
							x: 50,
							y: 50
						});
						onTap({
							x: 50,
							y: 50
						});
					}
				},
				className: cn("group relative w-full h-full rounded-2xl overflow-hidden cursor-pointer select-none outline-none focus-visible:ring-4 focus-visible:ring-primary/60 transition-transform duration-300", "hover:scale-[1.02] active:scale-[0.98]", getAnimationClass()),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: imageSrc,
						alt: characterName,
						className: "w-full h-full object-cover object-center select-none pointer-events-none transition-all duration-300"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DamageOverlay, { damageLevel }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute bottom-3 inset-x-3 flex justify-center pointer-events-none z-25",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("glass px-3.5 py-1.5 rounded-full text-xs font-semibold text-white tracking-wide transition-all duration-300 shadow-lg backdrop-blur-md", selectedAction ? "bg-primary/40 border-primary/50 text-white animate-pulse" : "bg-black/40 border-white/10 text-white/90 group-hover:bg-primary/30"),
							children: selectedAction ? `Tap to use ${selectedAction.toUpperCase()}! ✨` : "Select an action below & tap me! ✨"
						})
					}),
					isReacting && activeAction === "stone" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "aria-hidden pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-start pt-6 animate-pulse",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-4xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]",
							children: "💥🪨"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-black text-amber-300 bg-black/60 px-2 py-0.5 rounded-full mt-1",
							children: "Ouch! Bump!"
						})]
					}),
					isReacting && activeAction === "hand" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "aria-hidden pointer-events-none absolute inset-0 z-20 flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-6xl opacity-85 rotate-[-15deg] drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]",
							children: "✋"
						})
					}),
					isReacting && activeAction === "punch" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "aria-hidden pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-6xl animate-spin text-amber-300 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]",
							children: "💫"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xl font-extrabold text-red-400 bg-black/70 px-3 py-1 rounded-full mt-2",
							children: "DIZZY!"
						})]
					}),
					isReacting && activeAction === "hit" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "aria-hidden pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-amber-400/20 backdrop-brightness-125",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-7xl animate-ping opacity-90",
							children: "💥"
						})
					}),
					isReacting && activeAction === "slap" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "aria-hidden pointer-events-none absolute inset-0 z-20 flex items-center justify-end pr-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-16 h-16 rounded-full bg-red-500/40 blur-md border-2 border-red-400 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute text-4xl right-6",
							children: "👋"
						})]
					}),
					isReacting && activeAction === "love" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "aria-hidden pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-pink-500/15 backdrop-brightness-110",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-6xl animate-bounce drop-shadow-[0_0_20px_rgba(244,114,182,0.8)]",
							children: "🥰"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImpactEffect, {
						action: activeAction,
						clickPos,
						triggerId
					})
				]
			})
		})
	});
}
var DAMAGE_DESCRIPTIONS = [
	{
		level: 0,
		text: "Normal 🙂",
		detail: "No damage",
		color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
	},
	{
		level: 1,
		text: "Small Hit 🩹",
		detail: "Tiny cheek scratch",
		color: "text-amber-400 bg-amber-500/10 border-amber-500/30"
	},
	{
		level: 2,
		text: "Bruised 😣",
		detail: "Cartoon cheek bruise",
		color: "text-orange-400 bg-orange-500/10 border-orange-500/30"
	},
	{
		level: 3,
		text: "Bandaged 🩹",
		detail: "Forehead cartoon bandage",
		color: "text-rose-400 bg-rose-500/10 border-rose-500/30"
	},
	{
		level: 4,
		text: "Heavy Damage 😵",
		detail: "Scratches & cross-bandages",
		color: "text-red-400 bg-red-500/10 border-red-500/30"
	},
	{
		level: 5,
		text: "MAX DAMAGE! 💫",
		detail: "Exaggerated cartoon state!",
		color: "text-purple-400 bg-purple-500/20 border-purple-500/50 animate-pulse"
	}
];
function FunZone() {
	const [selectedAction, setSelectedAction] = (0, import_react.useState)(null);
	const [activeAction, setActiveAction] = (0, import_react.useState)(null);
	const [isReacting, setIsReacting] = (0, import_react.useState)(false);
	const [damageLevel, setDamageLevel] = (0, import_react.useState)(0);
	const [triggerId, setTriggerId] = (0, import_react.useState)(0);
	const availableImages = [{
		src: funZoneConfig.characterImage,
		label: "Default Hero"
	}, ...photos.slice(0, 5).map((p, idx) => ({
		src: p.image,
		label: p.caption || `Photo ${idx + 1}`
	}))];
	const [currentImageIndex, setCurrentImageIndex] = (0, import_react.useState)(0);
	const currentImage = availableImages[currentImageIndex]?.src || funZoneConfig.characterImage;
	const handleSelectAction = (action) => {
		setSelectedAction(action);
		const actDef = ACTIONS.find((a) => a.id === action);
		if (actDef) toast.info(`${actDef.icon} ${actDef.label} selected — now tap the picture!`, { duration: 1800 });
	};
	const handleTapCharacter = (clickPos) => {
		if (!selectedAction) {
			toast.warning("Please select an action from the toolbar below first!", { icon: "👇" });
			return;
		}
		setActiveAction(selectedAction);
		setIsReacting(true);
		setTriggerId((prev) => prev + 1);
		if (selectedAction !== "love") setDamageLevel((prev) => {
			const next = Math.min(prev + 1, 5);
			if (next === 5 && prev < 5) toast.error("MAX DAMAGE REACHED! 💫 Bandages & bruises everywhere!", { duration: 2500 });
			return next;
		});
		else setDamageLevel((prev) => {
			if (prev > 0) {
				toast.success("❤️ Love healed a bit of damage!", { duration: 1800 });
				return Math.max(0, prev - 1);
			}
			return 0;
		});
		setTimeout(() => {
			setIsReacting(false);
		}, 850);
	};
	const handleReset = () => {
		setSelectedAction(null);
		setActiveAction(null);
		setIsReacting(false);
		setDamageLevel(0);
		setTriggerId(0);
		toast.success("✨ Everything reset back to normal!", { duration: 1500 });
	};
	const handleNextPhoto = () => {
		setCurrentImageIndex((prev) => (prev + 1) % availableImages.length);
		setDamageLevel(0);
	};
	const currentDamageInfo = DAMAGE_DESCRIPTIONS[damageLevel] || DAMAGE_DESCRIPTIONS[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "section-shell relative py-6 lg:py-10 min-h-[85vh] flex flex-col justify-between",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "glass rounded-full px-4 py-2 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground transition-all flex items-center gap-2 hover:scale-105",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Back to Home" })]
				}), availableImages.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: handleNextPhoto,
					"aria-label": "Switch character photo",
					className: "glass rounded-full px-3.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-all flex items-center gap-1.5 cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Switch Photo" })]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				title: funZoneConfig.title,
				subtitle: funZoneConfig.subtitle
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center justify-center my-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex flex-col sm:flex-row items-center gap-2 text-center",
					children: [selectedAction ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold text-primary animate-pulse border-primary/40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4 text-primary animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							ACTIONS.find((a) => a.id === selectedAction)?.icon,
							" ",
							ACTIONS.find((a) => a.id === selectedAction)?.label,
							" selected — tap the photo!"
						] })]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-xs font-medium text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "👇 Choose an action & tap the picture!" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `inline-flex items-center gap-1.5 glass px-3 py-1 rounded-full text-xs font-bold border ${currentDamageInfo.color}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"Damage Lvl ",
							damageLevel,
							"/5:"
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: currentDamageInfo.text })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FunCharacter, {
					imageSrc: currentImage,
					characterName: funZoneConfig.characterName,
					selectedAction,
					isReacting,
					activeAction,
					damageLevel,
					onTap: handleTapCharacter,
					triggerId
				})]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-full max-w-xl mx-auto mt-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FunActions, {
					selectedAction,
					onSelectAction: handleSelectAction,
					onReset: handleReset,
					isReacting
				})
			}) })
		]
	});
}
function FunPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FunZone, {});
}
//#endregion
export { FunPage as component };
