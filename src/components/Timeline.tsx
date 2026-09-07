/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Coffee,
  Heart,
  Plane,
  Sparkles,
  Star,
  Loader2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  X,
  Play,
  Maximize2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useRef, useState, useEffect } from "react";
import { timeline as staticTimeline, type Milestone } from "@/data/site";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

const icons: Record<string, any> = {
  heart: Heart,
  coffee: Coffee,
  sparkles: Sparkles,
  plane: Plane,
  star: Star,
};

function Node({ m }: { m: any }) {
  const Icon = icons[m.icon] || Heart;
  return (
    <span
      className={cn(
        "relative z-10 grid size-13 shrink-0 place-items-center rounded-full border shadow-md transition-transform duration-300 group-hover:scale-110",
        m.highlight
          ? "btn-love animate-glow-pulse border-transparent text-primary-foreground"
          : "border-border bg-surface text-muted-foreground group-hover:text-foreground group-hover:border-primary/50"
      )}
    >
      <Icon className="size-5" fill={m.highlight ? "currentColor" : "none"} />
    </span>
  );
}

export function Timeline() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedMilestone, setSelectedMilestone] = useState<any | null>(null);

  const { data: serverTimeline = [], isLoading } = useQuery({
    queryKey: ["timeline"],
    queryFn: async () => {
      const res = await fetch("/api/timeline");
      if (!res.ok) throw new Error("Failed to fetch timeline");
      return res.json();
    },
  });

  const milestones = useMemo<any[]>(() => {
    const rawList =
      serverTimeline.length > 0
        ? serverTimeline.map((item: any) => ({
            _id: item._id,
            title: item.title,
            description: item.description || "",
            location: item.location || "",
            rawDate: item.memoryDate || item.date || item.createdAt,
            date: item.memoryDate
              ? new Date(item.memoryDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : item.date,
            icon: item.icon || "heart",
            highlight: !!item.highlight,
            image: item.imageFileId ? `/api/media/file/${item.imageFileId}` : undefined,
            video: item.videoFileId ? `/api/media/file/${item.videoFileId}` : undefined,
          }))
        : staticTimeline.map((item: Milestone, idx) => ({
            ...item,
            rawDate: item.date,
            _id: `static-${idx}`,
          }));

    return [...rawList].sort((a, b) => {
      const getTimestamp = (item: any) => {
        const raw = item.rawDate ? String(item.rawDate).trim() : "";
        if (raw) {
          if (
            raw.toLowerCase() === "forever" ||
            raw.toLowerCase().includes("future") ||
            raw.toLowerCase().includes("many more")
          ) {
            return 9999999999999;
          }
          const t = Date.parse(raw);
          if (!isNaN(t)) return t;
        }

        const dateStr = item.date ? String(item.date).trim() : "";
        if (dateStr) {
          if (
            dateStr.toLowerCase() === "forever" ||
            dateStr.toLowerCase().includes("future") ||
            dateStr.toLowerCase().includes("many more")
          ) {
            return 9999999999999;
          }
          const t = Date.parse(dateStr);
          if (!isNaN(t)) return t;
        }

        return 0;
      };

      return getTimestamp(a) - getTimestamp(b);
    });
  }, [serverTimeline]);

  const updateScrollState = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      setScrollProgress(Math.min(100, Math.max(0, (scrollLeft / maxScroll) * 100)));
    } else {
      setScrollProgress(100);
    }
  };

  useEffect(() => {
    updateScrollState();
    const current = scrollRef.current;
    if (current) {
      current.addEventListener("scroll", updateScrollState, { passive: true });
      window.addEventListener("resize", updateScrollState);
    }
    return () => {
      if (current) current.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [milestones]);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const cardWidth = 380;
    const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24 text-sm text-muted-foreground gap-2">
        <Loader2 className="size-5 animate-spin text-primary" /> Loading our journey milestones...
      </div>
    );
  }

  return (
    <div className="mt-10 relative">
      {/* Controls header */}
      <div className="flex items-center justify-between gap-4 mb-6 px-1">
        <div className="flex items-center gap-2">
          <span className="glass rounded-full px-3.5 py-1 text-xs font-semibold text-foreground/80 flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-primary" />
            <span>{milestones.length} Beautiful Milestones</span>
          </span>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            Scroll horizontally or use arrows
          </span>
        </div>

        {/* Scroll Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleScroll("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className="glass grid size-10 place-items-center rounded-full text-foreground transition-all hover:scale-105 hover:border-primary/50 disabled:opacity-30 disabled:hover:scale-100 cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            onClick={() => handleScroll("right")}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className="glass grid size-10 place-items-center rounded-full text-foreground transition-all hover:scale-105 hover:border-primary/50 disabled:opacity-30 disabled:hover:scale-100 cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>

      {/* Progress Line Indicator */}
      <div className="w-full bg-surface-2/60 h-1 rounded-full mb-8 overflow-hidden relative">
        <div
          className="h-full bg-[var(--gradient-love)] transition-all duration-300 rounded-full"
          style={{ width: `${Math.max(8, scrollProgress)}%` }}
        />
      </div>

      {/* Horizontal Scroll Track */}
      <div className="relative">
        {/* Full-width connected line running across node centers */}
        <div className="absolute left-0 right-0 top-[26px] h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent pointer-events-none" />

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-4 px-1"
          style={{ scrollPaddingLeft: "1rem", scrollPaddingRight: "1rem" }}
        >
          {milestones.map((m, i) => (
            <div
              key={m._id || m.title + i}
              className="w-[300px] sm:w-[340px] md:w-[370px] shrink-0 snap-start flex flex-col group"
            >
              {/* Node Header on Track */}
              <div className="flex items-center gap-3 mb-5 pl-2">
                <Node m={m} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-primary tracking-wider uppercase">
                      Memory #{i + 1}
                    </span>
                    {m.highlight && (
                      <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">
                        Highlight ✨
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 font-medium">
                    <Calendar className="size-3 text-muted-foreground/70" />
                    {m.date}
                  </p>
                </div>
              </div>

              {/* Fixed Card Body */}
              <article
                onClick={() => setSelectedMilestone(m)}
                className={cn(
                  "glass glass-hover rounded-3xl p-5 flex flex-col justify-between flex-1 border transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl",
                  m.highlight
                    ? "border-primary/40 bg-surface/50 hover:border-primary"
                    : "border-border/80 bg-surface/30 hover:border-border"
                )}
              >
                <div>
                  {/* Fixed Media Size */}
                  {m.image ? (
                    <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-black/30 mb-4 group/img">
                      <img
                        src={m.image}
                        alt={m.title}
                        loading="lazy"
                        className="size-full object-cover object-center transition-transform duration-700 group-hover/img:scale-105"
                      />
                      <span className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60 group-hover/img:opacity-40 transition-opacity" />
                      <div className="absolute right-2.5 bottom-2.5 glass size-7 rounded-full grid place-items-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                        <Maximize2 className="size-3.5 text-foreground" />
                      </div>
                    </div>
                  ) : m.video ? (
                    <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-black/40 mb-4 flex items-center justify-center">
                      <video
                        src={m.video}
                        className="size-full object-cover object-center pointer-events-none"
                        preload="metadata"
                      />
                      <span className="absolute inset-0 bg-background/30" />
                      <span className="btn-love size-10 rounded-full grid place-items-center shadow-lg relative z-10">
                        <Play className="size-4" fill="currentColor" />
                      </span>
                    </div>
                  ) : (
                    <div className="h-2 w-full mb-2" />
                  )}

                  <h3 className="text-base sm:text-lg font-bold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {m.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {m.description}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-border/20 text-xs">
                  {m.location ? (
                    <span className="text-muted-foreground flex items-center gap-1 font-medium truncate">
                      <MapPin className="size-3 text-primary shrink-0" />
                      <span className="truncate">{m.location}</span>
                    </span>
                  ) : (
                    <span className="text-muted-foreground/60 text-[11px]">Special Moment</span>
                  )}

                  <span className="text-primary font-semibold text-xs shrink-0 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    View &rarr;
                  </span>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox / Milestone Detail Modal */}
      {selectedMilestone && (
        <div
          className="fixed inset-0 z-[70] grid place-items-center bg-background/90 p-4 backdrop-blur-xl animate-in fade-in-50"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedMilestone(null)}
        >
          <div
            className="animate-letter-open glass relative w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-border shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMilestone(null)}
              aria-label="Close dialog"
              className="glass absolute top-4 right-4 grid size-10 place-items-center rounded-full text-muted-foreground hover:text-foreground transition-colors cursor-pointer z-20"
            >
              <X className="size-4" />
            </button>

            {/* Media if present */}
            {selectedMilestone.image && (
              <div className="relative max-h-[48vh] w-full flex items-center justify-center overflow-hidden rounded-2xl bg-black/40 mb-6">
                <img
                  src={selectedMilestone.image}
                  alt={selectedMilestone.title}
                  className="max-h-[48vh] max-w-full w-auto h-auto rounded-2xl object-contain mx-auto"
                />
              </div>
            )}

            {selectedMilestone.video && (
              <div className="relative w-full aspect-video overflow-hidden rounded-2xl bg-black mb-6">
                <video
                  src={selectedMilestone.video}
                  controls
                  autoPlay
                  playsInline
                  className="size-full rounded-2xl"
                />
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="bg-primary/10 text-primary border border-primary/20 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
                <Calendar className="size-3" />
                {selectedMilestone.date}
              </span>
              {selectedMilestone.location && (
                <span className="glass text-xs font-medium text-muted-foreground px-3 py-1 rounded-full flex items-center gap-1.5">
                  <MapPin className="size-3 text-primary" />
                  {selectedMilestone.location}
                </span>
              )}
              {selectedMilestone.highlight && (
                <span className="btn-love text-xs font-semibold px-3 py-1 rounded-full">
                  Special Memory ✨
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              {selectedMilestone.title}
            </h2>

            <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
              {selectedMilestone.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

