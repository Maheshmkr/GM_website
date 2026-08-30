import { Heart } from "lucide-react";

export function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="inline-flex items-center gap-3 text-2xl font-semibold sm:text-3xl md:text-4xl">
        {title}
        <Heart className="size-6 shrink-0 text-primary" />
      </h2>
      <div className="mx-auto mt-3 h-px w-24 bg-[var(--gradient-love)]" />
      {subtitle && <p className="mt-4 text-sm text-muted-foreground sm:text-base">{subtitle}</p>}
    </div>
  );
}
