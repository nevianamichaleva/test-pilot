"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";

import GameNameGate from "@/components/games/GameNameGate";
import GameResultSummary from "@/components/games/GameResultSummary";
import {
  SYNONYM_CLOUDS,
  SYNONYM_DEFINITION,
  synonymTargetCount,
} from "@/data/bel-synonyms";
import useSaveGameResultOnEnd from "@/hooks/useSaveGameResultOnEnd";
import { buildGamePointsLabel } from "@/lib/saveGameResult";

import styles from "./SynonymDetective.module.css";

function shuffleArray(items) {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Фиксирани позиции в „облака“, за да няма припокриване. */
const LAYOUT = [
  { top: "6%", left: "18%", rot: -12 },
  { top: "8%", left: "48%", rot: 8 },
  { top: "10%", left: "72%", rot: -6 },
  { top: "22%", left: "8%", rot: 14 },
  { top: "24%", left: "34%", rot: -8 },
  { top: "26%", left: "58%", rot: 10 },
  { top: "28%", left: "80%", rot: -14 },
  { top: "40%", left: "14%", rot: 6 },
  { top: "42%", left: "40%", rot: -10 },
  { top: "44%", left: "66%", rot: 12 },
  { top: "52%", left: "4%", rot: -4 },
  { top: "54%", left: "28%", rot: 16 },
  { top: "56%", left: "52%", rot: -12 },
  { top: "58%", left: "76%", rot: 5 },
  { top: "68%", left: "16%", rot: 9 },
  { top: "70%", left: "42%", rot: -7 },
  { top: "72%", left: "68%", rot: 11 },
  { top: "82%", left: "10%", rot: -9 },
  { top: "84%", left: "36%", rot: 7 },
  { top: "86%", left: "62%", rot: -5 },
  { top: "88%", left: "82%", rot: 13 },
  { top: "18%", left: "88%", rot: -16 },
];

/**
 * @param {{ exitHref?: string, game?: object | null }} props
 */
export default function SynonymDetective({ exitHref = "/igri", game = null }) {
  const [phase, setPhase] = useState("learn"); // learn | pick | intro | play | cloudDone | won
  const [participantName, setParticipantName] = useState("");
  const [cloudOrder, setCloudOrder] = useState([]);
  const [cloudIndex, setCloudIndex] = useState(0);
  const [placedWords, setPlacedWords] = useState([]); // shuffled words with layout
  const [found, setFound] = useState([]); // correct words collected
  const [shakeId, setShakeId] = useState(null);
  const [flyingId, setFlyingId] = useState(null);
  const [wrongClicks, setWrongClicks] = useState(0);
  const [questionResults, setQuestionResults] = useState([]);
  const wrongRef = useRef(0);

  const cloud = cloudOrder[cloudIndex]
    ? SYNONYM_CLOUDS.find((c) => c.id === cloudOrder[cloudIndex])
    : null;
  const targetTotal = cloud ? synonymTargetCount(cloud) : 10;
  const finished = phase === "won";

  useSaveGameResultOnEnd(finished && Boolean(game?.slug), () => ({
    game,
    name: participantName,
    questionResults,
    correct: questionResults.filter((q) => q.isCorrect).length,
    total: questionResults.length || targetTotal,
    completed: true,
    won: true,
  }));

  const tableSlots = useMemo(() => {
    const slots = Array.from({ length: targetTotal }, (_, i) => found[i] ?? null);
    return slots;
  }, [found, targetTotal]);

  const prepareCloud = (c) => {
    const shuffled = shuffleArray(c.words);
    return shuffled.map((w, i) => ({
      ...w,
      uid: `${c.id}-${w.word}-${i}`,
      layout: LAYOUT[i % LAYOUT.length],
    }));
  };

  const startWithClouds = (ids) => {
    const order = ids.length ? ids : shuffleArray(SYNONYM_CLOUDS.map((c) => c.id)).slice(0, 3);
    const first = SYNONYM_CLOUDS.find((c) => c.id === order[0]);
    setCloudOrder(order);
    setCloudIndex(0);
    setPlacedWords(first ? prepareCloud(first) : []);
    setFound([]);
    setShakeId(null);
    setFlyingId(null);
    setWrongClicks(0);
    wrongRef.current = 0;
    setQuestionResults([]);
    setPhase("play");
  };

  const recordCloudResult = (collected, wrongs) => {
    if (!cloud) return;
    setQuestionResults((prev) => {
      const n = cloudIndex + 1;
      if (prev.some((item) => item.questionNumber === n)) return prev;
      const ok = wrongs === 0 && collected === targetTotal;
      return [
        ...prev,
        {
          questionNumber: n,
          questionText: `Синоними на „${cloud.target}“`,
          firstAnswer: `${collected}/${targetTotal} · грешки: ${wrongs}`,
          correctAnswer: `${targetTotal} синонима`,
          isCorrect: ok || collected === targetTotal,
          status: collected === targetTotal ? "correct" : "wrong",
        },
      ];
    });
  };

  const onWordClick = (item) => {
    if (phase !== "play" || flyingId) return;
    if (found.includes(item.word)) return;

    if (!item.ok) {
      setShakeId(item.uid);
      wrongRef.current += 1;
      setWrongClicks(wrongRef.current);
      setTimeout(() => setShakeId(null), 500);
      return;
    }

    setFlyingId(item.uid);
    setTimeout(() => {
      setFound((prev) => {
        const next = [...prev, item.word];
        if (next.length >= targetTotal) {
          recordCloudResult(next.length, wrongRef.current);
          setPhase("cloudDone");
        }
        return next;
      });
      setFlyingId(null);
    }, 420);
  };

  const goNextCloud = () => {
    if (cloudIndex + 1 >= cloudOrder.length) {
      setPhase("won");
      return;
    }
    const nextIndex = cloudIndex + 1;
    const next = SYNONYM_CLOUDS.find((c) => c.id === cloudOrder[nextIndex]);
    setCloudIndex(nextIndex);
    setPlacedWords(next ? prepareCloud(next) : []);
    setFound([]);
    setShakeId(null);
    setFlyingId(null);
    setWrongClicks(0);
    wrongRef.current = 0;
    setPhase("play");
  };

  if (phase === "learn") {
    return (
      <div className={styles.shell}>
        <div className={styles.learn}>
          <p className={styles.badge}>Български език</p>
          <h2 className={styles.title}>{SYNONYM_DEFINITION.title}</h2>
          <p className={styles.definition}>{SYNONYM_DEFINITION.text}</p>
          <div className={styles.exampleRow}>
            {SYNONYM_DEFINITION.examples.map((ex) => (
              <div key={`${ex.a}-${ex.b}`} className={styles.examplePair}>
                <span className={styles.exampleWord}>{ex.a}</span>
                <span className={styles.exampleDash}>–</span>
                <span className={styles.exampleWord}>{ex.b}</span>
              </div>
            ))}
          </div>
          <p className={styles.learnHint}>
            После ще търсиш синоними в облак от думи — като детектив.
          </p>
          <button type="button" className={styles.primaryBtn} onClick={() => setPhase("pick")}>
            Разбрах — напред
          </button>
        </div>
      </div>
    );
  }

  if (phase === "pick") {
    return (
      <div className={styles.shell}>
        <div className={styles.intro}>
          <h2 className={styles.title}>Детектив в облака</h2>
          <p className={styles.introSub}>
            Избери дума или започни с 3 случайни облака. Кликни само върху истинските синоними.
          </p>
          <div className={styles.cloudPickGrid}>
            {SYNONYM_CLOUDS.map((c) => (
              <button
                key={c.id}
                type="button"
                className={styles.cloudPickBtn}
                onClick={() => {
                  setPhase("intro");
                  setCloudOrder([c.id]);
                }}
              >
                <span className={styles.cloudPickShape}>{c.shapeLabel}</span>
                <span className={styles.cloudPickTarget}>„{c.target}“</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => {
              setCloudOrder([]);
              setPhase("intro");
            }}
          >
            3 случайни облака
          </button>
        </div>
      </div>
    );
  }

  if (phase === "intro") {
    const selected =
      cloudOrder.length > 0
        ? cloudOrder.map((id) => SYNONYM_CLOUDS.find((c) => c.id === id)?.target).filter(Boolean)
        : ["3 случайни"];
    return (
      <div className={styles.shell}>
        <div className={styles.intro}>
          <h2 className={styles.title}>Готов ли си?</h2>
          <p className={styles.introSub}>
            Облаци: {selected.map((t) => `„${t}“`).join(", ")}
          </p>
          <ul className={styles.bullets}>
            <li>Кликни само върху синонимите</li>
            <li>Верните отиват в таблицата</li>
            <li>Грешните се разклащат — опитай пак</li>
          </ul>
          <GameNameGate
            inputId="synonym-detective-name"
            buttonLabel="Започни"
            onStart={(name) => {
              setParticipantName(name);
              startWithClouds(cloudOrder);
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
          <h2 className={styles.resultOk}>Детективската мисия е готова!</h2>
          {participantName ? (
            <p className={styles.resultMsg}>
              Участник: <strong>{participantName}</strong>
            </p>
          ) : null}
          <p className={styles.resultMsg}>
            {buildGamePointsLabel(correctCount, questionResults.length || 1)}
          </p>
          <GameResultSummary items={questionResults} />
          <div className={styles.actionRow}>
            <button type="button" className={styles.primaryBtn} onClick={() => setPhase("learn")}>
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

  if (!cloud) return null;

  return (
    <div className={styles.shell}>
      <header className={styles.topBar}>
        <Link href={exitHref} className={styles.backLink}>
          ← Към игрите
        </Link>
        <div className={styles.progress}>
          Облак {cloudIndex + 1} / {cloudOrder.length} · {found.length}/{targetTotal}
        </div>
      </header>

      <p className={styles.prompt}>
        Открий 10 синонима на <strong>„{cloud.target}“</strong>
        <span className={styles.shapeHint}> ({cloud.shapeLabel})</span>
      </p>

      {phase === "cloudDone" ? (
        <div className={styles.doneBanner} role="status">
          <p className={styles.doneText}>Браво! Таблицата е пълна.</p>
          <button type="button" className={styles.primaryBtn} onClick={goNextCloud}>
            {cloudIndex + 1 >= cloudOrder.length ? "Край" : "Следващ облак →"}
          </button>
        </div>
      ) : null}

      <div
        className={[styles.cloud, styles[`shape_${cloud.shape}`] || ""].filter(Boolean).join(" ")}
        aria-label={`Облак от думи за ${cloud.target}`}
      >
        {placedWords.map((item) => {
          const collected = found.includes(item.word);
          if (collected) return null;
          const shaking = shakeId === item.uid;
          const flying = flyingId === item.uid;
          return (
            <button
              key={item.uid}
              type="button"
              className={[
                styles.word,
                shaking ? styles.wordWrong : "",
                flying ? styles.wordFly : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{
                top: item.layout.top,
                left: item.layout.left,
                "--rot": `${item.layout.rot}deg`,
                transform: `rotate(${item.layout.rot}deg)`,
              }}
              onClick={() => onWordClick(item)}
              disabled={Boolean(flyingId) || phase === "cloudDone"}
            >
              {item.word}
            </button>
          );
        })}
      </div>

      <div className={styles.tableWrap}>
        <p className={styles.tableTitle}>Синоними на „{cloud.target}“</p>
        <div className={styles.table}>
          {tableSlots.map((slot, i) => (
            <div
              key={`slot-${i}`}
              className={[styles.slot, slot ? styles.slotFilled : ""].filter(Boolean).join(" ")}
            >
              <span className={styles.slotNum}>{i + 1}.</span>
              <span className={styles.slotWord}>{slot || ""}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
