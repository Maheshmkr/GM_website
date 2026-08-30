import { useMemo } from "react";
import { Heart } from "lucide-react";

/** Floating hearts + star sparkles background. Purely decorative. */
export function Ambience() {
  const hearts = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: (i * 7.3 + ((i * 13) % 9)) % 98,
        size: 10 + ((i * 5) % 22),
        duration: 18 + ((i * 7) % 16),
        delay: -(i * 3.1) % 20,
        opacity: 0.08 + (i % 5) * 0.04,
      })),
    [],
  );

  const stars = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: (i * 17.7) % 100,
        top: (i * 29.3) % 100,
        size: i % 3 === 0 ? 2 : 1,
        duration: 2 + (i % 5),
        delay: -(i % 7),
      })),
    [],
  );

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {stars.map((s) => (
        <span
          key={`s-${s.id}`}
          className="animate-twinkle absolute rounded-full bg-foreground"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
      {hearts.map((h) => (
        <Heart
          key={`h-${h.id}`}
          className="animate-float-up absolute bottom-[-10vh] text-primary"
          fill="currentColor"
          style={
            {
              left: `${h.left}%`,
              width: h.size,
              height: h.size,
              animationDuration: `${h.duration}s`,
              animationDelay: `${h.delay}s`,
              "--heart-opacity": h.opacity,
              filter: "drop-shadow(0 0 10px currentColor)",
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
