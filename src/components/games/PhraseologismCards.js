"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import GameNameGate from "@/components/games/GameNameGate";
import GameResultSummary from "@/components/games/GameResultSummary";
import {
  PHRASE_ROUNDS,
  phraseById,
  phraseQuestionNumber,
  totalPhrasePairs,
} from "@/data/bel-phraseologisms";
import useSaveGameResultOnEnd from "@/hooks/useSaveGameResultOnEnd";
import { buildGamePointsLabel } from "@/lib/saveGameResult";

import styles from "./PhraseologismCards.module.css";

function shuffleArray(items) {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * @param {{ exitHref?: string, game?: object | null }} props
 */
export default function PhraseologismCards({ exitHref = "/igri", game = null }) {
  const [phase, setPhase] = useState("intro");
  const [participantName, setParticipantName] = useState("");
  const [roundIndex, setRoundIndex] = useState(0);
  const [meaningOrder, setMeaningOrder] = useState([]);
  const [selectedPhrase, setSelectedPhrase] = useState(null);
  const [matched, setMatched] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [flashOk, setFlashOk] = useState(null);
  const [attempts, setAttempts] = useState({});
  const [questionResults, setQuestionResults] = useState([]);

  const round = PHRASE_ROUNDS[roundIndex];
  const total = totalPhrasePairs();
  const finished = phase === "won";

  const roundCards = useMemo(
    () => (round ? round.ids.map((id) => phraseById(id)).filter(Boolean) : []),
    [round]
  );

  useSaveGameResultOnEnd(finished && Boolean(game?.slug), () => ({
    game,
    name: participantName,
    questionResults,
    correct: questionResults.filter((q) => q.isCorrect).length,
    total: questionResults.length || total,
    completed: true,
    won: true,
  }));

  const startRound = (idx) => {
    const r = PHRASE_ROUNDS[idx];
    setRoundIndex(idx);
    setMeaningOrder(shuffleArray(r.ids));
    setSelectedPhrase(null);
    setMatched([]);
    setFeedback(null);
    setFlashOk(null);
    setPhase("play");
  };

  const startGame = () => {
    setQuestionResults([]);
    setAttempts({});
    startRound(0);
  };

  const recordPair = (id, firstPhrase, ok) => {
    const card = phraseById(id);
    if (!card) return;
    setQuestionResults((prev) => {
      const n = phraseQuestionNumber(roundIndex, id);
      if (prev.some((item) => item.questionNumber === n)) return prev;
      return [
        ...prev,
        {
          questionNumber: n,
          questionText: card.phrase,
          firstAnswer: ok ? card.meaning : "грешна двойка",
          correctAnswer: card.meaning,
          isCorrect: ok,
          status: ok ? "correct" : "wrong",
        },
      ];
    });
  };

  const pickMeaning = (id) => {
    if (!selectedPhrase || matched.includes(selectedPhrase)) return;
    const card = phraseById(selectedPhrase);
    if (!card) return;

    const isFirst = attempts[selectedPhrase] == null;
    if (isFirst) setAttempts((p) => ({ ...p, [selectedPhrase]: id }));

    if (id === selectedPhrase) {
      recordPair(id, selectedPhrase, isFirst || attempts[selectedPhrase] === id);
      setMatched((m) => [...m, selectedPhrase]);
      setFlashOk(selectedPhrase);
      setFeedback({ kind: "ok", text: card.example });
      setSelectedPhrase(null);
      setTimeout(() => setFlashOk(null), 700);

      if (matched.length + 1 >= round.ids.length) {
        setTimeout(() => {
          if (roundIndex + 1 >= PHRASE_ROUNDS.length) setPhase("won");
          else startRound(roundIndex + 1);
        }, 1400);
      }
    } else {
      const wrongCard = phraseById(id);
      setFeedback({
        kind: "hint",
        text: card.hint || wrongCard?.hint || "Прочети внимателно двете карти и опитай пак.",
      });
      setTimeout(() => {
        setSelectedPhrase(null);
      }, 400);
    }
  };

  if (phase === "intro") {
    return (
      <div className={styles.shell}>
        <div className={styles.intro}>
          <p className={styles.badge}>Български език</p>
          <h2 className={styles.introTitle}>Фразеологични карти</h2>
          <p className={styles.introSub}>
            Свържи фразеологизма с правилното значение. Без таймер — мисли спокойно.
          </p>
          <ul className={styles.bullets}>
            <li>Докосни фразата, после значението</li>
            <li>При вярна двойка виждаш примерно изречение</li>
            <li>При грешка — кратка подсказка, не наказание</li>
          </ul>
          <p className={styles.credit}>
            По „Златното българско слово: Фразеологични карти“, Силвия Анова
          </p>
          <GameNameGate inputId="phrase-cards-name" onStart={(name) => {
            setParticipantName(name);
            startGame();
          }} />
        </div>
      </div>
    );
  }

  if (phase === "won") {
    const correctCount = questionResults.filter((q) => q.isCorrect).length;
    return (
      <div className={styles.shell}>
        <div className={styles.result}>
          <h2 className={styles.resultOk}>Браво!</h2>
          {participantName ? (
            <p className={styles.resultMsg}>
              Участник: <strong>{participantName}</strong>
            </p>
          ) : null}
          <p className={styles.resultMsg}>
            {buildGamePointsLabel(correctCount, questionResults.length || total)}. Фразеологизмите
            са свързани!
          </p>
          <GameResultSummary items={questionResults} />
          <div className={styles.actionRow}>
            <button type="button" className={styles.primaryBtn} onClick={startGame}>
              Играй отново
            </button>
            <Link href={exitHref} className={styles.menuBtn}>
              Към игрите
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!round) return null;

  return (
    <div className={styles.shell}>
      <div className={styles.topBar}>
        <Link href={exitHref} className={styles.backLink}>
          ← Към игрите
        </Link>
        <div className={styles.progress}>
          Кръг {roundIndex + 1} / {PHRASE_ROUNDS.length} · {matched.length}/{round.ids.length}
        </div>
      </div>

      <p className={styles.prompt}>Свържи фразеологизма със значението</p>

      {feedback ? (
        <p
          className={feedback.kind === "ok" ? styles.feedbackOk : styles.feedbackHint}
          role="status"
        >
          {feedback.kind === "ok" ? (
            <>
              <span className={styles.exampleLabel}>Пример:</span> {feedback.text}
            </>
          ) : (
            feedback.text
          )}
        </p>
      ) : (
        <p className={styles.feedbackSpacer} />
      )}

      <div className={styles.board}>
        <div className={styles.col}>
          <h3 className={styles.colTitle}>Фразеологизъм</h3>
          {roundCards.map((card) => {
            if (matched.includes(card.id)) return null;
            const selected = selectedPhrase === card.id;
            const flash = flashOk === card.id;
            return (
              <button
                key={card.id}
                type="button"
                className={[
                  styles.phraseCard,
                  selected ? styles.cardSelected : "",
                  flash ? styles.cardFlashOk : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => {
                  setSelectedPhrase((cur) => (cur === card.id ? null : card.id));
                  setFeedback(null);
                }}
              >
                <span className={styles.icon} aria-hidden>
                  {card.icon}
                </span>
                <span className={styles.phraseText}>{card.phrase}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.col}>
          <h3 className={styles.colTitle}>Значение</h3>
          {meaningOrder.map((id) => {
            if (matched.includes(id)) return null;
            const card = phraseById(id);
            if (!card) return null;
            return (
              <button
                key={`m-${id}`}
                type="button"
                className={[
                  styles.meaningCard,
                  selectedPhrase ? styles.meaningReady : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => pickMeaning(id)}
              >
                {card.meaning}
              </button>
            );
          })}
        </div>
      </div>

      <p className={styles.touchHint}>
        {selectedPhrase
          ? "Сега избери подходящото значение"
          : "Докосни фразеологизъм отляво"}
      </p>
    </div>
  );
}
