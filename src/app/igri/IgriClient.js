"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { gameMatchesClass, getAllGames } from "@/data/games";
import { SUBJECT_LABELS } from "@/lib/subjectLabels";

import styles from "./Igri.module.css";

function normalizeClassNum(classNum) {
  const n = Number(classNum);
  return Number.isFinite(n) ? String(n) : String(classNum ?? "");
}

function uniq(list) {
  return [...new Set(list)];
}

function sortNumericStrings(list) {
  return [...list].sort((a, b) => Number(a) - Number(b));
}

function buildSearch({ classNum, subject }) {
  const p = new URLSearchParams();
  if (classNum) p.set("class", classNum);
  if (subject) p.set("subject", subject);
  const q = p.toString();
  return q ? `?${q}` : "";
}

function normalizeQueryString(qs) {
  const p = new URLSearchParams(typeof qs === "string" ? qs : "");
  return [...p.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
}

function orderedSubjectsFromPool(pool) {
  const unique = uniq(pool.map((g) => g.subject).filter(Boolean)).sort();
  const preferred = ["bg", "matematika", "english", "geografia", "istoriya", "priroda", "literatura"];
  return [
    ...preferred.filter((s) => unique.includes(s)),
    ...unique.filter((s) => !preferred.includes(s)),
  ];
}

function gamesForClass(games, classNumStr) {
  if (!classNumStr) return games;
  return games.filter((g) => gameMatchesClass(g, classNumStr));
}

function pickDescription(subject, classNum) {
  if (subject === "geografia") {
    return classNum
      ? `Игри по география за ${classNum}. клас.`
      : "Игри по география: понятия, обекти и континенти.";
  }
  if (subject === "bg") {
    return classNum
      ? `Игри по български език за ${classNum}. клас.`
      : "Игри по български език: части на речта и още.";
  }
  if (subject === "istoriya") {
    return classNum
      ? `Игри по история за ${classNum}. клас.`
      : "Игри по история: линия на времето, цивилизации и понятия.";
  }
  if (classNum) return `Игри за ${classNum}. клас.`;
  return "Избери клас и предмет, за да намериш подходяща игра.";
}

function gameMetaLabel(g) {
  if (g.kind === "geo-mode") return "Мини-игра";
  if (g.kind === "did-you-know") return "Факти + кръстословица";
  if (g.kind === "geo-vhodno") return "5 мини-игри";
  if (g.kind === "nature-maze") return "Лабиринт";
  if (g.kind === "pos-puzzle") return "Пъзел";
  if (g.kind === "history-review") return "5 мини-игри";
  if (g.kind === "bel-6") return "7 мини-игри";
  if (g.kind === "sentence-builder") return "Конструктор";
  if (g.kind === "grammar-detective") return "Детектив";
  if (g.kind === "bridge-of-rules") return "Сравнения";
  if (g.kind === "signal-light") return "Сигнална лампа";
  if (g.kind === "verb-magnet") return "Магнит за глаголи";
  if (g.kind === "hint-hangman") return "Бесеница с подсказка";
  if (g.kind === "text-detective") return "Текст детектив";
  return `${g.questionCount} въпроса`;
}

export default function IgriClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const games = useMemo(() => getAllGames().filter((g) => g.status === "ready"), []);

  const classOptions = useMemo(() => {
    const all = games.flatMap((g) => g.classNums ?? []).filter(Boolean);
    return sortNumericStrings(uniq(all));
  }, [games]);

  const qpClassRaw = searchParams?.get("class") ?? "";
  const qpSubjectRaw = searchParams?.get("subject") ?? "";
  const normalizedClass = qpClassRaw ? normalizeClassNum(qpClassRaw) : "";
  const selectedClass = classOptions.includes(normalizedClass) ? normalizedClass : "";

  const pool = useMemo(() => gamesForClass(games, selectedClass), [games, selectedClass]);
  const subjectOptions = useMemo(() => orderedSubjectsFromPool(pool), [pool]);
  const selectedSubject = subjectOptions.includes(qpSubjectRaw) ? qpSubjectRaw : "";

  const filtered = useMemo(() => {
    return games.filter((g) => {
      if (selectedClass && !gameMatchesClass(g, selectedClass)) return false;
      if (selectedSubject && g.subject !== selectedSubject) return false;
      return true;
    });
  }, [games, selectedClass, selectedSubject]);

  const canonicalQuery = useMemo(
    () => buildSearch({ classNum: selectedClass, subject: selectedSubject }).replace(/^\?/, ""),
    [selectedClass, selectedSubject]
  );

  useEffect(() => {
    const cur = searchParams.toString();
    if (normalizeQueryString(cur) === normalizeQueryString(canonicalQuery)) return;
    router.replace(`/igri${canonicalQuery ? `?${canonicalQuery}` : ""}`, { scroll: false });
  }, [canonicalQuery, searchParams, router]);

  const pageTitle = useMemo(() => {
    if (selectedSubject && selectedClass) {
      return `Игри по ${SUBJECT_LABELS[selectedSubject] ?? selectedSubject} за ${selectedClass}. клас`;
    }
    if (selectedSubject) return `Игри по ${SUBJECT_LABELS[selectedSubject] ?? selectedSubject}`;
    if (selectedClass) return `Игри за ${selectedClass}. клас`;
    return "Хайде да поиграем";
  }, [selectedClass, selectedSubject]);

  const heroDesc = useMemo(
    () => pickDescription(selectedSubject, selectedClass),
    [selectedSubject, selectedClass]
  );

  return (
    <div className={styles.page}>
      <main className={styles.wrap}>
        <PageHero variant="page" title={pageTitle} subtitle={heroDesc}>
          <div className={styles.filters}>
            <label>
              <span className="sr-only">Клас</span>
              <select
                className={styles.select}
                value={selectedClass}
                onChange={(e) => {
                  const nextClass = e.target.value;
                  const nextPool = gamesForClass(games, nextClass);
                  const validSubjects = new Set(nextPool.map((g) => g.subject));
                  const nextSubject =
                    selectedSubject && validSubjects.has(selectedSubject) ? selectedSubject : "";
                  router.replace(
                    `/igri${buildSearch({ classNum: nextClass, subject: nextSubject })}`,
                    { scroll: false }
                  );
                }}
              >
                <option value="">Всички класове</option>
                {classOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}. клас
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="sr-only">Предмет</span>
              <select
                className={styles.select}
                value={selectedSubject}
                onChange={(e) => {
                  router.replace(
                    `/igri${buildSearch({ classNum: selectedClass, subject: e.target.value })}`,
                    { scroll: false }
                  );
                }}
              >
                <option value="">Всички предмети</option>
                {subjectOptions.map((s) => (
                  <option key={s} value={s}>
                    {SUBJECT_LABELS[s] ?? s}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </PageHero>

        {filtered.length === 0 ? (
          <p className={styles.empty}>Няма игри за избраните филтри.</p>
        ) : (
          <div className={styles.gameGrid}>
            {filtered.map((g, i) => (
              <Link
                key={g.slug}
                href={`/igri/${g.slug}`}
                className={styles.gameCard}
                style={{
                  "--tone": g.tone,
                  "--accent": g.accent || "#3b8eea",
                  "--tilt": i % 2 === 0 ? "-0.6deg" : "0.6deg",
                }}
              >
                <div className={styles.gameThumb}>
                  {g.image ? (
                    <img className={styles.gameThumbImg} src={g.image} alt="" decoding="async" />
                  ) : (
                    <span className={styles.thumbMark}>▶</span>
                  )}
                </div>
                <div className={styles.gameBody}>
                  <h2 className={styles.gameTitle}>{g.title}</h2>
                  <p className={styles.gameDesc}>{g.description}</p>
                  <div className={styles.meta}>
                    <span>{g.subjectLabel}</span>
                    <span>{g.classHint}</span>
                    <span>{gameMetaLabel(g)}</span>
                  </div>
                  <span className={styles.playPill}>
                    Играй <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
