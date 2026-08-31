"use client";

import Link from "next/link";
import { useState } from "react";

import GameNameGate from "@/components/games/GameNameGate";
import GameResultSummary from "@/components/games/GameResultSummary";
import {
  AREA_ROUNDS,
  bucketLabelDetector,
  DETECTOR_BUCKETS,
  DETECTOR_ROUNDS,
  detectorById,
  detectorQuestionNumber,
  GEOMETRY6_MODES,
  NET_BODIES,
  NET_ROUNDS,
  taskTotalForGeometry6Mode,
} from "@/data/matematika-geometria-6";
import useSaveGameResultOnEnd from "@/hooks/useSaveGameResultOnEnd";
import { buildGamePointsLabel } from "@/lib/saveGameResult";

import styles from "./Geometry6Adventure.module.css";

function shuffleArray(items) {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function NetSvg({ id }) {
  const s = styles.netSvg;
  if (id === "cube-cross") {
    const u = 28;
    const squares = [
      [1, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [1, 2],
      [1, 3],
    ];
    return (
      <svg className={s} viewBox="0 0 84 112" aria-hidden>
        {squares.map(([cx, cy], i) => (
          <rect
            key={i}
            x={cx * u + 2}
            y={cy * u + 2}
            width={u - 4}
            height={u - 4}
            fill={cx === 1 && cy === 1 ? "#ddd6fe" : "#c4b5fd"}
            stroke="#7c3aed"
            strokeWidth="2"
          />
        ))}
      </svg>
    );
  }
  if (id === "cube-l" || id === "cube-z" || id === "cube-t") {
    return (
      <svg className={s} viewBox="0 0 120 80" aria-hidden>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect
            key={i}
            x={(i % 3) * 38 + 4}
            y={Math.floor(i / 3) * 38 + 4}
            width="34"
            height="34"
            fill="#e2e8f0"
            stroke="#94a3b8"
            strokeWidth="2"
          />
        ))}
      </svg>
    );
  }
  if (id === "prism-box") {
    return (
      <svg className={s} viewBox="0 0 160 80" aria-hidden>
        <rect x="0" y="20" width="30" height="40" fill="#93c5fd" stroke="#2563eb" strokeWidth="2" />
        <rect x="30" y="20" width="50" height="40" fill="#bfdbfe" stroke="#2563eb" strokeWidth="2" />
        <rect x="80" y="20" width="30" height="40" fill="#93c5fd" stroke="#2563eb" strokeWidth="2" />
        <rect x="110" y="20" width="50" height="40" fill="#bfdbfe" stroke="#2563eb" strokeWidth="2" />
      </svg>
    );
  }
  if (id === "cylinder-roll") {
    return (
      <svg className={s} viewBox="0 0 140 70" aria-hidden>
        <circle cx="25" cy="35" r="22" fill="#86efac" stroke="#059669" strokeWidth="2" />
        <rect x="47" y="13" width="70" height="44" fill="#bbf7d0" stroke="#059669" strokeWidth="2" />
        <circle cx="117" cy="35" r="22" fill="#86efac" stroke="#059669" strokeWidth="2" />
      </svg>
    );
  }
  return (
    <svg className={s} viewBox="0 0 100 60" aria-hidden>
      <rect x="10" y="10" width="80" height="40" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="6 4" />
    </svg>
  );
}

function BodyPreview({ body }) {
  const meta = NET_BODIES[body];
  return (
    <div className={styles.bodyPreview}>
      <span className={styles.bodyEmoji} aria-hidden>
        {meta?.emoji ?? "📐"}
      </span>
      <span className={styles.bodyLabel}>{meta?.label ?? body}</span>
    </div>
  );
}

function DetectorIcon({ type }) {
  const s = styles.detectorIcon;
  if (type === "obtuse") {
    return (
      <svg className={s} viewBox="0 0 60 50" aria-hidden>
        <polygon points="8,45 52,45 12,8" fill="#fde68a" stroke="#d97706" strokeWidth="2" />
      </svg>
    );
  }
  if (type === "equilateral") {
    return (
      <svg className={s} viewBox="0 0 60 50" aria-hidden>
        <polygon points="30,6 54,44 6,44" fill="#fcd34d" stroke="#d97706" strokeWidth="2" />
      </svg>
    );
  }
  if (type === "square") {
    return (
      <svg className={s} viewBox="0 0 60 50" aria-hidden>
        <rect x="12" y="8" width="36" height="36" fill="#c4b5fd" stroke="#7c3aed" strokeWidth="2" />
      </svg>
    );
  }
  if (type === "parallelogram" || type === "rhombus") {
    return (
      <svg className={s} viewBox="0 0 60 50" aria-hidden>
        <polygon points="14,42 48,42 54,10 20,10" fill="#93c5fd" stroke="#2563eb" strokeWidth="2" />
      </svg>
    );
  }
  if (type === "trapezoid") {
    return (
      <svg className={s} viewBox="0 0 60 50" aria-hidden>
        <polygon points="16,42 44,42 50,12 10,12" fill="#a5f3fc" stroke="#0891b2" strokeWidth="2" />
      </svg>
    );
  }
  if (type === "rectangle") {
    return (
      <svg className={s} viewBox="0 0 60 50" aria-hidden>
        <rect x="8" y="14" width="44" height="28" fill="#bbf7d0" stroke="#059669" strokeWidth="2" />
      </svg>
    );
  }
  return (
    <svg className={s} viewBox="0 0 60 50" aria-hidden>
      <polygon points="30,8 52,42 8,42" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
    </svg>
  );
}

function GridBg({ children, className = "" }) {
  return <div className={`${styles.gridBg} ${className}`}>{children}</div>;
}

function AreaPuzzle({ round, onSuccess, hadHint, setHadHint, feedback, setFeedback }) {
  const [step, setStep] = useState(0);

  if (round.kind === "parallelogram") {
    const { base, height } = round;
    const area = base * height;
    const moved = step >= 1;

    return (
      <GridBg className={styles.areaWrap}>
        <svg className={styles.areaSvg} viewBox={`0 0 ${base + 4} ${height + 2}`} aria-hidden>
          {Array.from({ length: height }, (_, r) =>
            Array.from({ length: base }, (_, c) => {
              const x = c + (moved ? 0 : Math.floor((height - r - 1) / 2));
              if (x < 0 || x >= base) return null;
              return (
                <rect
                  key={`${r}-${c}`}
                  x={x + 1}
                  y={r + 1}
                  width="0.92"
                  height="0.92"
                  fill="#bbf7d0"
                  stroke="#059669"
                  strokeWidth="0.04"
                />
              );
            })
          )}
          {!moved ? (
            <polygon
              points={`1,1 ${1 + Math.floor(height / 2)},1 1,${height + 1}`}
              fill="#fde68a"
              stroke="#d97706"
              strokeWidth="0.06"
              opacity="0.85"
            />
          ) : null}
          <line x1="1" y1={height + 1} x2={base + 1} y2={height + 1} stroke="#2563eb" strokeWidth="0.12" />
          <line
            x1="1"
            y1="1"
            x2="1"
            y2={height + 1}
            stroke="#dc2626"
            strokeWidth="0.12"
            strokeDasharray="0.2 0.15"
          />
          <text x={base / 2 + 1} y={height + 1.6} textAnchor="middle" fontSize="0.45" fill="#2563eb" fontWeight="700">
            a
          </text>
          <text x="0.35" y={height / 2 + 1} textAnchor="middle" fontSize="0.45" fill="#dc2626" fontWeight="700">
            h
          </text>
        </svg>
        {moved ? (
          <p className={styles.formula}>
            S = <span className={styles.colorA}>a</span> · <span className={styles.colorH}>h</span> = {base} ·{" "}
            {height} = <strong>{area} кв. ед.</strong>
          </p>
        ) : (
          <p className={styles.areaHint}>Жълтият △ чака да бъде преместен отдясно</p>
        )}
        <div className={styles.actionRow}>
          {step < 1 ? (
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => {
                setStep(1);
                setFeedback("");
              }}
            >
              Премести △
            </button>
          ) : (
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => onSuccess(!hadHint)}
            >
              Разбрах! Напред
            </button>
          )}
        </div>
        {feedback ? (
          <p className={styles.feedback} role="status">
            {feedback}
          </p>
        ) : null}
      </GridBg>
    );
  }

  const { baseA, baseB, height } = round;
  const mid = (baseA + baseB) / 2;
  const area = mid * height;

  return (
    <GridBg className={styles.areaWrap}>
      <svg className={styles.areaSvg} viewBox="0 0 12 6" aria-hidden>
        <polygon points="2,5 10,5 9,2 3,2" fill="#a5f3fc" stroke="#0891b2" strokeWidth="0.08" />
        <line x1="3" y1="2" x2="3" y2="5" stroke="#dc2626" strokeWidth="0.08" strokeDasharray="0.15" />
        <line x1="2" y1="5" x2="10" y2="5" stroke="#2563eb" strokeWidth="0.08" />
        <text x="6" y="5.7" textAnchor="middle" fontSize="0.35" fill="#2563eb">
          a, b
        </text>
        <text x="2.4" y="3.5" fontSize="0.35" fill="#dc2626">
          h
        </text>
      </svg>
      <p className={styles.formula}>
        S = (<span className={styles.colorA}>a + b</span>) / 2 · <span className={styles.colorH}>h</span> = ({baseA}{" "}
        + {baseB}) / 2 · {height} = <strong>{area} кв. ед.</strong>
      </p>
      <div className={styles.actionRow}>
        <button type="button" className={styles.primaryBtn} onClick={() => onSuccess(!hadHint)}>
          Разбрах! Напред
        </button>
      </div>
    </GridBg>
  );
}

/**
 * @param {{ initialMode?: string | null, exitHref?: string, game?: object | null }} props
 */
export default function Geometry6Adventure({
  initialMode = null,
  exitHref = "/igri",
  game = null,
}) {
  const lockedMode = Boolean(initialMode);
  const [phase, setPhase] = useState("intro");
  const [participantName, setParticipantName] = useState("");
  const [mode, setMode] = useState(null);
  const [questionResults, setQuestionResults] = useState([]);

  const [netIndex, setNetIndex] = useState(0);
  const [netHint, setNetHint] = useState(false);
  const [netFeedback, setNetFeedback] = useState("");
  const [netHadHint, setNetHadHint] = useState(false);

  const [areaIndex, setAreaIndex] = useState(0);
  const [areaFeedback, setAreaFeedback] = useState("");
  const [areaHadHint, setAreaHadHint] = useState(false);

  const [detRoundIndex, setDetRoundIndex] = useState(0);
  const [detPlacements, setDetPlacements] = useState({});
  const [detDeck, setDetDeck] = useState([]);
  const [selectedDet, setSelectedDet] = useState(null);
  const [detDragOver, setDetDragOver] = useState(null);
  const [detFeedback, setDetFeedback] = useState("");
  const [detAttempts, setDetAttempts] = useState({});

  const finished = phase === "won";
  const activeMode = mode || initialMode;
  const taskTotal = activeMode ? taskTotalForGeometry6Mode(activeMode) : 0;

  useSaveGameResultOnEnd(finished && Boolean(game?.slug), () => ({
    game,
    name: participantName,
    questionResults,
    correct: questionResults.filter((q) => q.isCorrect).length,
    total: questionResults.length || taskTotal,
    completed: true,
    won: true,
  }));

  const recordResult = (n, text, first, correct, ok) => {
    setQuestionResults((prev) => {
      if (prev.some((item) => item.questionNumber === n)) return prev;
      return [
        ...prev,
        {
          questionNumber: n,
          questionText: text,
          firstAnswer: first,
          correctAnswer: correct,
          isCorrect: ok,
          status: ok ? "correct" : "wrong",
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

  const startNets = () => {
    setNetIndex(0);
    setNetHint(false);
    setNetFeedback("");
    setNetHadHint(false);
    setMode("nets");
    setPhase("play");
    setQuestionResults([]);
  };

  const startArea = () => {
    setAreaIndex(0);
    setAreaFeedback("");
    setAreaHadHint(false);
    setMode("area");
    setPhase("play");
    setQuestionResults([]);
  };

  const startDetector = () => {
    setDetRoundIndex(0);
    setDetPlacements({});
    setDetDeck(shuffleArray(DETECTOR_ROUNDS[0].cards));
    setSelectedDet(null);
    setDetFeedback("");
    setDetAttempts({});
    setMode("detector");
    setPhase("play");
    setQuestionResults([]);
  };

  const startGame = (id) => {
    if (id === "nets") startNets();
    else if (id === "area") startArea();
    else if (id === "detector") startDetector();
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

  const pickNet = (netId) => {
    const round = NET_ROUNDS[netIndex];
    if (!round) return;
    const ok = netId === round.correct;
    if (ok) {
      recordResult(
        netIndex + 1,
        `Мрежа за ${NET_BODIES[round.body]?.label}`,
        netId,
        round.correct,
        !netHadHint
      );
      const next = netIndex + 1;
      if (next >= NET_ROUNDS.length) setPhase("won");
      else {
        setNetIndex(next);
        setNetHint(false);
        setNetFeedback("");
        setNetHadHint(false);
      }
    } else {
      setNetHint(true);
      setNetHadHint(true);
      setNetFeedback(round.hint);
    }
  };

  const areaSuccess = (firstTry) => {
    const round = AREA_ROUNDS[areaIndex];
    recordResult(areaIndex + 1, round.prompt, "преместен △", round.prompt, firstTry);
    const next = areaIndex + 1;
    if (next >= AREA_ROUNDS.length) setPhase("won");
    else {
      setAreaIndex(next);
      setAreaFeedback("");
      setAreaHadHint(false);
    }
  };

  const loadDetRound = (idx) => {
    const round = DETECTOR_ROUNDS[idx];
    if (!round) {
      setPhase("won");
      return;
    }
    setDetRoundIndex(idx);
    setDetPlacements({});
    setDetDeck(shuffleArray(round.cards));
    setSelectedDet(null);
    setDetFeedback("");
  };

  const tryPlaceDet = (cardId, bucketId) => {
    const card = detectorById(cardId);
    if (!card || detPlacements[cardId]) return;
    const isFirst = detAttempts[cardId] == null;
    const firstBucket = isFirst ? bucketId : detAttempts[cardId];
    if (isFirst) setDetAttempts((p) => ({ ...p, [cardId]: bucketId }));

    if (card.bucket === bucketId) {
      recordResult(
        detectorQuestionNumber(detRoundIndex, cardId),
        card.label,
        bucketLabelDetector(firstBucket),
        bucketLabelDetector(card.bucket),
        firstBucket === card.bucket
      );
      const next = { ...detPlacements, [cardId]: bucketId };
      setDetPlacements(next);
      setSelectedDet(null);
      setDetFeedback("");
      const round = DETECTOR_ROUNDS[detRoundIndex];
      if (Object.keys(next).length >= round.cards.length) {
        setTimeout(() => loadDetRound(detRoundIndex + 1), 600);
      }
    } else {
      setDetFeedback(`Провери свойствата на „${card.label}“ и опитай друга кутия.`);
    }
  };

  if (phase === "intro") {
    const modeMeta = lockedMode ? GEOMETRY6_MODES.find((m) => m.id === initialMode) : null;
    return (
      <div className={styles.shell}>
        <div className={styles.intro}>
          <p className={styles.badge}>Математика · 6. клас</p>
          <h2 className={styles.introTitle}>{modeMeta?.title ?? "Геометрия 6. клас"}</h2>
          <p className={styles.introSub}>
            {modeMeta?.description ??
              "Мрежи, лице и класификация — a е синьо, h е червено, всичко върху мрежа."}
          </p>
          <GameNameGate inputId="geometry-6-name" onStart={enterPlay} />
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
          <p className={styles.resultMsg}>{buildGamePointsLabel(correctCount, total)}</p>
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
                Към меню
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
        </div>
        <h2 className={styles.menuTitle}>Геометрия · 6. клас</h2>
        <div className={styles.modeGrid}>
          {GEOMETRY6_MODES.map((m) => (
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
        <p className={styles.legend}>
          <span className={styles.colorA}>a</span> страна · <span className={styles.colorH}>h</span> височина
        </p>
      </div>
    );
  }

  if (mode === "nets") {
    const round = NET_ROUNDS[netIndex];
    if (!round) return null;
    return (
      <div className={styles.shell}>
        <div className={styles.topBar}>
          {backControl}
          <div className={styles.progress}>
            Задача {netIndex + 1} / {NET_ROUNDS.length}
          </div>
        </div>
        <p className={styles.prompt}>Коя мрежа съответства на тялото?</p>
        <BodyPreview body={round.body} />
        {netFeedback ? (
          <p className={styles.feedback} role="status">
            {netFeedback}
          </p>
        ) : (
          <p className={styles.feedbackSpacer} />
        )}
        <div className={styles.netGrid}>
          {round.options.map((opt) => (
            <button
              key={opt}
              type="button"
              className={[
                styles.netOption,
                netHint && opt === round.correct ? styles.netHint : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => pickNet(opt)}
            >
              <NetSvg id={opt} />
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (mode === "area") {
    const round = AREA_ROUNDS[areaIndex];
    if (!round) return null;
    return (
      <div className={styles.shell}>
        <div className={styles.topBar}>
          {backControl}
          <div className={styles.progress}>
            Задача {areaIndex + 1} / {AREA_ROUNDS.length}
          </div>
        </div>
        <p className={styles.prompt}>{round.prompt}</p>
        <AreaPuzzle
          key={round.id}
          round={round}
          onSuccess={areaSuccess}
          hadHint={areaHadHint}
          setHadHint={setAreaHadHint}
          feedback={areaFeedback}
          setFeedback={setAreaFeedback}
        />
      </div>
    );
  }

  if (mode === "detector") {
    const round = DETECTOR_ROUNDS[detRoundIndex];
    if (!round) return null;
    const unplaced = detDeck.filter((id) => !detPlacements[id]);
    return (
      <div className={styles.shell}>
        <div className={styles.topBar}>
          {backControl}
          <div className={styles.progress}>
            Кръг {detRoundIndex + 1} / {DETECTOR_ROUNDS.length}
          </div>
        </div>
        <p className={styles.prompt}>Геометричен детектор — подреди фигурите</p>
        {detFeedback ? (
          <p className={styles.feedback} role="status">
            {detFeedback}
          </p>
        ) : (
          <p className={styles.feedbackSpacer} />
        )}
        <div className={styles.deck}>
          {unplaced.map((id) => {
            const fig = detectorById(id);
            return (
              <button
                key={id}
                type="button"
                draggable
                className={[styles.card, selectedDet === id ? styles.cardSelected : ""]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => setSelectedDet((c) => (c === id ? null : id))}
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/id", id);
                  setSelectedDet(id);
                }}
              >
                <DetectorIcon type={fig?.icon} />
                <span>{fig?.label}</span>
              </button>
            );
          })}
        </div>
        <div className={styles.buckets}>
          {DETECTOR_BUCKETS.map((bucket) => {
            const placed = round.cards.filter((cid) => detPlacements[cid] === bucket.id);
            return (
              <div
                key={bucket.id}
                className={[
                  styles.bucket,
                  detDragOver === bucket.id ? styles.bucketHover : "",
                  selectedDet ? styles.bucketReady : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDetDragOver(bucket.id);
                }}
                onDragLeave={() => setDetDragOver(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDetDragOver(null);
                  const id = e.dataTransfer.getData("text/id") || selectedDet;
                  if (id) tryPlaceDet(id, bucket.id);
                }}
                onClick={() => {
                  if (selectedDet) tryPlaceDet(selectedDet, bucket.id);
                }}
                role="button"
                tabIndex={0}
              >
                <span className={styles.bucketLabel}>{bucket.label}</span>
                <div className={styles.bucketCards}>
                  {placed.map((cid) => (
                    <span key={cid} className={styles.placedChip}>
                      {detectorById(cid)?.label}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}
