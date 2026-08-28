"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import GameNameGate from "@/components/games/GameNameGate";
import GameResultSummary from "@/components/games/GameResultSummary";
import { BRIDGE_LIVES, BRIDGE_ROUNDS } from "@/data/english-bridge-of-rules";
import useSaveGameResultOnEnd from "@/hooks/useSaveGameResultOnEnd";
import { buildGamePointsLabel } from "@/lib/saveGameResult";

import styles from "./BridgeOfRules.module.css";

function sizeClass(size) {
  if (size === 1) return styles.figSm;
  if (size === 3) return styles.figLg;
  return styles.figMd;
}

function correctOptionText(round) {
  return round?.options?.find((o) => o.correct)?.text || "—";
}

/**
 * @param {{ exitHref?: string, game?: object }} props
 */
export default function BridgeOfRules({ exitHref = "/igri", game = null }) {
  const [phase, setPhase] = useState("intro"); // intro | play | won | lost
  const [participantName, setParticipantName] = useState("");
  const [roundIndex, setRoundIndex] = useState(0);
  const [lives, setLives] = useState(BRIDGE_LIVES);
  const [picked, setPicked] = useState(null); // option text
  const [feedback, setFeedback] = useState(null); // { ok, tip, stomp }
  const [shake, setShake] = useState(false);
  const [crossing, setCrossing] = useState(false);
  const [firstTryScore, setFirstTryScore] = useState(0);
  const [attempted, setAttempted] = useState(false);
  const [questionResults, setQuestionResults] = useState([]);
  const [firstTryByRound, setFirstTryByRound] = useState({});

  const round = BRIDGE_ROUNDS[roundIndex];
  const total = BRIDGE_ROUNDS.length;

  const options = useMemo(() => {
    // keep pedagogical order: base / comparative / superlative as authored
    return round?.options ?? [];
  }, [round]);

  const finished = phase === "won" || phase === "lost";

  useSaveGameResultOnEnd(finished, () => ({
    game,
    name: participantName,
    questionResults,
    correct: questionResults.filter((q) => q.isCorrect).length,
    total: questionResults.length || total,
    completed: true,
    won: phase === "won",
  }));

  const startRound = (idx) => {
    setRoundIndex(idx);
    setPicked(null);
    setFeedback(null);
    setShake(false);
    setCrossing(false);
    setAttempted(false);
    setPhase("play");
  };

  const startGame = () => {
    setLives(BRIDGE_LIVES);
    setFirstTryScore(0);
    setQuestionResults([]);
    setFirstTryByRound({});
    startRound(0);
  };

  const recordRoundResult = (idx, firstAnswer, isCorrect) => {
    const r = BRIDGE_ROUNDS[idx];
    setQuestionResults((prev) => {
      if (prev.some((item) => item.questionNumber === idx + 1)) return prev;
      return [
        ...prev,
        {
          questionNumber: idx + 1,
          questionText: r?.sentence || `Мост ${idx + 1}`,
          firstAnswer,
          correctAnswer: correctOptionText(r),
          isCorrect,
          status: isCorrect ? "correct" : "wrong",
        },
      ];
    });
  };

  const select = (opt) => {
    if (phase !== "play" || picked || crossing) return;
    const isFirstTry = !attempted;
    setPicked(opt.text);
    setAttempted(true);

    if (isFirstTry) {
      setFirstTryByRound((prev) => ({ ...prev, [roundIndex]: opt.text }));
    }

    if (opt.correct) {
      if (isFirstTry) setFirstTryScore((s) => s + 1);
      const firstAnswer = isFirstTry ? opt.text : firstTryByRound[roundIndex] || opt.text;
      recordRoundResult(roundIndex, firstAnswer, isFirstTry);
      setFeedback({ ok: true, tip: "Мостът е стабилен – преминаваш!", stomp: false });
      setCrossing(true);
      setTimeout(() => {
        if (roundIndex + 1 >= total) {
          setPhase("won");
        } else {
          startRound(roundIndex + 1);
        }
      }, 1200);
      return;
    }

    setFeedback({
      ok: false,
      tip: opt.tip || "Опитай друга форма.",
      stomp: Boolean(opt.stomp),
    });
    setShake(true);
    const nextLives = lives - 1;
    setLives(nextLives);
    setTimeout(() => setShake(false), 700);

    if (nextLives <= 0) {
      recordRoundResult(roundIndex, opt.text, false);
      setTimeout(() => setPhase("lost"), 900);
      return;
    }

    setTimeout(() => {
      setPicked(null);
    }, 900);
  };

  if (phase === "intro") {
    return (
      <div className={styles.shell}>
        <div className={styles.intro}>
          <p className={styles.badge}>5.–6. клас</p>
          <h2 className={styles.introTitle}>The Bridge of Rules</h2>
          <p className={styles.introSub}>Мостът на сравненията</p>
          <p className={styles.introText}>
            Погледни трите картинки и попълни изречението.{" "}
            <strong>-er / more</strong> = две неща; <strong>-est / the most</strong> = три или
            повече. Грешният избор разклаща моста – понякога „най-големият“ стъпва върху него!
          </p>
          <ul className={styles.bullets}>
            <li>{total} моста за преминаване</li>
            <li>{BRIDGE_LIVES} живота (мостът не издържа безкрайни грешки)</li>
            <li>Всеки грешен отговор идва с ясно обяснение</li>
          </ul>
          <GameNameGate
            inputId="bridge-of-rules-name"
            buttonLabel="Към моста"
            onStart={(name) => {
              setParticipantName(name);
              startGame();
            }}
          />
        </div>
      </div>
    );
  }

  if (phase === "won" || phase === "lost") {
    const correctCount = questionResults.filter((q) => q.isCorrect).length;
    return (
      <div className={styles.shell}>
        <div className={styles.result}>
          <h2 className={phase === "won" ? styles.resultOk : styles.resultBad}>
            {phase === "won" ? "Премина всички мостове!" : "Мостът се срина…"}
          </h2>
          {participantName ? (
            <p className={styles.resultMsg}>
              Участник: <strong>{participantName}</strong>
            </p>
          ) : null}
          <p className={styles.resultMsg}>
            {phase === "won"
              ? `${buildGamePointsLabel(firstTryScore, total)} от първи опит. Сравненията вече са твои приятели!`
              : `${buildGamePointsLabel(correctCount, questionResults.length || total)}. Помни: две неща → -er / more; три+ → -est / the most.`}
          </p>
          <GameResultSummary items={questionResults} />
          <div className={styles.actionRow}>
            <button type="button" className={styles.primaryBtn} onClick={startGame}>
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

  const stompFigure = round.figures.find((f) => f.id === (round.stompId || ""));
  const showStomp = Boolean(feedback && !feedback.ok && feedback.stomp && stompFigure);

  return (
    <div className={styles.shell}>
      <div className={styles.hud}>
        <div className={styles.lives} aria-label={`Животи: ${lives}`}>
          {"♥".repeat(Math.max(lives, 0))}
          {"♡".repeat(Math.max(BRIDGE_LIVES - lives, 0))}
        </div>
        <div className={styles.roundLabel}>
          Мост {roundIndex + 1}/{total} · {round.topic}
        </div>
        <Link href={exitHref} className={styles.exitLink}>
          ← Изход
        </Link>
      </div>

      <div className={styles.stage}>
        <div className={styles.figures} aria-label="Сравнение">
          {round.figures.map((fig) => {
            const focused = round.focusIds.includes(fig.id);
            return (
              <div
                key={fig.id}
                className={[
                  styles.figure,
                  sizeClass(fig.size),
                  focused ? styles.figureFocus : styles.figureDim,
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <span className={styles.figEmoji} aria-hidden>
                  {fig.emoji}
                </span>
                <span className={styles.figLabel}>{fig.label}</span>
              </div>
            );
          })}
        </div>

        <div
          className={[styles.bridgeWrap, shake ? styles.bridgeShake : "", crossing ? styles.bridgeOk : ""]
            .filter(Boolean)
            .join(" ")}
        >
          <div className={styles.cliffLeft} aria-hidden />
          <div className={styles.bridge}>
            <div className={styles.planks}>
              {Array.from({ length: 7 }).map((_, i) => (
                <span key={i} className={styles.plank} />
              ))}
            </div>
            {crossing ? (
              <span className={styles.walker} aria-hidden>
                🧒
              </span>
            ) : null}
            {showStomp ? (
              <span className={styles.stomper} aria-hidden>
                {stompFigure.emoji}
              </span>
            ) : null}
          </div>
          <div className={styles.cliffRight} aria-hidden />
        </div>
      </div>

      <p className={styles.sentence}>
        {round.sentence.split("_______").map((part, i, arr) => (
          <span key={i}>
            {part}
            {i < arr.length - 1 ? (
              <span className={styles.blank}>
                {picked && feedback?.ok ? picked : "______"}
              </span>
            ) : null}
          </span>
        ))}
      </p>

      {feedback ? (
        <p
          className={feedback.ok ? styles.tipOk : styles.tipBad}
          role="status"
        >
          {feedback.ok ? "✅ " : "💥 "}
          {feedback.tip}
        </p>
      ) : (
        <p className={styles.tipSpacer} />
      )}

      <div className={styles.options}>
        {options.map((opt) => {
          let cls = styles.optBtn;
          if (picked === opt.text) {
            cls += opt.correct ? ` ${styles.optOk}` : ` ${styles.optBad}`;
          } else if (picked && opt.correct && feedback?.ok) {
            cls += ` ${styles.optOk}`;
          }
          return (
            <button
              key={opt.text}
              type="button"
              className={cls}
              disabled={Boolean(picked) || crossing}
              onClick={() => select(opt)}
            >
              {opt.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
