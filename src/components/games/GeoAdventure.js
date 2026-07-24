"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  CONTINENTS,
  CYRILLIC_ALPHABET,
  GEO_ADVENTURE_6_DATA,
  GEO_ADVENTURE_6_MODES,
} from "@/data/geografia-6-games";

import styles from "./GeoAdventure.module.css";

function shuffleArray(items) {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function scrambleWord(word) {
  let result = word;
  let guard = 0;
  while (result === word && guard < 20) {
    result = shuffleArray(word.split("")).join("");
    guard += 1;
  }
  return result;
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

/**
 * @param {{ initialMode?: string | null, exitHref?: string }} props
 */
export default function GeoAdventure({ initialMode = null, exitHref = "/igri" }) {
  const lockedMode = Boolean(initialMode);
  const [mode, setMode] = useState(null);
  const [result, setResult] = useState(null);
  const startedRef = useRef(false);

  const [hangmanItem, setHangmanItem] = useState(null);
  const [guessed, setGuessed] = useState([]);
  const [lives, setLives] = useState(5);
  const [disabledLetters, setDisabledLetters] = useState([]);

  const [scrambleIndex, setScrambleIndex] = useState(0);
  const [scrambled, setScrambled] = useState("");
  const [scrambleInput, setScrambleInput] = useState("");
  const [usedTileIdx, setUsedTileIdx] = useState([]);
  const [scrambleShake, setScrambleShake] = useState(false);

  const [sortIndex, setSortIndex] = useState(0);
  const [wrongContinent, setWrongContinent] = useState(null);

  const [oddIndex, setOddIndex] = useState(0);
  const [wrongOdd, setWrongOdd] = useState(null);

  const [matchSelectedTerm, setMatchSelectedTerm] = useState(null);
  const [matchSelectedDef, setMatchSelectedDef] = useState(null);
  const [matchedTerms, setMatchedTerms] = useState([]);
  const [matchDefs, setMatchDefs] = useState([]);

  const resetToMenu = () => {
    if (lockedMode) return;
    setMode(null);
    setResult(null);
  };

  const endGame = (success, message) => {
    setResult({ success, message });
  };

  const loadScramble = (idx) => {
    const item = GEO_ADVENTURE_6_DATA.scramble[idx];
    if (!item) {
      endGame(true, "Браво! Подреди всички разбъркани географски обекти!");
      return;
    }
    setScrambled(scrambleWord(item.word));
    setScrambleInput("");
    setUsedTileIdx([]);
  };

  const startHangman = () => {
    const item = pickRandom(GEO_ADVENTURE_6_DATA.hangman);
    setHangmanItem(item);
    setGuessed([]);
    setLives(5);
    setDisabledLetters([]);
    setMode("hangman");
    setResult(null);
  };

  const startScramble = () => {
    setScrambleIndex(0);
    loadScramble(0);
    setMode("scramble");
    setResult(null);
  };

  const startSort = () => {
    setSortIndex(0);
    setWrongContinent(null);
    setMode("sort");
    setResult(null);
  };

  const startOdd = () => {
    setOddIndex(0);
    setWrongOdd(null);
    setMode("odd_one");
    setResult(null);
  };

  const startMatch = () => {
    setMatchedTerms([]);
    setMatchSelectedTerm(null);
    setMatchSelectedDef(null);
    setMatchDefs(shuffleArray(GEO_ADVENTURE_6_DATA.match));
    setMode("match");
    setResult(null);
  };

  const startGame = (id) => {
    if (id === "hangman") startHangman();
    else if (id === "scramble") startScramble();
    else if (id === "sort") startSort();
    else if (id === "odd_one") startOdd();
    else if (id === "match") startMatch();
  };

  useEffect(() => {
    if (!initialMode || startedRef.current) return;
    startedRef.current = true;
    startGame(initialMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMode]);

  const backControl = lockedMode ? (
    <Link href={exitHref} className={styles.backLink}>
      ← Към игрите
    </Link>
  ) : (
    <button type="button" className={styles.backLink} onClick={resetToMenu}>
      ← Меню
    </button>
  );

  const handleGuess = (letter) => {
    if (!hangmanItem || disabledLetters.includes(letter) || result) return;
    setDisabledLetters((prev) => [...prev, letter]);
    if (hangmanItem.word.includes(letter)) {
      const nextGuessed = [...guessed, letter];
      setGuessed(nextGuessed);
      const won = hangmanItem.word.split("").every((ch) => nextGuessed.includes(ch));
      if (won) endGame(true, "Позна успешно думата!");
    } else {
      const nextLives = lives - 1;
      setLives(nextLives);
      if (nextLives <= 0) endGame(false, hangmanItem.word);
    }
  };

  const hangmanDisplay = useMemo(() => {
    if (!hangmanItem) return "";
    return hangmanItem.word
      .split("")
      .map((ch) => (guessed.includes(ch) ? ch : "_"))
      .join(" ");
  }, [hangmanItem, guessed]);

  const addScrambleLetter = (letter, idx) => {
    if (usedTileIdx.includes(idx)) return;
    setScrambleInput((v) => v + letter);
    setUsedTileIdx((prev) => [...prev, idx]);
  };

  const clearScramble = () => {
    setScrambleInput("");
    setUsedTileIdx([]);
  };

  const checkScramble = () => {
    const item = GEO_ADVENTURE_6_DATA.scramble[scrambleIndex];
    if (!item) return;
    if (scrambleInput.toUpperCase().trim() === item.word) {
      const next = scrambleIndex + 1;
      setScrambleIndex(next);
      loadScramble(next);
    } else {
      setScrambleShake(true);
      setTimeout(() => setScrambleShake(false), 700);
    }
  };

  const pickContinent = (continent) => {
    const item = GEO_ADVENTURE_6_DATA.sort[sortIndex];
    if (!item) return;
    if (continent === item.continent) {
      const next = sortIndex + 1;
      if (next >= GEO_ADVENTURE_6_DATA.sort.length) {
        endGame(true, "Отлично! Сортира всички географски обекти правилно!");
        return;
      }
      setSortIndex(next);
      setWrongContinent(null);
    } else {
      setWrongContinent(continent);
      setTimeout(() => setWrongContinent(null), 500);
    }
  };

  const pickOdd = (opt) => {
    const item = GEO_ADVENTURE_6_DATA.oddOne[oddIndex];
    if (!item) return;
    if (opt === item.correct) {
      const next = oddIndex + 1;
      if (next >= GEO_ADVENTURE_6_DATA.oddOne.length) {
        endGame(true, "Страхотно! Откри всички излишни думи!");
        return;
      }
      setOddIndex(next);
      setWrongOdd(null);
    } else {
      setWrongOdd(opt);
      setTimeout(() => setWrongOdd(null), 500);
    }
  };

  const selectMatch = (type, value) => {
    let term = matchSelectedTerm;
    let def = matchSelectedDef;
    if (type === "term") {
      term = value;
      setMatchSelectedTerm(value);
    } else {
      def = value;
      setMatchSelectedDef(value);
    }
    if (!term || !def) return;

    if (term === def.term) {
      const nextMatched = [...matchedTerms, term];
      setMatchedTerms(nextMatched);
      setMatchSelectedTerm(null);
      setMatchSelectedDef(null);
      if (nextMatched.length >= GEO_ADVENTURE_6_DATA.match.length) {
        setTimeout(() => {
          endGame(true, "Браво! Свърза всички понятия с техните дефиниции!");
        }, 280);
      }
    } else {
      setTimeout(() => {
        setMatchSelectedTerm(null);
        setMatchSelectedDef(null);
      }, 400);
    }
  };

  if (result) {
    return (
      <div className={styles.shell}>
        <div className={styles.result}>
          <h2 className={result.success ? styles.resultOk : styles.resultBad}>
            {result.success ? "Поздравления!" : "Опитай пак!"}
          </h2>
          <p className={styles.resultMsg}>
            {result.success
              ? result.message
              : `Търсената дума беше: ${result.message}`}
          </p>
          <div className={styles.actionRow}>
            <button
              type="button"
              className={styles.primaryTeal}
              onClick={() => startGame(lockedMode ? initialMode : mode || initialMode)}
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

  if (!mode) {
    if (lockedMode) {
      return (
        <div className={styles.shell}>
          <p className={styles.footnote}>Зареждане на играта…</p>
        </div>
      );
    }
    return (
      <div className={styles.shell}>
        <h2 className={styles.menuTitle}>Избери тип игра</h2>
        <div className={styles.modeGrid}>
          {GEO_ADVENTURE_6_MODES.map((m) => (
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
        <p className={styles.footnote}>По учебната програма по география за 6. клас</p>
      </div>
    );
  }

  if (mode === "hangman" && hangmanItem) {
    return (
      <div className={styles.shell}>
        <div className={styles.topBar}>
          {backControl}
          <div className={styles.lives}>Опити: {"♥".repeat(Math.max(lives, 0))}</div>
        </div>
        <div className={`${styles.hint} ${styles.hintBlue}`}>Подсказка: {hangmanItem.hint}</div>
        <div className={styles.wordDisplay}>{hangmanDisplay}</div>
        <div className={styles.keyboard}>
          {CYRILLIC_ALPHABET.map((letter) => {
            const used = disabledLetters.includes(letter);
            const correct = used && hangmanItem.word.includes(letter);
            const wrong = used && !hangmanItem.word.includes(letter);
            return (
              <button
                key={letter}
                type="button"
                disabled={used}
                className={[
                  styles.key,
                  correct ? styles.keyOk : "",
                  wrong ? styles.keyBad : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => handleGuess(letter)}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (mode === "scramble") {
    const item = GEO_ADVENTURE_6_DATA.scramble[scrambleIndex];
    if (!item) return null;
    return (
      <div className={styles.shell}>
        <div className={styles.topBar}>
          {backControl}
          <div className={styles.progressTeal}>
            Ниво: {scrambleIndex + 1} / {GEO_ADVENTURE_6_DATA.scramble.length}
          </div>
        </div>
        <div className={`${styles.hint} ${styles.hintTeal}`}>Въпрос: {item.hint}</div>
        <p className={styles.label}>Разбъркани букви</p>
        <div className={styles.scrambledBox}>{scrambled}</div>
        <div className={styles.tiles}>
          {scrambled.split("").map((letter, idx) => (
            <button
              key={`${letter}-${idx}`}
              type="button"
              disabled={usedTileIdx.includes(idx)}
              className={styles.tile}
              onClick={() => addScrambleLetter(letter, idx)}
            >
              {letter}
            </button>
          ))}
        </div>
        <input
          className={`${styles.input} ${scrambleShake ? styles.inputShake : ""}`}
          value={scrambleInput}
          onChange={(e) => setScrambleInput(e.target.value.toUpperCase())}
          onKeyDown={(e) => {
            if (e.key === "Enter") checkScramble();
          }}
          placeholder="Твоят отговор..."
          autoComplete="off"
          spellCheck={false}
        />
        <div className={styles.actionRow}>
          <button type="button" className={styles.secondaryBtn} onClick={clearScramble}>
            Изчисти
          </button>
          <button type="button" className={styles.primaryTeal} onClick={checkScramble}>
            Провери
          </button>
        </div>
      </div>
    );
  }

  if (mode === "sort") {
    const item = GEO_ADVENTURE_6_DATA.sort[sortIndex];
    if (!item) return null;
    return (
      <div className={styles.shell}>
        <div className={styles.topBar}>
          {backControl}
          <div className={styles.progressAmber}>
            Прогрес: {sortIndex + 1}/{GEO_ADVENTURE_6_DATA.sort.length}
          </div>
        </div>
        <p className={styles.label}>На кой континент се намира обектът?</p>
        <div className={styles.sortTarget}>{item.item}</div>
        <div className={styles.continentGrid}>
          {CONTINENTS.map((c) => (
            <button
              key={c}
              type="button"
              className={`${styles.continentBtn} ${wrongContinent === c ? styles.flashBad : ""}`}
              onClick={() => pickContinent(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (mode === "odd_one") {
    const item = GEO_ADVENTURE_6_DATA.oddOne[oddIndex];
    if (!item) return null;
    return (
      <div className={styles.shell}>
        <div className={styles.topBar}>
          {backControl}
          <div className={styles.progressPurple}>
            Въпрос: {oddIndex + 1}/{GEO_ADVENTURE_6_DATA.oddOne.length}
          </div>
        </div>
        <div className={`${styles.hint} ${styles.hintPurple}`}>{item.q}</div>
        <div className={styles.oddGrid}>
          {item.options.map((opt) => (
            <button
              key={opt}
              type="button"
              className={`${styles.oddBtn} ${wrongOdd === opt ? styles.flashBad : ""}`}
              onClick={() => pickOdd(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (mode === "match") {
    return (
      <div className={styles.shell}>
        <div className={styles.topBar}>
          {backControl}
          <div className={styles.progressRose}>Свържи понятията с дефинициите</div>
        </div>
        <div className={styles.matchGrid}>
          <div className={styles.matchCol}>
            {GEO_ADVENTURE_6_DATA.match.map((item) => {
              if (matchedTerms.includes(item.term)) return null;
              const selected = matchSelectedTerm === item.term;
              return (
                <button
                  key={item.term}
                  type="button"
                  className={`${styles.matchBtn} ${selected ? styles.matchSelected : ""}`}
                  onClick={() => selectMatch("term", item.term)}
                >
                  {item.term}
                </button>
              );
            })}
          </div>
          <div className={styles.matchCol}>
            {matchDefs.map((item) => {
              if (matchedTerms.includes(item.term)) return null;
              const selected = matchSelectedDef?.term === item.term;
              return (
                <button
                  key={item.term}
                  type="button"
                  className={`${styles.matchBtn} ${styles.matchDef} ${selected ? styles.matchSelected : ""}`}
                  onClick={() => selectMatch("def", item)}
                >
                  {item.def}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
