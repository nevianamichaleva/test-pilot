"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import GameNameGate from "@/components/games/GameNameGate";
import GameResultSummary from "@/components/games/GameResultSummary";
import {
  TRAIN_DRIVER_DEFAULT_WRONG,
  TRAIN_DRIVER_LIVES,
  TRAIN_DRIVER_ROUNDS,
} from "@/data/bel-6-train-driver";
import useSaveGameResultOnEnd from "@/hooks/useSaveGameResultOnEnd";
import { buildGamePointsLabel } from "@/lib/saveGameResult";

import styles from "./Bel6TrainDriver.module.css";

/** @typedef {'podlog' | 'skazuemo' | null} ActiveTool */

/**
 * @param {{ exitHref?: string, game?: object }} props
 */
export default function Bel6TrainDriver({ exitHref = "/igri", game = null }) {
  const [phase, setPhase] = useState("intro"); // intro | play | won | lost
  const [participantName, setParticipantName] = useState("");
  const [roundIndex, setRoundIndex] = useState(0);
  const [lives, setLives] = useState(TRAIN_DRIVER_LIVES);
  const [activeTool, setActiveTool] = useState(/** @type {ActiveTool} */ (null));
  const [podlogWord, setPodlogWord] = useState(null);
  const [skazuemoWord, setSkazuemoWord] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [feedbackKind, setFeedbackKind] = useState("info");
  const [smokeBad, setSmokeBad] = useState(false);
  const [trainDepart, setTrainDepart] = useState(false);
  const [questionResults, setQuestionResults] = useState([]);
  const advanceTimer = useRef(null);

  const round = TRAIN_DRIVER_ROUNDS[roundIndex];
  const total = TRAIN_DRIVER_ROUNDS.length;
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

  useEffect(
    () => () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    },
    []
  );

  const resetRoundMarks = useCallback(() => {
    setPodlogWord(null);
    setSkazuemoWord(null);
    setActiveTool(null);
    setFeedback(null);
    setFeedbackKind("info");
    setSmokeBad(false);
    setTrainDepart(false);
  }, []);

  const startRound = useCallback(
    (idx) => {
      resetRoundMarks();
      setRoundIndex(idx);
      setPhase("play");
    },
    [resetRoundMarks]
  );

  const startGame = () => {
    setLives(TRAIN_DRIVER_LIVES);
    setQuestionResults([]);
    startRound(0);
  };

  const recordRoundResult = (ok) => {
    setQuestionResults((prev) => {
      if (prev.some((item) => item.questionNumber === roundIndex + 1)) return prev;
      return [
        ...prev,
        {
          questionNumber: roundIndex + 1,
          questionText: round.sentence,
          firstAnswer: ok ? "подлог + сказуемо" : "грешка",
          correctAnswer: `${round.podlog} · ${round.skazuemo}`,
          isCorrect: ok,
          status: ok ? "correct" : "wrong",
        },
      ];
    });
  };

  const loseLife = () => {
    setLives((l) => {
      const next = l - 1;
      if (next <= 0) setPhase("lost");
      return next;
    });
  };

  const advanceRound = () => {
    setTrainDepart(true);
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => {
      if (roundIndex + 1 >= total) {
        setPhase("won");
        return;
      }
      startRound(roundIndex + 1);
    }, 950);
  };

  const onWordClick = (word) => {
    if (phase !== "play" || trainDepart) return;
    if (!activeTool) {
      setFeedback("Първо избери инструмент: Машинист (подлог) или Двигател (сказуемо).");
      setFeedbackKind("info");
      return;
    }
    if (podlogWord === word || skazuemoWord === word) return;

    if (activeTool === "podlog") {
      if (podlogWord) return;
      if (word === round.podlog) {
        setPodlogWord(word);
        setFeedback("Вярно! Машинистът (подлогът) е на място — две права линии отдолу.");
        setFeedbackKind("ok");
        if (skazuemoWord) {
          recordRoundResult(true);
          setFeedback("Браво! Влакчето тръгва — и подлог, и сказуемо са намерени!");
          advanceRound();
        }
        return;
      }
      setSmokeBad(true);
      setTimeout(() => setSmokeBad(false), 700);
      const msg =
        round.wrongPodlog?.[word] ?? TRAIN_DRIVER_DEFAULT_WRONG.podlog;
      setFeedback(msg);
      setFeedbackKind("bad");
      loseLife();
      return;
    }

    if (activeTool === "skazuemo") {
      if (skazuemoWord) return;
      if (word === round.skazuemo) {
        setSkazuemoWord(word);
        setFeedback("Вярно! Двигателят (сказуемото) работи — две успоредни линии.");
        setFeedbackKind("ok");
        if (podlogWord) {
          recordRoundResult(true);
          setFeedback("Браво! Влакчето тръгва — и подлог, и сказуемо са намерени!");
          advanceRound();
        }
        return;
      }
      setSmokeBad(true);
      setTimeout(() => setSmokeBad(false), 700);
      const msg =
        round.wrongSkazuemo?.[word] ?? TRAIN_DRIVER_DEFAULT_WRONG.skazuemo;
      setFeedback(msg);
      setFeedbackKind("bad");
      loseLife();
    }
  };

  const wordClass = (word) => {
    let cls = styles.wordBtn;
    if (podlogWord === word) cls += ` ${styles.podlogMark}`;
    if (skazuemoWord === word) cls += ` ${styles.skazuemoMark}`;
    return cls;
  };

  if (phase === "intro") {
    return (
      <div className={styles.shell}>
        <div className={styles.intro}>
          <p className={styles.badge}>БЕЛ 6. клас</p>
          <h2 className={styles.introTitle}>Кой кара влака?</h2>
          <p className={styles.introSub}>Подлог и сказуемо</p>
          <p className={styles.introText}>
            Локомотивът е сказуемото — действието, което движи изречението. Машинистът е
            подлогът — вършителят, който го управлява. Избери инструмент и кликни върху
            правилната дума!
          </p>
          <ul className={styles.bullets}>
            <li>Машинист 🧢 → подлог (две права линии отдолу)</li>
            <li>Двигател ⚙ → сказуемо (две успоредни линии)</li>
            <li>
              {total} изречения · {TRAIN_DRIVER_LIVES} опита
            </li>
          </ul>
          <GameNameGate
            inputId="train-driver-name"
            buttonLabel="Тръгни с влака"
            onStart={(name) => {
              setParticipantName(name);
              startGame();
            }}
          />
        </div>
      </div>
    );
  }

  if (finished) {
    const correct = questionResults.filter((q) => q.isCorrect).length;
    return (
      <div className={styles.shell}>
        <div className={styles.result}>
          <h2 className={phase === "won" ? styles.resultOk : styles.resultBad}>
            {phase === "won" ? "Влакът пристигна!" : "Локомотивът спря…"}
          </h2>
          {participantName ? (
            <p className={styles.resultMsg}>
              Участник: <strong>{participantName}</strong>
            </p>
          ) : null}
          <p className={styles.resultMsg}>
            {phase === "won"
              ? `${buildGamePointsLabel(correct, total)}. Намери подлог и сказуемо в изреченията!`
              : `${buildGamePointsLabel(correct, questionResults.length || total)}. Попитай: Кой? Какво? · Какво прави?`}
          </p>
          <GameResultSummary items={questionResults} />
          <div className={styles.actions}>
            <button type="button" className={styles.primaryBtn} onClick={startGame}>
              Играй отново
            </button>
            <Link href={exitHref} className={styles.secondaryBtn}>
              ← Към игрите
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.shell}>
      <div className={styles.playHead}>
        <p className={styles.meta}>
          Изречение {roundIndex + 1} / {total}
        </p>
        <p className={styles.lives} aria-live="polite">
          {"❤".repeat(Math.max(0, lives))}
          {"🖤".repeat(Math.max(0, TRAIN_DRIVER_LIVES - lives))}
        </p>
      </div>

      <div className={styles.trainScene} aria-hidden>
        <div className={styles.rail} />
        <div className={`${styles.train} ${trainDepart ? styles.trainDepart : ""}`}>
          <div className={styles.cab}>
            <span className={styles.cabLabel}>Машинист</span>
          </div>
          <div className={styles.loco}>
            <span className={styles.smokeStack} />
            <span className={`${styles.smoke} ${smokeBad ? styles.smokeBad : ""}`} />
            <span className={styles.locoLabel}>Двигател</span>
          </div>
        </div>
      </div>

      <div className={styles.tools} role="toolbar" aria-label="Инструменти за синтактичен анализ">
        <button
          type="button"
          className={`${styles.toolBtn} ${activeTool === "podlog" ? styles.toolActive : ""}`}
          onClick={() => setActiveTool("podlog")}
          aria-pressed={activeTool === "podlog"}
        >
          <span className={styles.toolIcon} aria-hidden>
            🧢
          </span>
          <span>
            Машинист
            <br />
            <small>Подлог</small>
          </span>
        </button>
        <button
          type="button"
          className={`${styles.toolBtn} ${activeTool === "skazuemo" ? styles.toolActive : ""}`}
          onClick={() => setActiveTool("skazuemo")}
          aria-pressed={activeTool === "skazuemo"}
        >
          <span className={styles.toolIcon} aria-hidden>
            ⚙
          </span>
          <span>
            Двигател
            <br />
            <small>Сказуемо</small>
          </span>
        </button>
      </div>

      <p className={styles.toolHint}>
        {activeTool === "podlog"
          ? "Кликни върху подлога — Кой? или Какво?"
          : activeTool === "skazuemo"
            ? "Кликни върху сказуемото — Какво прави?"
            : "Избери Машинист или Двигател, после кликни върху дума."}
      </p>

      <div className={styles.sentenceBox}>
        <p className={styles.sentenceLabel}>Изречение</p>
        <div className={styles.words}>
          {round.words.map((word) => (
            <button
              key={`${round.id}-${word}`}
              type="button"
              className={wordClass(word)}
              disabled={Boolean(trainDepart)}
              onClick={() => onWordClick(word)}
            >
              {word}
            </button>
          ))}
        </div>
        <div className={styles.legend}>
          <span className={styles.legendPodlog}>
            <span aria-hidden /> подлог
          </span>
          <span className={styles.legendSkazuemo}>
            <span aria-hidden /> сказуемо
          </span>
        </div>
      </div>

      {feedback ? (
        <p
          className={`${styles.feedback} ${
            feedbackKind === "ok"
              ? styles.feedbackOk
              : feedbackKind === "bad"
                ? styles.feedbackBad
                : styles.feedbackInfo
          }`}
          role="status"
        >
          {feedback}
        </p>
      ) : null}
    </div>
  );
}
