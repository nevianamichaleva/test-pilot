"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import GameNameGate from "@/components/games/GameNameGate";
import GameResultSummary from "@/components/games/GameResultSummary";
import {
  COLOR_PAINTER_DEFAULT_WRONG,
  COLOR_PAINTER_LIVES,
  COLOR_PAINTER_PALETTE,
  COLOR_PAINTER_ROUNDS,
} from "@/data/bel-6-color-painter";
import useSaveGameResultOnEnd from "@/hooks/useSaveGameResultOnEnd";
import { buildGamePointsLabel } from "@/lib/saveGameResult";

import styles from "./Bel6ColorPainter.module.css";

/**
 * @param {{ exitHref?: string, game?: object }} props
 */
export default function Bel6ColorPainter({ exitHref = "/igri", game = null }) {
  const [phase, setPhase] = useState("intro");
  const [participantName, setParticipantName] = useState("");
  const [roundIndex, setRoundIndex] = useState(0);
  const [lives, setLives] = useState(COLOR_PAINTER_LIVES);
  const [painted, setPainted] = useState(/** @type {Record<string, string>} */ ({}));
  const [feedback, setFeedback] = useState(null);
  const [feedbackKind, setFeedbackKind] = useState("info");
  const [brushDry, setBrushDry] = useState(false);
  const [questionResults, setQuestionResults] = useState([]);
  const advanceTimer = useRef(null);

  const round = COLOR_PAINTER_ROUNDS[roundIndex];
  const total = COLOR_PAINTER_ROUNDS.length;
  const finished = phase === "won" || phase === "lost";
  const paintedCount = round ? round.determiners.filter((w) => painted[w]).length : 0;
  const allPainted = round ? paintedCount === round.determiners.length : false;

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

  const startRound = (idx) => {
    setRoundIndex(idx);
    setPainted({});
    setFeedback(null);
    setFeedbackKind("info");
    setBrushDry(false);
    setPhase("play");
  };

  const startGame = () => {
    setLives(COLOR_PAINTER_LIVES);
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
          firstAnswer: ok ? round.determiners.join(", ") : "грешка",
          correctAnswer: round.determiners.join(", "),
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
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => {
      if (roundIndex + 1 >= total) {
        setPhase("won");
        return;
      }
      startRound(roundIndex + 1);
    }, 1400);
  };

  const onWordClick = (word) => {
    if (phase !== "play" || allPainted) return;
    if (painted[word]) return;

    if (round.determiners.includes(word)) {
      const color = COLOR_PAINTER_PALETTE[paintedCount % COLOR_PAINTER_PALETTE.length];
      const nextPainted = { ...painted, [word]: color };
      setPainted(nextPainted);
      setBrushDry(false);

      const done = round.determiners.every((w) => nextPainted[w]);
      if (done) {
        setFeedback(round.successMessage);
        setFeedbackKind("ok");
        recordRoundResult(true);
        advanceRound();
        return;
      }

      setFeedback(`Вярно! „${word}“ е определение. Оцвети и останалите!`);
      setFeedbackKind("ok");
      return;
    }

    setBrushDry(true);
    setTimeout(() => setBrushDry(false), 700);
    const msg = round.wrongHints?.[word] ?? COLOR_PAINTER_DEFAULT_WRONG;
    setFeedback(msg);
    setFeedbackKind("bad");
    loseLife();
  };

  const wordStyle = (word) => {
    const color = painted[word];
    if (!color) return undefined;
    return { color, textDecorationColor: color };
  };

  if (phase === "intro") {
    return (
      <div className={styles.shell}>
        <div className={styles.intro}>
          <p className={styles.badge}>БЕЛ 6. клас · Задача 16</p>
          <h2 className={styles.introTitle}>Цветният художник</h2>
          <p className={styles.introSub}>Определение</p>
          <p className={styles.introText}>
            Определението описва съществителни имена – отговаря на „Какъв? Каква?“ и „Чий?“.
            Вземи четката и <strong>оцвети</strong> само думите, които правят изречението по-красиво!
          </p>
          <ul className={styles.bullets}>
            <li>🎨 Палитра с бои и четка</li>
            <li>Оцветената дума получава вълнообразно подчертаване</li>
            <li>
              {total} изречения · {COLOR_PAINTER_LIVES} опита
            </li>
          </ul>
          <GameNameGate
            inputId="color-painter-name"
            buttonLabel="Започни да рисуваш"
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
            {phase === "won" ? "Картината е готова!" : "Четката изсъхна…"}
          </h2>
          {participantName ? (
            <p className={styles.resultMsg}>
              Участник: <strong>{participantName}</strong>
            </p>
          ) : null}
          <p className={styles.resultMsg}>
            {phase === "won"
              ? `${buildGamePointsLabel(correct, total)}. Определението отговаря на Какъв? и Чий?`
              : `${buildGamePointsLabel(correct, questionResults.length || total)}. Попитай: Какъв? Каква? Какви? – и намери определението!`}
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
          {"🖤".repeat(Math.max(0, COLOR_PAINTER_LIVES - lives))}
        </p>
      </div>

      <div className={styles.paletteBar}>
        <div
          className={`${styles.brushTool} ${brushDry ? styles.brushToolDry : ""}`}
          aria-live="polite"
        >
          <span className={styles.brushIcon} aria-hidden>
            🖌️
          </span>
          <span>{brushDry ? "Четката изсъхна!" : "Четка за определения"}</span>
        </div>
        <div className={styles.paletteSwatches} aria-hidden>
          {COLOR_PAINTER_PALETTE.map((color) => (
            <span key={color} className={styles.swatch} style={{ background: color }} />
          ))}
        </div>
      </div>

      <p className={styles.toolHint}>
        {round.determiners.length > 1
          ? `Оцвети ${round.determiners.length} определения в изречението (${paintedCount}/${round.determiners.length}).`
          : "Кликни с четката върху определението – думата, която отговаря на „Какъв?“ или „Чий?“"}
      </p>

      <div className={styles.sentenceBox}>
        <p className={styles.sentenceLabel}>Изречение</p>
        <div className={styles.words}>
          {round.words.map((word) => (
            <button
              key={`${round.id}-${word}`}
              type="button"
              className={`${styles.wordBtn} ${painted[word] ? styles.painted : ""}`}
              style={wordStyle(word)}
              disabled={Boolean(allPainted)}
              onClick={() => onWordClick(word)}
            >
              {word}
            </button>
          ))}
        </div>
        <div className={styles.legend}>
          <span className={styles.legendSample}>
            <span>Младият</span> – определение (вълнообразно подчертаване)
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
