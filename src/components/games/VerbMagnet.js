"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  MAGNET_LIVES,
  MAGNET_ROUNDS,
  MAGNET_VERBS,
  verbById,
} from "@/data/english-verb-magnet";

import styles from "./VerbMagnet.module.css";

function shuffle(items) {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function MagnetGlyph({ tone }) {
  return (
    <svg className={styles.glyph} viewBox="0 0 80 92" aria-hidden>
      <path
        d="M14 6h22v40a10 10 0 0 0 20 0V6h22v42a32 32 0 0 1-64 0V6z"
        fill={tone}
      />
      <rect x="14" y="6" width="22" height="18" rx="2" fill="#e5e7eb" />
      <rect x="56" y="6" width="22" height="18" rx="2" fill="#e5e7eb" />
    </svg>
  );
}

/**
 * @param {{ exitHref?: string }} props
 */
export default function VerbMagnet({ exitHref = "/igri" }) {
  const [phase, setPhase] = useState("intro"); // intro | play | won | lost
  const [roundIndex, setRoundIndex] = useState(0);
  const [order, setOrder] = useState([]);
  const [placed, setPlaced] = useState({}); // wordId -> verbId
  const [visible, setVisible] = useState(0);
  const [selected, setSelected] = useState(null);
  const [lives, setLives] = useState(MAGNET_LIVES);
  const [flash, setFlash] = useState(null); // { wordId, verb, ok }
  const [toast, setToast] = useState("");
  const [dragOver, setDragOver] = useState(null);

  const round = MAGNET_ROUNDS[roundIndex];
  const total = MAGNET_ROUNDS.length;
  const wordById = useMemo(() => {
    const map = new Map();
    for (const w of round?.words ?? []) map.set(w.id, w);
    return map;
  }, [round]);

  useEffect(() => {
    if (phase !== "play" || order.length === 0) return undefined;
    setVisible(0);
    const timers = order.map((_, i) =>
      setTimeout(() => setVisible((n) => Math.max(n, i + 1)), 140 + i * 220)
    );
    return () => timers.forEach(clearTimeout);
  }, [phase, order, roundIndex]);

  const startRound = (idx) => {
    const r = MAGNET_ROUNDS[idx];
    setRoundIndex(idx);
    setOrder(shuffle(r.words.map((w) => w.id)));
    setPlaced({});
    setVisible(0);
    setSelected(null);
    setFlash(null);
    setToast("");
    setDragOver(null);
    setPhase("play");
  };

  const startGame = () => {
    setLives(MAGNET_LIVES);
    startRound(0);
  };

  const remaining = order.filter((id, i) => !placed[id] && i < visible);
  const stuckOnMagnet = (verbId) =>
    order.filter((id) => placed[id] === verbId).map((id) => wordById.get(id));

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  const tryPlace = (wordId, verbId) => {
    if (phase !== "play" || placed[wordId]) return;
    const word = wordById.get(wordId);
    if (!word) return;

    const ok = word.verb === verbId;
    setFlash({ wordId, verb: verbId, ok });
    setSelected(null);

    if (ok) {
      const next = { ...placed, [wordId]: verbId };
      setPlaced(next);
      showToast(`${verbById(verbId)?.label} ${word.text}`);

      const left = order.filter((id) => !next[id]);
      if (left.length === 0) {
        setTimeout(() => {
          if (roundIndex + 1 >= total) {
            setPhase("won");
          } else {
            startRound(roundIndex + 1);
          }
        }, 900);
      }
    } else {
      const nextLives = lives - 1;
      setLives(nextLives);
      const tip =
        word.tips?.[verbId] ||
        `Гледай правилото: ${verbById(word.verb)?.rule}. → ${verbById(word.verb)?.label.toLowerCase()} ${word.text}`;
      showToast(tip);
      if (nextLives <= 0) {
        setTimeout(() => setPhase("lost"), 900);
      }
    }

    setTimeout(() => setFlash(null), 550);
  };

  const onDragStart = (e, wordId) => {
    e.dataTransfer.setData("text/word-id", wordId);
    e.dataTransfer.effectAllowed = "move";
    setSelected(wordId);
  };

  const onDragOver = (e, verbId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOver(verbId);
  };

  const onDrop = (e, verbId) => {
    e.preventDefault();
    setDragOver(null);
    const wordId = e.dataTransfer.getData("text/word-id") || selected;
    if (wordId) tryPlace(wordId, verbId);
  };

  if (phase === "intro") {
    const nWords = MAGNET_ROUNDS.reduce((s, r) => s + r.words.length, 0);
    return (
      <div className={styles.shell}>
        <div className={styles.intro}>
          <p className={styles.badge}>Diagnostic · Grade 6</p>
          <h2 className={styles.introTitle}>The Verb Magnet</h2>
          <p className={styles.introSub}>Магнит за глаголи · do / play / make</p>
          <p className={styles.introText}>
            Думите падат отгоре. Завлечи ги към правилния магнит. Не превеждай
            буквално „правя“ – на английски не винаги е <em>make</em>!
          </p>
          <ul className={styles.rules}>
            {MAGNET_VERBS.map((v) => (
              <li key={v.id} style={{ "--tone": v.tone }}>
                <strong>{v.label}</strong> — {v.rule}
              </li>
            ))}
          </ul>
          <ul className={styles.bullets}>
            <li>{nWords} думи в {total} вълни</li>
            <li>{MAGNET_LIVES} живота</li>
            <li>На телефон: докосни дума, после магнит</li>
          </ul>
          <button type="button" className={styles.primaryBtn} onClick={startGame}>
            Пусни магнитите
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
            {phase === "won" ? "Магнитите са пълни!" : "Думата избяга…"}
          </h2>
          <p className={styles.resultMsg}>
            {phase === "won"
              ? "do gymnastics, play football, make a cake — вече без буквален превод!"
              : "Помни: PLAY = топка, DO = без топка, MAKE = създаваш нещо. Опитай пак!"}
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
          {"♡".repeat(Math.max(MAGNET_LIVES - lives, 0))}
        </div>
        <div className={styles.roundLabel}>
          {round.title} · {Object.keys(placed).length}/{order.length}
        </div>
        <Link href={exitHref} className={styles.exitLink}>
          ← Изход
        </Link>
      </div>

      <p className={styles.hint}>
        {selected
          ? `„${wordById.get(selected)?.text}“ → пусни върху магнит`
          : "Завлечи думата или я докосни, после магнита"}
      </p>
      {toast ? (
        <p className={styles.toast} role="status">
          {toast}
        </p>
      ) : (
        <p className={styles.toastSpacer} />
      )}

      <div className={styles.sky} aria-label="Падащи думи">
        {remaining.map((id, i) => {
          const w = wordById.get(id);
          if (!w) return null;
          const isSel = selected === id;
          const flashHere = flash?.wordId === id;
          return (
            <button
              key={id}
              type="button"
              draggable
              className={[
                styles.chip,
                styles.chipFall,
                isSel ? styles.chipSel : "",
                flashHere && flash.ok ? styles.chipOk : "",
                flashHere && !flash.ok ? styles.chipBad : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{ animationDelay: `${i * 40}ms` }}
              onClick={() => setSelected((cur) => (cur === id ? null : id))}
              onDragStart={(e) => onDragStart(e, id)}
            >
              {w.text}
            </button>
          );
        })}
        {remaining.length === 0 ? (
          <span className={styles.skyEmpty}>Всички думи са залепени!</span>
        ) : null}
      </div>

      <div className={styles.magnets}>
        {MAGNET_VERBS.map((v) => {
          const flashHere = flash?.verb === v.id;
          const stuck = stuckOnMagnet(v.id);
          return (
            <div
              key={v.id}
              className={[
                styles.magnet,
                selected ? styles.magnetReady : "",
                dragOver === v.id ? styles.magnetHover : "",
                flashHere && flash.ok ? styles.magnetOk : "",
                flashHere && !flash.ok ? styles.magnetBad : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{ "--tone": v.tone }}
              onClick={() => {
                if (selected) tryPlace(selected, v.id);
              }}
              onDragOver={(e) => onDragOver(e, v.id)}
              onDragLeave={() => setDragOver(null)}
              onDrop={(e) => onDrop(e, v.id)}
              role="button"
              tabIndex={0}
              aria-label={`${v.label}: ${v.rule}`}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && selected) {
                  e.preventDefault();
                  tryPlace(selected, v.id);
                }
              }}
            >
              <MagnetGlyph tone={v.tone} />
              <span className={styles.magnetLabel}>{v.label}</span>
              <span className={styles.magnetRule}>{v.rule}</span>
              <div className={styles.stuck}>
                {stuck.map((w) =>
                  w ? (
                    <span key={w.id} className={styles.stuckChip}>
                      {w.text}
                    </span>
                  ) : null
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
