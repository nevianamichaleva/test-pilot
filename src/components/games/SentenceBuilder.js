"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  SENTENCE_BUILDER_LIVES,
  SENTENCE_BUILDER_ROUNDS,
  buildTilePool,
  getMonsterTrapHint,
  slotsMatchCorrect,
} from "@/data/english-sentence-builder";

import styles from "./SentenceBuilder.module.css";

/**
 * @param {{ exitHref?: string }} props
 */
export default function SentenceBuilder({ exitHref = "/igri" }) {
  const [phase, setPhase] = useState("intro"); // intro | play | won | lost
  const [roundIndex, setRoundIndex] = useState(0);
  const [lives, setLives] = useState(SENTENCE_BUILDER_LIVES);
  const [pool, setPool] = useState([]);
  const [slots, setSlots] = useState([]); // (tileId|null)[]
  const [selectedId, setSelectedId] = useState(null);
  const [toast, setToast] = useState("");
  const [toastKind, setToastKind] = useState("info"); // info | monster | ok | bad
  const [shakeSlot, setShakeSlot] = useState(null);
  const [flashPoolId, setFlashPoolId] = useState(null);
  const [slotStatus, setSlotStatus] = useState([]); // '' | 'ok' | 'bad'
  const toastTimer = useRef(null);

  const round = SENTENCE_BUILDER_ROUNDS[roundIndex];
  const total = SENTENCE_BUILDER_ROUNDS.length;

  const tileById = useMemo(() => {
    const map = new Map();
    for (const t of pool) map.set(t.id, t);
    return map;
  }, [pool]);

  const showToast = useCallback((msg, kind = "info", ms = 3200) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    setToastKind(kind);
    toastTimer.current = setTimeout(() => {
      setToast("");
      setToastKind("info");
    }, ms);
  }, []);

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  const startRound = (idx) => {
    const r = SENTENCE_BUILDER_ROUNDS[idx];
    setRoundIndex(idx);
    setPool(buildTilePool(r));
    setSlots(Array(r.correct.length).fill(null));
    setSelectedId(null);
    setShakeSlot(null);
    setFlashPoolId(null);
    setSlotStatus(Array(r.correct.length).fill(""));
    setToast("");
    setPhase("play");
  };

  const startGame = () => {
    setLives(SENTENCE_BUILDER_LIVES);
    startRound(0);
  };

  const usedIds = useMemo(() => new Set(slots.filter(Boolean)), [slots]);
  const freeTiles = pool.filter((t) => !usedIds.has(t.id));
  const allFilled = slots.length > 0 && slots.every(Boolean);

  const placeTileInSlot = (tileId, slotIndex) => {
    if (phase !== "play" || slotIndex < 0 || slotIndex >= slots.length) return;
    const tile = tileById.get(tileId);
    if (!tile) return;

    const nextSlotsText = slots.map((id, i) => {
      if (i === slotIndex) return tile.text;
      return id ? tileById.get(id)?.text ?? null : null;
    });

    const trap = getMonsterTrapHint(nextSlotsText, slotIndex, tile.text);
    if (trap) {
      setShakeSlot(slotIndex);
      setFlashPoolId(tileId);
      showToast(trap, "monster", 4500);
      setTimeout(() => {
        setShakeSlot(null);
        setFlashPoolId(null);
      }, 700);
      setSelectedId(null);
      return;
    }

    const next = [...slots];
    // Ако слотът е зает – върни старата плочка в пула (просто освобождаваме id)
    next[slotIndex] = tileId;
    // Ако плочката вече е в друг слот – махни я оттам
    for (let i = 0; i < next.length; i += 1) {
      if (i !== slotIndex && next[i] === tileId) next[i] = null;
    }
    setSlots(next);
    setSelectedId(null);
    setSlotStatus(Array(next.length).fill(""));
  };

  const clearSlot = (slotIndex) => {
    if (phase !== "play") return;
    const next = [...slots];
    next[slotIndex] = null;
    setSlots(next);
    setSlotStatus(Array(next.length).fill(""));
  };

  const onTileClick = (tileId) => {
    if (phase !== "play") return;
    if (usedIds.has(tileId)) return;
    setSelectedId((prev) => (prev === tileId ? null : tileId));
  };

  const onSlotClick = (slotIndex) => {
    if (phase !== "play") return;
    if (selectedId) {
      placeTileInSlot(selectedId, slotIndex);
      return;
    }
    if (slots[slotIndex]) {
      setSelectedId(slots[slotIndex]);
      clearSlot(slotIndex);
    }
  };

  const onDragStart = (e, tileId) => {
    if (usedIds.has(tileId)) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("text/tile-id", tileId);
    e.dataTransfer.effectAllowed = "move";
    setSelectedId(tileId);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onDropSlot = (e, slotIndex) => {
    e.preventDefault();
    const tileId = e.dataTransfer.getData("text/tile-id") || selectedId;
    if (tileId) placeTileInSlot(tileId, slotIndex);
  };

  const checkSentence = () => {
    if (!allFilled || phase !== "play") return;
    const texts = slots.map((id) => tileById.get(id)?.text ?? "");
    if (slotsMatchCorrect(texts, round.correct)) {
      setSlotStatus(slots.map(() => "ok"));
      showToast("Супер! Изречението е правилно!", "ok", 1800);
      setTimeout(() => {
        if (roundIndex + 1 >= total) {
          setPhase("won");
        } else {
          startRound(roundIndex + 1);
        }
      }, 900);
      return;
    }

    const status = texts.map((t, i) =>
      t.toLowerCase() === String(round.correct[i]).toLowerCase() ? "ok" : "bad"
    );
    setSlotStatus(status);
    const nextLives = lives - 1;
    setLives(nextLives);
    showToast("Още не е точно – премести думите и пробвай пак!", "bad", 2800);
    if (nextLives <= 0) {
      setTimeout(() => setPhase("lost"), 700);
    }
  };

  const resetRound = () => {
    startRound(roundIndex);
  };

  if (phase === "intro") {
    return (
      <div className={styles.shell}>
        <div className={styles.intro}>
          <p className={styles.badge}>Live Beat · 5. клас</p>
          <h2 className={styles.introTitle}>The Sentence Builder</h2>
          <p className={styles.introSub}>Гръмотевичен конструктор</p>
          <p className={styles.introText}>
            Нареди думите във влакчето в правилния ред. Пази се от{" "}
            <strong>лакомите чудовища</strong> – <em>didn&apos;t</em>, <em>don&apos;t</em>,{" "}
            <em>doesn&apos;t</em> и <em>did</em> изяждат грешната глаголна форма и я
            изхвърлят обратно с подсказка!
          </p>
          <ul className={styles.bullets}>
            <li>Влачи тухличките или кликни дума → после празна кутийка</li>
            <li>{total} изречения от учебника Live Beat</li>
            <li>{SENTENCE_BUILDER_LIVES} живота при грешна проверка</li>
          </ul>
          <button type="button" className={styles.primaryBtn} onClick={startGame}>
            Започни конструктора
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
            {phase === "won" ? "Влакчето стигна до гарата!" : "Гръмотевицата спря играта…"}
          </h2>
          <p className={styles.resultMsg}>
            {phase === "won"
              ? `Построи ${total} правилни изречения. Didn't вече няма какво да хапне!`
              : "Животите свършиха. Опитай пак – помни чудовището didn't!"}
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
          {"♡".repeat(Math.max(SENTENCE_BUILDER_LIVES - lives, 0))}
        </div>
        <div className={styles.roundLabel}>
          {roundIndex + 1}/{total} · {round.topic}
        </div>
        <Link href={exitHref} className={styles.exitLink}>
          ← Изход
        </Link>
      </div>

      <p className={styles.hintBg}>
        <span className={styles.hintLabel}>Подсказка:</span> {round.hintBg}
      </p>

      {toast ? (
        <p
          className={[
            styles.toast,
            toastKind === "monster" ? styles.toastMonster : "",
            toastKind === "ok" ? styles.toastOk : "",
            toastKind === "bad" ? styles.toastBad : "",
          ]
            .filter(Boolean)
            .join(" ")}
          role="status"
        >
          {toastKind === "monster" ? "👾 " : ""}
          {toast}
        </p>
      ) : (
        <p className={styles.toastSpacer} />
      )}

      <div className={styles.track} aria-label="Кутийки за изречението">
        <div className={styles.engine} aria-hidden>
          🚂
        </div>
        <div className={styles.cars}>
          {slots.map((tileId, i) => {
            const text = tileId ? tileById.get(tileId)?.text : null;
            const status = slotStatus[i] || "";
            return (
              <button
                key={`slot-${i}`}
                type="button"
                className={[
                  styles.car,
                  text ? styles.carFilled : styles.carEmpty,
                  shakeSlot === i ? styles.carShake : "",
                  status === "ok" ? styles.carOk : "",
                  status === "bad" ? styles.carBad : "",
                  selectedId && !text ? styles.carTarget : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => onSlotClick(i)}
                onDragOver={onDragOver}
                onDrop={(e) => onDropSlot(e, i)}
                aria-label={text ? `Слот ${i + 1}: ${text}` : `Празен слот ${i + 1}`}
              >
                <span className={styles.carNum}>{i + 1}</span>
                <span className={styles.carWord}>{text || "· · ·"}</span>
              </button>
            );
          })}
        </div>
      </div>

      <p className={styles.poolLabel}>
        {selectedId
          ? `Избрано: „${tileById.get(selectedId)?.text}“ → кликни празна кутийка`
          : "Влачи или кликни тухличка, после кутийка"}
      </p>

      <div className={styles.pool} aria-label="Думи">
        {freeTiles.map((t) => (
          <button
            key={t.id}
            type="button"
            draggable
            className={[
              styles.brick,
              selectedId === t.id ? styles.brickSelected : "",
              flashPoolId === t.id ? styles.brickReject : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => onTileClick(t.id)}
            onDragStart={(e) => onDragStart(e, t.id)}
          >
            {t.text}
          </button>
        ))}
        {freeTiles.length === 0 ? (
          <span className={styles.poolEmpty}>Всички думи са във влакчето</span>
        ) : null}
      </div>

      <div className={styles.actionRow}>
        <button
          type="button"
          className={styles.primaryBtn}
          onClick={checkSentence}
          disabled={!allFilled}
        >
          Провери изречението
        </button>
        <button type="button" className={styles.secondaryBtn} onClick={resetRound}>
          Изчисти
        </button>
      </div>
    </div>
  );
}
