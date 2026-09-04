"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import GameNameGate from "@/components/games/GameNameGate";
import GameResultSummary from "@/components/games/GameResultSummary";
import {
  ANTONYM_DEFINITION,
  ANTONYM_PAIRS,
  CHOICE_COUNT,
  ROUND_SIZE,
  pickDistractors,
} from "@/data/bel-antonyms";
import useSaveGameResultOnEnd from "@/hooks/useSaveGameResultOnEnd";
import { buildGamePointsLabel } from "@/lib/saveGameResult";

import styles from "./AntonymPuzzle.module.css";

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
export default function AntonymPuzzle({ exitHref = "/igri", game = null }) {
  const [phase, setPhase] = useState("learn"); // learn | intro | play | joined | won
  const [participantName, setParticipantName] = useState("");
  const [deck, setDeck] = useState([]);
  const [index, setIndex] = useState(0);
  const [promptSide, setPromptSide] = useState("a"); // коя дума показваме вляво
  const [choices, setChoices] = useState([]);
  const [picked, setPicked] = useState(null);
  const [joined, setJoined] = useState(false);
  const [hint, setHint] = useState("");
  const [questionResults, setQuestionResults] = useState([]);
  const [firstAttempt, setFirstAttempt] = useState(true);

  const finished = phase === "won";
  const pair = deck[index] ?? null;

  const promptWord = useMemo(() => {
    if (!pair) return null;
    return promptSide === "a"
      ? { word: pair.a, icon: pair.iconA }
      : { word: pair.b, icon: pair.iconB };
  }, [pair, promptSide]);

  const answerWord = useMemo(() => {
    if (!pair) return null;
    return promptSide === "a"
      ? { word: pair.b, icon: pair.iconB }
      : { word: pair.a, icon: pair.iconA };
  }, [pair, promptSide]);

  useSaveGameResultOnEnd(finished && Boolean(game?.slug), () => ({
    game,
    name: participantName,
    questionResults,
    correct: questionResults.filter((q) => q.isCorrect).length,
    total: questionResults.length || ROUND_SIZE,
    completed: true,
    won: true,
  }));

  const buildRound = (pairItem, side) => {
    const correctSide = side === "a" ? "b" : "a";
    const correct = {
      id: `${pairItem.id}-ok`,
      word: correctSide === "a" ? pairItem.a : pairItem.b,
      icon: correctSide === "a" ? pairItem.iconA : pairItem.iconB,
      correct: true,
    };
    const distractors = pickDistractors(pairItem.id, CHOICE_COUNT - 1, correctSide);
    return shuffleArray([correct, ...distractors]);
  };

  const startGame = () => {
    const selected = shuffleArray(ANTONYM_PAIRS).slice(0, ROUND_SIZE);
    const side = Math.random() < 0.5 ? "a" : "b";
    setDeck(selected);
    setIndex(0);
    setPromptSide(side);
    setChoices(buildRound(selected[0], side));
    setPicked(null);
    setJoined(false);
    setHint("");
    setQuestionResults([]);
    setFirstAttempt(true);
    setPhase("play");
  };

  const recordResult = (ok) => {
    if (!pair || !promptWord || !answerWord) return;
    setQuestionResults((prev) => {
      const n = index + 1;
      if (prev.some((item) => item.questionNumber === n)) return prev;
      return [
        ...prev,
        {
          questionNumber: n,
          questionText: `${promptWord.word} → ?`,
          firstAnswer: ok ? answerWord.word : "грешен избор",
          correctAnswer: answerWord.word,
          isCorrect: ok,
          status: ok ? "correct" : "wrong",
        },
      ];
    });
  };

  const onPick = (choice) => {
    if (joined || phase !== "play") return;
    setPicked(choice.id);

    if (choice.correct) {
      if (firstAttempt) recordResult(true);
      else recordResult(false);
      setJoined(true);
      setHint("");
      setPhase("joined");
    } else {
      if (firstAttempt) {
        setFirstAttempt(false);
        recordResult(false);
      }
      setHint("Опитай пак — потърси противоположното.");
      setTimeout(() => setPicked(null), 400);
    }
  };

  const goNext = () => {
    if (index + 1 >= deck.length) {
      setPhase("won");
      return;
    }
    const nextIndex = index + 1;
    const nextPair = deck[nextIndex];
    const side = Math.random() < 0.5 ? "a" : "b";
    setIndex(nextIndex);
    setPromptSide(side);
    setChoices(buildRound(nextPair, side));
    setPicked(null);
    setJoined(false);
    setHint("");
    setFirstAttempt(true);
    setPhase("play");
  };

  if (phase === "learn") {
    return (
      <div className={styles.shell}>
        <div className={styles.learn}>
          <p className={styles.badge}>Български език</p>
          <h2 className={styles.title}>{ANTONYM_DEFINITION.title}</h2>
          <p className={styles.definition}>{ANTONYM_DEFINITION.text}</p>

          <div className={styles.exampleRow}>
            {ANTONYM_DEFINITION.examples.map((ex) => (
              <div key={`${ex.a}-${ex.b}`} className={styles.examplePair}>
                <span className={styles.exampleWord}>{ex.a}</span>
                <span className={styles.exampleDash}>–</span>
                <span className={styles.exampleWord}>{ex.b}</span>
              </div>
            ))}
          </div>

          <p className={styles.learnHint}>
            В играта ще събираш пъзел: лявата половинка + правилната противоположност.
          </p>

          <button type="button" className={styles.primaryBtn} onClick={() => setPhase("intro")}>
            Разбрах — напред
          </button>
        </div>
      </div>
    );
  }

  if (phase === "intro") {
    return (
      <div className={styles.shell}>
        <div className={styles.intro}>
          <h2 className={styles.title}>Пъзел от противоположности</h2>
          <p className={styles.introSub}>
            Вляво виждаш една дума. Вдясно избери нейния антоним — противоположната дума.
          </p>
          <ul className={styles.bullets}>
            <li>Без таймер — мисли спокойно</li>
            <li>{ROUND_SIZE} пъзела на игра</li>
            <li>При верен отговор парчетата се съединяват</li>
          </ul>
          <GameNameGate
            inputId="antonym-puzzle-name"
            buttonLabel="Започни пъзела"
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
          <h2 className={styles.resultOk}>Пъзелите са готови!</h2>
          {participantName ? (
            <p className={styles.resultMsg}>
              Участник: <strong>{participantName}</strong>
            </p>
          ) : null}
          <p className={styles.resultMsg}>
            {buildGamePointsLabel(correctCount, questionResults.length || ROUND_SIZE)}
          </p>
          <GameResultSummary items={questionResults} />
          <div className={styles.actionRow}>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => {
                setPhase("learn");
              }}
            >
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

  if (!pair || !promptWord || !answerWord) return null;

  return (
    <div className={styles.shell}>
      <header className={styles.topBar}>
        <Link href={exitHref} className={styles.backLink}>
          ← Към игрите
        </Link>
        <div className={styles.progress}>
          Пъзел {index + 1} / {deck.length}
        </div>
      </header>

      <p className={styles.prompt}>Намери противоположната дума</p>

      {joined ? (
        <div className={styles.joinedBanner} role="status">
          <div className={styles.joinedPieces}>
            <div className={[styles.piece, styles.pieceLeft, styles.pieceJoined].join(" ")}>
              <span className={styles.pieceIcon} aria-hidden>
                {promptWord.icon}
              </span>
              <span className={styles.pieceWord}>{promptWord.word}</span>
            </div>
            <div className={styles.joinGlow} aria-hidden />
            <div className={[styles.piece, styles.pieceRight, styles.pieceJoined].join(" ")}>
              <span className={styles.pieceIcon} aria-hidden>
                {answerWord.icon}
              </span>
              <span className={styles.pieceWord}>{answerWord.word}</span>
            </div>
          </div>
          <p className={styles.joinedText}>
            {promptWord.word} – {answerWord.word}!
          </p>
          <button type="button" className={styles.primaryBtn} onClick={goNext}>
            {index + 1 >= deck.length ? "Край" : "Напред →"}
          </button>
        </div>
      ) : (
        <div className={styles.board}>
          <div className={styles.leftCol}>
            <p className={styles.colLabel}>Дума</p>
            <div className={[styles.piece, styles.pieceLeft].join(" ")}>
              <span className={styles.pieceIcon} aria-hidden>
                {promptWord.icon}
              </span>
              <span className={styles.pieceWord}>{promptWord.word}</span>
            </div>
          </div>

          <div className={styles.rightCol}>
            <p className={styles.colLabel}>Избери противоположното</p>
            <div className={styles.choices}>
              {choices.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={[
                    styles.piece,
                    styles.pieceRight,
                    styles.choiceBtn,
                    picked === c.id ? styles.choiceWrong : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => onPick(c)}
                >
                  <span className={styles.pieceIcon} aria-hidden>
                    {c.icon}
                  </span>
                  <span className={styles.pieceWord}>{c.word}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {hint ? (
        <p className={styles.hint} role="status">
          {hint}
        </p>
      ) : (
        <p className={styles.hintSpacer} />
      )}
    </div>
  );
}
