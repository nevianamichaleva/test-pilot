"use client";

import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase";
import { getThumbnailSrcFromTestId, SUBJECT_THUMB_SRC } from "@/lib/subjectImages";

import tp from "../TestPilot.module.css";
import styles from "./Rezultati.module.css";

const SUBJECT_LABELS = {
  bg: "Български език",
  english: "Английски език",
  geografia: "География",
  istoriya: "История",
  matematika: "Математика",
  literatura: "Литература",
  priroda: "Човек и природа",
};

const SUBJECT_ORDER = ["bg", "english", "geografia", "istoriya", "matematika", "priroda", "literatura"];
const DATE_FILTERS = [
  { value: "7d", label: "Последните 7 дни" },
  { value: "30d", label: "Последните 30 дни" },
  { value: "all", label: "Всички" },
];

/** Извлича предмет от testId (напр. "5|bg|morfolojiya" -> "bg"). */
function getSubject(testId) {
  if (!testId || typeof testId !== "string") return null;
  const parts = testId.split("|");
  return parts.length >= 2 ? parts[1] : null;
}

/** Извлича числова оценка от assessment (напр. "5 (Отличен)" -> 5). */
function getGradeFromAssessment(assessment) {
  if (!assessment || typeof assessment !== "string") return 0;
  const num = parseFloat(assessment);
  return Number.isFinite(num) ? num : 0;
}

/** Преобразува Firestore Timestamp / обект във native Date. */
function toJsDate(timestamp) {
  if (!timestamp) return null;
  try {
    if (timestamp.toDate) return timestamp.toDate();
    if (typeof timestamp.seconds === "number") return new Date(timestamp.seconds * 1000);
  } catch {
    // ignore
  }
  return null;
}

/** Форматира дата от Firestore Timestamp или обект. */
function formatDate(timestamp) {
  const date = toJsDate(timestamp);
  if (!date) return "–";
  return date.toLocaleDateString("bg-BG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function RezultatiPage() {
  const router = useRouter();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState("7d");

  useEffect(() => {
    let cancelled = false;
    async function fetchResults() {
      try {
        if (!isFirebaseConfigured()) {
          if (!cancelled) {
            setError(
              "Firebase не е конфигуриран. Създай `.env.local` от `.env.example` и попълни `NEXT_PUBLIC_FIREBASE_*` стойностите."
            );
          }
          return;
        }

        const db = getFirebaseDb();
        if (!db) {
          if (!cancelled) setError("Firebase не може да се инициализира (липсва конфигурация).");
          return;
        }

        const snap = await getDocs(collection(db, "results"));
        if (cancelled) return;
        const list = [];
        snap.forEach((doc) => {
          const data = doc.data();
          list.push({
            id: doc.id,
            name: data.name || "Анонимен",
            points: data.points || "–",
            assessment: data.assessment || "–",
            test: data.test || "",
            testTitle: data.testTitle || data.test || "–",
            createdAt: data.createdAt ?? null,
            subject: getSubject(data.test),
            grade: getGradeFromAssessment(data.assessment),
          });
        });
        list.sort((a, b) => {
          if (!a.createdAt) return 1;
          if (!b.createdAt) return -1;
          try {
            const tA = a.createdAt.toDate ? a.createdAt.toDate() : new Date(0);
            const tB = b.createdAt.toDate ? b.createdAt.toDate() : new Date(0);
            return tB.getTime() - tA.getTime();
          } catch {
            return 0;
          }
        });
        setResults(list);
      } catch (err) {
        if (!cancelled) setError(err?.message || "Грешка при зареждане.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchResults();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredResults = useMemo(() => {
    if (dateFilter === "all") return results;
    const days = dateFilter === "30d" ? 30 : 7;
    const from = Date.now() - days * 24 * 60 * 60 * 1000;
    return results.filter((r) => {
      const d = toJsDate(r.createdAt);
      return d ? d.getTime() >= from : false;
    });
  }, [results, dateFilter]);

  const bySubject = {};
  filteredResults.forEach((r) => {
    const sub = r.subject || "друг";
    if (!bySubject[sub]) bySubject[sub] = [];
    bySubject[sub].push(r);
  });
  SUBJECT_ORDER.forEach((s) => {
    if (bySubject[s]) bySubject[s].sort((a, b) => b.grade - a.grade);
  });
  const otherSubject = bySubject["друг"];
  if (otherSubject) otherSubject.sort((a, b) => b.grade - a.grade);

  return (
    <div className={tp.page}>
      <main className={tp.wrap}>
        <PageHero
          variant="page"
          title="Резултати от тестовете"
          subtitle="Последните 15 резултата и класация по предмет."
          actions={
            <Link href="/test-pilot" className={styles.backLink}>
              Към тестовете <span aria-hidden>›</span>
            </Link>
          }
        />

        {loading && (
          <p className={`${styles.message} ${styles.messageCenter}`}>Зареждане...</p>
        )}

        {error && !results.length && <p className={styles.messageError}>{error}</p>}

        {!loading && filteredResults.length === 0 && !error && (
          <p className={`${styles.message} ${styles.messageCenter}`}>
            Все още няма записани резултати. Резултатите се записват автоматично при завършване на тест.
          </p>
        )}

        {!loading && filteredResults.length > 0 && (
          <>
            <section className={styles.panel}>
              <div className={styles.panelHeadRow}>
                <h2 className={styles.panelHead}>Резултати</h2>
                <label className={styles.filterWrap}>
                  <span className={styles.filterLabel}>Период:</span>
                  <select
                    className={styles.filterSelect}
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  >
                    {DATE_FILTERS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className={styles.tableScroll}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Дата</th>
                      <th>Име</th>
                      <th>Предмет</th>
                      <th>Тест</th>
                      <th>Точки</th>
                      <th>Оценка</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResults.map((r) => {
                      const subThumb = getThumbnailSrcFromTestId(r.test);
                      return (
                      <tr
                        key={r.id}
                        className={styles.clickableRow}
                        onClick={() => router.push(`/test-pilot/rezultati/${r.id}`)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            router.push(`/test-pilot/rezultati/${r.id}`);
                          }
                        }}
                        tabIndex={0}
                        role="button"
                        aria-label={`Детайли за резултат на ${r.name}`}
                      >
                        <td className={styles.cellMuted}>{formatDate(r.createdAt)}</td>
                        <td className={styles.cellStrong}>{r.name}</td>
                        <td>
                          <span className={styles.subjectCell}>
                            {subThumb ? (
                              <img
                                className={styles.subjectThumb}
                                src={subThumb}
                                alt=""
                                width={40}
                                height={40}
                                decoding="async"
                              />
                            ) : null}
                            <span>{SUBJECT_LABELS[r.subject] || r.subject || "–"}</span>
                          </span>
                        </td>
                        <td>
                          <span className={styles.truncate} title={r.testTitle}>
                            {r.testTitle}
                          </span>
                        </td>
                        <td>{r.points}</td>
                        <td className={styles.cellStrong}>{r.assessment}</td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            <h2 className={styles.sectionTitle}>Класация по предмет</h2>
            <div className={styles.rankGrid}>
              {SUBJECT_ORDER.filter((s) => bySubject[s]?.length).map((subject) => (
                <div key={subject} className={styles.panel}>
                  <h3 className={`${styles.panelHead} ${styles.panelHeadIconRow}`}>
                    {SUBJECT_THUMB_SRC[subject] ? (
                      <img
                        className={styles.panelSubjectIcon}
                        src={SUBJECT_THUMB_SRC[subject]}
                        alt=""
                        width={44}
                        height={44}
                        decoding="async"
                      />
                    ) : null}
                    <span>{SUBJECT_LABELS[subject]}</span>
                  </h3>
                  <ol className={styles.rankList}>
                    {bySubject[subject].slice(0, 10).map((r, i) => (
                      <li key={r.id} className={styles.rankItem}>
                        <span className={styles.rankLeft}>
                          <span className={styles.rankNum}>{i + 1}.</span>
                          <span className={styles.rankName}>{r.name}</span>
                        </span>
                        <span className={styles.rankMeta}>
                          {r.assessment}{" "}
                          <span className={styles.cellMuted}>({r.points})</span>
                        </span>
                      </li>
                    ))}
                  </ol>
                  {bySubject[subject].length > 10 && (
                    <p className={styles.rankFoot}>и още {bySubject[subject].length - 10} резултата</p>
                  )}
                </div>
              ))}
              {otherSubject?.length > 0 && (
                <div className={styles.panel}>
                  <h3 className={styles.panelHead}>Други</h3>
                  <ol className={styles.rankList}>
                    {otherSubject.slice(0, 10).map((r, i) => (
                      <li key={r.id} className={styles.rankItem}>
                        <span className={styles.rankLeft}>
                          <span className={styles.rankNum}>{i + 1}.</span>
                          <span className={styles.rankName}>{r.name}</span>
                        </span>
                        <span className={styles.rankMeta}>
                          {r.assessment}{" "}
                          <span className={styles.cellMuted}>({r.points})</span>
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
