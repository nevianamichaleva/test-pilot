"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { gameMatchesClass } from "@/data/games";
import { SUBJECT_THUMB_SRC } from "@/lib/subjectImages";

import styles from "./HomePage.module.css";
import igriStyles from "./igri/Igri.module.css";

const SUBJECTS = [
  {
    key: "bg",
    label: "Български език",
    icon: "📚",
    tone: "#fff6df",
    accent: "#f5a623",
    border: "#f5c56a",
  },
  {
    key: "matematika",
    label: "Математика",
    icon: "🧮",
    tone: "#eef4ff",
    accent: "#1e62d0",
    border: "#8fb4f0",
  },
  {
    key: "english",
    label: "Английски език",
    icon: "🇬🇧",
    tone: "#eaf3ff",
    accent: "#1e62d0",
    border: "#7eb0f2",
  },
  {
    key: "priroda",
    label: "Човек и природа",
    icon: "🧪",
    tone: "#e9f9ef",
    accent: "#28a745",
    border: "#7ad392",
  },
  {
    key: "istoriya",
    label: "История",
    icon: "🏛️",
    tone: "#f3ecff",
    accent: "#6f42c1",
    border: "#b89ae0",
  },
  {
    key: "geografia",
    label: "География",
    icon: "🌍",
    tone: "#e8f8ff",
    accent: "#0ea5c6",
    border: "#7ad4e8",
  },
  {
    key: "literatura",
    label: "Литература",
    icon: "✍️",
    tone: "#f7efff",
    accent: "#8b5cf6",
    border: "#c4a8f5",
  },
];

const CLASS_PILLS = [
  { label: "1. клас", classNum: "1" },
  { label: "2. клас", classNum: "2" },
  { label: "3. клас", classNum: "3" },
  { label: "4. клас", classNum: "4" },
  { label: "5. клас", classNum: "5" },
  { label: "6. клас", classNum: "6" },
  { label: "7. клас", classNum: "7" },
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
  if (g.kind === "did-you-know") return "Факти + кръстословица";
  if (g.kind === "history-review") return "5 мини-игри";
  if (g.kind === "bel-6") return "7 мини-игри";
  if (g.kind === "bel-train-driver") return "Подлог и сказуемо";
  if (g.kind === "bel-gift-boxes") return "Допълнение";
  if (g.kind === "bel-color-painter") return "Определение";
  if (g.kind === "sentence-builder") return "Конструктор";
  if (g.kind === "grammar-detective") return "Детектив";
  if (g.kind === "bridge-of-rules") return "Сравнения";
  if (g.kind === "signal-light") return "Сигнална лампа";
  if (g.kind === "verb-magnet") return "Магнит за глаголи";
  if (g.kind === "hint-hangman") return "Бесеница с подсказка";
  if (g.kind === "text-detective") return "Текст детектив";
  return `${g.questionCount} въпроса`;
}

function pluralTests(n) {
  if (n === 1) return "1 тест";
  return `${n} теста`;
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

  const testCountsBySubject = useMemo(() => {
    const pool = selectedClass
      ? tests.filter((t) => normalizeClassNum(t.classNum) === selectedClass)
      : tests;
    const counts = {};
    for (const t of pool) {
      if (!t.subject) continue;
      counts[t.subject] = (counts[t.subject] || 0) + 1;
    }
    return counts;
  }, [tests, selectedClass]);

  const subjectsShown = useMemo(() => {
    return SUBJECTS.filter((s) => (testCountsBySubject[s.key] || 0) > 0);
  }, [testCountsBySubject]);

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
      <section className={styles.classBar}>
        <div className={styles.classBarInner}>
          <p className={styles.classLabel}>
            <span className={styles.classLabelIcon} aria-hidden>
              🎓
            </span>
            Избери клас:
          </p>
          <div className={styles.classPills}>
            {visibleClassPills.map((c) => {
              const active = selectedClass === c.classNum;
              return (
                <button
                  key={c.classNum}
                  type="button"
                  className={`${styles.classPill}${active ? ` ${styles.classPillActive}` : ""}`}
                  onClick={() => toggleClass(c.classNum)}
                  aria-pressed={active}
                >
                  {active ? (
                    <span className={styles.classCheck} aria-hidden>
                      ✓
                    </span>
                  ) : null}
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon} aria-hidden>
              📖
            </span>
            Избери предмет
          </h2>
          <p className={styles.sectionHint}>
            {selectedClass
              ? `Предмети с тестове за ${selectedClass}. клас.`
              : "Разгледай предметите и избери тест, който да решиш."}
          </p>
        </div>

        {subjectsShown.length === 0 ? (
          <p className={styles.emptySubjects}>Няма тестове за този клас.</p>
        ) : (
          <div className={styles.cards}>
            {subjectsShown.map((s) => {
              const count = testCountsBySubject[s.key] || 0;
              return (
                <Link
                  key={s.key}
                  className={styles.card}
                  href={buildHref("/test-pilot", selectedClass, s.key)}
                  style={{
                    background: `linear-gradient(180deg, ${s.tone} 0%, #ffffff 72%)`,
                    borderColor: s.border,
                  }}
                >
                  <div className={styles.cardTop}>
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
                    <p className={styles.cardMeta}>{pluralTests(count)}</p>
                    <span
                      className={styles.cardBtn}
                      style={{ background: s.accent }}
                    >
                      Виж тестовете <span aria-hidden>→</span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon} aria-hidden>
              🎮
            </span>
            Хайде да поиграем
          </h2>
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
