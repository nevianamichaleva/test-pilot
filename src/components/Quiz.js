"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import styles from "./Quiz.module.css";

function normalizeQuestions(questions) {
  if (!Array.isArray(questions)) return [];
  return questions.filter(Boolean);
}

function isTextQuestion(q) {
  return q?.type === "text";
}

function getQuestionText(q) {
  if (!q) return "—";
  return q.question ?? q.q ?? "—";
}

function normalizeOption(opt) {
  if (typeof opt === "string") return opt;
  return opt?.label ?? opt?.text ?? String(opt?.value ?? "");
}

export default function Quiz({
  title,
  questions,
  testId,
  testTitle,
  classNum,
  subject,
  subjectLabel,
}) {
  const qs = useMemo(() => normalizeQuestions(questions), [questions]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState(() => new Map());
  const [done, setDone] = useState(false);

  const current = qs[idx];

  const total = qs.length;
  const answeredCount = useMemo(() => {
    let n = 0;
    for (let i = 0; i < total; i += 1) {
      const q = qs[i];
      const v = answers.get(i);
      if (isTextQuestion(q)) {
        if (typeof v === "string" && v.trim().length > 0) n += 1;
      } else if (v) {
        n += 1;
      }
    }
    return n;
  }, [answers, qs, total]);

  const select = (value) => {
    if (!current) return;
    const next = new Map(answers);
    next.set(idx, value);
    setAnswers(next);
  };

  const setText = (value) => {
    if (!current) return;
    const next = new Map(answers);
    next.set(idx, value);
    setAnswers(next);
  };

  const next = () => setIdx((v) => Math.min(v + 1, total - 1));
  const prev = () => setIdx((v) => Math.max(v - 1, 0));

  const finish = () => setDone(true);

  if (!total) {
    return (
      <div className={styles.page}>
        <div className={styles.wrap}>
          <h1 style={{ marginTop: 0 }}>{title ?? "Тест"}</h1>
          <p>Няма въпроси за този тест.</p>
          <Link href="/test-pilot">Назад към тестове</Link>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className={styles.page}>
        <header className={styles.topbar}>
          <div className={styles.topbarInner}>
            <Link href="/" className={styles.brand}>
              <span className={styles.brandMark}>TP</span>
              <span>Учене и тестове</span>
            </Link>
            <nav className={styles.nav}>
              <Link href="/">Начало</Link>
              <Link href="/test-pilot">Тестове</Link>
              <Link href="/test-pilot/rezultati">Резултати</Link>
              <Link className={styles.exit} href="/test-pilot">
                Изход
              </Link>
            </nav>
          </div>
        </header>

        <div className={styles.wrap}>
          <h1 style={{ marginTop: 0 }}>{testTitle ?? title ?? "Тест"}</h1>
          <p style={{ color: "rgba(26,58,82,0.75)" }}>
            Завърши теста (ID: <code>{testId}</code>). Отговорени: {answeredCount}
            /{total}
          </p>
          <div className={styles.done}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button type="button" className={`${styles.btn} ${styles.back}`} onClick={() => setDone(false)}>
                Преглед
              </button>
              <Link className={`${styles.btn} ${styles.next}`} href="/test-pilot" style={{ textDecoration: "none" }}>
                Към списъка с тестове
              </Link>
            </div>
            <p style={{ marginTop: 12, color: "rgba(26,58,82,0.65)" }}>
              Заб.: Записването на резултати във Firebase още не е конфигурирано в
              този изнесен проект.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const selected = answers.get(idx);
  const options = Array.isArray(current?.options) ? current.options : [];
  const crumbSubject = subjectLabel ?? subject ?? "Тестове";

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <Link href="/" className={styles.brand}>
            <span className={styles.brandMark}>TP</span>
            <span>Учене и тестове</span>
          </Link>
          <nav className={styles.nav}>
            <Link href="/">Начало</Link>
            <Link href="/test-pilot">Тестове</Link>
            <Link href="/test-pilot/rezultati">Резултати</Link>
            <Link className={styles.exit} href="/test-pilot">
              Изход
            </Link>
          </nav>
        </div>
      </header>

      <div className={styles.wrap}>
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div>
              <h1 className={styles.heroTitle}>{testTitle ?? title ?? "Тест"}</h1>
              <p className={styles.heroMeta}>
                Въпрос {idx + 1} от {total} • Отговорени: {answeredCount}/{total}
              </p>
            </div>
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.cardTop}>
            <span>
              Начало <span aria-hidden>&gt;</span> {crumbSubject}
              {classNum ? (
                <>
                  {" "}
                  <span aria-hidden>&gt;</span> {classNum}. клас
                </>
              ) : null}
            </span>
          </div>

          <div className={styles.cardBody}>
            <p className={styles.question}>{getQuestionText(current)}</p>
            <div className={styles.divider} />

            {isTextQuestion(current) ? (
              <input
                className={styles.textInput}
                value={typeof selected === "string" ? selected : ""}
                onChange={(e) => setText(e.target.value)}
                autoComplete="off"
                spellCheck={false}
              />
            ) : (
              <div className={styles.options}>
                {options.map((opt, i) => {
                  const value = normalizeOption(opt);
                  const key = `${idx}-${i}-${value}`;
                  return (
                    <label
                      key={key}
                      className={`${styles.option} ${selected === value ? styles.optionSelected : ""}`}
                    >
                      <input
                        type="radio"
                        name={`q-${idx}`}
                        value={value}
                        checked={selected === value}
                        onChange={() => select(value)}
                      />
                      <span>{value}</span>
                    </label>
                  );
                })}
              </div>
            )}

            <div className={styles.actions}>
              <button type="button" className={`${styles.btn} ${styles.back}`} onClick={prev} disabled={idx === 0}>
                Назад
              </button>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
                <button type="button" className={`${styles.btn} ${styles.next}`} onClick={next} disabled={idx === total - 1}>
                  Напред <span aria-hidden>›</span>
                </button>
                <button type="button" className={`${styles.btn} ${styles.finish}`} onClick={finish} disabled={answeredCount < total}>
                  Завърши
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

