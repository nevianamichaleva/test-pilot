"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  POS_CATEGORIES,
  POS_PUZZLE_LIVES,
  POS_PUZZLE_ROUNDS,
} from "@/data/bel-pos-puzzle";

import styles from "./PartsOfSpeechPuzzle.module.css";

function shuffle(items) {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function catById(id) {
  return POS_CATEGORIES.find((c) => c.id === id);
}

export default function PartsOfSpeechPuzzle({ exitHref = "/igri" }) {
  const [phase, setPhase] = useState("intro"); // intro | play | won | lost
  const [roundIndex, setRoundIndex] = useState(0);
  const [pool, setPool] = useState([]);
  const [placed, setPlaced] = useState({}); // word -> catId
  const [selected, setSelected] = useState(null);
  const [lives, setLives] = useState(POS_PUZZLE_LIVES);
  const [flash, setFlash] = useState(null); // { word, ok } | { bin, ok }
  const [toast, setToast] = useState("");

  const round = POS_PUZZLE_ROUNDS[roundIndex];
  const totalRounds = POS_PUZZLE_ROUNDS.length;

  const startRound = (idx) => {
    const r = POS_PUZZLE_ROUNDS[idx];
    setRoundIndex(idx);
    setPool(shuffle(r.words.map((w) => w.word)));
    setPlaced({});
    setSelected(null);
    setFlash(null);
    setToast("");
    setPhase("play");
  };

  const startGame = () => {
    setLives(POS_PUZZLE_LIVES);
    startRound(0);
  };

  const wordsInBin = useMemo(() => {
    const map = {};
    for (const c of POS_CATEGORIES) map[c.id] = [];
    for (const [word, cat] of Object.entries(placed)) {
      if (map[cat]) map[cat].push(word);
    }
    return map;
  }, [placed]);

  const remaining = pool.filter((w) => !placed[w]);
  const allPlaced = remaining.length === 0 && pool.length > 0;

  const showToast = (msg, ms = 1600) => {
    setToast(msg);
    setTimeout(() => setToast(""), ms);
  };

  const tryPlace = (catId) => {
    if (!selected || phase !== "play") return;
    const entry = round.words.find((w) => w.word === selected);
    if (!entry) return;

    const ok = entry.cat === catId;
    setFlash({ word: selected, bin: catId, ok });

    if (ok) {
      const nextPlaced = { ...placed, [selected]: catId };
      setPlaced(nextPlaced);
      setSelected(null);
      showToast("Верно!");

      const left = pool.filter((w) => !nextPlaced[w]);
      if (left.length === 0) {
        setTimeout(() => {
          if (roundIndex + 1 >= totalRounds) {
            setPhase("won");
          } else {
            showToast("Пъзелът е готов! Следващ…", 1200);
            setTimeout(() => startRound(roundIndex + 1), 900);
          }
        }, 500);
      }
    } else {
      const nextLives = lives - 1;
      setLives(nextLives);
      setSelected(null);
      if (nextLives <= 0) {
        setTimeout(() => setPhase("lost"), 600);
      } else {
        showToast(`Грешка! ${catById(entry.cat)?.label ?? ""} е верният ред.`);
      }
    }

    setTimeout(() => setFlash(null), 500);
  };

  const removeFromBin = (word) => {
    if (phase !== "play") return;
    const next = { ...placed };
    delete next[word];
    setPlaced(next);
    setSelected(word);
  };

  if (phase === "intro") {
    return (
      <div className={styles.shell}>
        <div className={styles.intro}>
          <h2 className={styles.introTitle}>Пъзел: Части на речта</h2>
          <p className={styles.introText}>
            Разбъркани думи чакат да ги наредиш. Избери дума, после кошницата –
            съществително, прилагателно, глагол или наречие. Има{" "}
            <strong>{totalRounds} пъзела</strong> и{" "}
            <strong>{POS_PUZZLE_LIVES} живота</strong>.
          </p>
          <div className={styles.catPreview}>
            {POS_CATEGORIES.map((c) => (
              <span key={c.id} className={styles.catChip} style={{ "--tone": c.tone }}>
                {c.label}
              </span>
            ))}
          </div>
          <button type="button" className={styles.primaryBtn} onClick={startGame}>
            Започни пъзела
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
            {phase === "won" ? "Всички пъзели са решени!" : "Пъзелът се разпадна…"}
          </h2>
          <p className={styles.resultMsg}>
            {phase === "won"
              ? `Нареди ${totalRounds} групи думи по части на речта.`
              : "Животите свършиха. Опитай пак!"}
          </p>
          <div className={styles.actionRow}>
            <button type="button" className={styles.primaryBtn} onClick={startGame}>
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
          {"♡".repeat(Math.max(POS_PUZZLE_LIVES - lives, 0))}
        </div>
        <div className={styles.roundLabel}>
          {roundIndex + 1}/{totalRounds} · {round.title.replace(/^Пъзел \d+ – /, "")}
        </div>
        <Link href={exitHref} className={styles.exitLink}>
          ← Изход
        </Link>
      </div>

      <p className={styles.hint}>
        {selected
          ? `Избрано: „${selected}“ → кликни кошница`
          : "Кликни дума, после кошницата"}
      </p>
      {toast ? <p className={styles.toast}>{toast}</p> : <p className={styles.toastSpacer} />}

      <div className={styles.bins}>
        {POS_CATEGORIES.map((c) => {
          const flashHere = flash?.bin === c.id;
          return (
            <div
              key={c.id}
              className={[
                styles.bin,
                selected ? styles.binActive : "",
                flashHere && flash.ok ? styles.binOk : "",
                flashHere && !flash.ok ? styles.binBad : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{ "--tone": c.tone }}
              onClick={() => tryPlace(c.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  tryPlace(c.id);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={c.label}
            >
              <span className={styles.binTitle}>{c.label}</span>
              <div className={styles.binWords}>
                {wordsInBin[c.id].map((w) => (
                  <button
                    key={w}
                    type="button"
                    className={styles.placedChip}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromBin(w);
                    }}
                    title="Върни в купа"
                  >
                    {w}
                  </button>
                ))}
                {wordsInBin[c.id].length === 0 ? (
                  <span className={styles.binEmpty}>празно</span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.pool}>
        <p className={styles.poolLabel}>
          {allPlaced ? "Готово!" : `Остават ${remaining.length} думи`}
        </p>
        <div className={styles.tiles}>
          {remaining.map((w) => (
            <button
              key={w}
              type="button"
              className={[
                styles.tile,
                selected === w ? styles.tileSelected : "",
                flash?.word === w && flash.ok ? styles.tileOk : "",
                flash?.word === w && !flash.ok ? styles.tileBad : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => setSelected((cur) => (cur === w ? null : w))}
            >
              {w}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
