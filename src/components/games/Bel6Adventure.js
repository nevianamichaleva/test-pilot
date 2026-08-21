"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  BEL6_MODES,
  BEL6_QUIZ,
  PARTICIPLE_ROWS,
  SMYAL_SE_FORMS,
  SPELLING_FILL,
  SPELLING_FIX_WORDS,
  SYNTAX_PAIRS,
  TENSE_MATCH,
  TENSE_QUIZ_ITEMS,
  WORD_TYPE_ROUNDS,
} from "@/data/bel-6-games";

import styles from "./Bel6Adventure.module.css";

function shuffle(items) {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function normalize(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function Toolbar({ title, onBack }) {
  return (
    <div className={styles.toolbar}>
      <button type="button" className={styles.backLink} onClick={onBack}>
        ← Меню
      </button>
      <p className={styles.modeTitle}>{title}</p>
    </div>
  );
}

function WordTypesMode({ onDone, onBack }) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null);
  const round = WORD_TYPE_ROUNDS[index];
  const options = useMemo(() => shuffle(round.options), [index]);

  const select = (id) => {
    if (picked) return;
    setPicked(id);
    if (id === round.correctId) setScore((s) => s + 1);
  };

  const next = () => {
    if (index + 1 >= WORD_TYPE_ROUNDS.length) {
      onDone(true, `Верни: ${score} от ${WORD_TYPE_ROUNDS.length}`);
      return;
    }
    setIndex((i) => i + 1);
    setPicked(null);
  };

  return (
    <div className={styles.panel}>
      <Toolbar title={`Синоними · ${index + 1}/${WORD_TYPE_ROUNDS.length}`} onBack={onBack} />
      <p className={styles.hint}>Избери верния отговор за:</p>
      <p className={styles.prompt}>{round.prompt}</p>
      <div className={styles.optStack}>
        {options.map((o) => {
          let cls = styles.optBtn;
          if (picked) {
            if (o.id === round.correctId) cls += ` ${styles.optOk}`;
            else if (o.id === picked) cls += ` ${styles.optBad}`;
          }
          return (
            <button key={o.id} type="button" className={cls} disabled={Boolean(picked)} onClick={() => select(o.id)}>
              <span className={styles.optKind}>{o.kind}</span>
              {o.label}
            </button>
          );
        })}
      </div>
      {picked ? (
        <div className={styles.actions}>
          <button type="button" className={styles.primaryBtn} onClick={next}>
            {index + 1 >= WORD_TYPE_ROUNDS.length ? "Край" : "Напред"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function SpellingFillMode({ onDone, onBack }) {
  const items = useMemo(() => shuffle(SPELLING_FILL).slice(0, 8), []);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null);
  const item = items[index];
  const choices = useMemo(() => shuffle(item.choices), [index]);

  const select = (value) => {
    if (picked) return;
    setPicked(value);
    if (value === item.correct) setScore((s) => s + 1);
  };

  const next = () => {
    if (index + 1 >= items.length) {
      onDone(true, `Верни: ${score} от ${items.length}`);
      return;
    }
    setIndex((i) => i + 1);
    setPicked(null);
  };

  return (
    <div className={styles.panel}>
      <Toolbar title={`Правопис · ${index + 1}/${items.length}`} onBack={onBack} />
      <p className={styles.hint}>Кой е верният правопис?</p>
      <p className={styles.promptMono}>{item.prompt}</p>
      <div className={styles.choiceRow}>
        {choices.map((c) => {
          let cls = styles.choiceBtn;
          if (picked) {
            if (c === item.correct) cls += ` ${styles.optOk}`;
            else if (c === picked) cls += ` ${styles.optBad}`;
          }
          return (
            <button key={c} type="button" className={cls} disabled={Boolean(picked)} onClick={() => select(c)}>
              {c}
            </button>
          );
        })}
      </div>
      {picked ? (
        <div className={styles.actions}>
          <button type="button" className={styles.primaryBtn} onClick={next}>
            {index + 1 >= items.length ? "Край" : "Напред"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function SpellingFixMode({ onDone, onBack }) {
  const errors = SPELLING_FIX_WORDS.filter((w) => w.correct);
  const [pool] = useState(() => shuffle(SPELLING_FIX_WORDS));
  const [selected, setSelected] = useState([]);
  const [phase, setPhase] = useState("pick"); // pick | fix | done
  const [fixIndex, setFixIndex] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [msg, setMsg] = useState("");

  const toggle = (shown) => {
    if (phase !== "pick") return;
    setSelected((prev) => (prev.includes(shown) ? prev.filter((x) => x !== shown) : [...prev, shown]));
  };

  const startFix = () => {
    const chosenErrors = selected.filter((s) => errors.some((e) => e.shown === s));
    if (chosenErrors.length === 0) {
      setMsg("Избери поне една дума с грешка.");
      return;
    }
    // Score picking: +1 for each real error selected, - nothing for false positives but we only fix real ones
    const hits = errors.filter((e) => selected.includes(e.shown)).length;
    const falsePos = selected.filter((s) => !errors.some((e) => e.shown === s)).length;
    setScore(Math.max(0, hits - falsePos));
    setFixIndex(0);
    setInput("");
    setPhase("fix");
    setMsg(falsePos ? `Имаш ${falsePos} грешни избора. Поправи верните.` : "Сега напиши верния правопис.");
  };

  const toFix = errors.filter((e) => selected.includes(e.shown));
  const current = toFix[fixIndex];

  const submitFix = () => {
    if (!current) return;
    const ok = normalize(input) === normalize(current.correct);
    if (ok) setScore((s) => s + 1);
    setMsg(ok ? "Верно!" : `Вярно е: ${current.correct}`);
    if (fixIndex + 1 >= toFix.length) {
      setTimeout(() => onDone(true, `Точки: ${score + (ok ? 1 : 0)}`), 700);
      return;
    }
    setTimeout(() => {
      setFixIndex((i) => i + 1);
      setInput("");
      setMsg("");
    }, 650);
  };

  if (phase === "fix" && current) {
    return (
      <div className={styles.panel}>
        <Toolbar title="Поправи думата" onBack={onBack} />
        <p className={styles.hint}>
          {fixIndex + 1}/{toFix.length}: напиши вярно
        </p>
        <p className={styles.promptMono}>{current.shown}</p>
        <input
          className={styles.textInput}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Верен правопис…"
          onKeyDown={(e) => e.key === "Enter" && submitFix()}
        />
        {msg ? <p className={styles.toast}>{msg}</p> : null}
        <div className={styles.actions}>
          <button type="button" className={styles.primaryBtn} onClick={submitFix}>
            Провери
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      <Toolbar title="Намери грешката" onBack={onBack} />
      <p className={styles.hint}>Маркирай думите с правописна грешка (ър/ръ, ъл/лъ).</p>
      <div className={styles.wordCloud}>
        {pool.map((w) => (
          <button
            key={w.shown}
            type="button"
            className={`${styles.wordChip} ${selected.includes(w.shown) ? styles.wordChipOn : ""}`}
            onClick={() => toggle(w.shown)}
          >
            {w.shown}
          </button>
        ))}
      </div>
      {msg ? <p className={styles.toast}>{msg}</p> : null}
      <div className={styles.actions}>
        <button type="button" className={styles.primaryBtn} onClick={startFix}>
          Поправи избраните
        </button>
      </div>
    </div>
  );
}

function TensesMode({ onDone, onBack }) {
  const [defs] = useState(() => shuffle(TENSE_MATCH));
  const [selected, setSelected] = useState(null);
  const [matched, setMatched] = useState([]);
  const [flash, setFlash] = useState(null);

  const tryPair = (defId) => {
    if (!selected || matched.includes(selected)) return;
    const ok = selected === defId;
    setFlash({ id: selected, ok });
    if (ok) {
      const next = [...matched, selected];
      setMatched(next);
      setSelected(null);
      if (next.length >= TENSE_MATCH.length) setTimeout(() => onDone(true), 700);
    } else {
      setTimeout(() => {
        setFlash(null);
        setSelected(null);
      }, 600);
    }
  };

  return (
    <div className={styles.panel}>
      <Toolbar title="Време на глагола" onBack={onBack} />
      <p className={styles.hint}>Свържи времето с обяснението.</p>
      <div className={styles.matchCols}>
        <div className={styles.matchCol}>
          {TENSE_MATCH.map((t) => {
            const done = matched.includes(t.id);
            const sel = selected === t.id;
            const bad = flash && !flash.ok && flash.id === t.id;
            return (
              <button
                key={t.id}
                type="button"
                className={`${styles.termBtn} ${sel ? styles.termSel : ""} ${done ? styles.termDone : ""} ${bad ? styles.optBad : ""}`}
                disabled={done}
                onClick={() => setSelected(t.id)}
              >
                {t.label}
              </button>
            );
          })}
        </div>
        <div className={styles.matchCol}>
          {defs.map((t) => {
            const done = matched.includes(t.id);
            return (
              <button
                key={t.id}
                type="button"
                className={`${styles.defBtn} ${done ? styles.termDone : ""}`}
                disabled={done || !selected}
                onClick={() => tryPair(t.id)}
              >
                <strong>{t.clue}</strong>
                <span className={styles.defEx}>{t.example}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className={styles.divider} />
      <p className={styles.hint}>Бързи въпроси:</p>
      <MiniQuiz items={TENSE_QUIZ_ITEMS} onAllDone={() => {}} embed />
    </div>
  );
}

function MiniQuiz({ items, onAllDone, embed }) {
  const questions = useMemo(() => shuffle(items), [items]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null);
  const current = questions[index];
  const options = useMemo(
    () => shuffle([current.correct, current.wrong1, current.wrong2, current.wrong3].filter(Boolean)),
    [index]
  );

  if (!current) return null;

  const select = (v) => {
    if (picked) return;
    setPicked(v);
    if (v === current.correct) setScore((s) => s + 1);
  };

  const next = () => {
    if (index + 1 >= questions.length) {
      onAllDone?.(true, `Верни: ${score} от ${questions.length}`);
      return;
    }
    setIndex((i) => i + 1);
    setPicked(null);
  };

  return (
    <div className={embed ? styles.embedQuiz : undefined}>
      <p className={styles.quizQ}>
        {index + 1}/{questions.length}. {current.q}
      </p>
      <div className={styles.optStack}>
        {options.map((opt) => {
          let cls = styles.optBtn;
          if (picked) {
            if (opt === current.correct) cls += ` ${styles.optOk}`;
            else if (opt === picked) cls += ` ${styles.optBad}`;
          }
          return (
            <button key={opt} type="button" className={cls} disabled={Boolean(picked)} onClick={() => select(opt)}>
              {opt}
            </button>
          );
        })}
      </div>
      {picked ? (
        <div className={styles.actions}>
          <button type="button" className={styles.primaryBtn} onClick={next}>
            {index + 1 >= questions.length ? (embed ? "Готово с въпросите" : "Край") : "Напред"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function ParticiplesMode({ onDone, onBack }) {
  const [index, setIndex] = useState(0);
  const [aorist, setAorist] = useState("");
  const [imperfect, setImperfect] = useState("");
  const [score, setScore] = useState(0);
  const [msg, setMsg] = useState("");
  const [phase, setPhase] = useState("table"); // table | forms
  const row = PARTICIPLE_ROWS[index];

  const checkRow = () => {
    const okA = normalize(aorist) === normalize(row.aorist);
    const okI = normalize(imperfect) === normalize(row.imperfect);
    const gained = (okA ? 1 : 0) + (okI ? 1 : 0);
    setScore((s) => s + gained);
    setMsg(
      okA && okI
        ? "Верно!"
        : `Вярно: ${row.aorist} / ${row.imperfect}`
    );
    if (index + 1 >= PARTICIPLE_ROWS.length) {
      setTimeout(() => setPhase("forms"), 800);
      return;
    }
    setTimeout(() => {
      setIndex((i) => i + 1);
      setAorist("");
      setImperfect("");
      setMsg("");
    }, 800);
  };

  const [formInput, setFormInput] = useState("");
  const [formFound, setFormFound] = useState([]);

  const addForm = () => {
    const n = normalize(formInput);
    const match = SMYAL_SE_FORMS.find((f) => normalize(f) === n);
    if (!match) {
      setMsg("Тази форма не е сред деветте. Опитай пак.");
      return;
    }
    if (formFound.includes(match)) {
      setMsg("Вече я имаш.");
      return;
    }
    const next = [...formFound, match];
    setFormFound(next);
    setFormInput("");
    setMsg("Верно!");
    if (next.length >= SMYAL_SE_FORMS.length) {
      setTimeout(() => onDone(true, `Точки от таблицата: ${score}`), 700);
    }
  };

  if (phase === "forms") {
    return (
      <div className={styles.panel}>
        <Toolbar title="Деветте форми на „смял се“" onBack={onBack} />
        <p className={styles.hint}>Запиши всички форми на миналото свършено деятелно причастие от „смея се“.</p>
        <div className={styles.foundList}>
          {formFound.map((f) => (
            <span key={f} className={styles.foundChip}>
              {f}
            </span>
          ))}
        </div>
        <p className={styles.progress}>
          {formFound.length}/{SMYAL_SE_FORMS.length}
        </p>
        <input
          className={styles.textInput}
          value={formInput}
          onChange={(e) => setFormInput(e.target.value)}
          placeholder="напр. смяла се"
          onKeyDown={(e) => e.key === "Enter" && addForm()}
        />
        {msg ? <p className={styles.toast}>{msg}</p> : null}
        <div className={styles.actions}>
          <button type="button" className={styles.primaryBtn} onClick={addForm}>
            Добави
          </button>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => onDone(true, `Точки: ${score}; форми: ${formFound.length}/9`)}
          >
            Пропусни и завърши
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      <Toolbar title={`Причастия · ${index + 1}/${PARTICIPLE_ROWS.length}`} onBack={onBack} />
      <p className={styles.hint}>Минало свършено и минало несвършено деятелно причастие</p>
      <p className={styles.prompt}>глагол: {row.verb}</p>
      <label className={styles.field}>
        <span>мин. св. деят.</span>
        <input className={styles.textInput} value={aorist} onChange={(e) => setAorist(e.target.value)} />
      </label>
      <label className={styles.field}>
        <span>мин. несв. деят.</span>
        <input className={styles.textInput} value={imperfect} onChange={(e) => setImperfect(e.target.value)} />
      </label>
      {msg ? <p className={styles.toast}>{msg}</p> : null}
      <div className={styles.actions}>
        <button type="button" className={styles.primaryBtn} onClick={checkRow}>
          Провери
        </button>
      </div>
    </div>
  );
}

function SyntaxMode({ onDone, onBack }) {
  const [defs] = useState(() => shuffle(SYNTAX_PAIRS));
  const [selected, setSelected] = useState(null);
  const [matched, setMatched] = useState([]);
  const [flash, setFlash] = useState(null);

  const tryPair = (defId) => {
    if (!selected || matched.includes(selected)) return;
    const ok = selected === defId;
    setFlash({ id: selected, ok });
    if (ok) {
      const next = [...matched, selected];
      setMatched(next);
      setSelected(null);
      if (next.length >= SYNTAX_PAIRS.length) setTimeout(() => onDone(true), 700);
    } else {
      setTimeout(() => {
        setFlash(null);
        setSelected(null);
      }, 600);
    }
  };

  return (
    <div className={styles.panel}>
      <Toolbar title="Части на изречението" onBack={onBack} />
      <p className={styles.hint}>Свържи частта с определението.</p>
      <div className={styles.matchCols}>
        <div className={styles.matchCol}>
          {SYNTAX_PAIRS.map((p) => {
            const done = matched.includes(p.id);
            const sel = selected === p.id;
            const bad = flash && !flash.ok && flash.id === p.id;
            return (
              <button
                key={p.id}
                type="button"
                className={`${styles.termBtn} ${sel ? styles.termSel : ""} ${done ? styles.termDone : ""} ${bad ? styles.optBad : ""}`}
                disabled={done}
                onClick={() => setSelected(p.id)}
              >
                <span className={styles.groupTag}>{p.group}</span>
                {p.term}
              </button>
            );
          })}
        </div>
        <div className={styles.matchCol}>
          {defs.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`${styles.defBtn} ${matched.includes(p.id) ? styles.termDone : ""}`}
              disabled={matched.includes(p.id) || !selected}
              onClick={() => tryPair(p.id)}
            >
              {p.definition}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuizMode({ onDone, onBack }) {
  return (
    <div className={styles.panel}>
      <Toolbar title="Бърз тест" onBack={onBack} />
      <MiniQuiz items={BEL6_QUIZ} onAllDone={onDone} />
    </div>
  );
}

export default function Bel6Adventure({ exitHref = "/igri" }) {
  const [mode, setMode] = useState(null);
  const [cleared, setCleared] = useState([]);
  const [banner, setBanner] = useState(null);

  const back = () => {
    setMode(null);
    setBanner(null);
  };

  const done = (ok, message) => {
    if (ok && mode && !cleared.includes(mode)) setCleared((c) => [...c, mode]);
    setBanner(message || "Готово! Избери следваща игра.");
    setMode(null);
  };

  if (mode === "word-types") return <WordTypesMode onDone={done} onBack={back} />;
  if (mode === "spelling-fill") return <SpellingFillMode onDone={done} onBack={back} />;
  if (mode === "spelling-fix") return <SpellingFixMode onDone={done} onBack={back} />;
  if (mode === "tenses") return <TensesMode onDone={done} onBack={back} />;
  if (mode === "participles") return <ParticiplesMode onDone={done} onBack={back} />;
  if (mode === "syntax") return <SyntaxMode onDone={done} onBack={back} />;
  if (mode === "quiz") return <QuizMode onDone={done} onBack={back} />;

  return (
    <div className={styles.panel}>
      <div className={styles.hero}>
        <p className={styles.kicker}>Български език · 6. клас</p>
        <h2 className={styles.heroTitle}>Езикова работилница</h2>
        <p className={styles.heroSub}>
          Синоними и омоними, правопис, глаголни времена, причастия и части на изречението.
        </p>
      </div>
      {banner ? <p className={styles.banner}>{banner}</p> : null}
      {cleared.length >= BEL6_MODES.length ? (
        <p className={styles.bannerWin}>Премина всички мини-игри!</p>
      ) : null}
      <div className={styles.menuGrid}>
        {BEL6_MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            className={`${styles.menuCard} ${cleared.includes(m.id) ? styles.menuDone : ""}`}
            style={{ "--tone": m.tone }}
            onClick={() => {
              setBanner(null);
              setMode(m.id);
            }}
          >
            <span className={styles.menuTitle}>{m.title}</span>
            <span className={styles.menuDesc}>{m.description}</span>
            {cleared.includes(m.id) ? <span className={styles.menuBadge}>✓</span> : null}
          </button>
        ))}
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
