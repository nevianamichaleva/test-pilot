import Link from "next/link";

import PageHero from "@/components/PageHero";
import HomeFilters from "./HomeFilters";
import styles from "./HomePage.module.css";
import { getAllTests } from "@/data/tests";

export const metadata = {
  alternates: { canonical: "/" },
};

function pickPopular(tests, count = 3) {
  return [...tests]
    .sort((a, b) => (b.questionCount ?? 0) - (a.questionCount ?? 0))
    .slice(0, count);
}

export default function Home() {
  const tests = getAllTests();
  const popular = pickPopular(tests, 3);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHero
          variant="home"
          title="Тестове за ученици"
          subtitle="Избери клас и предмет и започни да тестваш знанията си с кратки упражнения и тестове."
          actions={
            <div className={styles.heroActionRow}>
              <Link className={styles.cta} href="/test-pilot">
                Започни сега <span aria-hidden>→</span>
              </Link>
              <Link className={styles.ghost} href="/test-pilot/7-nvo">
                7. клас НВО
              </Link>
            </div>
          }
        />

        <HomeFilters tests={tests} />

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Популярни тестове</h2>
            <p className={styles.sectionHint}>Подбрани по най-много въпроси.</p>
          </div>

          <div className={styles.popularGrid}>
            {popular.map((t) => (
              <Link
                key={`${t.classNum}|${t.subject}|${t.slug}`}
                className={styles.popularCard}
                href={`/test-pilot/${encodeURIComponent(t.classNum)}/${encodeURIComponent(
                  t.subject
                )}/${encodeURIComponent(t.slug)}`}
              >
                <div className={styles.popularThumb} />
                <div className={styles.popularBody}>
                  <p className={styles.popularTitle}>{t.title}</p>
                  <p className={styles.popularMeta}>
                    {t.questionCount} въпроса • {t.classNum}. клас
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className={styles.moreWrap}>
            <Link className={styles.moreBtn} href="/test-pilot">
              Виж всички тестове <span aria-hidden>›</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

