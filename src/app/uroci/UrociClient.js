"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { getAllLessons } from "@/data/lessons";
import { SUBJECT_LABELS } from "@/lib/subjectLabels";

import styles from "./Uroci.module.css";

const SUBJECT_ORDER = [
  "bg",
  "matematika",
  "english",
  "geografia",
  "istoriya",
  "priroda",
  "literatura",
  "km",
  "filosofia",
];

function orderedSubjects(subjects) {
  const unique = [...new Set(subjects.filter(Boolean))];
  return [
    ...SUBJECT_ORDER.filter((s) => unique.includes(s)),
    ...unique.filter((s) => !SUBJECT_ORDER.includes(s)).sort(),
  ];
}

function normalizeSubject(subject, options) {
  const s = String(subject || "");
  return options.includes(s) ? s : "";
}

function buildUrociUrl(subject) {
  return subject ? `/uroci?subject=${encodeURIComponent(subject)}` : "/uroci";
}

export default function UrociClient() {
  const searchParams = useSearchParams();
  const lessons = useMemo(() => getAllLessons(), []);

  const subjectOptions = useMemo(
    () => orderedSubjects(lessons.map((l) => l.subject)),
    [lessons]
  );

  const qpSubject = normalizeSubject(searchParams?.get("subject") ?? "", subjectOptions);
  const [selectedSubject, setSelectedSubject] = useState(qpSubject);

  useEffect(() => {
    setSelectedSubject(qpSubject);
  }, [qpSubject]);

  const filtered = useMemo(() => {
    if (!selectedSubject) return lessons;
    return lessons.filter((l) => l.subject === selectedSubject);
  }, [lessons, selectedSubject]);

  const setSubject = (subject) => {
    const next = normalizeSubject(subject, subjectOptions);
    setSelectedSubject(next);
    const url = buildUrociUrl(next);
    if (typeof window !== "undefined") {
      window.history.replaceState(window.history.state, "", url);
    }
  };

  return (
    <>
      {subjectOptions.length > 0 ? (
        <div className={styles.subjectFilters} role="group" aria-label="Филтър по предмет">
          <button
            type="button"
            className={`${styles.subjectPill}${!selectedSubject ? ` ${styles.subjectPillActive}` : ""}`}
            onClick={() => setSubject("")}
            aria-pressed={!selectedSubject}
          >
            Всички предмети
          </button>
          {subjectOptions.map((s) => (
            <button
              key={s}
              type="button"
              className={`${styles.subjectPill}${selectedSubject === s ? ` ${styles.subjectPillActive}` : ""}`}
              onClick={() => setSubject(s)}
              aria-pressed={selectedSubject === s}
            >
              {SUBJECT_LABELS[s] ?? s}
            </button>
          ))}
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <p className={styles.empty}>
          {selectedSubject
            ? "Няма уроци за избрания предмет."
            : "Още няма публикувани уроци."}
        </p>
      ) : (
        <div className={styles.list}>
          {filtered.map((l) => (
            <Link
              key={`${l.classNum}|${l.subject}|${l.slug}`}
              href={`/uroci/${encodeURIComponent(l.classNum)}/${encodeURIComponent(l.subject)}/${encodeURIComponent(l.slug)}`}
              className={styles.lessonCard}
            >
              <div className={styles.lessonCardThumb}>
                {l.image || l.textbookImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={l.image || l.textbookImage} alt="" />
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
    </>
  );
}
