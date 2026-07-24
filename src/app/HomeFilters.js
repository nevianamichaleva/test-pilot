"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { gameMatchesClass } from "@/data/games";
import { SUBJECT_THUMB_SRC } from "@/lib/subjectImages";

import styles from "./HomePage.module.css";
import igriStyles from "./igri/Igri.module.css";

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

function normalizeClassNum(classNum) {
  const n = Number(classNum);
  return Number.isFinite(n) ? String(n) : String(classNum ?? "");
}

function buildHref(basePath, classNum, subjectKey) {
  const p = new URLSearchParams();
  if (classNum) p.set("class", classNum);
  if (subjectKey) p.set("subject", subjectKey);
  const q = p.toString();
  return q ? `${basePath}?${q}` : basePath;
}

function gameMetaLabel(g) {
  if (g.kind === "geo-mode") return "Мини-игра";
  return `${g.questionCount} въпроса`;
}

export default function HomeFilters({ tests, games = [] }) {
  const [selectedClass, setSelectedClass] = useState("");

  const classesWithContent = useMemo(() => {
    const set = new Set(tests.map((t) => normalizeClassNum(t.classNum)).filter(Boolean));
    for (const g of games) {
      for (const c of g.classNums ?? []) {
        if (c) set.add(normalizeClassNum(c));
      }
    }
    return set;
  }, [tests, games]);

  const visibleClassPills = useMemo(
    () => CLASS_PILLS.filter((c) => classesWithContent.has(c.classNum)),
    [classesWithContent]
  );

  const subjectsShown = useMemo(() => {
    const pool = selectedClass
      ? tests.filter((t) => normalizeClassNum(t.classNum) === selectedClass)
      : tests;
    const keys = new Set(pool.map((t) => t.subject).filter(Boolean));
    return SUBJECTS.filter((s) => keys.has(s.key));
  }, [tests, selectedClass]);

  const filteredGames = useMemo(() => {
    const ready = games.filter((g) => g.status === "ready");
    const pool = selectedClass
      ? ready.filter((g) => gameMatchesClass(g, selectedClass))
      : ready;
    return pool.slice(0, 6);
  }, [games, selectedClass]);

  const gamesHref = buildHref("/igri", selectedClass, "");

  const toggleClass = (classNum) => {
    setSelectedClass((prev) => (prev === classNum ? "" : classNum));
  };

  return (
    <>
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Избери клас</h2>
          <p className={styles.sectionHint}>
            Изборът филтрира предметите и игрите по-долу. Повторно кликване маха филтъра.
          </p>
        </div>
        <div className={styles.pillRow}>
          {visibleClassPills.map((c) => (
            <button
              key={c.classNum}
              type="button"
              className={`${styles.pill} ${styles[c.tone]} ${selectedClass === c.classNum ? styles.pillSelected : ""}`}
              onClick={() => toggleClass(c.classNum)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Избери предмет</h2>
          <p className={styles.sectionHint}>
            {selectedClass
              ? `Предмети с тестове за ${selectedClass}. клас.`
              : "Всички предмети с тестове в платформата."}
          </p>
        </div>

        {subjectsShown.length === 0 ? (
          <p className={styles.emptySubjects}>Няма тестове за този клас.</p>
        ) : (
          <div className={styles.cards}>
            {subjectsShown.map((s) => (
              <Link
                key={s.key}
                className={styles.card}
                href={buildHref("/test-pilot", selectedClass, s.key)}
              >
                <div className={styles.cardTop} style={{ backgroundColor: s.tone }}>
                  {SUBJECT_THUMB_SRC[s.key] ? (
                    <img
                      className={styles.cardSubjectImg}
                      src={SUBJECT_THUMB_SRC[s.key]}
                      alt=""
                      width={96}
                      height={96}
                      decoding="async"
                    />
                  ) : (
                    <div className={styles.cardIcon} aria-hidden>
                      {s.icon}
                    </div>
                  )}
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
        )}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Образователни игри</h2>
          <p className={styles.sectionHint}>
            {selectedClass
              ? `Игри за ${selectedClass}. клас.`
              : "Кратки игри за упражнение с моментален резултат."}
          </p>
        </div>

        {filteredGames.length === 0 ? (
          <p className={styles.emptySubjects}>
            {selectedClass ? `Няма игри за ${selectedClass}. клас.` : "Скоро ще има нови игри."}
          </p>
        ) : (
          <div className={styles.popularGrid}>
            {filteredGames.map((g) => (
              <Link
                key={g.slug}
                className={igriStyles.homeCard}
                href={`/igri/${encodeURIComponent(g.slug)}`}
                style={{ borderColor: g.accent ? `${g.accent}55` : undefined }}
              >
                <div className={igriStyles.homeThumb} style={{ "--tone": g.tone }} aria-hidden>
                  {g.image ? (
                    <img className={igriStyles.homeThumbImg} src={g.image} alt="" decoding="async" />
                  ) : (
                    <span className={igriStyles.homeThumbMark}>▶</span>
                  )}
                </div>
                <div className={igriStyles.homeBody}>
                  <p className={igriStyles.homeTitle}>{g.title}</p>
                  <p className={igriStyles.homeMeta}>
                    {g.subjectLabel} · {gameMetaLabel(g)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className={styles.moreWrap}>
          <Link className={styles.moreBtn} href={gamesHref}>
            Виж всички игри <span aria-hidden>›</span>
          </Link>
        </div>
      </section>
    </>
  );
}
