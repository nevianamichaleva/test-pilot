"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import GameNameGate from "@/components/games/GameNameGate";
import GameResultSummary from "@/components/games/GameResultSummary";
import useSaveGameResultOnEnd from "@/hooks/useSaveGameResultOnEnd";
import { buildGamePointsLabel } from "@/lib/saveGameResult";

import styles from "./GamePlay.module.css";

function mulberry32(a) {
  let t = a >>> 0;
  return function next() {
    t += 0x6d2b79f5;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleArray(items, seed) {
  const rng = mulberry32(seed >>> 0);
  const a = [...items];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getOptions(q) {
  return [q.correct, q.wrong1, q.wrong2, q.wrong3].filter(
    (x) => typeof x === "string" && x.trim()
  );
}

export default function GamePlay({ game }) {
  const questions = Array.isArray(game.questions) ? game.questions : [];
  const [phase, setPhase] = useState("name"); // name | play | done
  const [participantName, setParticipantName] = useState("");
  const [session, setSession] = useState(1);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null);
  const [questionResults, setQuestionResults] = useState([]);

  const options = useMemo(() => {
    const q = questions[index];
    if (!q) return [];
    const raw = getOptions(q);
    return shuffleArray(raw, (session * 1000 + index * 17) >>> 0);
  }, [questions, index, session]);

  const current = questions[index];
  const total = questions.length;
  const done = phase === "done";

  useSaveGameResultOnEnd(done, () => ({
    game,
    questionResults,
    correct: score,
    total,
    completed: true,
    won: true,
    name: participantName,
  }));

  const beginWithName = (name) => {
    setParticipantName(name);
    setSession((s) => s + 1);
    setIndex(0);
    setScore(0);
    setPicked(null);
    setQuestionResults([]);
    setPhase("play");
  };

  const select = (value) => {
    if (picked || !current) return;
    setPicked(value);
    const ok = value === current.correct;
    if (ok) setScore((s) => s + 1);
    setQuestionResults((prev) => [
      ...prev,
      {
        questionNumber: index + 1,
        questionText: current.q || `Въпрос ${index + 1}`,
        firstAnswer: value,
        correctAnswer: current.correct,
        isCorrect: ok,
        status: ok ? "correct" : "wrong",
      },
    ]);
  };

  const next = () => {
    if (index + 1 >= total) {
      setPhase("done");
      return;
    }
    setIndex((i) => i + 1);
    setPicked(null);
  };

  const restart = () => {
    setSession((s) => s + 1);
    setIndex(0);
    setScore(0);
    setPicked(null);
    setQuestionResults([]);
    setPhase("play");
  };

  if (!total) {
    return (
      <div className={styles.panel}>
        <p>Тази игра още няма въпроси.</p>
        <Link href="/igri" className={styles.secondaryBtn}>
          Назад към игрите
        </Link>
      </div>
    );
  }

  if (phase === "name") {
    return (
      <div className={styles.panel}>
        <p className={styles.doneTitle}>{game.title || "Игра"}</p>
        <p className={styles.doneScore}>
          {total} въпроса · попълни името, за да започнеш
        </p>
        <GameNameGate
          inputId={`gameplay-name-${game.slug || "quiz"}`}
          buttonLabel="Започни играта"
          onStart={beginWithName}
        />
      </div>
    );
  }

  if (done) {
    return (
      <div className={styles.panel}>
        <p className={styles.doneTitle}>Край на играта</p>
        {participantName ? (
          <p className={styles.doneScore}>
            Участник: <strong>{participantName}</strong>
          </p>
        ) : null}
        <p className={styles.doneScore}>
          Резултат: <strong>{buildGamePointsLabel(score, total)}</strong>
        </p>
        <GameResultSummary items={questionResults} />
        <div className={styles.doneActions}>
          <button type="button" className={styles.primaryBtn} onClick={restart}>
            Играй отново
          </button>
          <Link href="/igri" className={styles.secondaryBtn}>
            Към всички игри
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      <div className={styles.progress}>
        Въпрос {index + 1} от {total} · Верни: {score}
        {participantName ? ` · ${participantName}` : ""}
      </div>
      <p className={styles.question}>{current.q}</p>
      <div className={styles.options}>
        {options.map((opt) => {
          const isPicked = picked === opt;
          const isCorrect = picked && opt === current.correct;
          const isWrong = isPicked && opt !== current.correct;
          const cls = [
            styles.option,
            isCorrect ? styles.optionCorrect : "",
            isWrong ? styles.optionWrong : "",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <button
              key={opt}
              type="button"
              className={cls}
              disabled={Boolean(picked)}
              onClick={() => select(opt)}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {picked ? (
        <div className={styles.nextRow}>
          <button type="button" className={styles.primaryBtn} onClick={next}>
            {index + 1 >= total ? "Виж резултата" : "Следващ въпрос"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
