"use client";

import Link from "next/link";
import { useRef, useState } from "react";

import GameNameGate from "@/components/games/GameNameGate";
import GameResultSummary from "@/components/games/GameResultSummary";
import {
  bucketForValue,
  bucketLabel,
  CARD_BUCKETS,
  CARD_ROUNDS,
  cardQuestionNumber,
  FRACTION_MODES,
  LAB_ROUNDS,
  numberLineMatch,
  NUMBERLINE_ROUNDS,
  targetPartCount,
  taskTotalForMode,
  valuesMatch,
} from "@/data/matematika-drob-procenti";
import useSaveGameResultOnEnd from "@/hooks/useSaveGameResultOnEnd";
import { buildGamePointsLabel } from "@/lib/saveGameResult";

import styles from "./FractionAdventure.module.css";

function shuffleArray(items) {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function gridCols(parts) {
  if (parts <= 4) return 2;
  if (parts <= 6) return 3;
  if (parts <= 10) return 5;
  return 4;
}

function CircleSlice({ index, total, filled, onToggle, hint }) {
  const angle = 360 / total;
  const rotation = index * angle - 90;
  const isFilled = filled.includes(index);
  return (
    <button
      type="button"
      className={[
        styles.slice,
        isFilled ? styles.sliceFilled : "",
        hint ? styles.sliceHint : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ transform: `rotate(${rotation}deg) skewY(${90 - angle}deg)` }}
      onClick={() => onToggle(index)}
      aria-label={`Парче ${index + 1} от ${total}`}
    />
  );
}

/**
 * @param {{ initialMode?: string | null, exitHref?: string, game?: object | null }} props
 */
export default function FractionAdventure({
  initialMode = null,
  exitHref = "/igri",
  game = null,
}) {
  const lockedMode = Boolean(initialMode);
  const [phase, setPhase] = useState("intro");
  const [participantName, setParticipantName] = useState("");
  const [mode, setMode] = useState(null);
  const [questionResults, setQuestionResults] = useState([]);

  const [labIndex, setLabIndex] = useState(0);
  const [filledParts, setFilledParts] = useState([]);
  const [labHint, setLabHint] = useState(false);
  const [labFeedback, setLabFeedback] = useState("");
  const [labHadHint, setLabHadHint] = useState(false);

  const [cardRoundIndex, setCardRoundIndex] = useState(0);
  const [cardPlacements, setCardPlacements] = useState({});
  const [cardDeck, setCardDeck] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [dragOverBucket, setDragOverBucket] = useState(null);
  const [cardFeedback, setCardFeedback] = useState("");
  const [cardAttempts, setCardAttempts] = useState({});

  const [nlIndex, setNlIndex] = useState(0);
  const [nlPosition, setNlPosition] = useState(0.5);
  const [nlHintPos, setNlHintPos] = useState(null);
  const [nlFeedback, setNlFeedback] = useState("");
  const [nlHadHint, setNlHadHint] = useState(false);
  const lineRef = useRef(null);

  const finished = phase === "won";
  const activeMode = mode || initialMode;
  const taskTotal = activeMode ? taskTotalForMode(activeMode) : 0;

  useSaveGameResultOnEnd(finished && Boolean(game?.slug), () => ({
    game,
    name: participantName,
    questionResults,
    correct: questionResults.filter((q) => q.isCorrect).length,
    total: questionResults.length || taskTotal,
    completed: true,
    won: true,
  }));

  const recordResult = (questionNumber, questionText, firstAnswer, correctAnswer, isCorrect) => {
    setQuestionResults((prev) => {
      if (prev.some((item) => item.questionNumber === questionNumber)) return prev;
      return [
        ...prev,
        {
          questionNumber,
          questionText,
          firstAnswer,
          correctAnswer,
          isCorrect,
          status: isCorrect ? "correct" : "wrong",
        },
      ];
    });
  };

  const resetToMenu = () => {
    if (lockedMode) return;
    setMode(null);
    setPhase("menu");
    setQuestionResults([]);
  };

  const finishMode = (message) => {
    setPhase("won");
    setMode(activeMode);
  };

  const startLab = () => {
    setLabIndex(0);
    setFilledParts([]);
    setLabHint(false);
    setLabFeedback("");
    setLabHadHint(false);
    setMode("lab");
    setPhase("play");
    setQuestionResults([]);
  };

  const startCards = () => {
    setCardRoundIndex(0);
    setCardPlacements({});
    setCardDeck(shuffleArray(CARD_ROUNDS[0].cards));
    setSelectedCard(null);
    setCardFeedback("");
    setCardAttempts({});
    setMode("cards");
    setPhase("play");
    setQuestionResults([]);
  };

  const startNumberLine = () => {
    setNlIndex(0);
    setNlPosition(0.5);
    setNlHintPos(null);
    setNlFeedback("");
    setNlHadHint(false);
    setMode("numberline");
    setPhase("play");
    setQuestionResults([]);
  };

  const startGame = (id) => {
    if (id === "lab") startLab();
    else if (id === "cards") startCards();
    else if (id === "numberline") startNumberLine();
  };

  const enterPlay = (name) => {
    setParticipantName(name);
    if (lockedMode && initialMode) {
      startGame(initialMode);
    } else {
      setPhase("menu");
    }
  };

  const backControl = lockedMode ? (
    <Link href={exitHref} className={styles.backLink}>
      ← Към игрите
    </Link>
  ) : (
    <button type="button" className={styles.backLink} onClick={resetToMenu}>
      ← Меню
    </button>
  );

  const togglePart = (idx) => {
    setFilledParts((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
    setLabHint(false);
    setLabFeedback("");
  };

  const checkLab = () => {
    const round = LAB_ROUNDS[labIndex];
    if (!round) return;
    const count = filledParts.length;
    const needed = targetPartCount(round.target, round.parts);

    if (valuesMatch(count, round.parts, round.target)) {
      recordResult(
        labIndex + 1,
        round.prompt,
        `${count}/${round.parts} части`,
        `${needed}/${round.parts} части`,
        !labHadHint
      );
      const next = labIndex + 1;
      if (next >= LAB_ROUNDS.length) {
        finishMode("Оцвети всички модели правилно! Браво!");
        return;
      }
      setLabIndex(next);
      setFilledParts([]);
      setLabHint(false);
      setLabFeedback("");
      setLabHadHint(false);
    } else {
      setLabHint(true);
      setLabHadHint(true);
      setLabFeedback(round.hint);
    }
  };

  const loadCardRound = (idx) => {
    const round = CARD_ROUNDS[idx];
    if (!round) {
      finishMode("Подреди всички карти в правилните кутии!");
      return;
    }
    setCardRoundIndex(idx);
    setCardPlacements({});
    setCardDeck(shuffleArray(round.cards));
    setSelectedCard(null);
    setCardFeedback("");
  };

  const tryPlaceCard = (cardId, bucketId) => {
    const card = CARD_ROUNDS[cardRoundIndex]?.cards.find((c) => c.id === cardId);
    if (!card || cardPlacements[cardId]) return;

    const correctBucket = bucketForValue(card.value);
    const isFirstAttempt = cardAttempts[cardId] == null;
    const firstBucket = isFirstAttempt ? bucketId : cardAttempts[cardId];

    if (isFirstAttempt) {
      setCardAttempts((prev) => ({ ...prev, [cardId]: bucketId }));
    }

    if (correctBucket === bucketId) {
      recordResult(
        cardQuestionNumber(cardRoundIndex, cardId),
        `Подреди: ${card.label}`,
        bucketLabel(firstBucket),
        bucketLabel(correctBucket),
        firstBucket === correctBucket
      );
      const next = { ...cardPlacements, [cardId]: bucketId };
      setCardPlacements(next);
      setSelectedCard(null);
      setCardFeedback("");

      const round = CARD_ROUNDS[cardRoundIndex];
      if (Object.keys(next).length >= round.cards.length) {
        setTimeout(() => loadCardRound(cardRoundIndex + 1), 600);
      }
    } else {
      const pct = Math.round(card.value * 100);
      setCardFeedback(
        `${card.label} = ${pct}%. ${pct < 50 ? "Това е по-малко от 50%." : pct === 50 ? "Това е точно 50%." : "Това е повече от 50%."}`
      );
    }
  };

  const onCardDragStart = (e, cardId) => {
    e.dataTransfer.setData("text/card-id", cardId);
    setSelectedCard(cardId);
  };

  const onBucketDrop = (e, bucketId) => {
    e.preventDefault();
    setDragOverBucket(null);
    const cardId = e.dataTransfer.getData("text/card-id") || selectedCard;
    if (cardId) tryPlaceCard(cardId, bucketId);
  };

  const positionFromEvent = (clientX) => {
    const line = lineRef.current;
    if (!line) return 0.5;
    const rect = line.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    return x / rect.width;
  };

  const checkNumberLine = () => {
    const round = NUMBERLINE_ROUNDS[nlIndex];
    if (!round) return;
    const pct = Math.round(nlPosition * 100);
    const targetPct = Math.round(round.target * 100);

    if (numberLineMatch(nlPosition, round.target)) {
      recordResult(
        nlIndex + 1,
        round.prompt,
        `${pct}%`,
        `${targetPct}%`,
        !nlHadHint
      );
      const next = nlIndex + 1;
      if (next >= NUMBERLINE_ROUNDS.length) {
        finishMode("Постави флага на всички места! Отлично!");
        return;
      }
      setNlIndex(next);
      setNlPosition(0.5);
      setNlHintPos(null);
      setNlFeedback("");
      setNlHadHint(false);
    } else {
      setNlHintPos(round.target);
      setNlHadHint(true);
      setNlFeedback(round.hint);
    }
  };

  if (phase === "intro") {
    const modeMeta = lockedMode
      ? FRACTION_MODES.find((m) => m.id === initialMode)
      : null;
    return (
      <div className={styles.shell}>
        <div className={styles.intro}>
          <p className={styles.badge}>Математика · 5.–6. клас</p>
          <h2 className={styles.introTitle}>
            {modeMeta?.title ?? "Дроби и проценти"}
          </h2>
          <p className={styles.introSub}>
            {modeMeta?.description ??
              "Три спокойни игри без таймер — визуални подсказки вместо стряскащи сигнали."}
          </p>
          <ul className={styles.bullets}>
            <li>Без времево ограничение — мисли спокойно</li>
            <li>Дроб ↔ процент ↔ десетична дроб на един поглед</li>
            <li>При грешка: подсказка, не наказание</li>
          </ul>
          <GameNameGate
            inputId="fraction-adventure-name"
            buttonLabel="Започни играта"
            onStart={enterPlay}
          />
        </div>
      </div>
    );
  }

  if (phase === "won") {
    const correctCount = questionResults.filter((q) => q.isCorrect).length;
    const total = questionResults.length || taskTotal;
    return (
      <div className={styles.shell}>
        <div className={styles.result}>
          <h2 className={styles.resultOk}>Поздравления!</h2>
          {participantName ? (
            <p className={styles.resultMsg}>
              Участник: <strong>{participantName}</strong>
            </p>
          ) : null}
          <p className={styles.resultMsg}>
            {buildGamePointsLabel(correctCount, total)}. Дроби, проценти и числова ос — браво!
          </p>
          <GameResultSummary items={questionResults} />
          <div className={styles.actionRow}>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => startGame(activeMode)}
            >
              Играй отново
            </button>
            {lockedMode ? (
              <Link href={exitHref} className={styles.menuBtn}>
                Към игрите
              </Link>
            ) : (
              <button type="button" className={styles.menuBtn} onClick={resetToMenu}>
                Към главното меню
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (phase === "menu" && !lockedMode) {
    return (
      <div className={styles.shell}>
        <div className={styles.topBar}>
          <Link href={exitHref} className={styles.backLink}>
            ← Към игрите
          </Link>
          {participantName ? (
            <span className={styles.playerName}>{participantName}</span>
          ) : null}
        </div>
        <h2 className={styles.menuTitle}>Дроби и проценти</h2>
        <div className={styles.modeGrid}>
          {FRACTION_MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              className={styles.modeCard}
              style={{ "--mode-tone": m.tone }}
              onClick={() => startGame(m.id)}
            >
              <span className={styles.modeTitle}>{m.title}</span>
              <span className={styles.modeDesc}>{m.description}</span>
            </button>
          ))}
        </div>
        <p className={styles.footnote}>Без таймер · спокойно темпо · визуални подсказки</p>
      </div>
    );
  }

  if (mode === "lab") {
    const round = LAB_ROUNDS[labIndex];
    if (!round) return null;
    const hintCount = labHint ? targetPartCount(round.target, round.parts) : 0;
    const hintIndices = labHint
      ? Array.from({ length: hintCount }, (_, i) => i)
      : [];

    return (
      <div className={styles.shell}>
        <div className={styles.topBar}>
          {backControl}
          <div className={styles.progress}>
            Задача {labIndex + 1} / {LAB_ROUNDS.length}
          </div>
        </div>

        <p className={styles.prompt}>{round.prompt}</p>
        {round.equivalents.length > 0 ? (
          <p className={styles.equiv}>
            Същото като: {round.equivalents.join(" = ")}
          </p>
        ) : null}

        <div
          className={[
            styles.modelWrap,
            round.theme === "pizza" ? styles.modelPizza : styles.modelChocolate,
          ].join(" ")}
        >
          {round.shape === "rect" ? (
            <div
              className={styles.rectGrid}
              style={{
                gridTemplateColumns: `repeat(${gridCols(round.parts)}, 1fr)`,
              }}
            >
              {Array.from({ length: round.parts }, (_, i) => {
                const isFilled = filledParts.includes(i);
                const isHint = hintIndices.includes(i);
                return (
                  <button
                    key={i}
                    type="button"
                    className={[
                      styles.rectPart,
                      isFilled ? styles.partFilled : "",
                      isHint ? styles.partHint : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => togglePart(i)}
                    aria-label={`Част ${i + 1} от ${round.parts}`}
                  />
                );
              })}
            </div>
          ) : (
            <div className={styles.circleWrap}>
              <div className={styles.circleInner}>
                {Array.from({ length: round.parts }, (_, i) => (
                  <CircleSlice
                    key={i}
                    index={i}
                    total={round.parts}
                    filled={filledParts}
                    hint={hintIndices.includes(i)}
                    onToggle={togglePart}
                  />
                ))}
              </div>
              {round.theme === "pizza" ? (
                <div className={styles.pizzaCenter} aria-hidden />
              ) : null}
            </div>
          )}
        </div>

        <p className={styles.counter}>
          Оцветени: {filledParts.length} / {round.parts}
        </p>

        {labFeedback ? (
          <p className={styles.feedback} role="status">
            {labFeedback}
          </p>
        ) : (
          <p className={styles.feedbackSpacer} />
        )}

        <div className={styles.actionRow}>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => {
              setFilledParts([]);
              setLabHint(false);
              setLabFeedback("");
            }}
          >
            Изчисти
          </button>
          <button type="button" className={styles.primaryBtn} onClick={checkLab}>
            Провери
          </button>
        </div>
      </div>
    );
  }

  if (mode === "cards") {
    const round = CARD_ROUNDS[cardRoundIndex];
    if (!round) return null;
    const unplaced = cardDeck.filter((c) => !cardPlacements[c.id]);

    return (
      <div className={styles.shell}>
        <div className={styles.topBar}>
          {backControl}
          <div className={styles.progress}>
            Кръг {cardRoundIndex + 1} / {CARD_ROUNDS.length}
          </div>
        </div>

        <p className={styles.prompt}>Подреди всяка карта в правилната кутия</p>

        {cardFeedback ? (
          <p className={styles.feedback} role="status">
            {cardFeedback}
          </p>
        ) : (
          <p className={styles.feedbackSpacer} />
        )}

        <div className={styles.deck} aria-label="Карти за подреждане">
          {unplaced.map((card) => (
            <button
              key={card.id}
              type="button"
              draggable
              className={[
                styles.card,
                selectedCard === card.id ? styles.cardSelected : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() =>
                setSelectedCard((cur) => (cur === card.id ? null : card.id))
              }
              onDragStart={(e) => onCardDragStart(e, card.id)}
            >
              {card.label}
            </button>
          ))}
          {unplaced.length === 0 ? (
            <span className={styles.deckEmpty}>Всички карти са подредени!</span>
          ) : null}
        </div>

        <div className={styles.buckets}>
          {CARD_BUCKETS.map((bucket) => {
            const placedHere = round.cards.filter(
              (c) => cardPlacements[c.id] === bucket.id
            );
            return (
              <div
                key={bucket.id}
                className={[
                  styles.bucket,
                  dragOverBucket === bucket.id ? styles.bucketHover : "",
                  selectedCard ? styles.bucketReady : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverBucket(bucket.id);
                }}
                onDragLeave={() => setDragOverBucket(null)}
                onDrop={(e) => onBucketDrop(e, bucket.id)}
                onClick={() => {
                  if (selectedCard) tryPlaceCard(selectedCard, bucket.id);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === " ") && selectedCard) {
                    e.preventDefault();
                    tryPlaceCard(selectedCard, bucket.id);
                  }
                }}
              >
                <span className={styles.bucketLabel}>{bucket.label}</span>
                <div className={styles.bucketCards}>
                  {placedHere.map((c) => (
                    <span key={c.id} className={styles.placedCard}>
                      {c.label}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <p className={styles.touchHint}>
          {selectedCard
            ? "Докосни кутията, където искаш да пуснеш картата"
            : "Завлечи картата или я докосни, после избери кутия"}
        </p>
      </div>
    );
  }

  if (mode === "numberline") {
    const round = NUMBERLINE_ROUNDS[nlIndex];
    if (!round) return null;
    const pct = Math.round(nlPosition * 100);

    return (
      <div className={styles.shell}>
        <div className={styles.topBar}>
          {backControl}
          <div className={styles.progress}>
            Задача {nlIndex + 1} / {NUMBERLINE_ROUNDS.length}
          </div>
        </div>

        <p className={styles.prompt}>{round.prompt}</p>
        {round.equivalents.length > 0 ? (
          <p className={styles.equiv}>
            Същото като: {round.equivalents.join(" = ")}
          </p>
        ) : null}

        <div className={styles.lineArea}>
          <div className={styles.lineLabels}>
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
          <div
            ref={lineRef}
            className={styles.lineTrack}
            onClick={(e) => {
              setNlPosition(positionFromEvent(e.clientX));
              setNlHintPos(null);
              setNlFeedback("");
            }}
            onKeyDown={() => {}}
            role="slider"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            aria-label="Числова ос от 0 до 100 процента"
            tabIndex={0}
          >
            {nlHintPos != null ? (
              <div
                className={styles.hintMarker}
                style={{ left: `${nlHintPos * 100}%` }}
                aria-hidden
              />
            ) : null}
            <div
              className={styles.flag}
              style={{ left: `${nlPosition * 100}%` }}
              onMouseDown={(e) => {
                e.preventDefault();
                const move = (ev) => {
                  setNlPosition(positionFromEvent(ev.clientX));
                  setNlHintPos(null);
                  setNlFeedback("");
                };
                const up = () => {
                  window.removeEventListener("mousemove", move);
                  window.removeEventListener("mouseup", up);
                };
                window.addEventListener("mousemove", move);
                window.addEventListener("mouseup", up);
              }}
              onTouchStart={(e) => {
                const touch = e.touches[0];
                const move = (ev) => {
                  const t = ev.touches[0];
                  if (t) {
                    setNlPosition(positionFromEvent(t.clientX));
                    setNlHintPos(null);
                    setNlFeedback("");
                  }
                };
                const end = () => {
                  window.removeEventListener("touchmove", move);
                  window.removeEventListener("touchend", end);
                };
                window.addEventListener("touchmove", move);
                window.addEventListener("touchend", end);
                setNlPosition(positionFromEvent(touch.clientX));
              }}
              role="presentation"
            >
              <span className={styles.flagPole} />
              <span className={styles.flagCloth} />
            </div>
          </div>
          <p className={styles.lineValue}>Твоето място: {pct}%</p>
        </div>

        {nlFeedback ? (
          <p className={styles.feedback} role="status">
            {nlFeedback}
          </p>
        ) : (
          <p className={styles.feedbackSpacer} />
        )}

        <div className={styles.actionRow}>
          <button type="button" className={styles.primaryBtn} onClick={checkNumberLine}>
            Провери
          </button>
        </div>
      </div>
    );
  }

  return null;
}
