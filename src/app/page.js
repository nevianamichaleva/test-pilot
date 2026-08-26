import Link from "next/link";

import PageHero from "@/components/PageHero";
import HomeFilters from "./HomeFilters";
import styles from "./HomePage.module.css";
import { getAllGames } from "@/data/games";
import { getAllTests } from "@/data/tests";
import { getTestListThumbnailSrc } from "@/lib/subjectImages";

export const metadata = {
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

function pickPopular(tests, count = 3) {
  return [...tests]
    .sort((a, b) => (b.questionCount ?? 0) - (a.questionCount ?? 0))
    .slice(0, count);
}

const HERO_FEATURES = [
  { icon: "🧠", label: "Затвърди знанията си" },
  { icon: "🎮", label: "Учи чрез игра" },
  { icon: "📊", label: "Проследявай своя напредък" },
];

export default function Home() {
  const tests = getAllTests();
  const popular = pickPopular(tests, 3);
  const games = getAllGames().filter((g) => g.status === "ready");

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHero
          variant="home"
          title="Образователни тестове и игри"
          subtitle="Учи по-лесно. Провери и надгради знанията си!"
          features={HERO_FEATURES}
          imageAlt="Пилотче в самолет – TestPilot"
          actions={
            <div className={styles.heroActionRow}>
              <Link className={styles.cta} href="/test-pilot">
                <span className={styles.ctaPlay} aria-hidden>
                  ▶
                </span>
                Започни тест
                <span aria-hidden>→</span>
              </Link>
              <Link className={styles.ctaGames} href="/igri">
                <span aria-hidden>🎮</span>
                Хайде да поиграем
                <span aria-hidden>→</span>
              </Link>
            </div>
          }
        />

        <HomeFilters tests={tests} games={games} />

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon} aria-hidden>
                🔥
              </span>
              Популярни тестове
            </h2>
            <p className={styles.sectionHint}>Подбрани по най-много въпроси.</p>
          </div>

          <div className={styles.popularGrid}>
            {popular.map((t) => {
              const thumbSrc = getTestListThumbnailSrc(t);
              return (
                <Link
                  key={`${t.classNum}|${t.subject}|${t.slug}`}
                  className={styles.popularCard}
                  href={`/test-pilot/${encodeURIComponent(t.classNum)}/${encodeURIComponent(
                    t.subject
                  )}/${encodeURIComponent(t.slug)}`}
                >
                  <div
                    className={`${styles.popularThumb}${thumbSrc ? ` ${styles.popularThumbWithImage}` : ""}`}
                  >
                    {thumbSrc ? (
                      <img className={styles.popularThumbImg} src={thumbSrc} alt="" decoding="async" />
                    ) : null}
                  </div>
                  <div className={styles.popularBody}>
                    <p className={styles.popularTitle}>{t.title}</p>
                    <p className={styles.popularMeta}>
                      {t.questionCount} въпроса • {t.classNum}. клас
                    </p>
                  </div>
                </Link>
              );
            })}
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
