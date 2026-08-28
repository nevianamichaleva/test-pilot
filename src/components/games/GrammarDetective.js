"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import GameNameGate from "@/components/games/GameNameGate";
import GameResultSummary from "@/components/games/GameResultSummary";
import {
  DETECTIVE_CASES,
  countErrors,
  listErrors,
} from "@/data/english-grammar-detective";
import useSaveGameResultOnEnd from "@/hooks/useSaveGameResultOnEnd";
import { buildGamePointsLabel } from "@/lib/saveGameResult";

import styles from "./GrammarDetective.module.css";

/**
 * @param {{ exitHref?: string, game?: object }} props
 */
export default function GrammarDetective({ exitHref = "/igri", game = null }) {
  const [phase, setPhase] = useState("intro"); // intro | play | won
  const [participantName, setParticipantName] = useState("");
  const [caseIndex, setCaseIndex] = useState(0);
  const [fixed, setFixed] = useState(() => new Set()); // keys "bi-ti"
  const [fixingKey, setFixingKey] = useState(null);
  const [missToast, setMissToast] = useState("");
  const [catchTip, setCatchTip] = useState("");
  const [totalCaught, setTotalCaught] = useState(0);
  const [questionResults, setQuestionResults] = useState([]);
  const toastTimer = useRef(null);

  const caseData = DETECTIVE_CASES[caseIndex];
  const totalCases = DETECTIVE_CASES.length;
  const errors = useMemo(() => (caseData ? listErrors(caseData) : []), [caseData]);
  const errorCount = errors.length;
  const caughtHere = errors.filter((e) => fixed.has(`${e.bi}-${e.ti}`)).length;
  const caseDone = errorCount > 0 && caughtHere >= errorCount;
  const finished = phase === "won";

  useSaveGameResultOnEnd(finished, () => ({
    game,
    name: participantName,
    questionResults,
    correct: questionResults.filter((q) => q.isCorrect).length,
    total: questionResults.length || totalCases,
    completed: true,
    won: phase === "won",
  }));

  const clearTimers = () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  };

  useEffect(() => () => clearTimers(), []);

  const flashMiss = useCallback((msg) => {
    clearTimers();
    setMissToast(msg);
    toastTimer.current = setTimeout(() => setMissToast(""), 1800);
  }, []);

  const startCase = (idx) => {
    setCaseIndex(idx);
    setFixed(new Set());
    setFixingKey(null);
    setMissToast("");
    setCatchTip("");
    setPhase("play");
  };

  const startGame = () => {
    setTotalCaught(0);
    setQuestionResults([]);
    startCase(0);
  };

  const recordCaseResult = (idx) => {
    const c = DETECTIVE_CASES[idx];
    const nErrors = countErrors(c);
    setQuestionResults((prev) => {
      if (prev.some((item) => item.questionNumber === idx + 1)) return prev;
      return [
        ...prev,
        {
          questionNumber: idx + 1,
          questionText: c?.title || `Дело ${idx + 1}`,
          firstAnswer: "хванати всички",
          correctAnswer: `${nErrors} грешки`,
          isCorrect: true,
          status: "correct",
        },
      ];
    });
  };

  const tokenKey = (bi, ti) => `${bi}-${ti}`;

  const onTokenClick = (bi, ti, tok) => {
    if (phase !== "play" || caseDone) return;
    const key = tokenKey(bi, ti);

    if (tok.ok === false) {
      if (fixed.has(key)) return;
      const next = new Set(fixed);
      next.add(key);
      setFixed(next);
      setFixingKey(key);
      setTotalCaught((n) => n + 1);
      setCatchTip(tok.tip || `Поправено: ${tok.fix}`);
      setMissToast("");
      setTimeout(() => setFixingKey(null), 700);

      if (next.size >= errorCount) {
        recordCaseResult(caseIndex);
        // всички в този случай
        setTimeout(() => {
          if (caseIndex + 1 >= totalCases) {
            setPhase("won");
          } else {
            startCase(caseIndex + 1);
          }
        }, 1100);
      }
      return;
    }

    // вярна дума – без наказание
    flashMiss("Тази дума е ОК. Търси счупената! 🔍");
  };

  const displayText = (bi, ti, tok) => {
    const key = tokenKey(bi, ti);
    if (tok.ok === false && fixed.has(key)) return tok.fix;
    return tok.t;
  };

  if (phase === "intro") {
    const allErrors = DETECTIVE_CASES.reduce((s, c) => s + countErrors(c), 0);
    return (
      <div className={styles.shell}>
        <div className={styles.intro}>
          <p className={styles.badge}>5.–6. клас</p>
          <h2 className={styles.introTitle}>Grammar Detective</h2>
          <p className={styles.introSub}>Spot the Thief · Хвани крадеца</p>
          <p className={styles.introText}>
            Извънземното <strong>Zorp</strong> се учи на английски, но граматическият
            крадец счупва думи в чата и в писмата. Кликни върху{" "}
            <em>грешните</em> думи – те се поправят! Ако кликнеш вярна дума, нищо
            страшно: опитай пак.
          </p>
          <ul className={styles.bullets}>
            <li>{totalCases} дела (чат и писма)</li>
            <li>{allErrors} „кражби“ за хващане</li>
            <li>Без наказание при грешен клик – само насърчение</li>
          </ul>
          <GameNameGate
            inputId="grammar-detective-name"
            buttonLabel="Започни разследването"
            onStart={(name) => {
              setParticipantName(name);
              startGame();
            }}
          />
        </div>
      </div>
    );
  }

  if (phase === "won") {
    const correctCount = questionResults.filter((q) => q.isCorrect).length;
    return (
      <div className={styles.shell}>
        <div className={styles.result}>
          <h2 className={styles.resultOk}>Делото е разкрито! 🕵️</h2>
          {participantName ? (
            <p className={styles.resultMsg}>
              Участник: <strong>{participantName}</strong>
            </p>
          ) : null}
          <p className={styles.resultMsg}>
            {`${buildGamePointsLabel(correctCount, totalCases)}. Хвана ${totalCaught} граматически кражби. Zorp вече говори по-добре – благодарение на теб!`}
          </p>
          <GameResultSummary items={questionResults} />
          <div className={styles.actionRow}>
            <button type="button" className={styles.primaryBtn} onClick={startGame}>
              Ново разследване
            </button>
            <Link href={exitHref} className={styles.secondaryBtn}>
              Към игрите
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.shell}>
      <div className={styles.hud}>
        <div className={styles.progress}>
          Дело {caseIndex + 1}/{totalCases} · хванати {caughtHere}/{errorCount}
        </div>
        <div className={styles.topic}>{caseData.topic}</div>
        <Link href={exitHref} className={styles.exitLink}>
          ← Изход
        </Link>
      </div>

      <h3 className={styles.caseTitle}>{caseData.title}</h3>
      <p className={styles.caseIntro}>{caseData.intro}</p>

      {missToast ? (
        <p className={styles.missToast} role="status">
          {missToast}
        </p>
      ) : catchTip ? (
        <p className={styles.catchToast} role="status">
          ✓ {catchTip}
        </p>
      ) : (
        <p className={styles.toastSpacer} />
      )}

      <div
        className={caseData.format === "letter" ? styles.letterFrame : styles.chatFrame}
        aria-label={caseData.format === "letter" ? "Писмо" : "Чат"}
      >
        {caseData.format === "letter" && caseData.letterFrom ? (
          <p className={styles.letterMeta}>From: {caseData.letterFrom}</p>
        ) : null}

        {caseData.bubbles.map((bubble, bi) => {
          const isHuman = bubble.who === "human";
          return (
            <div
              key={`${caseData.id}-b-${bi}`}
              className={[
                styles.bubble,
                isHuman ? styles.bubbleHuman : styles.bubbleAlien,
                caseData.format === "letter" ? styles.bubbleLetter : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {caseData.format === "chat" ? (
                <div className={styles.bubbleHead}>
                  <span className={styles.avatar} aria-hidden>
                    {bubble.avatar}
                  </span>
                  <span className={styles.who}>{bubble.name}</span>
                </div>
              ) : null}
              <p className={styles.bubbleText}>
                {bubble.tokens.map((tok, ti) => {
                  const key = tokenKey(bi, ti);
                  const isError = tok.ok === false;
                  const isFixed = fixed.has(key);
                  const isFixing = fixingKey === key;
                  const clickable = !isHuman && (isError ? !isFixed : true);

                  if (isHuman) {
                    return (
                      <span key={key} className={styles.plainTok}>
                        {tok.t}{" "}
                      </span>
                    );
                  }

                  return (
                    <button
                      key={key}
                      type="button"
                      className={[
                        styles.tok,
                        isError && !isFixed ? styles.tokSuspect : "",
                        isFixed ? styles.tokFixed : "",
                        isFixing ? styles.tokFixing : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() => onTokenClick(bi, ti, tok)}
                      disabled={!clickable && isFixed}
                      aria-label={
                        isFixed
                          ? `Поправено: ${tok.fix}`
                          : `Дума: ${tok.t}`
                      }
                    >
                      {displayText(bi, ti, tok)}
                    </button>
                  );
                })}
              </p>
            </div>
          );
        })}
      </div>

      {caseDone ? (
        <p className={styles.caseDoneBanner}>Крадецът е хванат! Следващо дело…</p>
      ) : (
        <p className={styles.hintBar}>Кликни върху счупените (грешни) думи в текста.</p>
      )}
    </div>
  );
}
