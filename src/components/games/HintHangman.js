"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  ALPHABET,
  HINT_HANGMAN_LIVES,
  HINT_HANGMAN_ROUNDS,
  HINT_HANGMAN_START_COINS,
  VOWEL_COST,
  VOWELS,
  isVowel,
} from "@/data/english-hint-hangman";

import styles from "./HintHangman.module.css";

/**
 * @param {{ exitHref?: string }} props
 */
export default function HintHangman({ exitHref = "/igri" }) {
  const [phase, setPhase] = useState("intro"); // intro | play | won | lost
  const [roundIndex, setRoundIndex] = useState(0);
  const [guessed, setGuessed] = useState(() => new Set());
  const [lives, setLives] = useState(HINT_HANGMAN_LIVES);
  const [coins, setCoins] = useState(HINT_HANGMAN_START_COINS);
  const [buyingVowel, setBuyingVowel] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const [toast, setToast] = useState("");
  const [solvedCount, setSolvedCount] = useState(0);

  const round = HINT_HANGMAN_ROUNDS[roundIndex];
  const total = HINT_HANGMAN_ROUNDS.length;
  const word = round?.word?.toLowerCase() ?? "";

  const startRound = (idx, nextLives, nextCoins, solved) => {
    const r = HINT_HANGMAN_ROUNDS[idx];
    const first = r.word[0].toLowerCase();
    setRoundIndex(idx);
    setGuessed(new Set([first]));
    setBuyingVowel(false);
    setShowIcon(false);
    setToast("");
    setLives(nextLives);
    setCoins(nextCoins);
    setSolvedCount(solved);
    setPhase("play");
  };

  const startGame = () => {
    startRound(0, HINT_HANGMAN_LIVES, HINT_HANGMAN_START_COINS, 0);
  };

  const displayLetters = useMemo(() => {
    return word.split("").map((ch) => (guessed.has(ch) ? ch : "_"));
  }, [word, guessed]);

  const isSolved = word.length > 0 && word.split("").every((ch) => guessed.has(ch));

  const flashToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2400);
  };

  const finishIfSolved = (nextGuessed, nextLives, nextCoins) => {
    const done = word.split("").every((ch) => nextGuessed.has(ch));
    if (!done) return false;
    const rewarded = nextCoins + 1;
    const nextSolved = solvedCount + 1;
    flashToast(`Браво! ${round.word}  (+1⭐)`);
    setTimeout(() => {
      if (roundIndex + 1 >= total) {
        setSolvedCount(nextSolved);
        setCoins(rewarded);
        setPhase("won");
      } else {
        startRound(roundIndex + 1, nextLives, rewarded, nextSolved);
      }
    }, 1100);
    return true;
  };

  const guessLetter = (raw) => {
    if (phase !== "play" || isSolved) return;
    const letter = raw.toLowerCase();
    if (guessed.has(letter)) return;

    if (isVowel(letter)) {
      if (!buyingVowel) {
        flashToast("Гласните се купуват с ⭐ – натисни „Купи гласна“.");
        return;
      }
      if (coins < VOWEL_COST) {
        flashToast("Нямаш достатъчно звезди.");
        setBuyingVowel(false);
        return;
      }
      const nextCoins = coins - VOWEL_COST;
      setCoins(nextCoins);
      setBuyingVowel(false);
      const next = new Set(guessed);
      next.add(letter);
      setGuessed(next);
      if (word.includes(letter)) {
        if (!finishIfSolved(next, lives, nextCoins)) {
          flashToast(`Купено: ${letter.toUpperCase()}`);
        }
      } else {
        flashToast(`Няма „${letter}“ в думата – звездата е похарчена.`);
      }
      return;
    }

    const next = new Set(guessed);
    next.add(letter);
    setGuessed(next);

    if (word.includes(letter)) {
      finishIfSolved(next, lives, coins);
      return;
    }

    const nextLives = lives - 1;
    setLives(nextLives);
    flashToast(`Няма „${letter}“. Остават ${nextLives} опита.`);
    if (nextLives <= 0) {
      setTimeout(() => setPhase("lost"), 900);
    }
  };

  const sentenceShown = round?.sentence.replace("_____", "……") ?? "";

  if (phase === "intro") {
    return (
      <div className={styles.shell}>
        <div className={styles.intro}>
          <p className={styles.badge}>Diagnostic · Въпроси 11–15</p>
          <h2 className={styles.introTitle}>Hint Hangman</h2>
          <p className={styles.introSub}>Бесеница с подсказка · Колелото на думите</p>
          <p className={styles.introText}>
            Не гледаш празен лист. Имаш <strong>изречение-контекст</strong>, първата буква е
            вече там. Можеш да <strong>купиш гласни</strong> или да видиш{" "}
            <strong>иконка</strong> (напр. Пинокио за <em>honest</em>) – за да не се отказваш
            при дълги думи като <em>individual</em> и <em>pyjamas</em>.
          </p>
          <ul className={styles.bullets}>
            <li>{total} думи от диагностичния тест</li>
            <li>
              {HINT_HANGMAN_LIVES} живота · {HINT_HANGMAN_START_COINS}⭐ за гласни
            </li>
            <li>Всеки решен рунд дава +1⭐</li>
          </ul>
          <button type="button" className={styles.primaryBtn} onClick={startGame}>
            Завърти колелото
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
            {phase === "won" ? "Всички думи са разкрити!" : "Думата остана скрита…"}
          </h2>
          <p className={styles.resultMsg}>
            {phase === "won"
              ? `Решени ${Math.max(solvedCount, total)} от ${total}. housework ≠ homework – вече го знаеш!`
              : `Думата беше „${round.word}“. ${round.tip} Опитай пак с гласни и иконка!`}
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
          {"♡".repeat(Math.max(HINT_HANGMAN_LIVES - lives, 0))}
        </div>
        <div className={styles.coins} aria-label={`Звезди: ${coins}`}>
          {coins > 0 ? "⭐".repeat(coins) : <span className={styles.coinsEmpty}>0⭐</span>}
        </div>
        <div className={styles.roundLabel}>
          Дума {roundIndex + 1}/{total}
        </div>
        <Link href={exitHref} className={styles.exitLink}>
          ← Изход
        </Link>
      </div>

      <div className={styles.stage}>
        <HangmanFigure misses={HINT_HANGMAN_LIVES - lives} />
        <p className={styles.sentence} lang="en">
          {sentenceShown}
        </p>
      </div>

      <div className={styles.wordDisplay} aria-label="Скрита дума">
        {displayLetters.map((ch, i) => (
          <span key={i} className={ch === "_" ? styles.boxEmpty : styles.boxFilled}>
            {ch === "_" ? "" : ch}
          </span>
        ))}
      </div>

      <div className={styles.tools}>
        <button
          type="button"
          className={[styles.toolBtn, buyingVowel ? styles.toolActive : ""]
            .filter(Boolean)
            .join(" ")}
          disabled={coins < VOWEL_COST || isSolved}
          onClick={() => {
            if (coins < VOWEL_COST) return;
            setBuyingVowel((v) => !v);
            flashToast(
              buyingVowel
                ? "Отказ от покупка."
                : `Избери гласна (${VOWEL_COST}⭐): ${VOWELS.join(", ").toUpperCase()}`
            );
          }}
        >
          Купи гласна ({VOWEL_COST}⭐)
        </button>
        <button
          type="button"
          className={[styles.toolBtn, showIcon ? styles.toolActive : ""]
            .filter(Boolean)
            .join(" ")}
          onClick={() => {
            setShowIcon((v) => !v);
            if (!showIcon) flashToast(round.tip);
          }}
        >
          {showIcon ? "Скрий иконката" : "Виж иконка-подсказка"}
        </button>
      </div>

      {showIcon ? (
        <div className={styles.iconHint}>
          <span className={styles.iconEmoji} aria-hidden>
            {round.icon}
          </span>
          <div>
            <p className={styles.iconLabel}>{round.iconLabel}</p>
            <p className={styles.iconTip}>{round.tip}</p>
          </div>
        </div>
      ) : (
        <div className={styles.iconHintSpacer} />
      )}

      {toast ? (
        <p className={styles.toast} role="status">
          {toast}
        </p>
      ) : (
        <p className={styles.toastSpacer} />
      )}

      <div
        className={[styles.keyboard, buyingVowel ? styles.keyboardBuy : ""]
          .filter(Boolean)
          .join(" ")}
        role="group"
        aria-label="Клавиатура"
      >
        {ALPHABET.map((letter) => {
          const used = guessed.has(letter);
          const inWord = word.includes(letter);
          const vowel = isVowel(letter);
          const lockedVowel = vowel && !buyingVowel && !used;
          const disabled =
            used || isSolved || (vowel && !buyingVowel) || (buyingVowel && !vowel);
          return (
            <button
              key={letter}
              type="button"
              disabled={disabled}
              className={[
                styles.key,
                vowel ? styles.keyVowel : "",
                lockedVowel ? styles.keyLocked : "",
                buyingVowel && vowel ? styles.keyBuyable : "",
                used && inWord ? styles.keyOk : "",
                used && !inWord ? styles.keyBad : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => guessLetter(letter)}
            >
              {letter}
            </button>
          );
        })}
      </div>

      <p className={styles.footerHint}>
        {buyingVowel
          ? "Режим покупка: кликни гласна (a e i o u)."
          : "Познай съгласна или купи гласна. Първата буква вече свети."}
      </p>
    </div>
  );
}

function HangmanFigure({ misses }) {
  const stage = Math.min(Math.max(misses, 0), 6);
  return (
    <div className={styles.figure} aria-hidden>
      <svg viewBox="0 0 120 140" className={styles.figureSvg}>
        <line x1="20" y1="130" x2="100" y2="130" className={styles.figStroke} />
        <line x1="40" y1="130" x2="40" y2="20" className={styles.figStroke} />
        <line x1="40" y1="20" x2="85" y2="20" className={styles.figStroke} />
        <line x1="85" y1="20" x2="85" y2="36" className={styles.figStroke} />
        {stage >= 1 ? <circle cx="85" cy="48" r="12" className={styles.figStroke} /> : null}
        {stage >= 2 ? (
          <line x1="85" y1="60" x2="85" y2="92" className={styles.figStroke} />
        ) : null}
        {stage >= 3 ? (
          <line x1="85" y1="70" x2="68" y2="84" className={styles.figStroke} />
        ) : null}
        {stage >= 4 ? (
          <line x1="85" y1="70" x2="102" y2="84" className={styles.figStroke} />
        ) : null}
        {stage >= 5 ? (
          <line x1="85" y1="92" x2="70" y2="114" className={styles.figStroke} />
        ) : null}
        {stage >= 6 ? (
          <line x1="85" y1="92" x2="100" y2="114" className={styles.figStroke} />
        ) : null}
      </svg>
    </div>
  );
}
