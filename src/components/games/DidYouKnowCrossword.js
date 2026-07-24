"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  POINTS_PER_WORD,
  YUZHNA_AMERIKA_ZNAESH_LI,
  buildCrosswordGrid,
} from "@/data/yuzhna-amerika-znaesh-li";

import styles from "./DidYouKnowCrossword.module.css";

function normalizeLetter(ch) {
  return String(ch ?? "")
    .toUpperCase()
    .replace(/Ь/g, "Ь")
    .trim();
}

function cellKey(r, c) {
  return `${r},${c}`;
}

/**
 * @param {{ exitHref?: string }} props
 */
export default function DidYouKnowCrossword({ exitHref = "/igri" }) {
  const data = YUZHNA_AMERIKA_ZNAESH_LI;
  const entries = data.crossword;
  const gridMeta = useMemo(() => buildCrosswordGrid(entries), [entries]);

  const [phase, setPhase] = useState("facts"); // facts | crossword | done
  const [factIndex, setFactIndex] = useState(0);
  const [cellValues, setCellValues] = useState({});
  const [solved, setSolved] = useState(() => new Set());
  const [checkedOnce, setCheckedOnce] = useState(false);
  const [activeWordId, setActiveWordId] = useState(entries[0]?.id ?? null);
  const [shakeWrong, setShakeWrong] = useState(false);

  const score = solved.size * POINTS_PER_WORD;
  const maxScore = entries.length * POINTS_PER_WORD;
  const fact = data.facts[factIndex];

  const setCell = (key, letter) => {
    const ch = normalizeLetter(letter).slice(0, 1);
    setCellValues((prev) => ({ ...prev, [key]: ch }));
  };

  const wordCells = (w) =>
    Array.from({ length: w.answer.length }, (_, i) => {
      const r = w.dir === "across" ? w.row : w.row + i;
      const c = w.dir === "across" ? w.col + i : w.col;
      return cellKey(r, c);
    });

  const isWordCorrect = (w) => {
    const keys = wordCells(w);
    return keys.every((k, i) => normalizeLetter(cellValues[k]) === w.answer[i]);
  };

  const isWordFilled = (w) => {
    const keys = wordCells(w);
    return keys.every((k) => normalizeLetter(cellValues[k]).length === 1);
  };

  const checkCrossword = () => {
    setCheckedOnce(true);
    const next = new Set(solved);
    let newly = 0;
    for (const w of entries) {
      if (next.has(w.id)) continue;
      if (isWordCorrect(w)) {
        next.add(w.id);
        newly += 1;
      }
    }
    setSolved(next);
    if (newly === 0 && next.size < entries.length) {
      setShakeWrong(true);
      setTimeout(() => setShakeWrong(false), 600);
    }
    if (next.size === entries.length) {
      setPhase("done");
    }
  };

  const finishAnyway = () => setPhase("done");

  const restart = () => {
    setPhase("facts");
    setFactIndex(0);
    setCellValues({});
    setSolved(new Set());
    setCheckedOnce(false);
    setActiveWordId(entries[0]?.id ?? null);
  };

  const fillFromClueInput = (w, value) => {
    const clean = normalizeLetter(value).replace(/[^А-Я]/g, "").slice(0, w.answer.length);
    const keys = wordCells(w);
    setCellValues((prev) => {
      const next = { ...prev };
      keys.forEach((k, i) => {
        next[k] = clean[i] ?? "";
      });
      return next;
    });
  };

  const clueInputValue = (w) =>
    wordCells(w)
      .map((k) => cellValues[k] ?? "")
      .join("");

  if (phase === "done") {
    return (
      <div className={styles.shell}>
        <div className={styles.result}>
          <p className={styles.resultEmoji} aria-hidden>
            {score >= maxScore * 0.8 ? "🏆" : score > 0 ? "🌟" : "📚"}
          </p>
          <h2 className={styles.resultTitle}>Край на играта!</h2>
          <p className={styles.resultScore}>
            Точки: <strong>{score}</strong> от {maxScore}
          </p>
          <p className={styles.resultHint}>
            Познати думи: {solved.size} от {entries.length} (по {POINTS_PER_WORD} т.)
          </p>
          <div className={styles.actions}>
            <button type="button" className={styles.primaryBtn} onClick={restart}>
              Играй отново
            </button>
            <Link href={exitHref} className={styles.secondaryBtn}>
              Към игрите
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "facts") {
    return (
      <div className={styles.shell}>
        <div className={styles.phaseBadge}>Стъпка 1 · Знаеш ли, че…</div>
        <p className={styles.lesson}>{data.lessonTitle}</p>
        <div className={styles.factProgress}>
          Факт {factIndex + 1} от {data.facts.length}
        </div>
        <article className={styles.factCard}>
          <h3 className={styles.factTitle}>{fact.title}</h3>
          <p className={styles.factText}>{fact.text}</p>
        </article>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.secondaryBtn}
            disabled={factIndex === 0}
            onClick={() => setFactIndex((i) => Math.max(0, i - 1))}
          >
            ← Назад
          </button>
          {factIndex + 1 < data.facts.length ? (
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => setFactIndex((i) => i + 1)}
            >
              Следващ факт →
            </button>
          ) : (
            <button type="button" className={styles.primaryBtn} onClick={() => setPhase("crossword")}>
              Към кръстословицата →
            </button>
          )}
        </div>
        {factIndex + 1 < data.facts.length ? (
          <button type="button" className={styles.skipLink} onClick={() => setPhase("crossword")}>
            Пропусни към кръстословицата
          </button>
        ) : null}
      </div>
    );
  }

  // crossword phase
  const across = entries.filter((w) => w.dir === "across");
  const down = entries.filter((w) => w.dir === "down");

  return (
    <div className={`${styles.shell} ${shakeWrong ? styles.shake : ""}`}>
      <div className={styles.topRow}>
        <div className={styles.phaseBadge}>Стъпка 2 · Кръстословица</div>
        <div className={styles.scorePill}>
          {score} т. · {solved.size}/{entries.length} думи
        </div>
      </div>
      <p className={styles.crossHint}>
        Всяка позната дума носи <strong>{POINTS_PER_WORD} точки</strong>. Попълни решетката или
        пиши до поясненията.
      </p>

      <div className={styles.crossLayout}>
        <div className={styles.gridWrap}>
          <div
            className={styles.grid}
            style={{
              gridTemplateColumns: `repeat(${gridMeta.maxC + 1}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: gridMeta.maxR + 1 }, (_, r) =>
              Array.from({ length: gridMeta.maxC + 1 }, (_, c) => {
                const key = cellKey(r, c);
                const letter = gridMeta.cells[key];
                if (!letter) {
                  return <div key={key} className={styles.cellEmpty} />;
                }
                const num = gridMeta.numberAt[key];
                const isSolvedCell = entries.some(
                  (w) => solved.has(w.id) && wordCells(w).includes(key)
                );
                return (
                  <label key={key} className={`${styles.cell} ${isSolvedCell ? styles.cellOk : ""}`}>
                    {num != null ? <span className={styles.cellNum}>{num}</span> : null}
                    <input
                      className={styles.cellInput}
                      value={cellValues[key] ?? ""}
                      maxLength={1}
                      disabled={isSolvedCell}
                      onChange={(e) => setCell(key, e.target.value)}
                      onFocus={() => {
                        const hit = entries.find((w) => wordCells(w).includes(key));
                        if (hit) setActiveWordId(hit.id);
                      }}
                      aria-label={`Клетка ${r + 1}-${c + 1}`}
                      autoComplete="off"
                      spellCheck={false}
                    />
                  </label>
                );
              })
            )}
          </div>
        </div>

        <div className={styles.clues}>
          <section>
            <h3 className={styles.clueHead}>Хоризонтално</h3>
            {across.map((w) => (
              <div
                key={w.id}
                className={`${styles.clueRow} ${solved.has(w.id) ? styles.clueSolved : ""} ${
                  activeWordId === w.id ? styles.clueActive : ""
                }`}
              >
                <span className={styles.clueNum}>{w.num}.</span>
                <div className={styles.clueBody}>
                  <p className={styles.clueText}>{w.clue}</p>
                  <input
                    className={styles.clueInput}
                    value={clueInputValue(w)}
                    disabled={solved.has(w.id)}
                    onChange={(e) => fillFromClueInput(w, e.target.value)}
                    onFocus={() => setActiveWordId(w.id)}
                    placeholder={"_ ".repeat(w.answer.length).trim()}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>
              </div>
            ))}
          </section>
          <section>
            <h3 className={styles.clueHead}>Вертикално</h3>
            {down.map((w) => (
              <div
                key={w.id}
                className={`${styles.clueRow} ${solved.has(w.id) ? styles.clueSolved : ""} ${
                  activeWordId === w.id ? styles.clueActive : ""
                }`}
              >
                <span className={styles.clueNum}>{w.num}.</span>
                <div className={styles.clueBody}>
                  <p className={styles.clueText}>{w.clue}</p>
                  <input
                    className={styles.clueInput}
                    value={clueInputValue(w)}
                    disabled={solved.has(w.id)}
                    onChange={(e) => fillFromClueInput(w, e.target.value)}
                    onFocus={() => setActiveWordId(w.id)}
                    placeholder={"_ ".repeat(w.answer.length).trim()}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>

      {checkedOnce && solved.size < entries.length ? (
        <p className={styles.feedback}>
          Има още непознати или непълни думи. Поправи и натисни „Провери“ отново.
        </p>
      ) : null}

      <div className={styles.actions}>
        <button type="button" className={styles.primaryBtn} onClick={checkCrossword}>
          Провери
        </button>
        <button type="button" className={styles.secondaryBtn} onClick={finishAnyway}>
          Край · виж точките
        </button>
      </div>
    </div>
  );
}
