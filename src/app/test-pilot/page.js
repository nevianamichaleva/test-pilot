import { Suspense } from "react";

import TestPilotClient from "./TestPilotClient";

export default function TestPilotPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
          Зареждане...
        </div>
      }
    >
      <TestPilotClient />
    </Suspense>
  );
}
