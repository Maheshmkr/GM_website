/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useMemo, useCallback } from "react";
import { Heart, Play, ChevronLeft, ChevronRight, Shuffle, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { girlfriend, heroSlides } from "@/data/site";
import { useMusic } from "@/components/music/MusicProvider";
import { readJsonResponse } from "@/lib/api";
import { cn } from "@/lib/utils";

type Burst = { id: number; left: number; dx: number; delay: number };

type SlideItem = {
  id?: string;
  image: string;
  alt: string;
  title?: string;
  description?: string;
  category?: string;
};

function shuffleList<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function Hero() {
  const [slide, setSlide] = useState(0);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [message, setMessage] = useState(false);
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const { play } = useMusic();

  // Fetch photos from MongoDB
  const { data: serverPhotos = [] } = useQuery({
    queryKey: ["photos"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/media?type=image");
        const payload = await readJsonResponse(res);
        if (!payload.ok) return [];
        return payload.data ?? [];
      } catch {
        return [];
      }
    },
  });

  // Filter ONLY for photos marked "Show in Home Screen" (p.showInHero === true) and shuffle them
  const slides = useMemo<SlideItem[]>(() => {
    const homePhotos = (serverPhotos || []).filter((p: any) => p.showInHero === true);

    if (homePhotos.length > 0) {
      const mapped = homePhotos.map((p: any) => ({
        id: p._id || p.fileId,
        image: p.source === "url" ? p.url : `/api/media/file/${p.fileId}`,
        alt: p.title || p.description || "Our Home Memory",
        title: p.title || "",
        description: p.description || "",
        category: p.category || "Special",
      }));
      return shuffleList(mapped);
    }

    // Default static hero slides if no photos are selected for Home Screen
    return heroSlides.map((s) => ({
      image: s.image,
      alt: s.alt,
      title: "Our Special Moment",
      description: "",
    }));
  }, [serverPhotos, shuffleSeed]);

  // Keep active slide in range
  useEffect(() => {
    if (slide >= slides.length && slides.length > 0) {
      setSlide(0);
    }
  }, [slides.length, slide]);

  // Autoplay slideshow
  useEffect(() => {
    if (slides.length <= 1) return;
    const id = window.setInterval(() => {
      setSlide((s) => (s + 1) % slides.length);
    }, 5500);
    return () => window.clearInterval(id);
  }, [slides.length]);

  const handleNext = useCallback(() => {
    setSlide((s) => (s + 1) % slides.length);
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    setSlide((s) => (s - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const handleManualShuffle = () => {
    setShuffleSeed((s) => s + 1);
    setSlide(0);
  };

  const loveClick = () => {
    const base = Date.now();
    setBursts(
      Array.from({ length: 12 }, (_, i) => ({
        id: base + i,
        left: 10 + Math.random() * 80,
        dx: (Math.random() - 0.5) * 120,
        delay: Math.random() * 320,
      })),
    );
    setMessage(true);
    window.setTimeout(() => setBursts([]), 2200);
    window.setTimeout(() => setMessage(false), 5000);
  };

  const currentSlide = slides[slide] || slides[0];

  return (
    <section className="section-shell grid items-center gap-10 py-8 lg:grid-cols-2 lg:gap-14 lg:py-16">
      <div className="relative">
        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-primary">
          A little piece of us ♡
        </p>
        <h1 className="text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">
          Hey <span className="gradient-text">{girlfriend.nickname},</span>
          <br />
          <span className="inline-flex flex-wrap items-center gap-3">
            {girlfriend.heroMessage}
            <Heart className="size-8 text-primary lg:size-10" />
          </span>
        </h1>
        <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
          {girlfriend.heroSubtitle}
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-4">
          <button
            onClick={loveClick}
            className="btn-love inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold"
          >
            <Heart className="size-4" fill="currentColor" />I Love You
          </button>
          <button
            onClick={() => play(0)}
            className="group inline-flex items-center gap-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="grid size-11 place-items-center rounded-full border border-border transition-colors group-hover:border-primary group-hover:text-primary">
              <Play className="size-4" fill="currentColor" />
            </span>
            Play Our Song
          </button>
        </div>

        <p
          className={cn(
            "mt-6 text-sm text-primary transition-all duration-500",
            message ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0",
          )}
          aria-live="polite"
        >
          {girlfriend.loveMessage}
        </p>

        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-0">
          {bursts.map((b) => (
            <Heart
              key={b.id}
              className="absolute bottom-0 size-5 text-primary"
              fill="currentColor"
              style={
                {
                  left: `${b.left}%`,
                  animation: `pop-heart 1.8s ease-out ${b.delay}ms forwards`,
                  "--dx": `${b.dx}px`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      </div>

      <div>
        <div className="group relative aspect-[16/10] overflow-hidden rounded-[2rem] border border-border bg-black/20 shadow-[var(--shadow-glow)]">
          {slides.map((s, i) => (
            <img
              key={s.id || s.image || i}
              src={s.image}
              alt={s.alt}
              width={1600}
              height={1000}
              loading={i === 0 ? "eager" : "lazy"}
              className={cn(
                "absolute inset-0 size-full object-cover object-center transition-all duration-[1200ms] ease-out group-hover:scale-105",
                i === slide ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none",
              )}
            />
          ))}
          
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

          {/* Top Badge: Home Screen */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-md px-3 py-1 text-xs font-medium text-white/90 border border-white/10 shadow-sm">
              <Sparkles className="size-3 text-primary animate-pulse" />
              Home Screen
            </span>
          </div>

          {/* Shuffle button top right */}
          {slides.length > 1 && (
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={handleManualShuffle}
                title="Shuffle Home Screen photos"
                aria-label="Shuffle Home Screen photos"
                className="grid size-8 place-items-center rounded-full bg-black/40 backdrop-blur-md text-white/80 border border-white/10 shadow-sm transition hover:bg-black/60 hover:text-white hover:scale-105 active:scale-95"
              >
                <Shuffle className="size-3.5" />
              </button>
            </div>
          )}

          {/* Left / Right arrows on hover */}
          {slides.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 -translate-y-1/2 grid size-9 place-items-center rounded-full bg-black/40 backdrop-blur-md text-white border border-white/15 opacity-0 group-hover:opacity-100 transition duration-300 hover:bg-black/70 hover:scale-110"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 -translate-y-1/2 grid size-9 place-items-center rounded-full bg-black/40 backdrop-blur-md text-white border border-white/15 opacity-0 group-hover:opacity-100 transition duration-300 hover:bg-black/70 hover:scale-110"
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          )}

          {/* Bottom title & description caption */}
          {currentSlide && (currentSlide.title || currentSlide.description) && (
            <div className="absolute bottom-4 inset-x-4 pointer-events-none">
              <div className="inline-block max-w-full rounded-2xl bg-black/40 backdrop-blur-md px-4 py-2 text-left border border-white/10 shadow-sm">
                {currentSlide.title && (
                  <p className="text-sm font-semibold text-white drop-shadow-sm truncate">
                    {currentSlide.title}
                  </p>
                )}
                {currentSlide.description && (
                  <p className="text-xs text-white/80 line-clamp-2 mt-0.5">
                    {currentSlide.description}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Indicators at the bottom */}
        {slides.length > 1 && (
          <div className="mt-5 flex items-center justify-center gap-1.5 flex-wrap max-w-xs mx-auto">
            {slides.slice(0, 16).map((s, i) => (
              <button
                key={s.id || s.image || i}
                onClick={() => setSlide(i)}
                aria-label={`Show photo ${i + 1}`}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  i === slide ? "w-6 bg-primary" : "w-2 bg-muted hover:bg-muted-foreground/50",
                )}
              />
            ))}
            {slides.length > 16 && (
              <span className="text-[10px] text-muted-foreground font-mono ml-1">
                +{slides.length - 16}
              </span>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
