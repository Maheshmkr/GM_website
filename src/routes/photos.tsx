import { createFileRoute } from "@tanstack/react-router";
import { SectionHeading } from "@/components/SectionHeading";
import { PhotoGallery } from "@/components/PhotoGallery";

const title = "Our Beautiful Memories — Photos";
const description =
  "Every picture holds a special moment with you: our trips, dates, candid smiles and the days I never want to forget.";

export const Route = createFileRoute("/photos")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: PhotosPage,
});

function PhotosPage() {
  return (
    <section className="section-shell py-10 lg:py-16">
      <SectionHeading
        title="Our Beautiful Memories"
        subtitle="Every picture holds a special moment with you."
      />
      <PhotoGallery />
    </section>
  );
}
