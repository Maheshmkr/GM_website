import { createFileRoute } from "@tanstack/react-router";
import { SectionHeading } from "@/components/SectionHeading";
import { Letters } from "@/components/Letters";

const title = "Letters For You — Open When...";
const description =
  "Open-when letters written for your low days, your proud days and the days you miss me. Words from my heart.";

export const Route = createFileRoute("/letters")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: LettersPage,
});

function LettersPage() {
  return (
    <section className="section-shell py-10 lg:py-16">
      <SectionHeading title="Letters For You" subtitle="Words I wish I could say every day." />
      <Letters />
    </section>
  );
}
