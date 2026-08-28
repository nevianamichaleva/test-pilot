"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import GameNameGate from "@/components/games/GameNameGate";
import GameResultSummary from "@/components/games/GameResultSummary";
import {
  GIFT_BOX_DEFAULT_WRONG,
  GIFT_BOX_LIVES,
  GIFT_BOX_ROUNDS,
} from "@/data/bel-6-gift-boxes";
import useSaveGameResultOnEnd from "@/hooks/useSaveGameResultOnEnd";
import { buildGamePointsLabel } from "@/lib/saveGameResult";

import styles from "./Bel6GiftBoxes.module.css";

/**
 * @param {{ exitHref?: string, game?: object }} props
 */
export default function Bel6GiftBoxes({ exitHref = "/igri", game = null }) {
  const [phase, setPhase] = useState("intro");
  const [participantName, setParticipantName] = useState("");
  const [roundIndex, setRoundIndex] = useState(0);
  const [lives, setLives] = useState(GIFT_BOX_LIVES);
  const [opened, setOpened] = useState(false);
  const [brokenKeys, setBrokenKeys] = useState(/** @type {string[]} */ ([]));
  const [feedback, setFeedback] = useState(null);
  const [feedbackKind, setFeedbackKind] = useState("info");
  const [questionResults, setQuestionResults] = useState([]);
  const advanceTimer = useRef(null);

  const round = GIFT_BOX_ROUNDS[roundIndex];
  const total = GIFT_BOX_ROUNDS.length;
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

  const startRound = (idx) => {
    setRoundIndex(idx);
    setOpened(false);
    setBrokenKeys([]);
    setFeedback(null);
    setFeedbackKind("info");
    setPhase("play");
  };

  const startGame = () => {
    setLives(GIFT_BOX_LIVES);
    setQuestionResults([]);
    startRound(0);
  };

  const recordRoundResult = (ok, chosenKey) => {
    setQuestionResults((prev) => {
      if (prev.some((item) => item.questionNumber === roundIndex + 1)) return prev;
      return [
        ...prev,
        {
          questionNumber: roundIndex + 1,
          questionText: `${round.before} ${round.hidden}${round.after}`,
          firstAnswer: chosenKey,
          correctAnswer: round.correctKey,
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

  const onKeyPick = (key) => {
    if (phase !== "play" || opened || brokenKeys.includes(key)) return;

    if (key === round.correctKey) {
      setOpened(true);
      setFeedback(round.openMessage);
      setFeedbackKind("ok");
      recordRoundResult(true, key);
      advanceRound();
      return;
    }

    setBrokenKeys((prev) => [...prev, key]);
    const hint = round.wrongHints?.[key] ?? GIFT_BOX_DEFAULT_WRONG;
    setFeedback(hint);
    setFeedbackKind("bad");
    recordRoundResult(false, key);
    loseLife();
  };

  if (phase === "intro") {
    return (
      <div className={styles.shell}>
        <div className={styles.intro}>
          <p className={styles.badge}>БЕЛ 6. клас</p>
          <h2 className={styles.introTitle}>Подаръци в кутии</h2>
          <p className={styles.introSub}>Допълнение</p>
          <p className={styles.introText}>
            Допълнението е част, която „допълва“ действието и отговаря на „Кого?“ или „Какво?“.
            Думата е скрита в подаръчна кутия — избери правилния ключ-въпрос, за да я отвориш!
          </p>
          <ul className={styles.bullets}>
            <li>🎁 Кутията крие допълнението</li>
            <li>🔑 Ключове: КАК?, КОГА?, КАКВО?, КОГО?</li>
            <li>
              {total} изречения · {GIFT_BOX_LIVES} опита
            </li>
          </ul>
          <GameNameGate
            inputId="gift-box-name"
            buttonLabel="Отвори първата кутия"
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
            {phase === "won" ? "Всички кутии са отворени!" : "Ключовете свършиха…"}
          </h2>
          {participantName ? (
            <p className={styles.resultMsg}>
              Участник: <strong>{participantName}</strong>
            </p>
          ) : null}
          <p className={styles.resultMsg}>
            {phase === "won"
              ? `${buildGamePointsLabel(correct, total)}. Допълнението отговаря на Кого? или Какво?`
              : `${buildGamePointsLabel(correct, questionResults.length || total)}. Помни: допълнението е „подаръкът“ в изречението!`}
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
          Кутия {roundIndex + 1} / {total}
        </p>
        <p className={styles.lives} aria-live="polite">
          {"❤".repeat(Math.max(0, lives))}
          {"🖤".repeat(Math.max(0, GIFT_BOX_LIVES - lives))}
        </p>
      </div>

      <div className={styles.sentenceStage}>
        <p className={styles.sentenceLabel}>Изречение</p>
        <div className={styles.sentence}>
          <span>{round.before}</span>
          <span
            className={`${styles.giftBox} ${opened ? styles.giftBoxOpen : styles.giftBoxClosed}`}
            aria-label={opened ? round.hidden : "Затворена кутия с допълнение"}
          >
            {opened ? (
              <>
                <span className={styles.sparkle} aria-hidden />
                <span className={styles.hiddenWord}>{round.hidden}</span>
              </>
            ) : null}
          </span>
          <span>{round.after}</span>
        </div>
      </div>

      {!opened ? (
        <>
          <p className={styles.keysLabel}>Избери ключ-въпрос, който отваря кутията:</p>
          <div className={styles.keys} role="group" aria-label="Ключове-въпроси">
            {round.keys.map((key) => {
              let cls = styles.keyBtn;
              if (brokenKeys.includes(key)) cls += ` ${styles.keyBroken}`;
              return (
                <button
                  key={`${round.id}-${key}`}
                  type="button"
                  className={cls}
                  disabled={brokenKeys.includes(key)}
                  onClick={() => onKeyPick(key)}
                >
                  {key}
                </button>
              );
            })}
          </div>
        </>
      ) : null}

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
