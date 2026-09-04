import { createFileRoute } from "@tanstack/react-router";
import { FunZone } from "@/components/fun/FunZone";

const title = "Fun Zone ❤️ — Interactive Character Game";
const description =
  "Playful interactive cartoon reactions! Select an action like Stone, Hand, Punch, Hit, Slap or Love and tap the picture for fun visual effects.";

export const Route = createFileRoute("/fun")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: FunPage,
});

function FunPage() {
  return <FunZone />;
}
