import { useState, useRef, MouseEvent, TouchEvent } from "react";
import type { ActionType } from "./FunActions";
import { ImpactEffect } from "./ImpactEffect";
import { DamageOverlay } from "./DamageOverlay";
import { cn } from "@/lib/utils";

interface FunCharacterProps {
  imageSrc: string;
  characterName: string;
  selectedAction: ActionType | null;
  isReacting: boolean;
  activeAction: ActionType | null;
  damageLevel: number;
  onTap: (clickPos: { x: number; y: number }) => void;
  triggerId: number;
}

export function FunCharacter({
  imageSrc,
  characterName,
  selectedAction,
  isReacting,
  activeAction,
  damageLevel,
  onTap,
  triggerId,
}: FunCharacterProps) {
  const [clickPos, setClickPos] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) => {
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

    const x = Math.max(10, Math.min(90, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(10, Math.min(90, ((clientY - rect.top) / rect.height) * 100));

    const pos = { x, y };
    setClickPos(pos);
    onTap(pos);
  };

  // Determine CSS animation class based on activeAction when reacting
  const getAnimationClass = () => {
    if (!isReacting || !activeAction) return "";
    switch (activeAction) {
      case "stone":
        return "animate-stone-shake";
      case "hand":
        return "animate-hand-thwack";
      case "punch":
        return "animate-punch-pop";
      case "hit":
        return "animate-hit-shake";
      case "slap":
        return "animate-slap-smack";
      case "love":
        return "animate-love-bounce";
      default:
        return "";
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-md mx-auto my-3 sm:my-5">
      {/* Outer Glow / Halo Frame */}
      <div
        className={cn(
          "relative w-full aspect-[4/5] sm:aspect-square rounded-3xl p-3 sm:p-4 transition-all duration-500",
          "glass border border-white/15 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)]",
          selectedAction === "love" && isReacting && "shadow-[0_0_80px_rgba(244,114,182,0.6)] border-primary/60",
          selectedAction === "punch" && isReacting && "shadow-[0_0_80px_rgba(239,68,68,0.6)] border-red-500/60",
          selectedAction === "stone" && isReacting && "shadow-[0_0_80px_rgba(245,158,11,0.6)] border-amber-500/60"
        )}
      >
        {/* Interactive Click Container */}
        <div
          ref={containerRef}
          onClick={handlePointerDown}
          role="button"
          tabIndex={0}
          aria-label={`Character ${characterName}. Click or tap to react!`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setClickPos({ x: 50, y: 50 });
              onTap({ x: 50, y: 50 });
            }
          }}
          className={cn(
            "group relative w-full h-full rounded-2xl overflow-hidden cursor-pointer select-none outline-none focus-visible:ring-4 focus-visible:ring-primary/60 transition-transform duration-300",
            "hover:scale-[1.02] active:scale-[0.98]",
            getAnimationClass()
          )}
        >
          {/* Character Photo */}
          <img
            src={imageSrc}
            alt={characterName}
            className="w-full h-full object-cover object-center select-none pointer-events-none transition-all duration-300"
          />

          {/* Vignette & Soft Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

          {/* PERSISTENT CUMULATIVE DAMAGE OVERLAY */}
          <DamageOverlay damageLevel={damageLevel} />

          {/* Interactive Hover Prompt Badge */}
          <div className="absolute bottom-3 inset-x-3 flex justify-center pointer-events-none z-25">
            <span
              className={cn(
                "glass px-3.5 py-1.5 rounded-full text-xs font-semibold text-white tracking-wide transition-all duration-300 shadow-lg backdrop-blur-md",
                selectedAction
                  ? "bg-primary/40 border-primary/50 text-white animate-pulse"
                  : "bg-black/40 border-white/10 text-white/90 group-hover:bg-primary/30"
              )}
            >
              {selectedAction
                ? `Tap to use ${selectedAction.toUpperCase()}! ✨`
                : "Select an action below & tap me! ✨"}
            </span>
          </div>

          {/* TEMPORARY FACIAL REACTION FLASHES DURING IMPACT */}
          {isReacting && activeAction === "stone" && (
            <div className="aria-hidden pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-start pt-6 animate-pulse">
              <span className="text-4xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">💥🪨</span>
              <span className="text-xs font-black text-amber-300 bg-black/60 px-2 py-0.5 rounded-full mt-1">
                Ouch! Bump!
              </span>
            </div>
          )}

          {isReacting && activeAction === "hand" && (
            <div className="aria-hidden pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
              <span className="text-6xl opacity-85 rotate-[-15deg] drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
                ✋
              </span>
            </div>
          )}

          {isReacting && activeAction === "punch" && (
            <div className="aria-hidden pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center">
              <span className="text-6xl animate-spin text-amber-300 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                💫
              </span>
              <span className="text-xl font-extrabold text-red-400 bg-black/70 px-3 py-1 rounded-full mt-2">
                DIZZY!
              </span>
            </div>
          )}

          {isReacting && activeAction === "hit" && (
            <div className="aria-hidden pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-amber-400/20 backdrop-brightness-125">
              <span className="text-7xl animate-ping opacity-90">💥</span>
            </div>
          )}

          {isReacting && activeAction === "slap" && (
            <div className="aria-hidden pointer-events-none absolute inset-0 z-20 flex items-center justify-end pr-8">
              <div className="w-16 h-16 rounded-full bg-red-500/40 blur-md border-2 border-red-400 animate-pulse" />
              <span className="absolute text-4xl right-6">👋</span>
            </div>
          )}

          {isReacting && activeAction === "love" && (
            <div className="aria-hidden pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-pink-500/15 backdrop-brightness-110">
              <span className="text-6xl animate-bounce drop-shadow-[0_0_20px_rgba(244,114,182,0.8)]">
                🥰
              </span>
            </div>
          )}

          {/* Particles and Comic Explosions Component */}
          <ImpactEffect action={activeAction} clickPos={clickPos} triggerId={triggerId} />
        </div>
      </div>
    </div>
  );
}
