import { Suspense } from "react";

import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";

import UrociClient from "./UrociClient";
import styles from "./Uroci.module.css";

export const metadata = {
  title: "Уроци",
  description: "Кратки уроци на достъпен език по предмети за ученици.",
  alternates: { canonical: "/uroci" },
};

export default function UrociPage() {
  return (
    <div className={styles.page}>
      <main className={`${styles.wrap} ${styles.wrapWide}`}>
        <PageHero
          variant="page"
          title="Уроци"
          subtitle="Кратки обяснения на най-важното — без излишни думи."
        />

        <Suspense
          fallback={<p className={styles.empty}>Зареждане на уроците…</p>}
        >
          <UrociClient />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
