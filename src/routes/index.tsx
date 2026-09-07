import { createFileRoute, Link } from "@tanstack/react-router";
import { Hero } from "@/components/Hero";
import { MemoryCards } from "@/components/MemoryCards";
import { SectionHeading } from "@/components/SectionHeading";
import { VideoGallery } from "@/components/VideoGallery";
import { Letters } from "@/components/Letters";
import { Timeline } from "@/components/Timeline";

const title = "For You — A Little World Made Just For Us";
const description =
  "A private collection of our photos, videos, songs, letters and the timeline of our story — made with all my love.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <MemoryCards />

      <section className="section-shell py-16 lg:py-24">
        <SectionHeading title="Our Videos" subtitle="Little moments captured in motion." />
        <VideoGallery limit={4} />
        <div className="mt-10 text-center">
          <Link
            to="/videos"
            className="btn-love inline-flex rounded-full px-6 py-3 text-sm font-semibold"
          >
            View All Videos
          </Link>
        </div>
      </section>

      <section className="section-shell py-16 lg:py-24">
        <SectionHeading title="Letters For You" subtitle="Words I wish I could say every day." />
        <Letters limit={4} />
        <div className="mt-10 text-center">
          <Link
            to="/letters"
            className="btn-love inline-flex rounded-full px-6 py-3 text-sm font-semibold"
          >
            View All Letters
          </Link>
        </div>
      </section>

      <section className="section-shell py-16 lg:py-24">
        <SectionHeading
          title="Our Journey Timeline"
          subtitle="A timeline of our beautiful journey together."
        />
        <Timeline />
      </section>
    </>
  );
}
