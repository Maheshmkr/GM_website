import { createFileRoute } from "@tanstack/react-router";
import { SectionHeading } from "@/components/SectionHeading";
import { Timeline } from "@/components/Timeline";
import { Surprise } from "@/components/Surprise";

const title = "Our Journey Timeline";
const description =
  "From the day we met to the adventures still ahead — a timeline of our beautiful journey together.";

export const Route = createFileRoute("/timeline")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: TimelinePage,
});

function TimelinePage() {
  return (
    <>
      <section className="section-shell py-10 lg:py-16">
        <SectionHeading
          title="Our Journey Timeline"
          subtitle="A timeline of our beautiful journey together."
        />
        <Timeline />
        <p className="mt-14 text-center text-sm text-muted-foreground">More memories to come...</p>
      </section>
      <Surprise />
    </>
  );
}
