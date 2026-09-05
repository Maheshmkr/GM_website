import { Heart, Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { formatTime, useMusic } from "./MusicProvider";
import { cn } from "@/lib/utils";

export function MiniPlayer() {
  const {
    current,
    playing,
    hasStarted,
    progress,
    duration,
    toggle,
    next,
    prev,
    favorites,
    toggleFavorite,
  } = useMusic();

  if (!hasStarted) return null;
  const pct = duration ? (progress / duration) * 100 : 0;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 sm:px-5 sm:pb-5">
      <div className="glass mx-auto flex max-w-3xl items-center gap-3 rounded-2xl p-2.5 sm:gap-4 sm:p-3">
        <div className="size-11 shrink-0 overflow-hidden rounded-xl bg-black/20 sm:size-12">
          <img
            src={current.cover}
            alt=""
            loading="lazy"
            className="size-full object-cover object-center"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{current.title}</p>
          <p className="truncate text-xs text-muted-foreground">{current.artist}</p>
          <div className="mt-1.5 flex items-center gap-2">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-[var(--gradient-love)] transition-[width] duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="hidden text-[11px] tabular-nums text-muted-foreground sm:block">
              {formatTime(progress)}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={() => toggleFavorite(current.title)}
            aria-label="Favorite song"
            className="hidden size-9 place-items-center rounded-full hover:bg-secondary sm:grid"
          >
            <Heart
              className={cn("size-4", favorites[current.title] && "text-primary")}
              fill={favorites[current.title] ? "currentColor" : "none"}
            />
          </button>
          <button
            onClick={prev}
            aria-label="Previous song"
            className="hidden size-9 place-items-center rounded-full hover:bg-secondary sm:grid"
          >
            <SkipBack className="size-4" />
          </button>
          <button
            onClick={toggle}
            aria-label={playing ? "Pause" : "Play"}
            className="btn-love grid size-10 place-items-center rounded-full"
          >
            {playing ? (
              <Pause className="size-4" fill="currentColor" />
            ) : (
              <Play className="size-4" fill="currentColor" />
            )}
          </button>
          <button
            onClick={next}
            aria-label="Next song"
            className="grid size-9 place-items-center rounded-full hover:bg-secondary"
          >
            <SkipForward className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
