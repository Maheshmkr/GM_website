import { useState } from "react";
import { Heart, Mail, X } from "lucide-react";
import { letters, type Letter } from "@/data/site";
import { Reveal } from "@/components/Reveal";

export function Letters({ limit }: { limit?: number }) {
  const [open, setOpen] = useState<Letter | null>(null);
  const list = limit ? letters.slice(0, limit) : letters;

  return (
    <>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {list.map((l, i) => (
          <Reveal key={l.title} delay={i * 80}>
            <button
              onClick={() => setOpen(l)}
              className="glass glass-hover flex h-full w-full flex-col rounded-3xl p-6 text-left"
            >
              <span className="grid size-10 place-items-center rounded-2xl bg-[var(--gradient-love)] text-primary-foreground">
                <Mail className="size-4" />
              </span>
              <h3 className="mt-4 text-base font-semibold leading-snug">{l.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {l.preview}
              </p>
              <span className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
                {l.date}
                <Heart className="size-3.5 text-primary" />
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[60] grid place-items-center bg-background/90 p-4 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(null)}
        >
          <div
            className="animate-letter-open glass relative max-h-[80vh] w-full max-w-xl overflow-y-auto rounded-3xl p-7 sm:p-9"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl"
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <Heart
                  key={i}
                  className="animate-float-up absolute bottom-0 size-3 text-primary"
                  fill="currentColor"
                  style={
                    {
                      left: `${12 + i * 19}%`,
                      animationDuration: `${9 + i * 2}s`,
                      animationDelay: `${i * 1.4}s`,
                      "--heart-opacity": 0.25,
                    } as React.CSSProperties
                  }
                />
              ))}
            </div>
            <p className="text-xs uppercase tracking-[0.25em] text-primary">Words from my heart</p>
            <h3 className="mt-3 text-2xl font-semibold">{open.title}</h3>
            <div className="relative mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground">
              {open.body.split("\n\n").map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <p className="mt-7 text-sm text-primary">Always yours ♡</p>
            <button
              onClick={() => setOpen(null)}
              aria-label="Close letter"
              className="glass absolute right-4 top-4 grid size-9 place-items-center rounded-full"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
