"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

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
];

function orderedSubjects(subjects) {
  const unique = [...new Set(subjects.filter(Boolean))];
  return [
    ...SUBJECT_ORDER.filter((s) => unique.includes(s)),
    ...unique.filter((s) => !SUBJECT_ORDER.includes(s)).sort(),
  ];
}

export default function UrociClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lessons = useMemo(() => getAllLessons(), []);

  const subjectOptions = useMemo(
    () => orderedSubjects(lessons.map((l) => l.subject)),
    [lessons]
  );

  const qpSubject = searchParams?.get("subject") ?? "";
  const selectedSubject = subjectOptions.includes(qpSubject) ? qpSubject : "";

  const filtered = useMemo(() => {
    if (!selectedSubject) return lessons;
    return lessons.filter((l) => l.subject === selectedSubject);
  }, [lessons, selectedSubject]);

  const setSubject = (subject) => {
    const p = new URLSearchParams();
    if (subject) p.set("subject", subject);
    const q = p.toString();
    router.replace(q ? `/uroci?${q}` : "/uroci", { scroll: false });
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
    </>
  );
}
