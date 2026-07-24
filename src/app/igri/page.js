import { Suspense } from "react";

import IgriClient from "./IgriClient";

export const metadata = {
  title: "Образователни игри",
  description:
    "Образователни игри за ученици: бързи упражнения по български език, география и други предмети. Филтрирай по клас и предмет.",
  alternates: { canonical: "/igri" },
  openGraph: {
    title: "Образователни игри | Test Pilot",
    description:
      "Игри за учене с бързи въпроси по училищни предмети. Избери клас и предмет.",
  },
};

export default function IgriPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>Зареждане...</div>
      }
    >
      <IgriClient />
    </Suspense>
  );
}
