import { Heart } from "lucide-react";
import { girlfriend } from "@/data/site";

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-border py-14 pb-28">
      <div className="section-shell text-center">
        <div className="mb-5 flex items-center justify-center gap-3">
          {[0, 1, 2].map((i) => (
            <Heart
              key={i}
              className="animate-twinkle size-4 text-primary"
              fill="currentColor"
              style={{
                animationDuration: `${2.5 + i}s`,
                animationDelay: `${i * 0.4}s`,
                filter: "drop-shadow(0 0 12px currentColor)",
              }}
            />
          ))}
        </div>
        <p className="text-base font-medium">
          Made with all my love, just for you <span className="text-primary">♡</span>
        </p>
        <p className="mt-2 text-sm text-muted-foreground">{girlfriend.finalMessage}</p>
      </div>
    </footer>
  );
}
