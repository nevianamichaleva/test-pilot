import Image from "next/image";
import Link from "next/link";

import styles from "./HomePage.module.css";
import { getAllTests } from "@/data/tests";

const SUBJECTS = [
  { key: "bg", label: "Български език", icon: "📚", tone: "#ffe1d5" },
  { key: "matematika", label: "Математика", icon: "🧮", tone: "#e6f1ff" },
  { key: "english", label: "Английски език", icon: "🇬🇧", tone: "#fff1cc" },
  { key: "priroda", label: "Човек и природа", icon: "🧪", tone: "#e6ffef" },
  { key: "istoriya", label: "История", icon: "🏛️", tone: "#ffe9d6" },
  { key: "geografia", label: "География", icon: "🌍", tone: "#e6f7ff" },
  { key: "literatura", label: "Литература", icon: "✍️", tone: "#f0eaff" },
];

const CLASS_PILLS = [
  { label: "1. клас", classNum: "1", tone: "pillOrange" },
  { label: "2. клас", classNum: "2", tone: "pillPink" },
  { label: "3. клас", classNum: "3", tone: "pillPurple" },
  { label: "4. клас", classNum: "4", tone: "pillTeal" },
  { label: "5. клас", classNum: "5", tone: "pillBlue" },
  { label: "6. клас", classNum: "6", tone: "pillRed" },
  { label: "7. клас", classNum: "7", tone: "pillGold" },
];

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
        <header className={styles.topbar}>
          <Link href="/" className={styles.brand}>
            <span className={styles.brandMark}>TP</span>
            <span>Учене и тестове</span>
          </Link>

          <nav className={styles.nav}>
            <Link href="/">Начало</Link>
            <Link href="/test-pilot">Тестове</Link>
            <Link href="/test-pilot/rezultati">Резултати</Link>
            <Link className={styles.ctaSmall} href="/test-pilot">
              Вход / Регистрация
            </Link>
          </nav>
        </header>

        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div>
              <h1>Тестове за ученици</h1>
              <p>
                Избери клас и предмет и започни да тестваш знанията си с кратки
                упражнения и тестове.
              </p>
              <div className={styles.heroActions}>
                <Link className={styles.cta} href="/test-pilot">
                  Започни сега <span aria-hidden>→</span>
                </Link>
                <Link className={styles.ghost} href="/test-pilot/7-nvo">
                  7. клас НВО
                </Link>
              </div>
            </div>

            <div className={styles.illustrationWrap}>
              <Image
                className={styles.illustration}
                src="/test-pilot.png"
                alt="Test Pilot"
                width={720}
                height={460}
                priority
              />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Избери клас</h2>
            <p className={styles.sectionHint}>Кликни клас, после предмет.</p>
          </div>
          <div className={styles.pillRow}>
            {CLASS_PILLS.map((c) => (
              <Link
                key={c.classNum}
                className={`${styles.pill} ${styles[c.tone]}`}
                href="/test-pilot"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Избери предмет</h2>
            <p className={styles.sectionHint}>Ще те отведем към списъка с тестове.</p>
          </div>

          <div className={styles.cards}>
            {SUBJECTS.map((s) => (
              <Link
                key={s.key}
                className={styles.card}
                href={`/test-pilot?subject=${encodeURIComponent(s.key)}`}
              >
                <div className={styles.cardTop} style={{ backgroundColor: s.tone }}>
                  <div className={styles.cardIcon} aria-hidden>
                    {s.icon}
                  </div>
                </div>
                <div className={styles.cardBody}>
                  <p className={styles.cardTitle}>{s.label}</p>
                  <p className={styles.cardMeta}>
                    Виж наличните тестове <span aria-hidden>→</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

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

