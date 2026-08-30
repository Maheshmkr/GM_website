import { createFileRoute } from "@tanstack/react-router";
import { SectionHeading } from "@/components/SectionHeading";
import { VideoGallery } from "@/components/VideoGallery";

const title = "Our Videos — Moments In Motion";
const description =
  "Little moments captured in motion: sunset dates, your laugh, our first trip and the candid clips I keep rewatching.";

export const Route = createFileRoute("/videos")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: VideosPage,
});

function VideosPage() {
  return (
    <section className="section-shell py-10 lg:py-16">
      <SectionHeading title="Our Videos" subtitle="Little moments captured in motion." />
      <VideoGallery />
    </section>
  );
}
