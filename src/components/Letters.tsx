/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { Heart, Mail, X, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { letters as staticLetters, type Letter } from "@/data/site";
import { Reveal } from "@/components/Reveal";
import { readJsonResponse } from "@/lib/api";

export function Letters({ limit }: { limit?: number }) {
  const [open, setOpen] = useState<Letter | null>(null);

  const { data: serverLetters = [], isLoading } = useQuery({
    queryKey: ["letters"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/letters");
        const payload = await readJsonResponse(res);
        if (!payload.ok) return [];
        return Array.isArray(payload.data) ? payload.data : [];
      } catch (err) {
        console.error("Error fetching letters:", err);
        return [];
      }
    },
  });

  const list = useMemo(() => {
    const combined: Letter[] =
      serverLetters.length > 0
        ? serverLetters.map((l: any) => ({
            title: l.title,
            preview: l.preview,
            body: l.body,
            date: l.date,
          }))
        : staticLetters;

    return limit ? combined.slice(0, limit) : combined;
  }, [serverLetters, limit]);

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center py-20 text-sm text-muted-foreground gap-2">
          <Loader2 className="size-5 animate-spin text-primary" /> Loading letters...
        </div>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {list.map((l, i) => (
            <Reveal key={l.title + i} delay={i * 80}>
              <button
                onClick={() => setOpen(l)}
                className="glass glass-hover flex h-full w-full flex-col rounded-3xl p-6 text-left cursor-pointer transition-all hover:scale-[1.02]"
              >
                <span className="grid size-10 place-items-center rounded-2xl bg-[var(--gradient-love)] text-primary-foreground shadow-md">
                  <Mail className="size-4" />
                </span>
                <h3 className="mt-4 text-base font-semibold leading-snug text-foreground">{l.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                  {l.preview}
                </p>
                <span className="mt-5 flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/40">
                  {l.date}
                  <Heart className="size-3.5 text-primary fill-primary/20" />
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      )}

      {open && (
        <div
          className="fixed inset-0 z-[60] grid place-items-center bg-background/90 p-4 backdrop-blur-xl animate-fade-in"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(null)}
        >
          <div
            className="animate-letter-open glass relative max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-3xl p-7 sm:p-9 border border-border shadow-2xl"
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
            <p className="text-xs uppercase tracking-[0.25em] text-primary font-bold">Words from my heart</p>
            <h3 className="mt-3 text-2xl font-semibold text-foreground">{open.title}</h3>
            <div className="relative mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground">
              {open.body.split("\n\n").map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
            <p className="mt-7 text-sm text-primary font-medium">Always yours ♡</p>
            <button
              onClick={() => setOpen(null)}
              aria-label="Close letter"
              className="glass absolute right-4 top-4 grid size-9 place-items-center rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
