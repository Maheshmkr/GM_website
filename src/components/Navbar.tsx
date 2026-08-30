import { Link } from "@tanstack/react-router";
import { Heart, Menu, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

const links = [
  { to: "/", label: "Home" },
  { to: "/photos", label: "Photos" },
  { to: "/videos", label: "Videos" },
  { to: "/songs", label: "Songs" },
  { to: "/letters", label: "Letters" },
  { to: "/timeline", label: "Timeline" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-border bg-background/70 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <nav className="section-shell grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-4 lg:flex lg:justify-between">
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="flex min-w-0 items-center gap-2 text-lg font-semibold"
        >
          <span className="truncate">For You</span>
          <Heart className="size-4 shrink-0 text-primary" />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                className="relative rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-primary [&[data-status=active]>span]:scale-x-100"
              >
                {l.label}
                <span className="absolute inset-x-3.5 -bottom-0.5 h-0.5 scale-x-0 rounded-full bg-[var(--gradient-love)] transition-transform duration-300" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-end gap-2">
          <span className="glass hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-medium sm:inline-flex">
            For You <span aria-hidden>💖</span>
          </span>
          <button
            aria-label="Sparkle"
            className="glass grid size-10 place-items-center rounded-full text-primary transition-transform hover:rotate-12"
          >
            <Sparkles className="size-4" />
          </button>
          <button
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="glass grid size-10 place-items-center rounded-full lg:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="section-shell pb-4 lg:hidden">
          <ul className="glass animate-letter-open grid gap-1 rounded-2xl p-2">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  activeOptions={{ exact: l.to === "/" }}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-primary"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
