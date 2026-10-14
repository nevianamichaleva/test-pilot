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
  km: "Компютърно моделиране",
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

function formatTime(date) {
  if (!date) return "–";
  return date.toLocaleTimeString("bg-BG", { hour: "2-digit", minute: "2-digit" });
}

function formatDayHeading(date) {
  if (!date) return "–";
  return date.toLocaleDateString("bg-BG", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function formatDayShort(date) {
  if (!date) return "–";
  return date.toLocaleDateString("bg-BG", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

/** Локален ключ YYYY-MM-DD за групиране по ден. */
function toDayKey(date) {
  if (!date) return null;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function todayDayKey() {
  return toDayKey(new Date());
}

function dayKeyToDate(dayKey) {
  if (!dayKey) return null;
  const [y, m, d] = dayKey.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function SubjectThumb({ subject, testId, size = 36 }) {
  const src = testId ? getThumbnailSrcFromTestId(testId) : SUBJECT_THUMB_SRC[subject];
  if (!src) return null;
  return (
    <img
      className={styles.subjectThumb}
      src={src}
      alt=""
      width={size}
      height={size}
      decoding="async"
      style={{ width: size, height: size }}
    />
  );
}

function DaySummaryChips({ tests, games, lessons }) {
  return (
    <div className={styles.dayChips}>
      <span className={styles.dayChip}>
        <strong>{tests}</strong> {tests === 1 ? "тест" : "теста"}
      </span>
      <span className={styles.dayChip}>
        <strong>{games}</strong> {games === 1 ? "игра" : "игри"}
      </span>
      <span className={styles.dayChip}>
        <strong>{lessons}</strong> {lessons === 1 ? "урок" : "урока"}
      </span>
    </div>
  );
}

function ActivityRow({ item, onOpenResult }) {
  const time = formatTime(item.at);
  const subjectLabel = SUBJECT_LABELS[item.subject] || item.subjectLabel || item.subject || "–";

  if (item.kind === "result") {
    const r = item.data;
    return (
      <button
        type="button"
        className={`${styles.activityRow} ${styles.activityRowClickable}`}
        onClick={() => onOpenResult(r.id)}
        aria-label={`Детайли за резултат на ${r.name}`}
      >
        <span className={styles.activityTime}>{time}</span>
        <span className={styles.activityKind} data-kind="test">
          {r.source === "game" ? "Игра" : "Тест"}
        </span>
        <span className={styles.activityMain}>
          <SubjectThumb subject={r.subject} testId={r.test} />
          <span className={styles.activityText}>
            <span className={styles.activityTitle}>{r.testTitle}</span>
            <span className={styles.activityMeta}>
              {r.name} · {subjectLabel}
              {r.completed ? "" : " · незавършен"}
            </span>
          </span>
        </span>
        <span className={styles.activityScore}>
          {r.completed ? r.points : r.progressText || r.points || "–"}
        </span>
      </button>
    );
  }

  if (item.kind === "game") {
    const g = item.data;
    return (
      <div className={styles.activityRow}>
        <span className={styles.activityTime}>{time}</span>
        <span className={styles.activityKind} data-kind="game">
          Отваряне
        </span>
        <span className={styles.activityMain}>
          <SubjectThumb subject={g.subject} />
          <span className={styles.activityText}>
            <span className={styles.activityTitle}>{g.title}</span>
            <span className={styles.activityMeta}>
              {g.subjectLabel}
              {g.classHint ? ` · ${g.classHint}` : ""}
            </span>
          </span>
        </span>
      </div>
    );
  }

  const v = item.data;
  return (
    <div className={styles.activityRow}>
      <span className={styles.activityTime}>{time}</span>
      <span className={styles.activityKind} data-kind="lesson">
        Урок
      </span>
      <span className={styles.activityMain}>
        <SubjectThumb subject={v.subject} />
        <span className={styles.activityText}>
          <span className={styles.activityTitle}>{v.title}</span>
          <span className={styles.activityMeta}>
            {v.subjectLabel}
            {v.classNum ? ` · ${v.classNum}. клас` : ""}
          </span>
        </span>
      </span>
    </div>
  );
}

function DayActivityList({ items, onOpenResult }) {
  if (!items.length) {
    return <p className={styles.dayEmpty}>Няма активност за този ден.</p>;
  }
  return (
    <div className={styles.activityList}>
      {items.map((item) => (
        <ActivityRow key={item.id} item={item} onOpenResult={onOpenResult} />
      ))}
    </div>
  );
}

export default function RezultatiPage() {
  const router = useRouter();
  const [results, setResults] = useState([]);
  const [gamePlays, setGamePlays] = useState([]);
  const [lessonVisits, setLessonVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState("7d");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedDays, setExpandedDays] = useState(() => new Set());

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

        const [resultsOutcome, gamesOutcome, lessonsOutcome] = await Promise.allSettled([
          getDocs(collection(db, "results")),
          getDocs(collection(db, "gamePlayEvents")),
          getDocs(collection(db, "lessonVisitEvents")),
        ]);

        if (cancelled) return;

        if (resultsOutcome.status === "rejected") {
          const err = resultsOutcome.reason;
          const code = err?.code || "";
          if (code === "permission-denied") {
            throw new Error(
              "Missing or insufficient permissions. Във Firebase Console → Firestore Database → Rules постави съдържанието от файла firestore.rules в проекта и натисни Publish."
            );
          }
          throw err instanceof Error ? err : new Error(err?.message || "Грешка при зареждане на резултати.");
        }

        const resultsSnap = resultsOutcome.value;
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
        if (gamesOutcome.status === "fulfilled") {
          gamesOutcome.value.forEach((docSnap) => {
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
        }
        setGamePlays(plays);

        const visits = [];
        if (lessonsOutcome.status === "fulfilled") {
          lessonsOutcome.value.forEach((docSnap) => {
            const data = docSnap.data();
            const classNum = data.classNum || "";
            const subject = data.subject || "";
            const slug = data.slug || "";
            visits.push({
              id: docSnap.id,
              classNum,
              subject,
              subjectLabel: data.subjectLabel || SUBJECT_LABELS[subject] || subject || "–",
              slug,
              title: data.title || slug || "Урок",
              lessonKey: data.lessonKey || `${classNum}|${subject}|${slug}`,
              startedAtIso: data.startedAtIso || null,
              createdAt: data.createdAt ?? null,
            });
          });
          visits.sort((a, b) => {
            const tA = getStartDateFromResult(a)?.getTime() ?? 0;
            const tB = getStartDateFromResult(b)?.getTime() ?? 0;
            return tB - tA;
          });
        }
        setLessonVisits(visits);
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

  const filteredLessonVisits = useMemo(() => {
    if (dateFilter === "all") return lessonVisits;
    const days = dateFilter === "30d" ? 30 : 7;
    const from = Date.now() - days * 24 * 60 * 60 * 1000;
    return lessonVisits.filter((v) => {
      const d = getStartDateFromResult(v);
      return d ? d.getTime() >= from : false;
    });
  }, [lessonVisits, dateFilter]);

  const { todayBundle, otherDays } = useMemo(() => {
    const todayKey = todayDayKey();
    const byDay = new Map();

    const ensure = (key) => {
      if (!byDay.has(key)) {
        byDay.set(key, {
          dayKey: key,
          date: dayKeyToDate(key),
          items: [],
          tests: 0,
          games: 0,
          lessons: 0,
        });
      }
      return byDay.get(key);
    };

    for (const r of filteredResults) {
      const at = getStartDateFromResult(r);
      const key = toDayKey(at);
      if (!key) continue;
      const day = ensure(key);
      day.tests += 1;
      day.items.push({
        id: `result-${r.id}`,
        kind: "result",
        at,
        data: r,
        sort: at?.getTime() ?? 0,
      });
    }

    for (const g of filteredGamePlays) {
      const at = getStartDateFromResult(g);
      const key = toDayKey(at);
      if (!key) continue;
      const day = ensure(key);
      day.games += 1;
      day.items.push({
        id: `game-${g.id}`,
        kind: "game",
        at,
        data: g,
        sort: at?.getTime() ?? 0,
      });
    }

    for (const v of filteredLessonVisits) {
      const at = getStartDateFromResult(v);
      const key = toDayKey(at);
      if (!key) continue;
      const day = ensure(key);
      day.lessons += 1;
      day.items.push({
        id: `lesson-${v.id}`,
        kind: "lesson",
        at,
        data: v,
        sort: at?.getTime() ?? 0,
      });
    }

    for (const day of byDay.values()) {
      day.items.sort((a, b) => b.sort - a.sort);
    }

    const todayBundle =
      byDay.get(todayKey) || {
        dayKey: todayKey,
        date: new Date(),
        items: [],
        tests: 0,
        games: 0,
        lessons: 0,
      };

    const otherDays = [...byDay.values()]
      .filter((d) => d.dayKey !== todayKey)
      .sort((a, b) => b.dayKey.localeCompare(a.dayKey));

    return { todayBundle, otherDays };
  }, [filteredResults, filteredGamePlays, filteredLessonVisits]);

  const bySubject = {};
  filteredResults.forEach((r) => {
    if (!r.completed) return;
    const sub = r.subject || "друг";
    if (!bySubject[sub]) bySubject[sub] = [];
    bySubject[sub].push(r);
  });
  SUBJECT_ORDER.forEach((s) => {
    if (bySubject[s]) {
      bySubject[s].sort((a, b) => {
        const tA = getStartDateFromResult(a)?.getTime() ?? 0;
        const tB = getStartDateFromResult(b)?.getTime() ?? 0;
        return tB - tA;
      });
    }
  });
  const otherSubject = bySubject["друг"];
  if (otherSubject) {
    otherSubject.sort((a, b) => {
      const tA = getStartDateFromResult(a)?.getTime() ?? 0;
      const tB = getStartDateFromResult(b)?.getTime() ?? 0;
      return tB - tA;
    });
  }

  const hasAnyData =
    filteredResults.length > 0 || filteredGamePlays.length > 0 || filteredLessonVisits.length > 0;
  const hasRawData = results.length > 0 || gamePlays.length > 0 || lessonVisits.length > 0;
  const hasRanking = SUBJECT_ORDER.some((s) => bySubject[s]?.length) || otherSubject?.length > 0;

  const openResult = (id) => router.push(`/test-pilot/rezultati/${id}`);

  const toggleDay = (dayKey) => {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      if (next.has(dayKey)) next.delete(dayKey);
      else next.add(dayKey);
      return next;
    });
  };

  return (
    <div className={tp.page}>
      <main className={tp.wrap}>
        <PageHero
          variant="page"
          title="Резултати"
          subtitle="Днешната активност напред; другите дни — в сбити резюмета."
          actions={
            <Link href="/test-pilot" className={styles.backLink}>
              Към тестовете <span aria-hidden>›</span>
            </Link>
          }
        />

        {loading && (
          <p className={`${styles.message} ${styles.messageCenter}`}>Зареждане...</p>
        )}

        {error && !hasRawData && (
          <p className={styles.messageError}>{error}</p>
        )}

        {!loading && !hasAnyData && !error && (
          <p className={`${styles.message} ${styles.messageCenter}`}>
            Все още няма записани резултати. Тестовете и игрите записват при завършване; отварянията на игри и уроци — при вход.
          </p>
        )}

        {!loading && hasRawData && (
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

        {!loading && hasAnyData && (
          <>
            <section className={`${styles.panel} ${styles.todayPanel}`} aria-labelledby="today-title">
              <div className={styles.todayHead}>
                <div>
                  <p className={styles.todayEyebrow}>Днес</p>
                  <h2 id="today-title" className={styles.todayTitle}>
                    {formatDayHeading(todayBundle.date)}
                  </h2>
                </div>
                <DaySummaryChips
                  tests={todayBundle.tests}
                  games={todayBundle.games}
                  lessons={todayBundle.lessons}
                />
              </div>
              <DayActivityList items={todayBundle.items} onOpenResult={openResult} />
            </section>

            {otherDays.length > 0 && (
              <section className={styles.pastSection} aria-labelledby="past-title">
                <h2 id="past-title" className={styles.sectionTitle}>
                  Предишни дни
                </h2>
                <div className={styles.dayStack}>
                  {otherDays.map((day) => {
                    const open = expandedDays.has(day.dayKey);
                    return (
                      <div key={day.dayKey} className={styles.dayCard}>
                        <button
                          type="button"
                          className={styles.dayCardToggle}
                          onClick={() => toggleDay(day.dayKey)}
                          aria-expanded={open}
                        >
                          <span className={styles.dayCardLeft}>
                            <span className={styles.dayCardDate}>{formatDayShort(day.date)}</span>
                            <DaySummaryChips
                              tests={day.tests}
                              games={day.games}
                              lessons={day.lessons}
                            />
                          </span>
                          <span className={styles.dayCardChevron} aria-hidden>
                            {open ? "▾" : "▸"}
                          </span>
                        </button>
                        {open && (
                          <div className={styles.dayCardBody}>
                            <DayActivityList items={day.items} onOpenResult={openResult} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        )}

        {!loading && hasRanking && (
          <>
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
                    {bySubject[subject].slice(0, 5).map((r, i) => (
                      <li key={r.id} className={styles.rankItem}>
                        <span className={styles.rankLeft}>
                          <span className={styles.rankNum}>{i + 1}.</span>
                          <span className={styles.rankName}>{r.name}</span>
                        </span>
                        <span className={styles.rankMeta}>{r.points}</span>
                      </li>
                    ))}
                  </ol>
                  {bySubject[subject].length > 5 && (
                    <p className={styles.rankFoot}>и още {bySubject[subject].length - 5} резултата</p>
                  )}
                </div>
              ))}
              {otherSubject?.length > 0 && (
                <div className={styles.panel}>
                  <h3 className={styles.panelHead}>Други</h3>
                  <ol className={styles.rankList}>
                    {otherSubject.slice(0, 5).map((r, i) => (
                      <li key={r.id} className={styles.rankItem}>
                        <span className={styles.rankLeft}>
                          <span className={styles.rankNum}>{i + 1}.</span>
                          <span className={styles.rankName}>{r.name}</span>
                        </span>
                        <span className={styles.rankMeta}>{r.points}</span>
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
