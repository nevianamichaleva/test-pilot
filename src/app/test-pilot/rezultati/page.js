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
const STATUS_FILTERS = [
  { value: "all", label: "Всички" },
  { value: "in_progress", label: "Само незавършени" },
  { value: "completed", label: "Само завършени" },
];

/** Извлича предмет от testId (напр. "5|bg|morfolojiya" -> "bg"). */
function getSubject(testId) {
  if (!testId || typeof testId !== "string") return null;
  const parts = testId.split("|");
  return parts.length >= 2 ? parts[1] : null;
}

/** Преобразува Firestore Timestamp / обект във native Date. */
function toJsDate(timestamp) {
  if (!timestamp) return null;
  if (timestamp instanceof Date) return timestamp;
  try {
    if (timestamp.toDate) return timestamp.toDate();
    if (typeof timestamp.seconds === "number") return new Date(timestamp.seconds * 1000);
  } catch {
    // ignore
  }
  return null;
}

function parseIsoDate(isoValue) {
  if (typeof isoValue !== "string" || !isoValue.trim()) return null;
  const d = new Date(isoValue);
  return Number.isNaN(d.getTime()) ? null : d;
}

function getStartDateFromResult(r) {
  return parseIsoDate(r.startedAtIso) || toJsDate(r.createdAt) || null;
}

function isResultCompleted(data) {
  if (!data || typeof data !== "object") return false;
  if (data.completed === true) return true;
  if (typeof data.status === "string" && data.status.toLowerCase() === "completed") return true;
  if (data.completedAt) return true;
  return false;
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
  const [gamePlays, setGamePlays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState("7d");
  const [statusFilter, setStatusFilter] = useState("all");

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

        const [resultsSnap, gamesSnap] = await Promise.all([
          getDocs(collection(db, "results")),
          getDocs(collection(db, "gamePlayEvents")),
        ]);
        if (cancelled) return;

        const list = [];
        resultsSnap.forEach((docSnap) => {
          const data = docSnap.data();
          const testId = data.test || "";
          list.push({
            id: docSnap.id,
            name: data.name || "Анонимен",
            points: data.points || "–",
            assessment: data.assessment || "–",
            test: testId,
            testTitle: data.testTitle || testId || "–",
            createdAt: data.createdAt ?? null,
            updatedAt: data.updatedAt ?? null,
            startedAtIso: data.startedAtIso || null,
            status: data.status || "completed",
            completed: isResultCompleted(data),
            progressText: data.progressText || "",
            subject: data.subject || getSubject(testId),
            source:
              data.source === "game" || String(testId).startsWith("game|") ? "game" : "test",
          });
        });
        list.sort((a, b) => {
          const tA = getStartDateFromResult(a)?.getTime() ?? 0;
          const tB = getStartDateFromResult(b)?.getTime() ?? 0;
          return tB - tA;
        });
        setResults(list);

        const plays = [];
        gamesSnap.forEach((docSnap) => {
          const data = docSnap.data();
          plays.push({
            id: docSnap.id,
            slug: data.slug || "",
            title: data.title || data.slug || "Игра",
            subject: data.subject || "",
            subjectLabel: data.subjectLabel || SUBJECT_LABELS[data.subject] || data.subject || "–",
            classHint: data.classHint || "",
            kind: data.kind || "",
            startedAtIso: data.startedAtIso || null,
            createdAt: data.createdAt ?? null,
          });
        });
        plays.sort((a, b) => {
          const tA = getStartDateFromResult(a)?.getTime() ?? 0;
          const tB = getStartDateFromResult(b)?.getTime() ?? 0;
          return tB - tA;
        });
        setGamePlays(plays);
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
    const byStatus = results.filter((r) => {
      if (statusFilter === "all") return true;
      if (statusFilter === "completed") return r.completed === true;
      if (statusFilter === "in_progress") return r.completed !== true;
      return true;
    });
    if (dateFilter === "all") return byStatus;
    const days = dateFilter === "30d" ? 30 : 7;
    const from = Date.now() - days * 24 * 60 * 60 * 1000;
    return byStatus.filter((r) => {
      const d = getStartDateFromResult(r);
      return d ? d.getTime() >= from : false;
    });
  }, [results, dateFilter, statusFilter]);

  const filteredGamePlays = useMemo(() => {
    if (dateFilter === "all") return gamePlays;
    const days = dateFilter === "30d" ? 30 : 7;
    const from = Date.now() - days * 24 * 60 * 60 * 1000;
    return gamePlays.filter((p) => {
      const d = getStartDateFromResult(p);
      return d ? d.getTime() >= from : false;
    });
  }, [gamePlays, dateFilter]);

  const gameInterest = useMemo(() => {
    const bySlug = new Map();
    for (const play of filteredGamePlays) {
      const key = play.slug || play.title;
      const prev = bySlug.get(key);
      if (!prev) {
        bySlug.set(key, {
          slug: play.slug,
          title: play.title,
          subject: play.subject,
          subjectLabel: play.subjectLabel,
          classHint: play.classHint,
          count: 1,
          lastPlayedAt: getStartDateFromResult(play),
        });
      } else {
        prev.count += 1;
        const d = getStartDateFromResult(play);
        if (d && (!prev.lastPlayedAt || d.getTime() > prev.lastPlayedAt.getTime())) {
          prev.lastPlayedAt = d;
        }
      }
    }
    return [...bySlug.values()].sort((a, b) => b.count - a.count || a.title.localeCompare(b.title, "bg"));
  }, [filteredGamePlays]);

  const bySubject = {};
  filteredResults.forEach((r) => {
    const sub = r.subject || "друг";
    if (!bySubject[sub]) bySubject[sub] = [];
    bySubject[sub].push(r);
  });
  SUBJECT_ORDER.forEach((s) => {
    if (bySubject[s]) bySubject[s].sort((a, b) => {
      const tA = getStartDateFromResult(a)?.getTime() ?? 0;
      const tB = getStartDateFromResult(b)?.getTime() ?? 0;
      return tB - tA;
    });
  });
  const otherSubject = bySubject["друг"];
  if (otherSubject) {
    otherSubject.sort((a, b) => {
      const tA = getStartDateFromResult(a)?.getTime() ?? 0;
      const tB = getStartDateFromResult(b)?.getTime() ?? 0;
      return tB - tA;
    });
  }

  const hasAnyData = filteredResults.length > 0 || filteredGamePlays.length > 0;

  return (
    <div className={tp.page}>
      <main className={tp.wrap}>
        <PageHero
          variant="page"
          title="Резултати"
          subtitle="Резултати от тестове и игри (грешно/вярно), плюс интерес към игрите."
          actions={
            <Link href="/test-pilot" className={styles.backLink}>
              Към тестовете <span aria-hidden>›</span>
            </Link>
          }
        />

        {loading && (
          <p className={`${styles.message} ${styles.messageCenter}`}>Зареждане...</p>
        )}

        {error && !results.length && !gamePlays.length && <p className={styles.messageError}>{error}</p>}

        {!loading && !hasAnyData && !error && (
          <p className={`${styles.message} ${styles.messageCenter}`}>
            Все още няма записани резултати. Тестовете и игрите записват грешно/вярно при завършване; отварянията на игри — при старт.
          </p>
        )}

        {!loading && (results.length > 0 || gamePlays.length > 0) && (
          <section className={styles.panel}>
            <div className={styles.panelHeadRow}>
              <h2 className={styles.panelHead}>Филтри</h2>
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
              <label className={styles.filterWrap}>
                <span className={styles.filterLabel}>Статус (тестове):</span>
                <select
                  className={styles.filterSelect}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {STATUS_FILTERS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>
        )}

        {!loading && filteredGamePlays.length > 0 && (
          <section className={styles.panel}>
            <div className={styles.panelHeadRow}>
              <h2 className={styles.panelHead}>Интерес към игрите</h2>
              <span className={styles.filterLabel}>
                {filteredGamePlays.length}{" "}
                {filteredGamePlays.length === 1 ? "отваряне" : "отваряния"}
              </span>
            </div>
            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Игра</th>
                    <th>Предмет</th>
                    <th>Клас</th>
                    <th>Отваряния</th>
                    <th>Последно</th>
                  </tr>
                </thead>
                <tbody>
                  {gameInterest.map((g, i) => (
                    <tr key={g.slug || g.title}>
                      <td className={styles.cellMuted}>{i + 1}</td>
                      <td className={styles.cellStrong}>{g.title}</td>
                      <td>
                        <span className={styles.subjectCell}>
                          {SUBJECT_THUMB_SRC[g.subject] ? (
                            <img
                              className={styles.subjectThumb}
                              src={SUBJECT_THUMB_SRC[g.subject]}
                              alt=""
                              width={40}
                              height={40}
                              decoding="async"
                            />
                          ) : null}
                          <span>{g.subjectLabel}</span>
                        </span>
                      </td>
                      <td>{g.classHint || "–"}</td>
                      <td className={styles.cellStrong}>{g.count}</td>
                      <td className={styles.cellMuted}>{formatDate(g.lastPlayedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {!loading && filteredResults.length > 0 && (
          <>
            <section className={styles.panel}>
              <div className={styles.panelHeadRow}>
                <h2 className={styles.panelHead}>Резултати от тестове и игри</h2>
              </div>
              <div className={styles.tableScroll}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Дата</th>
                      <th>Статус</th>
                      <th>Име</th>
                      <th>Предмет</th>
                      <th>Тест / игра</th>
                      <th>Резултат</th>
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
                        <td className={styles.cellMuted}>
                          {formatDate(getStartDateFromResult(r))}
                        </td>
                        <td className={styles.cellStrong}>
                          {r.completed ? "✓" : "x"}
                        </td>
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
                            {r.source === "game" ? `Игра · ${r.testTitle}` : r.testTitle}
                          </span>
                        </td>
                        <td>{r.completed ? r.points : r.progressText || r.points || "–"}</td>
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
                          {r.completed ? r.points : r.progressText || "Незавършен"}
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
                          {r.completed ? r.points : r.progressText || "Незавършен"}
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
