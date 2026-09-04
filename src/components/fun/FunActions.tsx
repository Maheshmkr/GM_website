import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export type ActionType = "stone" | "hand" | "punch" | "hit" | "slap" | "love";

export interface ActionItem {
  id: ActionType;
  label: string;
  icon: string;
  description: string;
  color: string;
}

export const ACTIONS: ActionItem[] = [
  {
    id: "stone",
    label: "Stone",
    icon: "🪨",
    description: "Throw a cartoon stone!",
    color: "hover:border-amber-500/60 hover:shadow-amber-500/20",
  },
  {
    id: "hand",
    label: "Hand",
    icon: "✋",
    description: "Give a quick tap!",
    color: "hover:border-sky-500/60 hover:shadow-sky-500/20",
  },
  {
    id: "punch",
    label: "Punch",
    icon: "👊",
    description: "Deliver a knockout POW!",
    color: "hover:border-rose-500/60 hover:shadow-rose-500/20",
  },
  {
    id: "hit",
    label: "Hit",
    icon: "💥",
    description: "Fast cartoon impact!",
    color: "hover:border-yellow-500/60 hover:shadow-yellow-500/20",
  },
  {
    id: "slap",
    label: "Slap",
    icon: "👋",
    description: "Playful cheek smack!",
    color: "hover:border-pink-500/60 hover:shadow-pink-500/20",
  },
  {
    id: "love",
    label: "Love",
    icon: "❤️",
    description: "Shower with hearts & love!",
    color: "hover:border-primary/80 hover:shadow-primary/30",
  },
];

interface FunActionsProps {
  selectedAction: ActionType | null;
  onSelectAction: (action: ActionType) => void;
  onReset: () => void;
  isReacting: boolean;
  damageLevel?: number;
}

export function FunActions({
  selectedAction,
  onSelectAction,
  onReset,
  isReacting,
  damageLevel = 0,
}: FunActionsProps) {
  const canReset = Boolean(selectedAction || isReacting || damageLevel > 0);

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full">
      {/* Action Toolbar */}
      <div className="glass w-full rounded-3xl p-3 sm:p-4 shadow-xl border border-white/10 backdrop-blur-2xl">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
          {ACTIONS.map((act) => {
            const isSelected = selectedAction === act.id;
            return (
              <button
                key={act.id}
                onClick={() => onSelectAction(act.id)}
                aria-label={`Select ${act.label} action`}
                aria-pressed={isSelected}
                title={act.description}
                className={cn(
                  "group relative flex flex-col items-center justify-center rounded-2xl py-3 px-2 transition-all duration-300 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  isSelected
                    ? "bg-primary/20 border-2 border-primary shadow-[0_0_20px_rgba(244,114,182,0.4)] scale-105"
                    : "glass hover:bg-white/10 hover:scale-102 border border-white/5",
                  act.color
                )}
              >
                {/* Selected glowing badge */}
                {isSelected && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[9px] text-white shadow-md animate-pulse">
                    ✓
                  </span>
                )}

                <span className="text-2xl sm:text-3xl transition-transform duration-300 group-hover:scale-110">
                  {act.icon}
                </span>
                <span
                  className={cn(
                    "mt-1 text-xs font-semibold tracking-wide transition-colors",
                    isSelected ? "text-primary" : "text-foreground/80 group-hover:text-foreground"
                  )}
                >
                  {act.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Reset & Status Control */}
      <div className="flex items-center justify-between w-full px-2">
        <div className="text-xs text-muted-foreground font-medium">
          {selectedAction ? (
            <span className="inline-flex items-center gap-1.5 text-primary font-semibold">
              <span>{ACTIONS.find((a) => a.id === selectedAction)?.icon}</span>
              <span>{ACTIONS.find((a) => a.id === selectedAction)?.label} action ready!</span>
            </span>
          ) : (
            <span>Tip: Select an action button above to start.</span>
          )}
        </div>

        <button
          onClick={onReset}
          disabled={!canReset}
          aria-label="Reset action and restore picture"
          className={cn(
            "glass rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary",
            canReset
              ? "text-destructive hover:bg-destructive/15 border-destructive/30 hover:scale-105"
              : "text-muted-foreground/40 opacity-50 cursor-not-allowed border-white/5"
          )}
        >
          <RotateCcw className="size-3.5" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}
