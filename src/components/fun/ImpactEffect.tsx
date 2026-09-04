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
  stone: { text: "BONK!", color: "from-amber-400 to-orange-500", subText: "🪨 Dust Everywhere!" },
  hand: { text: "THWACK!", color: "from-sky-400 to-indigo-500", subText: "✋ Ouch!" },
  punch: { text: "POW!", color: "from-rose-500 to-red-600", subText: "💥 Knockout!" },
  hit: { text: "BAM!", color: "from-amber-300 to-yellow-500", subText: "⚡ Direct Hit!" },
  slap: { text: "SMACK!", color: "from-pink-400 to-rose-500", subText: "👋 Red Cheek!" },
  love: { text: "LOVE! ❤️", color: "from-pink-400 to-purple-500", subText: "💕 So Much Love!" },
};

const ACTION_PARTICLES: Record<ActionType, string[]> = {
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

  useEffect(() => {
    if (!action || triggerId === 0) return;

    const comicInfo = ACTION_COMIC_TEXTS[action];
    const particleTemplates = ACTION_PARTICLES[action];

    // Determine target center if click position isn't specified
    const posX = clickPos?.x ?? 50;
    const posY = clickPos?.y ?? 50;

    setActiveText({
      ...comicInfo,
      x: posX,
      y: posY,
    });

    // Create 12-16 dynamic particles radiating from the click point
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
  }, [action, clickPos, triggerId]);

  if (!action || triggerId === 0) return null;

  return (
    <div className="aria-hidden pointer-events-none absolute inset-0 z-30 overflow-hidden rounded-3xl">
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
