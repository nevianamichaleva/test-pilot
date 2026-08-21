"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  CIVILIZATION_PAIRS,
  FAITH_EVENTS,
  FAITH_QUIZ,
  HISTORY_REVIEW_MODES,
  TERM_PAIRS,
  TIMELINE_EVENTS,
} from "@/data/istoriya-6-nachalen-pregled";

import styles from "./HistoryReviewAdventure.module.css";

function shuffle(items) {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function OrderMode({
  title,
  hint,
  items,
  getLabel,
  getKey,
  onDone,
  onBack,
  decoration,
}) {
  const [pool, setPool] = useState(() => shuffle(items));
  const [slots, setSlots] = useState(() => items.map(() => null));
  const [feedback, setFeedback] = useState(null);

  const nextSlot = slots.findIndex((s) => s == null);
  const filled = slots.every(Boolean);

  const pick = (item) => {
    if (feedback || filled) return;
    const key = getKey(item);
    if (slots.some((s) => s && getKey(s) === key)) return;
    const idx = nextSlot;
    if (idx < 0) return;
    const next = [...slots];
    next[idx] = item;
    setSlots(next);
    setPool((p) => p.filter((x) => getKey(x) !== key));
  };

  const undo = () => {
    if (feedback) return;
    let last = -1;
    for (let i = 0; i < slots.length; i += 1) if (slots[i]) last = i;
    if (last < 0) return;
    const item = slots[last];
    const next = [...slots];
    next[last] = null;
    setSlots(next);
    setPool((p) => [...p, item]);
  };

  const check = () => {
    const ok = slots.every((s, i) => s && getKey(s) === getKey(items[i]));
    setFeedback(ok ? "ok" : "bad");
    if (ok) {
      setTimeout(() => onDone(true), 900);
    }
  };

  const reset = () => {
    setPool(shuffle(items));
    setSlots(items.map(() => null));
    setFeedback(null);
  };

  return (
    <div className={styles.panel}>
      <div className={styles.toolbar}>
        <button type="button" className={styles.backLink} onClick={onBack}>
          ← Меню
        </button>
        <p className={styles.modeTitle}>{title}</p>
      </div>
      {decoration}
      <p className={styles.hint}>{hint}</p>

      <ol className={styles.slots}>
        {slots.map((s, i) => (
          <li key={i} className={`${styles.slot} ${s ? styles.slotFilled : ""} ${nextSlot === i && !feedback ? styles.slotActive : ""}`}>
            <span className={styles.slotNum}>{i + 1}</span>
            <span className={styles.slotBody}>{s ? getLabel(s) : "Постави тук…"}</span>
          </li>
        ))}
      </ol>

      <div className={styles.pool}>
        {pool.map((item) => (
          <button
            key={getKey(item)}
            type="button"
            className={styles.poolCard}
            onClick={() => pick(item)}
            disabled={Boolean(feedback)}
          >
            {getLabel(item)}
          </button>
        ))}
      </div>

      {feedback === "ok" ? <p className={styles.toastOk}>Верно! Браво!</p> : null}
      {feedback === "bad" ? <p className={styles.toastBad}>Не е точният ред. Опитай отново.</p> : null}

      <div className={styles.actions}>
        <button type="button" className={styles.secondaryBtn} onClick={undo} disabled={Boolean(feedback)}>
          Премахни последното
        </button>
        <button type="button" className={styles.secondaryBtn} onClick={reset}>
          Разбъркай
        </button>
        {filled && feedback !== "ok" ? (
          <button type="button" className={styles.primaryBtn} onClick={feedback === "bad" ? reset : check}>
            {feedback === "bad" ? "Нов опит" : "Провери"}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function PicturesMode({ onDone, onBack }) {
  const [labels] = useState(() => shuffle(CIVILIZATION_PAIRS.map((p) => p.label)));
  const [selectedImg, setSelectedImg] = useState(null);
  const [matched, setMatched] = useState([]);
  const [flash, setFlash] = useState(null);

  const remaining = CIVILIZATION_PAIRS.filter((p) => !matched.includes(p.id));

  const tryMatch = (label) => {
    if (!selectedImg || matched.includes(selectedImg)) return;
    const pair = CIVILIZATION_PAIRS.find((p) => p.id === selectedImg);
    const ok = pair?.label === label;
    setFlash({ id: selectedImg, ok });
    if (ok) {
      const next = [...matched, selectedImg];
      setMatched(next);
      setSelectedImg(null);
      if (next.length >= CIVILIZATION_PAIRS.length) {
        setTimeout(() => onDone(true), 700);
      }
    } else {
      setTimeout(() => {
        setFlash(null);
        setSelectedImg(null);
      }, 650);
    }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.toolbar}>
        <button type="button" className={styles.backLink} onClick={onBack}>
          ← Меню
        </button>
        <p className={styles.modeTitle}>Цивилизации</p>
      </div>
      <p className={styles.hint}>Избери картинка, после верната цивилизация.</p>
      <p className={styles.progress}>
        Свързани: {matched.length}/{CIVILIZATION_PAIRS.length}
      </p>

      <div className={styles.picGrid}>
        {CIVILIZATION_PAIRS.map((p) => {
          const done = matched.includes(p.id);
          const sel = selectedImg === p.id;
          const flashState = flash?.id === p.id ? (flash.ok ? styles.picOk : styles.picBad) : "";
          return (
            <button
              key={p.id}
              type="button"
              className={`${styles.picCard} ${sel ? styles.picSelected : ""} ${done ? styles.picDone : ""} ${flashState}`}
              onClick={() => !done && setSelectedImg(p.id)}
              disabled={done}
            >
              <img src={p.image} alt={p.hint} className={styles.picImg} />
              <span className={styles.picCaption}>{done ? p.label : "？"}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.labelGrid}>
        {labels
          .filter((lab) => remaining.some((p) => p.label === lab))
          .map((lab) => (
            <button
              key={lab}
              type="button"
              className={styles.labelBtn}
              onClick={() => tryMatch(lab)}
              disabled={!selectedImg}
            >
              {lab}
            </button>
          ))}
      </div>
    </div>
  );
}

function TermsMode({ onDone, onBack }) {
  const [defs] = useState(() => shuffle(TERM_PAIRS));
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [matched, setMatched] = useState([]);
  const [flash, setFlash] = useState(null);

  const tryPair = (defId) => {
    if (!selectedTerm || matched.includes(selectedTerm)) return;
    const ok = selectedTerm === defId;
    setFlash({ id: selectedTerm, defId, ok });
    if (ok) {
      const next = [...matched, selectedTerm];
      setMatched(next);
      setSelectedTerm(null);
      if (next.length >= TERM_PAIRS.length) setTimeout(() => onDone(true), 700);
    } else {
      setTimeout(() => {
        setFlash(null);
        setSelectedTerm(null);
      }, 650);
    }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.toolbar}>
        <button type="button" className={styles.backLink} onClick={onBack}>
          ← Меню
        </button>
        <p className={styles.modeTitle}>Понятия</p>
      </div>
      <p className={styles.hint}>Свържи понятието с дефиницията.</p>

      <div className={styles.matchCols}>
        <div className={styles.matchCol}>
          {TERM_PAIRS.map((p) => {
            const done = matched.includes(p.id);
            const sel = selectedTerm === p.id;
            const bad = flash && !flash.ok && flash.id === p.id;
            return (
              <button
                key={p.id}
                type="button"
                className={`${styles.termBtn} ${sel ? styles.termSelected : ""} ${done ? styles.termDone : ""} ${bad ? styles.termBad : ""}`}
                onClick={() => !done && setSelectedTerm(p.id)}
                disabled={done}
              >
                {p.term}
              </button>
            );
          })}
        </div>
        <div className={styles.matchCol}>
          {defs.map((p) => {
            const done = matched.includes(p.id);
            const bad = flash && !flash.ok && flash.defId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                className={`${styles.defBtn} ${done ? styles.termDone : ""} ${bad ? styles.termBad : ""}`}
                onClick={() => tryPair(p.id)}
                disabled={done || !selectedTerm}
              >
                {p.definition}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function QuizMode({ onDone, onBack }) {
  const questions = useMemo(() => shuffle(FAITH_QUIZ), []);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null);

  const current = questions[index];
  const options = useMemo(() => {
    if (!current) return [];
    return shuffle([current.correct, current.wrong1, current.wrong2, current.wrong3]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, questions]);

  const select = (value) => {
    if (picked || !current) return;
    setPicked(value);
    if (value === current.correct) setScore((s) => s + 1);
  };

  const goNext = () => {
    if (index + 1 >= questions.length) {
      onDone(true, `Верни: ${score} от ${questions.length}`);
      return;
    }
    setIndex((i) => i + 1);
    setPicked(null);
  };

  if (!current) return null;

  return (
    <div className={styles.panel}>
      <div className={styles.toolbar}>
        <button type="button" className={styles.backLink} onClick={onBack}>
          ← Меню
        </button>
        <p className={styles.modeTitle}>
          Въпрос {index + 1}/{questions.length}
        </p>
      </div>
      <div className={styles.quizDecor}>
        <img src="/images/igri/istoriya-6/hrist-hiro.jpg" alt="" className={styles.quizImg} />
      </div>
      <p className={styles.quizQ}>{current.q}</p>
      <div className={styles.quizOpts}>
        {options.map((opt) => {
          let cls = styles.quizOpt;
          if (picked) {
            if (opt === current.correct) cls += ` ${styles.quizOptOk}`;
            else if (opt === picked) cls += ` ${styles.quizOptBad}`;
          }
          return (
            <button key={opt} type="button" className={cls} onClick={() => select(opt)} disabled={Boolean(picked)}>
              {opt}
            </button>
          );
        })}
      </div>
      {picked ? (
        <div className={styles.actions}>
          <button type="button" className={styles.primaryBtn} onClick={goNext}>
            {index + 1 >= questions.length ? "Край" : "Напред"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function HistoryReviewAdventure({ exitHref = "/igri" }) {
  const [mode, setMode] = useState(null);
  const [cleared, setCleared] = useState([]);
  const [banner, setBanner] = useState(null);

  const backToMenu = () => {
    setMode(null);
    setBanner(null);
  };

  const handleDone = (ok, message) => {
    if (ok && mode && !cleared.includes(mode)) {
      setCleared((c) => [...c, mode]);
    }
    setBanner(message || (ok ? "Готово! Избери следваща игра." : null));
    setMode(null);
  };

  if (mode === "timeline") {
    return (
      <OrderMode
        title="Линия на времето"
        hint="Докосни събитията в хронологичен ред (най-старото = 1)."
        items={TIMELINE_EVENTS}
        getKey={(e) => e.id}
        getLabel={(e) => (
          <>
            <strong>{e.yearLabel}</strong>
            <span> — {e.text}</span>
          </>
        )}
        onDone={() => handleDone(true)}
        onBack={backToMenu}
        decoration={
          <div className={styles.timelineBar} aria-hidden>
            <span>пр.Хр.</span>
            <span className={styles.timelineZero}>0</span>
            <span>сл.Хр.</span>
          </div>
        }
      />
    );
  }

  if (mode === "pictures") {
    return <PicturesMode onDone={() => handleDone(true)} onBack={backToMenu} />;
  }

  if (mode === "terms") {
    return <TermsMode onDone={() => handleDone(true)} onBack={backToMenu} />;
  }

  if (mode === "faith-order") {
    return (
      <OrderMode
        title="Християнството"
        hint="Подреди от най-ранното към най-късното събитие."
        items={FAITH_EVENTS}
        getKey={(e) => e.id}
        getLabel={(e) => e.text}
        onDone={() => handleDone(true)}
        onBack={backToMenu}
        decoration={
          <img
            src="/images/igri/istoriya-6/imperator.jpg"
            alt="Римски император"
            className={styles.sideArt}
          />
        }
      />
    );
  }

  if (mode === "quiz") {
    return (
      <QuizMode
        onDone={(_ok, msg) => handleDone(true, msg)}
        onBack={backToMenu}
      />
    );
  }

  const allDone = cleared.length >= HISTORY_REVIEW_MODES.length;

  return (
    <div className={styles.panel}>
      <div className={styles.hero}>
        <img src="/images/igri/istoriya-6/cover.jpg" alt="" className={styles.heroImg} />
        <div className={styles.heroText}>
          <p className={styles.kicker}>Начален преговор</p>
          <h2 className={styles.heroTitle}>Древният свят</h2>
          <p className={styles.heroSub}>
            Линия на времето, картинки на цивилизации, понятия и християнството — 5 мини-игри.
          </p>
        </div>
      </div>

      {banner ? <p className={styles.banner}>{banner}</p> : null}
      {allDone ? (
        <p className={styles.bannerWin}>Премина всички игри от началния преговор!</p>
      ) : null}

      <div className={styles.menuGrid}>
        {HISTORY_REVIEW_MODES.map((m) => {
          const done = cleared.includes(m.id);
          return (
            <button
              key={m.id}
              type="button"
              className={`${styles.menuCard} ${done ? styles.menuDone : ""}`}
              style={{ "--tone": m.tone }}
              onClick={() => {
                setBanner(null);
                setMode(m.id);
              }}
            >
              <span className={styles.menuTitle}>{m.title}</span>
              <span className={styles.menuDesc}>{m.description}</span>
              {done ? <span className={styles.menuBadge}>✓</span> : null}
            </button>
          );
        })}
      </div>

      <div className={styles.actions}>
        <Link href={exitHref} className={styles.secondaryBtn}>
          ← Към игрите
        </Link>
        {cleared.length > 0 ? (
          <button type="button" className={styles.secondaryBtn} onClick={() => setCleared([])}>
            Нулирай напредъка
          </button>
        ) : null}
      </div>
    </div>
  );
}
