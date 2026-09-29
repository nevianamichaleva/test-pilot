import Link from "next/link";

import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { getAllLessons } from "@/data/lessons";
import { SUBJECT_LABELS } from "@/lib/subjectLabels";

import styles from "./Uroci.module.css";

export const metadata = {
  title: "Уроци",
  description: "Кратки уроци на достъпен език по предмети за ученици.",
  alternates: { canonical: "/uroci" },
};

export default function UrociPage() {
  const lessons = getAllLessons();

  return (
    <div className={styles.page}>
      <main className={`${styles.wrap} ${styles.wrapWide}`}>
        <PageHero
          variant="page"
          title="Уроци"
          subtitle="Кратки обяснения на най-важното — без излишни думи."
        />

        {lessons.length === 0 ? (
          <p className={styles.empty}>Още няма публикувани уроци.</p>
        ) : (
          <div className={styles.list}>
            {lessons.map((l) => (
              <Link
                key={`${l.classNum}|${l.subject}|${l.slug}`}
                href={`/uroci/${encodeURIComponent(l.classNum)}/${encodeURIComponent(l.subject)}/${encodeURIComponent(l.slug)}`}
                className={styles.lessonCard}
              >
                <div className={styles.lessonCardThumb}>
                  {l.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={l.image} alt="" />
                  ) : (
                    <span aria-hidden>📘</span>
                  )}
                </div>
                <div className={styles.lessonCardBody}>
                  <p className={styles.lessonCardMeta}>
                    {l.classNum}. клас · {SUBJECT_LABELS[l.subject] ?? l.subject}
                  </p>
                  <h2 className={styles.lessonCardTitle}>{l.title}</h2>
                  {l.subtitle ? <p className={styles.lessonCardDesc}>{l.subtitle}</p> : null}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
