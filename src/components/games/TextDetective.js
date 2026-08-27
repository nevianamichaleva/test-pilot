"use client";

import Link from "next/link";
import { useState } from "react";

import {
  TEXT_DETECTIVE_CASES,
  TEXT_DETECTIVE_LIVES,
  TEXT_DETECTIVE_PASSAGE,
} from "@/data/english-text-detective";

import styles from "./TextDetective.module.css";

/**
 * @param {{ exitHref?: string }} props
 */
export default function TextDetective({ exitHref = "/igri" }) {
  const [phase, setPhase] = useState("intro"); // intro | play | won | lost
  const [caseIndex, setCaseIndex] = useState(0);
  const [step, setStep] = useState("answer"); // answer | prove
  const [picked, setPicked] = useState(null); // true | false
  const [markedId, setMarkedId] = useState(null);
  const [lives, setLives] = useState(TEXT_DETECTIVE_LIVES);
  const [toast, setToast] = useState("");
  const [toastKind, setToastKind] = useState("info"); // info | ok | bad
  const [pulsePara, setPulsePara] = useState(null);
  const [flashSentence, setFlashSentence] = useState(null); // { id, ok }
  const [firstTryScore, setFirstTryScore] = useState(0);
  const [answerFirstTry, setAnswerFirstTry] = useState(true);

  const caseData = TEXT_DETECTIVE_CASES[caseIndex];
  const total = TEXT_DETECTIVE_CASES.length;

  const startCase = (idx, nextLives = lives, score = firstTryScore) => {
    setCaseIndex(idx);
    setStep("answer");
    setPicked(null);
    setMarkedId(null);
    setToast("");
    setToastKind("info");
    setPulsePara(null);
    setFlashSentence(null);
    setAnswerFirstTry(true);
    setLives(nextLives);
    setFirstTryScore(score);
    setPhase("play");
  };

  const startGame = () => {
    startCase(0, TEXT_DETECTIVE_LIVES, 0);
  };

  const showToast = (msg, kind = "info") => {
    setToast(msg);
    setToastKind(kind);
  };

  const loseLife = (nextLives) => {
    setLives(nextLives);
    if (nextLives <= 0) {
      setTimeout(() => setPhase("lost"), 900);
      return true;
    }
    return false;
  };

  const pickAnswer = (value) => {
    if (phase !== "play" || step !== "answer" || picked !== null) return;
    setPicked(value);

    if (value !== caseData.answer) {
      setAnswerFirstTry(false);
      const nextLives = lives - 1;
      showToast("Не точно. Прочети текста пак и опитай!", "bad");
      setFlashSentence(null);
      if (loseLife(nextLives)) return;
      setTimeout(() => {
        setPicked(null);
        setToast("");
      }, 1400);
      return;
    }

    showToast("Добре! Сега маркирай изречението, което доказва отговора.", "ok");
    setStep("prove");
  };

  const markSentence = (sentenceId) => {
    if (phase !== "play" || step !== "prove") return;
    setMarkedId(sentenceId);

    if (sentenceId === caseData.evidenceId) {
      setFlashSentence({ id: sentenceId, ok: true });
      setPulsePara(null);
      const nextScore = firstTryScore + (answerFirstTry ? 1 : 0);
      showToast(`✅ ${caseData.tip}`, "ok");
      setTimeout(() => {
        if (caseIndex + 1 >= total) {
          setFirstTryScore(nextScore);
          setPhase("won");
        } else {
          startCase(caseIndex + 1, lives, nextScore);
        }
      }, 1800);
      return;
    }

    setFlashSentence({ id: sentenceId, ok: false });
    setPulsePara(caseData.paragraphId);
    setAnswerFirstTry(false);
    const nextLives = lives - 1;
    showToast(caseData.wrongMarkTip || "Хмм, виж пак този абзац!", "bad");
    if (loseLife(nextLives)) return;
    setTimeout(() => {
      setMarkedId(null);
      setFlashSentence(null);
      setPulsePara(null);
    }, 1600);
  };

  if (phase === "intro") {
    return (
      <div className={styles.shell}>
        <div className={styles.intro}>
          <p className={styles.badge}>Diagnostic · Въпроси 16–20</p>
          <h2 className={styles.introTitle}>Text Detective</h2>
          <p className={styles.introSub}>Текст детектив · True / False + доказателство</p>
          <p className={styles.introText}>
            Отговори с <strong>True</strong> или <strong>False</strong>, после{" "}
            <strong>маркирай изречението</strong> в текста, което доказва отговора. Така няма
            да пропуснеш детайли като <em>weekend = Saturdays and Sundays</em>.
          </p>
          <ul className={styles.bullets}>
            <li>{total} дела по разказа „An Unusual Hobby“</li>
            <li>{TEXT_DETECTIVE_LIVES} живота</li>
            <li>Грешно изречение → „Хмм, виж пак този абзац!“</li>
          </ul>
          <button type="button" className={styles.primaryBtn} onClick={startGame}>
            Започни разследването
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
            {phase === "won" ? "Делото е разкрито!" : "Доказателството избяга…"}
          </h2>
          <p className={styles.resultMsg}>
            {phase === "won"
              ? `Верни от първи опит: ${firstTryScore} от ${total}. Weekend = събота и неделя – запомнено!`
              : "Прочети изречението бавно и търси ключовата дума. Опитай пак!"}
          </p>
          <div className={styles.actionRow}>
            <button type="button" className={styles.primaryBtn} onClick={startGame}>
              Ново разследване
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
          {"♡".repeat(Math.max(TEXT_DETECTIVE_LIVES - lives, 0))}
        </div>
        <div className={styles.roundLabel}>
          Дело {caseIndex + 1}/{total}
        </div>
        <Link href={exitHref} className={styles.exitLink}>
          ← Изход
        </Link>
      </div>

      <article className={styles.passage} lang="en">
        <h3 className={styles.passageTitle}>{TEXT_DETECTIVE_PASSAGE.title}</h3>
        {TEXT_DETECTIVE_PASSAGE.paragraphs.map((p) => (
          <p
            key={p.id}
            className={[
              styles.para,
              pulsePara === p.id ? styles.paraPulse : "",
              step === "prove" ? styles.paraProve : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {p.sentences.map((s) => {
              const flash = flashSentence?.id === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  className={[
                    styles.sentence,
                    step === "prove" ? styles.sentenceClickable : "",
                    markedId === s.id ? styles.sentenceMarked : "",
                    flash && flashSentence.ok ? styles.sentenceOk : "",
                    flash && !flashSentence.ok ? styles.sentenceBad : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  disabled={step !== "prove"}
                  onClick={() => markSentence(s.id)}
                >
                  {s.text}{" "}
                </button>
              );
            })}
          </p>
        ))}
      </article>

      <div className={styles.caseCard}>
        <p className={styles.question} lang="en">
          {caseData.question}
        </p>
        <p className={styles.stepHint}>
          {step === "answer"
            ? "Стъпка 1: True или False?"
            : "Стъпка 2: Маркирай изречението-доказателство"}
        </p>

        <div className={styles.tfRow} role="group" aria-label="True или False">
          <button
            type="button"
            className={[
              styles.tfBtn,
              styles.tfTrue,
              picked === true ? styles.tfPicked : "",
              picked === true && caseData.answer === true && step === "prove"
                ? styles.tfOk
                : "",
              picked === true && caseData.answer !== true ? styles.tfBad : "",
            ]
              .filter(Boolean)
              .join(" ")}
            disabled={step !== "answer" || picked !== null}
            onClick={() => pickAnswer(true)}
          >
            True
          </button>
          <button
            type="button"
            className={[
              styles.tfBtn,
              styles.tfFalse,
              picked === false ? styles.tfPicked : "",
              picked === false && caseData.answer === false && step === "prove"
                ? styles.tfOk
                : "",
              picked === false && caseData.answer !== false ? styles.tfBad : "",
            ]
              .filter(Boolean)
              .join(" ")}
            disabled={step !== "answer" || picked !== null}
            onClick={() => pickAnswer(false)}
          >
            False
          </button>
        </div>
      </div>

      {toast ? (
        <p
          className={
            toastKind === "ok"
              ? styles.toastOk
              : toastKind === "bad"
                ? styles.toastBad
                : styles.toast
          }
          role="status"
        >
          {toast}
        </p>
      ) : (
        <p className={styles.toastSpacer} />
      )}
    </div>
  );
}
