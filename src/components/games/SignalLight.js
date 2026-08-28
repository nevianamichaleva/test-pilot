"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import GameNameGate from "@/components/games/GameNameGate";
import GameResultSummary from "@/components/games/GameResultSummary";
import { SIGNAL_LIVES, SIGNAL_ROUNDS } from "@/data/english-signal-light";
import useSaveGameResultOnEnd from "@/hooks/useSaveGameResultOnEnd";
import { buildGamePointsLabel } from "@/lib/saveGameResult";

import styles from "./SignalLight.module.css";

const CHOICE_LABEL = {
  continuous: "Синя · Continuous",
  simple: "Зелена · Simple",
};

/**
 * @param {{ exitHref?: string, game?: object }} props
 */
export default function SignalLight({ exitHref = "/igri", game = null }) {
  const [phase, setPhase] = useState("intro"); // intro | play | won | lost
  const [participantName, setParticipantName] = useState("");
  const [roundIndex, setRoundIndex] = useState(0);
  const [lives, setLives] = useState(SIGNAL_LIVES);
  const [picked, setPicked] = useState(null); // 'continuous' | 'simple'
  const [feedback, setFeedback] = useState(null); // { ok, tip }
  const [lit, setLit] = useState(null); // glowing colour after pick
  const [firstTryScore, setFirstTryScore] = useState(0);
  const [attempted, setAttempted] = useState(false);
  const [questionResults, setQuestionResults] = useState([]);
  const [firstTryByRound, setFirstTryByRound] = useState({});

  const round = SIGNAL_ROUNDS[roundIndex];
  const total = SIGNAL_ROUNDS.length;

  const sentenceParts = useMemo(() => {
    if (!round?.highlight) return [{ text: round?.sentence ?? "", hot: false }];
    const h = round.highlight;
    const idx = round.sentence.toLowerCase().indexOf(h.toLowerCase());
    if (idx < 0) return [{ text: round.sentence, hot: false }];
    const before = round.sentence.slice(0, idx);
    const mid = round.sentence.slice(idx, idx + h.length);
    const after = round.sentence.slice(idx + h.length);
    return [
      { text: before, hot: false },
      { text: mid, hot: true },
      { text: after, hot: false },
    ].filter((p) => p.text);
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
    setLit(null);
    setAttempted(false);
    setPhase("play");
  };

  const startGame = () => {
    setLives(SIGNAL_LIVES);
    setFirstTryScore(0);
    setQuestionResults([]);
    setFirstTryByRound({});
    startRound(0);
  };

  const recordRoundResult = (idx, firstChoice, isCorrect) => {
    const r = SIGNAL_ROUNDS[idx];
    setQuestionResults((prev) => {
      if (prev.some((item) => item.questionNumber === idx + 1)) return prev;
      return [
        ...prev,
        {
          questionNumber: idx + 1,
          questionText: r?.sentence || `Сигнал ${idx + 1}`,
          firstAnswer: CHOICE_LABEL[firstChoice] || firstChoice,
          correctAnswer: CHOICE_LABEL[r?.answer] || r?.answer || "—",
          isCorrect,
          status: isCorrect ? "correct" : "wrong",
        },
      ];
    });
  };

  const select = (choice) => {
    if (phase !== "play" || picked) return;
    const isFirstTry = !attempted;
    setPicked(choice);
    setAttempted(true);
    setLit(choice);

    if (isFirstTry) {
      setFirstTryByRound((prev) => ({ ...prev, [roundIndex]: choice }));
    }

    if (choice === round.answer) {
      if (isFirstTry) setFirstTryScore((s) => s + 1);
      const firstChoice = isFirstTry ? choice : firstTryByRound[roundIndex] || choice;
      recordRoundResult(roundIndex, firstChoice, isFirstTry);
      setFeedback({ ok: true, tip: round.tip });
      setTimeout(() => {
        if (roundIndex + 1 >= total) {
          setPhase("won");
        } else {
          startRound(roundIndex + 1);
        }
      }, 1600);
      return;
    }

    setFeedback({
      ok: false,
      tip:
        round.answer === "continuous"
          ? `Гледай жокера за „сега“! ${round.tip}`
          : `Гледай жокера за навик! ${round.tip}`,
    });
    const nextLives = lives - 1;
    setLives(nextLives);

    if (nextLives <= 0) {
      recordRoundResult(roundIndex, choice, false);
      setTimeout(() => setPhase("lost"), 1200);
      return;
    }

    setTimeout(() => {
      setPicked(null);
      setFeedback(null);
      setLit(null);
    }, 1800);
  };

  if (phase === "intro") {
    return (
      <div className={styles.shell}>
        <div className={styles.intro}>
          <p className={styles.badge}>Diagnostic · Grade 6</p>
          <h2 className={styles.introTitle}>The Signal Light</h2>
          <p className={styles.introSub}>Сигнална лампа · Present Simple vs Continuous</p>
          <p className={styles.introText}>
            Първо търси <strong>контекста</strong>, после избери лампата. Думи за{" "}
            <em>сега</em> (Listen!, Look!, Where is…?, at the moment, now) →{" "}
            <span className={styles.swatchBlue}>сина</span> лампа = Present Continuous. Думи за{" "}
            <em>навик</em> (usually, always, every day, often) →{" "}
            <span className={styles.swatchGreen}>зелена</span> лампа = Present Simple.
          </p>
          <ul className={styles.bullets}>
            <li>{total} сигнала за разчитане</li>
            <li>{SIGNAL_LIVES} живота</li>
            <li>Жокерните думи светват след отговор</li>
          </ul>
          <GameNameGate
            inputId="signal-light-name"
            buttonLabel="Светни лампата"
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
            {phase === "won" ? "Сигналите са ясни!" : "Лампата угасна…"}
          </h2>
          {participantName ? (
            <p className={styles.resultMsg}>
              Участник: <strong>{participantName}</strong>
            </p>
          ) : null}
          <p className={styles.resultMsg}>
            {phase === "won"
              ? `${buildGamePointsLabel(firstTryScore, total)} от първи опит. Вече търсиш контекста преди глагола!`
              : `${buildGamePointsLabel(correctCount, questionResults.length || total)}. Помни: сега → синя (Continuous); навик → зелена (Simple).`}
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

  return (
    <div className={styles.shell}>
      <div className={styles.hud}>
        <div className={styles.lives} aria-label={`Животи: ${lives}`}>
          {"♥".repeat(Math.max(lives, 0))}
          {"♡".repeat(Math.max(SIGNAL_LIVES - lives, 0))}
        </div>
        <div className={styles.roundLabel}>
          Сигнал {roundIndex + 1}/{total}
        </div>
        <Link href={exitHref} className={styles.exitLink}>
          ← Изход
        </Link>
      </div>

      <div className={styles.stage}>
        <div
          className={[
            styles.lamp,
            lit === "continuous" ? styles.lampBlue : "",
            lit === "simple" ? styles.lampGreen : "",
            feedback?.ok ? styles.lampPulse : "",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-hidden
        >
          <div className={styles.lampHood} />
          <div className={styles.lampGlass}>
            <span className={styles.lampGlow} />
          </div>
          <div className={styles.lampPole} />
        </div>

        <p className={styles.sentence} lang="en">
          {sentenceParts.map((p, i) =>
            p.hot && (feedback || picked) ? (
              <mark key={i} className={styles.hotWord}>
                {p.text}
              </mark>
            ) : (
              <span key={i}>{p.text}</span>
            )
          )}
        </p>
      </div>

      {feedback ? (
        <p className={feedback.ok ? styles.tipOk : styles.tipBad} role="status">
          {feedback.ok ? "✅ " : "💡 "}
          {feedback.tip}
        </p>
      ) : (
        <p className={styles.prompt}>Коя лампа свети за това изречение?</p>
      )}

      <div className={styles.options} role="group" aria-label="Избери лампа">
        <button
          type="button"
          className={[
            styles.optBtn,
            styles.optBlue,
            picked === "continuous"
              ? round.answer === "continuous"
                ? styles.optOk
                : styles.optBad
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
          disabled={Boolean(picked)}
          onClick={() => select("continuous")}
        >
          <span className={styles.optDot} aria-hidden />
          <span className={styles.optLabel}>Синя · Continuous</span>
          <span className={styles.optHint}>сега / в момента</span>
        </button>
        <button
          type="button"
          className={[
            styles.optBtn,
            styles.optGreen,
            picked === "simple"
              ? round.answer === "simple"
                ? styles.optOk
                : styles.optBad
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
          disabled={Boolean(picked)}
          onClick={() => select("simple")}
        >
          <span className={styles.optDot} aria-hidden />
          <span className={styles.optLabel}>Зелена · Simple</span>
          <span className={styles.optHint}>навик / regularly</span>
        </button>
      </div>
    </div>
  );
}
