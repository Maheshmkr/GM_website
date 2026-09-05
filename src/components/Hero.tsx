import { useEffect, useState } from "react";
import { Heart, Play } from "lucide-react";
import { girlfriend, heroSlides } from "@/data/site";
import { useMusic } from "@/components/music/MusicProvider";
import { cn } from "@/lib/utils";

type Burst = { id: number; left: number; dx: number; delay: number };

export function Hero() {
  const [slide, setSlide] = useState(0);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [message, setMessage] = useState(false);
  const { play } = useMusic();

  useEffect(() => {
    const id = window.setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 6500);
    return () => window.clearInterval(id);
  }, []);

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
          {heroSlides.map((s, i) => (
            <img
              key={s.image}
              src={s.image}
              alt={s.alt}
              width={1600}
              height={1000}
              loading={i === 0 ? "eager" : "lazy"}
              className={cn(
                "absolute inset-0 size-full object-cover object-center transition-all duration-[1200ms] ease-out group-hover:scale-105",
                i === slide ? "opacity-100" : "opacity-0",
              )}
            />
          ))}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-background/20" />
        </div>
        <div className="mt-5 flex items-center justify-center gap-2">
          {heroSlides.map((s, i) => (
            <button
              key={s.image}
              onClick={() => setSlide(i)}
              aria-label={`Show photo ${i + 1}`}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === slide ? "w-6 bg-primary" : "w-2 bg-muted",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
