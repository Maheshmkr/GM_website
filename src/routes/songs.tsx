import { createFileRoute } from "@tanstack/react-router";
import { SectionHeading } from "@/components/SectionHeading";
import { MusicPlayer } from "@/components/music/MusicPlayer";

const title = "Songs That Remind Me of You";
const description =
  "Our playlist — the melodies that speak your name, from the first song we danced to onwards.";

export const Route = createFileRoute("/songs")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: SongsPage,
});

function SongsPage() {
  return (
    <section className="section-shell py-10 lg:py-16">
      <SectionHeading
        title="Songs That Remind Me of You"
        subtitle="Melodies that speak your name."
      />
      <MusicPlayer />
    </section>
  );
}
