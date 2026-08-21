"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  NATURE_MAZE_GRID,
  NATURE_MAZE_LIVES,
  NATURE_MAZE_QUESTIONS,
} from "@/data/priroda-6-maze";

import styles from "./NatureMaze.module.css";

const DIRS = {
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1],
  w: [-1, 0],
  s: [1, 0],
  a: [0, -1],
  d: [0, 1],
};

function findStart(grid) {
  for (let r = 0; r < grid.length; r += 1) {
    for (let c = 0; c < grid[r].length; c += 1) {
      if (grid[r][c] === "S") return { r, c };
    }
  }
  return { r: 1, c: 1 };
}

function cellType(ch) {
  if (ch === "#") return "wall";
  if (ch === "S") return "start";
  if (ch === "E") return "exit";
  if (/^[0-8]$/.test(ch)) return "gate";
  return "path";
}

function shuffleOptions(options, seed) {
  const a = [...options];
  let s = seed >>> 0;
  for (let i = a.length - 1; i > 0; i -= 1) {
    s = (Math.imul(s ^ (s >>> 15), s | 1) + (i * 97)) >>> 0;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function NatureMaze({ exitHref = "/igri" }) {
  const grid = NATURE_MAZE_GRID;
  const start = useMemo(() => findStart(grid), [grid]);

  const [phase, setPhase] = useState("intro"); // intro | play | won | lost
  const [pos, setPos] = useState(start);
  const [lives, setLives] = useState(NATURE_MAZE_LIVES);
  const [cleared, setCleared] = useState(() => new Set());
  const [gateModal, setGateModal] = useState(null); // { idx, from }
  const [picked, setPicked] = useState(null);
  const [shake, setShake] = useState(false);
  const [message, setMessage] = useState("");

  const totalGates = NATURE_MAZE_QUESTIONS.length;
  const clearedCount = cleared.size;

  const resetGame = () => {
    setPos(start);
    setLives(NATURE_MAZE_LIVES);
    setCleared(new Set());
    setGateModal(null);
    setPicked(null);
    setShake(false);
    setMessage("");
    setPhase("play");
  };

  const tryMove = useCallback(
    (dr, dc) => {
      if (phase !== "play" || gateModal) return;
      const nr = pos.r + dr;
      const nc = pos.c + dc;
      if (nr < 0 || nc < 0 || nr >= grid.length || nc >= grid[0].length) return;
      const ch = grid[nr][nc];
      if (ch === "#") {
        setShake(true);
        setTimeout(() => setShake(false), 280);
        return;
      }

      if (/^[0-8]$/.test(ch) && !cleared.has(ch)) {
        setGateModal({ idx: Number(ch), from: { ...pos }, to: { r: nr, c: nc } });
        setPicked(null);
        return;
      }

      if (ch === "E") {
        if (cleared.size < totalGates) {
          setMessage(`Още ${totalGates - cleared.size} неотключени врати!`);
          setTimeout(() => setMessage(""), 2200);
          setPos({ r: nr, c: nc });
          return;
        }
        setPos({ r: nr, c: nc });
        setPhase("won");
        return;
      }

      setPos({ r: nr, c: nc });
      setMessage("");
    },
    [phase, gateModal, pos, grid, cleared, totalGates]
  );

  useEffect(() => {
    if (phase !== "play") return;
    const onKey = (e) => {
      const d = DIRS[e.key];
      if (!d) return;
      e.preventDefault();
      tryMove(d[0], d[1]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, tryMove]);

  const answerGate = (opt) => {
    if (!gateModal || picked) return;
    setPicked(opt);
    const q = NATURE_MAZE_QUESTIONS[gateModal.idx];
    const ok = opt === q.correct;
    if (ok) {
      const key = String(gateModal.idx);
      const next = new Set(cleared);
      next.add(key);
      setCleared(next);
      setTimeout(() => {
        setPos(gateModal.to);
        setGateModal(null);
        setPicked(null);
        setMessage("Вратата е отключена!");
        setTimeout(() => setMessage(""), 1400);
      }, 450);
    } else {
      const nextLives = lives - 1;
      setLives(nextLives);
      setTimeout(() => {
        setGateModal(null);
        setPicked(null);
        if (nextLives <= 0) {
          setPhase("lost");
        } else {
          setMessage("Грешен отговор – вратата остава заключена.");
          setTimeout(() => setMessage(""), 1800);
        }
      }, 700);
    }
  };

  const gateQuestion = gateModal ? NATURE_MAZE_QUESTIONS[gateModal.idx] : null;
  const gateOptions = useMemo(() => {
    if (!gateQuestion || !gateModal) return [];
    return shuffleOptions(gateQuestion.options, gateModal.idx * 31 + 7);
  }, [gateQuestion, gateModal]);

  if (phase === "intro") {
    return (
      <div className={styles.shell}>
        <div className={styles.intro}>
          <h2 className={styles.introTitle}>Лабиринт на знанието</h2>
          <p className={styles.introText}>
            Стигни до изхода през змиевидния лабиринт. По пътя има{" "}
            <strong>{totalGates} заключени врати</strong> – всяка с въпрос по човек и
            природа. Верен отговор отключва вратата. Имаш{" "}
            <strong>{NATURE_MAZE_LIVES} живота</strong>.
          </p>
          <ul className={styles.legend}>
            <li>
              <span className={styles.legPlayer} aria-hidden /> Ти
            </li>
            <li>
              <span className={styles.legGate} aria-hidden /> Заключена врата
            </li>
            <li>
              <span className={styles.legClear} aria-hidden /> Отключена врата
            </li>
            <li>
              <span className={styles.legExit} aria-hidden /> Изход
            </li>
          </ul>
          <p className={styles.hintKeys}>Движение: стрелки или WASD · или бутоните долу</p>
          <button type="button" className={styles.primaryBtn} onClick={resetGame}>
            Влез в лабиринта
          </button>
        </div>
      </div>
    );
  }

  if (phase === "won" || phase === "lost") {
    return (
      <div className={styles.shell}>
        <div className={styles.result}>
          <h2 className={phase === "won" ? styles.resultOk : styles.resultBad}>
            {phase === "won" ? "Излезе от лабиринта!" : "Лабиринтът те спря…"}
          </h2>
          <p className={styles.resultMsg}>
            {phase === "won"
              ? `Отключи ${clearedCount} от ${totalGates} врати и стигна до изхода.`
              : "Животите свършиха. Опитай пак с нови сили!"}
          </p>
          <div className={styles.actionRow}>
            <button type="button" className={styles.primaryBtn} onClick={resetGame}>
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
          {"♡".repeat(Math.max(NATURE_MAZE_LIVES - lives, 0))}
        </div>
        <div className={styles.progress}>
          Врати: {clearedCount}/{totalGates}
        </div>
        <Link href={exitHref} className={styles.exitLink}>
          ← Изход
        </Link>
      </div>

      {message ? <p className={styles.toast}>{message}</p> : <p className={styles.toastSpacer} />}

      <div className={`${styles.mazeWrap} ${shake ? styles.shake : ""}`}>
        <div
          className={styles.maze}
          style={{
            gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`,
            gridTemplateRows: `repeat(${grid.length}, 1fr)`,
          }}
        >
          {grid.map((row, r) =>
            row.split("").map((ch, c) => {
              const type = cellType(ch);
              const isPlayer = pos.r === r && pos.c === c;
              const isClearedGate = type === "gate" && cleared.has(ch);
              const cls = [
                styles.cell,
                type === "wall" ? styles.wall : "",
                type === "path" || type === "start" ? styles.path : "",
                type === "gate" && !isClearedGate ? styles.gate : "",
                isClearedGate ? styles.gateOpen : "",
                type === "exit" ? styles.exit : "",
                isPlayer ? styles.playerCell : "",
              ]
                .filter(Boolean)
                .join(" ");
              return (
                <div key={`${r}-${c}`} className={cls}>
                  {isPlayer ? <span className={styles.player}>🧪</span> : null}
                  {!isPlayer && type === "gate" && !isClearedGate ? (
                    <span className={styles.gateIcon}>🔒</span>
                  ) : null}
                  {!isPlayer && isClearedGate ? <span className={styles.gateIcon}>✓</span> : null}
                  {!isPlayer && type === "exit" ? <span className={styles.exitIcon}>🏁</span> : null}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className={styles.pad} aria-label="Управление">
        <button type="button" className={styles.padBtn} onClick={() => tryMove(-1, 0)} aria-label="Нагоре">
          ↑
        </button>
        <div className={styles.padMid}>
          <button type="button" className={styles.padBtn} onClick={() => tryMove(0, -1)} aria-label="Наляво">
            ←
          </button>
          <button type="button" className={styles.padBtn} onClick={() => tryMove(1, 0)} aria-label="Надолу">
            ↓
          </button>
          <button type="button" className={styles.padBtn} onClick={() => tryMove(0, 1)} aria-label="Надясно">
            →
          </button>
        </div>
      </div>

      {gateModal && gateQuestion ? (
        <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="gate-title">
          <div className={styles.modalCard}>
            <p className={styles.modalEyebrow}>Заключена врата {gateModal.idx + 1}</p>
            <h3 id="gate-title" className={styles.modalQ}>
              {gateQuestion.q}
            </h3>
            <div className={styles.modalOpts}>
              {gateOptions.map((opt) => {
                const isPicked = picked === opt;
                const isCorrect = picked && opt === gateQuestion.correct;
                const isWrong = isPicked && opt !== gateQuestion.correct;
                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={Boolean(picked)}
                    className={[
                      styles.optBtn,
                      isCorrect ? styles.optOk : "",
                      isWrong ? styles.optBad : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => answerGate(opt)}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
