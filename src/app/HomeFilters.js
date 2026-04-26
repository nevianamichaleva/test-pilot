"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { SUBJECT_THUMB_SRC } from "@/lib/subjectImages";

import styles from "./HomePage.module.css";

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

function buildTestPilotHref(classNum, subjectKey) {
  const p = new URLSearchParams();
  if (classNum) p.set("class", classNum);
  if (subjectKey) p.set("subject", subjectKey);
  const q = p.toString();
  return q ? `/test-pilot?${q}` : "/test-pilot";
}

export default function HomeFilters({ tests }) {
  const [selectedClass, setSelectedClass] = useState("");

  const classesWithTests = useMemo(() => {
    const set = new Set(tests.map((t) => normalizeClassNum(t.classNum)));
    return new Set([...set].filter(Boolean));
  }, [tests]);

  const visibleClassPills = useMemo(
    () => CLASS_PILLS.filter((c) => classesWithTests.has(c.classNum)),
    [classesWithTests]
  );

  const subjectsShown = useMemo(() => {
    const pool = selectedClass
      ? tests.filter((t) => normalizeClassNum(t.classNum) === selectedClass)
      : tests;
    const keys = new Set(pool.map((t) => t.subject).filter(Boolean));
    return SUBJECTS.filter((s) => keys.has(s.key));
  }, [tests, selectedClass]);

  const toggleClass = (classNum) => {
    setSelectedClass((prev) => (prev === classNum ? "" : classNum));
  };

  return (
    <>
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Избери клас</h2>
          <p className={styles.sectionHint}>
            Изборът филтрира предметите по-долу. Повторно кликване маха филтъра.
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
                href={buildTestPilotHref(selectedClass, s.key)}
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
    </>
  );
}
