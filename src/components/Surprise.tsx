import { useState } from "react";
import { Heart, X } from "lucide-react";
import { girlfriend } from "@/data/site";
import { cn } from "@/lib/utils";

export function Surprise() {
  const [open, setOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const start = () => {
    setOpen(true);
    window.setTimeout(() => setRevealed(true), 700);
  };
  const close = () => {
    setOpen(false);
    setRevealed(false);
  };

  return (
    <section className="section-shell py-16 lg:py-24">
      <div className="glass mx-auto max-w-3xl rounded-[2rem] p-10 text-center sm:p-14">
        <p className="text-xs uppercase tracking-[0.3em] text-primary">
          Our story isn't finished yet
        </p>
        <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">
          I left something here just for you
        </h2>
        <button
          onClick={start}
          className="btn-love mt-8 inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold"
        >
          Open Your Surprise <span aria-hidden>💌</span>
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[70] grid place-items-center bg-background/95 p-4 backdrop-blur-2xl"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg text-center">
            {/* Envelope */}
            <div className="relative mx-auto h-40 w-64 sm:h-48 sm:w-80">
              <div
                className={cn(
                  "absolute inset-x-0 top-0 mx-auto h-0 w-0 origin-top border-x-[128px] border-t-[80px] border-x-transparent transition-transform duration-700 sm:border-x-[160px] sm:border-t-[96px]",
                  revealed ? "rotate-x-180 opacity-0" : "opacity-100",
                )}
                style={{
                  borderTopColor: "oklch(0.35 0.12 340)",
                  transform: revealed ? "rotateX(180deg)" : undefined,
                }}
              />
              <div className="absolute inset-0 rounded-2xl bg-[var(--gradient-love)] opacity-90 shadow-[var(--shadow-glow)]" />
              <div
                className={cn(
                  "glass absolute inset-x-6 bottom-8 rounded-2xl p-5 transition-all duration-700",
                  revealed
                    ? "-translate-y-24 opacity-100 sm:-translate-y-28"
                    : "translate-y-6 opacity-0",
                )}
              >
                <Heart className="mx-auto size-5 text-primary" fill="currentColor" />
              </div>
            </div>

            <div
              className={cn(
                "mt-14 transition-all duration-700 sm:mt-16",
                revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
              )}
            >
              <p className="text-lg leading-relaxed sm:text-xl">{girlfriend.surpriseMessage}</p>
              <p className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                I Love You <Heart className="size-4" fill="currentColor" />
              </p>
            </div>

            <button
              onClick={close}
              aria-label="Close surprise"
              className="glass absolute -top-4 right-0 grid size-10 place-items-center rounded-full"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
