"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllTests } from "@/data/tests";

import styles from "./TestPilot.module.css";

const SUBJECT_LABELS = {
  english: "Английски език",
  geografia: "География",
  istoriya: "История",
  literatura: "Литература",
  matematika: "Математика",
  bg: "Български език",
  priroda: "Човек и природа",
};

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

function pickDescription(subject) {
  switch (subject) {
    case "matematika":
      return "Покриваме основни теми по математика с кратки тестове и задачи.";
    case "bg":
      return "Упражни правопис, граматика и четене с разбиране.";
    case "english":
      return "Кратки упражнения по граматика и лексика за по-бърз напредък.";
    case "geografia":
      return "Тестове за природни и обществени процеси, карти и понятия.";
    case "istoriya":
      return "Упражни понятия, хронология и ключови събития.";
    case "priroda":
      return "Тестове за вещества, смеси, клетки и природни явления.";
    case "literatura":
      return "Теми, жанрове и упражнения по литература.";
    default:
      return "Избери тест и започни да упражняваш знанията си.";
  }
}

export default function TestPilotClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [visibleCount, setVisibleCount] = useState(4);

  const tests = useMemo(() => getAllTests(), []);

  const classOptions = useMemo(() => {
    const all = tests.map((t) => normalizeClassNum(t.classNum)).filter(Boolean);
    return sortNumericStrings(uniq(all));
  }, [tests]);

  const subjectOptions = useMemo(() => {
    const all = tests.map((t) => t.subject).filter(Boolean);
    const unique = uniq(all).sort();
    // Prefer labels order when present.
    const preferred = ["bg", "matematika", "english", "geografia", "istoriya", "priroda", "literatura"];
    return [
      ...preferred.filter((s) => unique.includes(s)),
      ...unique.filter((s) => !preferred.includes(s)),
    ];
  }, [tests]);

  const filtered = useMemo(() => {
    return tests.filter((t) => {
      if (selectedClass && normalizeClassNum(t.classNum) !== selectedClass) return false;
      if (selectedSubject && t.subject !== selectedSubject) return false;
      return true;
    });
  }, [tests, selectedClass, selectedSubject]);

  const visible = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);

  useEffect(() => {
    const qpClass = searchParams?.get("class") ?? "";
    const qpSubject = searchParams?.get("subject") ?? "";
    const normalizedClass = qpClass ? normalizeClassNum(qpClass) : "";

    setSelectedClass(classOptions.includes(normalizedClass) ? normalizedClass : "");
    setSelectedSubject(subjectOptions.includes(qpSubject) ? qpSubject : "");
    setVisibleCount(4);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    const q = buildSearch({ classNum: selectedClass, subject: selectedSubject });
    const current = searchParams?.toString() ? `?${searchParams.toString()}` : "";
    if (q !== current) router.replace(`/test-pilot${q}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClass, selectedSubject]);

  const pageTitle = useMemo(() => {
    if (selectedSubject && selectedClass) {
      return `Тестове по ${SUBJECT_LABELS[selectedSubject] ?? selectedSubject} за ${selectedClass}. клас`;
    }
    if (selectedSubject) return `Тестове по ${SUBJECT_LABELS[selectedSubject] ?? selectedSubject}`;
    return "Тестове";
  }, [selectedClass, selectedSubject]);

  const heroDesc = useMemo(() => pickDescription(selectedSubject), [selectedSubject]);

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.wrap}>
        <div className={styles.crumbs}>
          <Link href="/">Начало</Link>
          <span aria-hidden>/</span>
          <Link href="/test-pilot">Тестове</Link>
          {selectedSubject ? (
            <>
              <span aria-hidden>/</span>
              <span>{SUBJECT_LABELS[selectedSubject] ?? selectedSubject}</span>
            </>
          ) : null}
        </div>

        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div>
              <h1 className={styles.heroTitle}>{pageTitle}</h1>
              <p className={styles.heroSub}>{heroDesc}</p>

              <div className={styles.filters}>
                <label>
                  <span className="sr-only">Клас</span>
                  <select
                    className={styles.select}
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
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
                    onChange={(e) => setSelectedSubject(e.target.value)}
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
            </div>

            <div className={styles.heroArt}>
              <Image
                className={styles.heroImg}
                src="/test-pilot.png"
                alt="Тестове"
                width={720}
                height={460}
                priority
              />
            </div>
          </div>
        </section>

        {filtered.length === 0 ? (
          <p style={{ marginTop: 14, color: "rgba(26,58,82,0.75)" }}>
            Няма тестове за избраните филтри.
          </p>
        ) : (
          <>
            <div className={styles.list}>
              {visible.map((t, i) => (
                <article
                  key={`${t.classNum}|${t.subject}|${t.slug}`}
                  className={styles.card}
                >
                  <div className={styles.thumb} aria-hidden />

                  <div className={styles.info}>
                    <h3>
                      {selectedSubject
                        ? t.title
                        : `Тест по ${SUBJECT_LABELS[t.subject] ?? t.subject}: ${t.title}`}
                    </h3>
                    <p className={styles.desc}>
                      Тест с {t.questionCount} въпроса за {normalizeClassNum(t.classNum)}.
                      клас.
                    </p>
                    <div className={styles.meta}>
                      <span>{t.questionCount} въпроса</span>
                    </div>
                  </div>

                  <div className={styles.actions}>
                    <div className={styles.badge} aria-hidden>
                      {i + 1}
                    </div>
                    <Link
                      className={styles.start}
                      href={`/test-pilot/${encodeURIComponent(
                        normalizeClassNum(t.classNum)
                      )}/${encodeURIComponent(t.subject)}/${encodeURIComponent(t.slug)}`}
                    >
                      Започни тест <span aria-hidden>›</span>
                    </Link>
                    <span className={styles.cert}>
                      <span aria-hidden>🏆</span> сертификат
                    </span>
                  </div>
                </article>
              ))}
            </div>

            {visibleCount < filtered.length && (
              <div className={styles.moreWrap}>
                <button
                  type="button"
                  className={styles.more}
                  onClick={() => setVisibleCount((v) => Math.min(v + 4, filtered.length))}
                >
                  Покажи повече тестове <span aria-hidden>›</span>
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

