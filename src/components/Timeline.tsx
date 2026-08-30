/* eslint-disable @typescript-eslint/no-explicit-any */
import { Coffee, Heart, Plane, Sparkles, Star, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { timeline as staticTimeline, type Milestone } from "@/data/site";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

const icons = {
  heart: Heart,
  coffee: Coffee,
  sparkles: Sparkles,
  plane: Plane,
  star: Star,
};

function Node({ m }: { m: Milestone }) {
  const Icon = icons[m.icon];
  return (
    <span
      className={cn(
        "grid size-14 shrink-0 place-items-center rounded-full border border-border",
        m.highlight
          ? "btn-love animate-glow-pulse border-transparent"
          : "bg-surface-2 text-muted-foreground",
      )}
    >
      <Icon className="size-5" fill={m.highlight ? "currentColor" : "none"} />
    </span>
  );
}

export function Timeline() {
  const { data: serverTimeline = [], isLoading } = useQuery({
    queryKey: ["timeline"],
    queryFn: async () => {
      const res = await fetch("/api/timeline");
      if (!res.ok) throw new Error("Failed to fetch timeline");
      return res.json();
    },
  });

  const milestones = useMemo<Milestone[]>(() => {
    if (serverTimeline.length > 0) {
      return serverTimeline.map((item: any) => ({
        title: item.title,
        description: item.description || "",
        date: item.memoryDate
          ? new Date(item.memoryDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : item.date,
        icon: item.icon || "heart",
        highlight: item.highlight || false,
        image: item.imageFileId ? `/api/media/file/${item.imageFileId}` : undefined,
      }));
    }
    return staticTimeline;
  }, [serverTimeline]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20 text-sm text-muted-foreground gap-2">
        <Loader2 className="size-5 animate-spin text-primary" /> Loading timeline...
      </div>
    );
  }

  return (
    <div className="mt-14">
      {/* Desktop: horizontal */}
      <div className="relative hidden lg:block">
        <div className="absolute left-0 right-0 top-7 h-px bg-[var(--gradient-love)] opacity-60" />
        <ol
          className="relative grid gap-4"
          style={{ gridTemplateColumns: `repeat(${milestones.length || 1}, minmax(0, 1fr))` }}
        >
          {milestones.map((m, i) => (
            <Reveal as="li" key={m.title} delay={i * 110} className="text-center">
              <div className="flex justify-center">
                <Node m={m} />
              </div>
              <h3 className="mt-5 text-base font-semibold">{m.title}</h3>
              <p className="mx-auto mt-2 max-w-[15rem] text-sm text-muted-foreground">
                {m.description}
              </p>
              <p
                className={cn(
                  "mt-3 text-xs",
                  m.highlight ? "font-semibold text-primary" : "text-muted-foreground",
                )}
              >
                {m.date}
              </p>
              {m.image && (
                <img
                  src={m.image}
                  alt={m.title}
                  loading="lazy"
                  className="mx-auto mt-4 h-28 w-full rounded-2xl object-cover opacity-80 transition-opacity hover:opacity-100"
                />
              )}
            </Reveal>
          ))}
        </ol>
      </div>

      {/* Mobile / tablet: vertical */}
      <ol className="relative space-y-8 pl-4 lg:hidden">
        <div className="absolute bottom-4 left-[2.75rem] top-4 w-px bg-[var(--gradient-love)] opacity-50" />
        {milestones.map((m, i) => (
          <Reveal as="li" key={m.title} delay={i * 90}>
            <div className="relative flex gap-4">
              <Node m={m} />
              <div className="glass min-w-0 flex-1 rounded-2xl p-4">
                <h3 className="text-base font-semibold">{m.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{m.description}</p>
                <p
                  className={cn(
                    "mt-2 text-xs",
                    m.highlight ? "font-semibold text-primary" : "text-muted-foreground",
                  )}
                >
                  {m.date}
                </p>
                {m.image && (
                  <img
                    src={m.image}
                    alt={m.title}
                    loading="lazy"
                    className="mt-3 h-32 w-full rounded-xl object-cover"
                  />
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}
