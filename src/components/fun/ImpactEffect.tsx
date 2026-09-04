import { useEffect, useState } from "react";
import type { ActionType } from "./FunActions";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  dx: number;
  dy: number;
  rotation: number;
  content: string;
}

interface ImpactEffectProps {
  action: ActionType | null;
  clickPos: { x: number; y: number } | null;
  triggerId: number;
}

const ACTION_COMIC_TEXTS: Record<ActionType, { text: string; color: string; subText?: string }> = {
  tomato: { text: "SPLAT!", color: "from-red-600 via-rose-600 to-amber-500", subText: "🍅 Juicy Splatter!" },
  stone: { text: "BONK!", color: "from-amber-400 to-orange-500", subText: "🪨 Dust Everywhere!" },
  hand: { text: "THWACK!", color: "from-sky-400 to-indigo-500", subText: "✋ Ouch!" },
  punch: { text: "POW!", color: "from-rose-500 to-red-600", subText: "💥 Knockout!" },
  hit: { text: "BAM!", color: "from-amber-300 to-yellow-500", subText: "⚡ Direct Hit!" },
  slap: { text: "SMACK!", color: "from-pink-400 to-rose-500", subText: "👋 Red Cheek!" },
  love: { text: "LOVE! ❤️", color: "from-pink-400 to-purple-500", subText: "💕 So Much Love!" },
};

const ACTION_PARTICLES: Record<ActionType, string[]> = {
  tomato: ["🍅", "💥", "🔴", "✨", "🩸", "💦", "⭐"],
  stone: ["🪨", "✨", "💨", "💥", "⭐"],
  hand: ["✋", "💥", "💫", "✨", "⚡"],
  punch: ["💥", "👊", "⭐", "💫", "✨", "⚡"],
  hit: ["💥", "⚡", "✨", "🔥", "⭐"],
  slap: ["👋", "💥", "💨", "✨", "⭐"],
  love: ["❤️", "💖", "💕", "✨", "💗", "🥰"],
};

export function ImpactEffect({ action, clickPos, triggerId }: ImpactEffectProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [activeText, setActiveText] = useState<{ text: string; color: string; subText?: string; x: number; y: number } | null>(null);
  const [isTomatoFlying, setIsTomatoFlying] = useState(false);
  const [showTomatoSplat, setShowTomatoSplat] = useState(false);
  const [targetPos, setTargetPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    if (!action || triggerId === 0) return;

    const posX = clickPos?.x ?? 50;
    const posY = clickPos?.y ?? 50;
    setTargetPos({ x: posX, y: posY });

    const comicInfo = ACTION_COMIC_TEXTS[action];
    const particleTemplates = ACTION_PARTICLES[action];

    if (action === "tomato") {
      // 1. Tomato flies towards target
      setIsTomatoFlying(true);
      setShowTomatoSplat(false);

      const flyTimer = setTimeout(() => {
        setIsTomatoFlying(false);
        setShowTomatoSplat(true);

        // 2. Trigger SPLAT comic text and impact burst
        setActiveText({
          ...comicInfo,
          x: posX,
          y: posY,
        });

        // Radiate juicy tomato particles
        const count = 16;
        const newParticles: Particle[] = Array.from({ length: count }, (_, i) => {
          const angle = (i / count) * 2 * Math.PI + (Math.random() * 0.4 - 0.2);
          const distance = 45 + Math.random() * 95;
          return {
            id: Date.now() + i,
            x: posX,
            y: posY,
            size: 20 + Math.random() * 18,
            dx: Math.cos(angle) * distance,
            dy: Math.sin(angle) * distance + (Math.random() * 20 - 5),
            rotation: Math.random() * 360 - 180,
            content: particleTemplates[i % particleTemplates.length],
          };
        });
        setParticles(newParticles);
      }, 220);

      const cleanupTimer = setTimeout(() => {
        setShowTomatoSplat(false);
        setParticles([]);
        setActiveText(null);
      }, 1000);

      return () => {
        clearTimeout(flyTimer);
        clearTimeout(cleanupTimer);
      };
    } else {
      // Instant impact for other actions
      setIsTomatoFlying(false);
      setShowTomatoSplat(false);

      setActiveText({
        ...comicInfo,
        x: posX,
        y: posY,
      });

      const count = action === "love" ? 18 : 14;
      const newParticles: Particle[] = Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * 2 * Math.PI + (Math.random() * 0.4 - 0.2);
        const distance = 40 + Math.random() * 90;
        return {
          id: Date.now() + i,
          x: posX,
          y: posY,
          size: 18 + Math.random() * 16,
          dx: Math.cos(angle) * distance,
          dy: Math.sin(angle) * distance - (action === "love" ? 40 : 10),
          rotation: Math.random() * 360 - 180,
          content: particleTemplates[i % particleTemplates.length],
        };
      });

      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
        setActiveText(null);
      }, 850);

      return () => clearTimeout(timer);
    }
  }, [action, clickPos, triggerId]);

  if (!action || triggerId === 0) return null;

  return (
    <div className="aria-hidden pointer-events-none absolute inset-0 z-30 overflow-hidden rounded-3xl">
      {/* 🍅 Flying Tomato Animation */}
      {isTomatoFlying && (
        <div
          className="absolute z-40 transition-all duration-[220ms] ease-in-out text-5xl sm:text-6xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]"
          style={{
            left: `${targetPos.x}%`,
            top: `${targetPos.y}%`,
            transform: "translate(-50%, -50%) scale(1.3) rotate(360deg)",
            animation: "tomato-flight 0.22s cubic-bezier(0.2, 0.8, 0.4, 1) forwards",
          }}
        >
          🍅
        </div>
      )}

      {/* 💥 Tomato Splat SVG Graphic on Picture */}
      {showTomatoSplat && (
        <div
          className="absolute z-35 -translate-x-1/2 -translate-y-1/2 select-none animate-in fade-in zoom-in-50 duration-150"
          style={{
            left: `${targetPos.x}%`,
            top: `${targetPos.y}%`,
            width: "180px",
            height: "180px",
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_12px_rgba(185,28,28,0.7)]">
            {/* Outer sauce splatter drops */}
            <circle cx="22" cy="18" r="7" fill="#dc2626" opacity="0.9" />
            <circle cx="78" cy="22" r="8" fill="#b91c1c" opacity="0.85" />
            <circle cx="88" cy="65" r="6.5" fill="#ef4444" opacity="0.95" />
            <circle cx="15" cy="72" r="7.5" fill="#b91c1c" opacity="0.9" />
            <circle cx="50" cy="92" r="9" fill="#dc2626" opacity="0.9" />
            <circle cx="82" cy="45" r="4" fill="#f87171" opacity="0.9" />
            <circle cx="12" cy="40" r="5" fill="#ef4444" opacity="0.9" />

            {/* Sauce drips */}
            <path
              d="M 50 50 Q 52 75 48 88 Q 50 94 53 88 Q 55 75 50 50"
              fill="#b91c1c"
              opacity="0.9"
            />
            <path
              d="M 60 50 Q 68 68 72 78 Q 75 82 74 76 Q 66 65 60 50"
              fill="#dc2626"
              opacity="0.85"
            />

            {/* Central Splat Body */}
            <path
              d="M 50 20 C 65 18, 75 30, 80 42 C 86 55, 78 72, 68 78 C 55 85, 40 82, 30 75 C 18 68, 16 52, 22 38 C 28 25, 38 22, 50 20 Z"
              fill="#dc2626"
            />
            {/* Tomato Core & Highlights */}
            <path
              d="M 48 30 C 58 28, 68 36, 70 46 C 72 56, 64 68, 54 70 C 42 72, 34 65, 32 54 C 30 42, 38 32, 48 30 Z"
              fill="#ef4444"
            />
            <circle cx="45" cy="40" r="4" fill="#fecaca" opacity="0.8" />
            <circle cx="58" cy="48" r="3" fill="#fef08a" opacity="0.9" />
            <circle cx="42" cy="56" r="2.5" fill="#fef08a" opacity="0.9" />
            <circle cx="54" cy="36" r="2.5" fill="#fef08a" opacity="0.9" />
          </svg>
        </div>
      )}

      {/* Dynamic Comic Text Pop */}
      {activeText && (
        <div
          className="absolute z-40 -translate-x-1/2 -translate-y-1/2 text-center"
          style={{ left: `${activeText.x}%`, top: `${Math.max(15, activeText.y - 10)}%` }}
        >
          <div
            className={`animate-comic-pop inline-block rounded-2xl bg-gradient-to-r ${activeText.color} px-5 py-2 text-2xl font-black tracking-wider text-white shadow-2xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] md:text-4xl`}
          >
            {activeText.text}
          </div>
          {activeText.subText && (
            <div className="mt-1 text-xs font-bold text-white/90 drop-shadow md:text-sm">
              {activeText.subText}
            </div>
          )}
        </div>
      )}

      {/* Radiating Impact Particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute select-none transition-all duration-700 ease-out"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}px`,
            transform: `translate(-50%, -50%) translate(${p.dx}px, ${p.dy}px) rotate(${p.rotation}deg)`,
            opacity: 0,
            animation: "particle-burst 0.75s ease-out forwards",
            filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.4))",
          }}
        >
          {p.content}
        </span>
      ))}
    </div>
  );
}
