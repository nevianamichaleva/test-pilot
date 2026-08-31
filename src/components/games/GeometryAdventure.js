"use client";

import Link from "next/link";
import { useState } from "react";

import GameNameGate from "@/components/games/GameNameGate";
import GameResultSummary from "@/components/games/GameResultSummary";
import {
  ANGLE_BUCKETS,
  ANGLE_ROUNDS,
  angleById,
  angleQuestionNumber,
  bucketLabelAngle,
  bucketLabelShape,
  GEOMETRY_MODES,
  isOnMirrorSide,
  PERIMETER_ROUNDS,
  SHAPE_BUCKETS,
  SHAPE_ROUNDS,
  shapeById,
  shapeQuestionNumber,
  SYMMETRY_ROUNDS,
  targetMirrorCells,
  taskTotalForGeometryMode,
} from "@/data/matematika-geometria-5";
import useSaveGameResultOnEnd from "@/hooks/useSaveGameResultOnEnd";
import { buildGamePointsLabel } from "@/lib/saveGameResult";

import styles from "./GeometryAdventure.module.css";

function shuffleArray(items) {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function cellKey(r, c) {
  return `${r},${c}`;
}

function setsEqual(a, b) {
  if (a.size !== b.size) return false;
  for (const v of a) if (!b.has(v)) return false;
  return true;
}

function ShapeIcon({ sides }) {
  if (sides === 0) {
    return (
      <svg className={styles.shapeIcon} viewBox="0 0 48 48" aria-hidden>
        <circle cx="24" cy="24" r="18" fill="#93c5fd" stroke="#2563eb" strokeWidth="2" />
      </svg>
    );
  }
  if (sides === 3) {
    return (
      <svg className={styles.shapeIcon} viewBox="0 0 48 48" aria-hidden>
        <polygon points="24,6 42,40 6,40" fill="#fcd34d" stroke="#d97706" strokeWidth="2" />
      </svg>
    );
  }
  if (sides === 4) {
    return (
      <svg className={styles.shapeIcon} viewBox="0 0 48 48" aria-hidden>
        <rect x="8" y="10" width="32" height="28" rx="2" fill="#c4b5fd" stroke="#7c3aed" strokeWidth="2" />
      </svg>
    );
  }
  return (
    <svg className={styles.shapeIcon} viewBox="0 0 48 48" aria-hidden>
      <polygon
        points="24,4 42,16 36,42 12,42 6,16"
        fill="#86efac"
        stroke="#059669"
        strokeWidth="2"
      />
    </svg>
  );
}

function AngleIcon({ degrees }) {
  const rad = (degrees * Math.PI) / 180;
  const x2 = 24 + Math.cos(-rad) * 20;
  const y2 = 24 + Math.sin(-rad) * 20;
  return (
    <svg className={styles.angleIcon} viewBox="0 0 48 48" aria-hidden>
      <line x1="24" y1="24" x2="44" y2="24" stroke="#64748b" strokeWidth="3" />
      <line x1="24" y1="24" x2={x2} y2={y2} stroke="#2563eb" strokeWidth="3" />
      <path
        d={`M 34 24 A 10 10 0 0 0 ${24 + 10 * Math.cos(-rad)} ${24 + 10 * Math.sin(-rad)}`}
        fill="none"
        stroke="#f59e0b"
        strokeWidth="2"
      />
    </svg>
  );
}

function PerimeterGrid({ cells, highlight }) {
  const rows = cells.map(([r]) => r);
  const cols = cells.map(([, c]) => c);
  const minR = Math.min(...rows) - 1;
  const maxR = Math.max(...rows) + 1;
  const minC = Math.min(...cols) - 1;
  const maxC = Math.max(...cols) + 1;
  const set = new Set(cells.map(([r, c]) => cellKey(r, c)));
  const cellsOut = [];
  for (let r = minR; r <= maxR; r += 1) {
    for (let c = minC; c <= maxC; c += 1) {
      if (set.has(cellKey(r, c))) cellsOut.push([r, c]);
    }
  }
  const gridRows = maxR - minR + 1;
  const gridColsCount = maxC - minC + 1;

  return (
    <div
      className={styles.perimeterGrid}
      style={{ gridTemplateColumns: `repeat(${gridColsCount}, 1fr)` }}
    >
      {Array.from({ length: gridRows * gridColsCount }, (_, i) => {
        const r = minR + Math.floor(i / gridColsCount);
        const c = minC + (i % gridColsCount);
        const filled = set.has(cellKey(r, c));
        const isEdge =
          filled &&
          [
            [r - 1, c],
            [r + 1, c],
            [r, c - 1],
            [r, c + 1],
          ].some(([nr, nc]) => !set.has(cellKey(nr, nc)));
        return (
          <div
            key={cellKey(r, c)}
            className={[
              styles.perimeterCell,
              filled ? styles.perimeterFilled : "",
              highlight && isEdge ? styles.perimeterEdge : "",
            ]
              .filter(Boolean)
              .join(" ")}
          />
        );
      })}
    </div>
  );
}

/**
 * @param {{ initialMode?: string | null, exitHref?: string, game?: object | null }} props
 */
export default function GeometryAdventure({
  initialMode = null,
  exitHref = "/igri",
  game = null,
}) {
  const lockedMode = Boolean(initialMode);
  const [phase, setPhase] = useState("intro");
  const [participantName, setParticipantName] = useState("");
  const [mode, setMode] = useState(null);
  const [questionResults, setQuestionResults] = useState([]);

  const [shapeRoundIndex, setShapeRoundIndex] = useState(0);
  const [shapePlacements, setShapePlacements] = useState({});
  const [shapeDeck, setShapeDeck] = useState([]);
  const [selectedShape, setSelectedShape] = useState(null);
  const [shapeDragOver, setShapeDragOver] = useState(null);
  const [shapeFeedback, setShapeFeedback] = useState("");
  const [shapeAttempts, setShapeAttempts] = useState({});

  const [angleRoundIndex, setAngleRoundIndex] = useState(0);
  const [anglePlacements, setAnglePlacements] = useState({});
  const [angleDeck, setAngleDeck] = useState([]);
  const [selectedAngle, setSelectedAngle] = useState(null);
  const [angleDragOver, setAngleDragOver] = useState(null);
  const [angleFeedback, setAngleFeedback] = useState("");
  const [angleAttempts, setAngleAttempts] = useState({});

  const [symIndex, setSymIndex] = useState(0);
  const [symSelected, setSymSelected] = useState(new Set());
  const [symHint, setSymHint] = useState(false);
  const [symFeedback, setSymFeedback] = useState("");
  const [symHadHint, setSymHadHint] = useState(false);

  const [perimIndex, setPerimIndex] = useState(0);
  const [perimHint, setPerimHint] = useState(false);
  const [perimFeedback, setPerimFeedback] = useState("");
  const [perimHadHint, setPerimHadHint] = useState(false);

  const finished = phase === "won";
  const activeMode = mode || initialMode;
  const taskTotal = activeMode ? taskTotalForGeometryMode(activeMode) : 0;

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

  const finishMode = () => setPhase("won");

  const startShapes = () => {
    setShapeRoundIndex(0);
    setShapePlacements({});
    setShapeDeck(shuffleArray(SHAPE_ROUNDS[0].cards));
    setSelectedShape(null);
    setShapeFeedback("");
    setShapeAttempts({});
    setMode("shapes");
    setPhase("play");
    setQuestionResults([]);
  };

  const startAngles = () => {
    setAngleRoundIndex(0);
    setAnglePlacements({});
    setAngleDeck(shuffleArray(ANGLE_ROUNDS[0].cards));
    setSelectedAngle(null);
    setAngleFeedback("");
    setAngleAttempts({});
    setMode("angles");
    setPhase("play");
    setQuestionResults([]);
  };

  const startSymmetry = () => {
    setSymIndex(0);
    setSymSelected(new Set());
    setSymHint(false);
    setSymFeedback("");
    setSymHadHint(false);
    setMode("symmetry");
    setPhase("play");
    setQuestionResults([]);
  };

  const startPerimeter = () => {
    setPerimIndex(0);
    setPerimHint(false);
    setPerimFeedback("");
    setPerimHadHint(false);
    setMode("perimeter");
    setPhase("play");
    setQuestionResults([]);
  };

  const startGame = (id) => {
    if (id === "shapes") startShapes();
    else if (id === "angles") startAngles();
    else if (id === "symmetry") startSymmetry();
    else if (id === "perimeter") startPerimeter();
  };

  const enterPlay = (name) => {
    setParticipantName(name);
    if (lockedMode && initialMode) startGame(initialMode);
    else setPhase("menu");
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

  const loadShapeRound = (idx) => {
    const round = SHAPE_ROUNDS[idx];
    if (!round) {
      finishMode();
      return;
    }
    setShapeRoundIndex(idx);
    setShapePlacements({});
    setShapeDeck(shuffleArray(round.cards));
    setSelectedShape(null);
    setShapeFeedback("");
  };

  const tryPlaceShape = (cardId, bucketId) => {
    const card = shapeById(cardId);
    if (!card || shapePlacements[cardId]) return;
    const isFirst = shapeAttempts[cardId] == null;
    const firstBucket = isFirst ? bucketId : shapeAttempts[cardId];
    if (isFirst) setShapeAttempts((p) => ({ ...p, [cardId]: bucketId }));

    if (card.bucket === bucketId) {
      recordResult(
        shapeQuestionNumber(shapeRoundIndex, cardId),
        `Фигура: ${card.label}`,
        bucketLabelShape(firstBucket),
        bucketLabelShape(card.bucket),
        firstBucket === card.bucket
      );
      const next = { ...shapePlacements, [cardId]: bucketId };
      setShapePlacements(next);
      setSelectedShape(null);
      setShapeFeedback("");
      const round = SHAPE_ROUNDS[shapeRoundIndex];
      if (Object.keys(next).length >= round.cards.length) {
        setTimeout(() => loadShapeRound(shapeRoundIndex + 1), 600);
      }
    } else {
      setShapeFeedback(
        `${card.label} има ${card.sides || "без"} страни. Провери коя кутия отговаря.`
      );
    }
  };

  const loadAngleRound = (idx) => {
    const round = ANGLE_ROUNDS[idx];
    if (!round) {
      finishMode();
      return;
    }
    setAngleRoundIndex(idx);
    setAnglePlacements({});
    setAngleDeck(shuffleArray(round.cards));
    setSelectedAngle(null);
    setAngleFeedback("");
  };

  const tryPlaceAngle = (cardId, bucketId) => {
    const card = angleById(cardId);
    if (!card || anglePlacements[cardId]) return;
    const isFirst = angleAttempts[cardId] == null;
    const firstBucket = isFirst ? bucketId : angleAttempts[cardId];
    if (isFirst) setAngleAttempts((p) => ({ ...p, [cardId]: bucketId }));

    if (card.bucket === bucketId) {
      recordResult(
        angleQuestionNumber(angleRoundIndex, cardId),
        `Ъгъл: ${card.label}`,
        bucketLabelAngle(firstBucket),
        bucketLabelAngle(card.bucket),
        firstBucket === card.bucket
      );
      const next = { ...anglePlacements, [cardId]: bucketId };
      setAnglePlacements(next);
      setSelectedAngle(null);
      setAngleFeedback("");
      const round = ANGLE_ROUNDS[angleRoundIndex];
      if (Object.keys(next).length >= round.cards.length) {
        setTimeout(() => loadAngleRound(angleRoundIndex + 1), 600);
      }
    } else {
      const tip =
        card.degrees < 90
          ? "Под 90° — остър ъгъл."
          : card.degrees === 90
            ? "Точно 90° — прав ъгъл."
            : "Над 90° — тъп ъгъл.";
      setAngleFeedback(`${card.label}: ${tip}`);
    }
  };

  const toggleSymCell = (row, col) => {
    const round = SYMMETRY_ROUNDS[symIndex];
    if (!round || !isOnMirrorSide(round, row, col)) return;
    const key = cellKey(row, col);
    setSymSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
    setSymHint(false);
    setSymFeedback("");
  };

  const checkSymmetry = () => {
    const round = SYMMETRY_ROUNDS[symIndex];
    if (!round) return;
    const target = new Set(targetMirrorCells(round).map(([r, c]) => cellKey(r, c)));
    if (setsEqual(symSelected, target)) {
      recordResult(
        symIndex + 1,
        `Симетрия: ${round.id}`,
        `${symSelected.size} клетки`,
        `${target.size} клетки`,
        !symHadHint
      );
      const next = symIndex + 1;
      if (next >= SYMMETRY_ROUNDS.length) {
        finishMode();
        return;
      }
      setSymIndex(next);
      setSymSelected(new Set());
      setSymHint(false);
      setSymFeedback("");
      setSymHadHint(false);
    } else {
      setSymHint(true);
      setSymHadHint(true);
      setSymFeedback(round.hint);
    }
  };

  const pickPerimeter = (value) => {
    const round = PERIMETER_ROUNDS[perimIndex];
    if (!round) return;
    if (value === round.answer) {
      recordResult(
        perimIndex + 1,
        round.prompt,
        String(value),
        String(round.answer),
        !perimHadHint
      );
      const next = perimIndex + 1;
      if (next >= PERIMETER_ROUNDS.length) {
        finishMode();
        return;
      }
      setPerimIndex(next);
      setPerimHint(false);
      setPerimFeedback("");
      setPerimHadHint(false);
    } else {
      setPerimHint(true);
      setPerimHadHint(true);
      setPerimFeedback(round.hint);
    }
  };

  const renderSortGame = ({
    roundIndex,
    rounds,
    deck,
    placements,
    selected,
    setSelected,
    dragOver,
    setDragOver,
    feedback,
    buckets,
    bucketLabels,
    onDrop,
    renderCard,
  }) => {
    const round = rounds[roundIndex];
    if (!round) return null;
    const unplaced = deck.filter((id) => !placements[id]);

    return (
      <>
        <div className={styles.topBar}>
          {backControl}
          <div className={styles.progress}>
            Кръг {roundIndex + 1} / {rounds.length}
          </div>
        </div>
        {feedback ? (
          <p className={styles.feedback} role="status">
            {feedback}
          </p>
        ) : (
          <p className={styles.feedbackSpacer} />
        )}
        <div className={styles.deck}>
          {unplaced.map((id) => (
            <button
              key={id}
              type="button"
              draggable
              className={[styles.card, selected === id ? styles.cardSelected : ""]
                .filter(Boolean)
                .join(" ")}
              onClick={() => setSelected((cur) => (cur === id ? null : id))}
              onDragStart={(e) => {
                e.dataTransfer.setData("text/card-id", id);
                setSelected(id);
              }}
            >
              {renderCard(id)}
            </button>
          ))}
        </div>
        <div className={styles.buckets}>
          {buckets.map((bucket) => {
            const placed = round.cards.filter((cid) => placements[cid] === bucket.id);
            return (
              <div
                key={bucket.id}
                className={[
                  styles.bucket,
                  dragOver === bucket.id ? styles.bucketHover : "",
                  selected ? styles.bucketReady : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(bucket.id);
                }}
                onDragLeave={() => setDragOver(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(null);
                  const id = e.dataTransfer.getData("text/card-id") || selected;
                  if (id) onDrop(id, bucket.id);
                }}
                onClick={() => {
                  if (selected) onDrop(selected, bucket.id);
                }}
                role="button"
                tabIndex={0}
              >
                <span className={styles.bucketLabel}>{bucket.label}</span>
                <div className={styles.bucketCards}>
                  {placed.map((cid) => (
                    <span key={cid} className={styles.placedChip}>
                      {renderCard(cid, true)}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  if (phase === "intro") {
    const modeMeta = lockedMode ? GEOMETRY_MODES.find((m) => m.id === initialMode) : null;
    return (
      <div className={styles.shell}>
        <div className={styles.intro}>
          <p className={styles.badge}>Математика · 5. клас</p>
          <h2 className={styles.introTitle}>{modeMeta?.title ?? "Геометрия"}</h2>
          <p className={styles.introSub}>
            {modeMeta?.description ??
              "Визуални игри: фигури, ъгли, симетрия и обиколка. Без таймер."}
          </p>
          <ul className={styles.bullets}>
            <li>Разпознаване и класификация на фигури</li>
            <li>Остър, прав и тъп ъгъл</li>
            <li>Огледална симетрия и обиколка на решетка</li>
          </ul>
          <GameNameGate inputId="geometry-5-name" onStart={enterPlay} />
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
            {buildGamePointsLabel(correctCount, total)}. Геометрията е наред!
          </p>
          <GameResultSummary items={questionResults} />
          <div className={styles.actionRow}>
            <button type="button" className={styles.primaryBtn} onClick={() => startGame(activeMode)}>
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
          {participantName ? <span className={styles.playerName}>{participantName}</span> : null}
        </div>
        <h2 className={styles.menuTitle}>Геометрия · 5. клас</h2>
        <div className={styles.modeGrid}>
          {GEOMETRY_MODES.map((m) => (
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
      </div>
    );
  }

  if (mode === "shapes") {
    return (
      <div className={styles.shell}>
        <p className={styles.prompt}>Подреди фигурите в правилната кутия</p>
        {renderSortGame({
          roundIndex: shapeRoundIndex,
          rounds: SHAPE_ROUNDS,
          deck: shapeDeck,
          placements: shapePlacements,
          selected: selectedShape,
          setSelected: setSelectedShape,
          dragOver: shapeDragOver,
          setDragOver: setShapeDragOver,
          feedback: shapeFeedback,
          buckets: SHAPE_BUCKETS,
          onDrop: tryPlaceShape,
          renderCard: (id, compact) => {
            const card = shapeById(id);
            if (!card) return id;
            return compact ? (
              card.label
            ) : (
              <>
                <ShapeIcon sides={card.sides} />
                <span>{card.label}</span>
              </>
            );
          },
        })}
      </div>
    );
  }

  if (mode === "angles") {
    return (
      <div className={styles.shell}>
        <p className={styles.prompt}>Подреди ъглите в правилната кутия</p>
        {renderSortGame({
          roundIndex: angleRoundIndex,
          rounds: ANGLE_ROUNDS,
          deck: angleDeck,
          placements: anglePlacements,
          selected: selectedAngle,
          setSelected: setSelectedAngle,
          dragOver: angleDragOver,
          setDragOver: setAngleDragOver,
          feedback: angleFeedback,
          buckets: ANGLE_BUCKETS,
          onDrop: tryPlaceAngle,
          renderCard: (id, compact) => {
            const card = angleById(id);
            if (!card) return id;
            return compact ? (
              card.label
            ) : (
              <>
                <AngleIcon degrees={card.degrees} />
                <span>{card.label}</span>
              </>
            );
          },
        })}
      </div>
    );
  }

  if (mode === "symmetry") {
    const round = SYMMETRY_ROUNDS[symIndex];
    if (!round) return null;
    const hintSet = symHint
      ? new Set(targetMirrorCells(round).map(([r, c]) => cellKey(r, c)))
      : new Set();
    const sourceSet = new Set(round.filled.map(([r, c]) => cellKey(r, c)));

    return (
      <div className={styles.shell}>
        <div className={styles.topBar}>
          {backControl}
          <div className={styles.progress}>
            Задача {symIndex + 1} / {SYMMETRY_ROUNDS.length}
          </div>
        </div>
        <p className={styles.prompt}>Довърши огледалния образ</p>
        <p className={styles.equiv}>
          Оста е {round.axis === "v" ? "вертикална" : "хоризонтална"} (пунктирана линия)
        </p>
        <div
          className={styles.symGrid}
          style={{
            gridTemplateColumns: `repeat(${round.cols}, 1fr)`,
            gridTemplateRows: `repeat(${round.rows}, 1fr)`,
          }}
        >
          {Array.from({ length: round.rows * round.cols }, (_, i) => {
            const row = Math.floor(i / round.cols);
            const col = i % round.cols;
            const key = cellKey(row, col);
            const onAxis =
              round.axis === "v" ? col === round.axisIndex : row === round.axisIndex;
            const isSource = sourceSet.has(key);
            const isUser = symSelected.has(key);
            const isHint = hintSet.has(key);
            const clickable = isOnMirrorSide(round, row, col);
            return (
              <button
                key={key}
                type="button"
                disabled={!clickable && !onAxis}
                className={[
                  styles.symCell,
                  onAxis ? styles.symAxis : "",
                  isSource ? styles.symSource : "",
                  isUser ? styles.symUser : "",
                  isHint ? styles.symHint : "",
                  clickable ? styles.symClickable : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => toggleSymCell(row, col)}
                aria-label={`Клетка ${row + 1}, ${col + 1}`}
              />
            );
          })}
        </div>
        {symFeedback ? (
          <p className={styles.feedback} role="status">
            {symFeedback}
          </p>
        ) : (
          <p className={styles.feedbackSpacer} />
        )}
        <div className={styles.actionRow}>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => {
              setSymSelected(new Set());
              setSymHint(false);
              setSymFeedback("");
            }}
          >
            Изчисти
          </button>
          <button type="button" className={styles.primaryBtn} onClick={checkSymmetry}>
            Провери
          </button>
        </div>
      </div>
    );
  }

  if (mode === "perimeter") {
    const round = PERIMETER_ROUNDS[perimIndex];
    if (!round) return null;
    return (
      <div className={styles.shell}>
        <div className={styles.topBar}>
          {backControl}
          <div className={styles.progress}>
            Задача {perimIndex + 1} / {PERIMETER_ROUNDS.length}
          </div>
        </div>
        <p className={styles.prompt}>{round.prompt}</p>
        <div className={styles.perimeterWrap}>
          <PerimeterGrid cells={round.cells} highlight={perimHint} />
        </div>
        {perimFeedback ? (
          <p className={styles.feedback} role="status">
            {perimFeedback}
          </p>
        ) : (
          <p className={styles.feedbackSpacer} />
        )}
        <div className={styles.optionRow}>
          {round.options.map((opt) => (
            <button
              key={opt}
              type="button"
              className={styles.optionBtn}
              onClick={() => pickPerimeter(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
