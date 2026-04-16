"use client";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import Link from "next/link";

import PageHero from "@/components/PageHero";
import { useEffect, useMemo, useRef, useState } from "react";

import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase";

import styles from "./Quiz.module.css";

function normalizeQuestions(questions) {
  if (!Array.isArray(questions)) return [];
  return questions.filter(Boolean);
}

function isTextQuestion(q) {
  return q?.type === "text";
}

function getQuestionText(q) {
  if (!q) return "—";
  return q.question ?? q.q ?? "—";
}

function normalizeOption(opt) {
  if (typeof opt === "string") return opt;
  return opt?.label ?? opt?.text ?? String(opt?.value ?? "");
}

function normalizeText(s) {
  return String(s ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function isGradableQuestion(q) {
  if (!q) return false;
  if (typeof q.correct !== "string") return false;
  if (isTextQuestion(q)) return true;
  return Array.isArray(q.options);
}

function isTextAnswerCorrect(q, answer) {
  const user = normalizeText(answer);
  if (!user) return false;

  const accepted = Array.isArray(q.acceptedAnswers) ? q.acceptedAnswers : [];
  const candidates = [q.correct, ...accepted].filter(Boolean).map(normalizeText);
  return candidates.some((c) => c && user === c);
}

function isMcAnswerCorrect(q, answer) {
  if (typeof q.correct !== "string") return false;
  return normalizeText(answer) === normalizeText(q.correct);
}

function gradeQuiz(qs, stepAnswers, sequence) {
  const seq = Array.isArray(sequence) && sequence.length ? sequence : buildInitialSequence(qs.length);

  let correct = 0;
  let gradable = 0;

  for (let i = 0; i < qs.length; i += 1) {
    const q = qs[i];
    if (!isGradableQuestion(q)) continue;
    gradable += 1;

    const firstTry = getFirstTryAnswerForQuestion(seq, stepAnswers, i);
    if (isTextQuestion(q)) {
      if (isTextAnswerCorrect(q, firstTry)) correct += 1;
      continue;
    }
    if (isMcAnswerCorrect(q, firstTry)) correct += 1;
  }

  const total = qs.length;
  const answered = seq.filter((s) => Boolean(stepAnswers.get(s.key))).length;
  const firstTryGradable = (() => {
        const seen = new Set();
        let n = 0;
        for (const s of seq) {
          if (s.isRetry) continue;
          if (!isGradableQuestion(qs[s.qIndex])) continue;
          if (seen.has(s.qIndex)) continue;
          seen.add(s.qIndex);
          n += 1;
        }
        return n;
      })();

  const firstTryCorrect = (() => {
        const seen = new Set();
        let n = 0;
        for (const s of seq) {
          if (s.isRetry) continue;
          if (!isGradableQuestion(qs[s.qIndex])) continue;
          if (seen.has(s.qIndex)) continue;
          seen.add(s.qIndex);

          const q = qs[s.qIndex];
          const a = stepAnswers.get(s.key);
          if (isTextQuestion(q)) n += isTextAnswerCorrect(q, a) ? 1 : 0;
          else n += isMcAnswerCorrect(q, a) ? 1 : 0;
        }
        return n;
      })();

  const pointsText =
    firstTryGradable > 0
      ? `${firstTryCorrect}/${firstTryGradable}`
      : gradable > 0
        ? `${correct}/${gradable}`
        : `${answered}/${total}`;

  const ratio = firstTryGradable > 0 ? firstTryCorrect / firstTryGradable : gradable > 0 ? correct / gradable : null;
  let assessment = "–";
  if (ratio !== null) {
    const percent = ratio * 100;
    if (percent >= 90) assessment = "6 (Отличен)";
    else if (percent >= 75) assessment = "5 (Много добър)";
    else if (percent >= 60) assessment = "4 (Добър)";
    else if (percent >= 50) assessment = "3 (Среден)";
    else if (percent >= 30) assessment = "2 (Слаб)";
    else assessment = "1 (Много слаб)";
  }

  return { correct, gradable, pointsText, assessment, ratio, firstTryCorrect, firstTryGradable };
}

function getFirstTryAnswerForQuestion(sequence, stepAnswers, qIndex) {
  if (!sequence) return undefined;
  for (const s of sequence) {
    if (s.isRetry) continue;
    if (s.qIndex !== qIndex) continue;
    return stepAnswers.get(s.key);
  }
  return undefined;
}

function judgeAnswer(q, answer) {
  if (!q) return { status: "unknown" };
  if (!isGradableQuestion(q)) return { status: "unknown" };

  if (isTextQuestion(q)) {
    const ok = isTextAnswerCorrect(q, answer);
    return { status: ok ? "correct" : "wrong" };
  }

  const ok = isMcAnswerCorrect(q, answer);
  return { status: ok ? "correct" : "wrong" };
}

function buildInitialSequence(total) {
  return Array.from({ length: total }, (_, i) => ({
    key: `o-${i}`,
    qIndex: i,
    isRetry: false,
  }));
}

export default function Quiz({
  title,
  questions,
  testId,
  testTitle,
  classNum,
  subject,
  subjectLabel,
}) {
  const qs = useMemo(() => normalizeQuestions(questions), [questions]);
  const [step, setStep] = useState(0);
  const [sequence, setSequence] = useState(() => buildInitialSequence(normalizeQuestions(questions).length));
  const [stepAnswers, setStepAnswers] = useState(() => new Map());
  const [locked, setLocked] = useState(() => new Map());
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [firebaseSaved, setFirebaseSaved] = useState(false);
  const [finishSummary, setFinishSummary] = useState(null);
  const [nameDraft, setNameDraft] = useState("");
  const [quizStarted, setQuizStarted] = useState(false);
  const [participantName, setParticipantName] = useState("");
  const submittedRef = useRef(false);
  const stepRef = useRef(0);

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  useEffect(() => {
    setStep(0);
    setSequence(buildInitialSequence(qs.length));
    setStepAnswers(new Map());
    setLocked(new Map());
    setDone(false);
    setSaving(false);
    setSaveError(null);
    setFirebaseSaved(false);
    setFinishSummary(null);
    setNameDraft("");
    setQuizStarted(false);
    setParticipantName("");
    submittedRef.current = false;
  }, [testId, questions, qs.length]);

  const total = qs.length;
  const seqLen = sequence.length;
  const currentStep = sequence[step];
  const qIndex = currentStep?.qIndex ?? 0;
  const current = qs[qIndex];

  const lockedCount = useMemo(() => {
    let n = 0;
    for (let s = 0; s < seqLen; s += 1) {
      const key = sequence[s]?.key;
      if (key && locked.get(key)) n += 1;
    }
    return n;
  }, [locked, seqLen, sequence]);

  const isLocked = Boolean(currentStep && locked.get(currentStep.key));

  const maybeScheduleRetry = (baseQIndex, wasWrong, isRetryStep) => {
    if (!wasWrong) return;
    if (isRetryStep) return;
    if (!isGradableQuestion(qs[baseQIndex])) return;

    setSequence((prev) => {
      if (prev.some((x) => x.isRetry && x.qIndex === baseQIndex)) return prev;

      const pos = stepRef.current + 3;
      const insertAt = Math.min(Math.max(pos, 0), prev.length);

      const retry = {
        key: `r-${baseQIndex}-${insertAt}-${Date.now()}`,
        qIndex: baseQIndex,
        isRetry: true,
      };

      const next = [...prev];
      next.splice(insertAt, 0, retry);
      return next;
    });
  };

  const select = (value) => {
    if (!current) return;
    if (!currentStep) return;
    if (locked.get(currentStep.key)) return;
    if (isTextQuestion(current)) return;

    const next = new Map(stepAnswers);
    next.set(currentStep.key, value);
    setStepAnswers(next);

    const lockNext = new Map(locked);
    lockNext.set(currentStep.key, true);
    setLocked(lockNext);

    const judgement = judgeAnswer(current, value);
    maybeScheduleRetry(qIndex, judgement.status === "wrong", currentStep.isRetry);
  };

  const setText = (value) => {
    if (!current) return;
    if (!currentStep) return;
    if (locked.get(currentStep.key)) return;
    const next = new Map(stepAnswers);
    next.set(currentStep.key, value);
    setStepAnswers(next);
  };

  const commitText = () => {
    if (!current) return;
    if (!currentStep) return;
    if (!isTextQuestion(current)) return;
    if (locked.get(currentStep.key)) return;

    const v = stepAnswers.get(currentStep.key);
    if (typeof v !== "string" || v.trim().length === 0) return;

    const lockNext = new Map(locked);
    lockNext.set(currentStep.key, true);
    setLocked(lockNext);

    const judgement = judgeAnswer(current, v);
    maybeScheduleRetry(qIndex, judgement.status === "wrong", currentStep.isRetry);
  };

  const next = () => setStep((v) => Math.min(v + 1, Math.max(seqLen - 1, 0)));
  const prev = () => setStep((v) => Math.max(v - 1, 0));

  const startQuiz = () => {
    const t = nameDraft.trim();
    if (!t) return;
    setParticipantName(t);
    setQuizStarted(true);
  };

  const finish = async () => {
    if (submittedRef.current) {
      setDone(true);
      return;
    }

    setSaving(true);
    setSaveError(null);
    setFirebaseSaved(false);

    try {
      const summaryAnswers = qs.map((q, i) => {
        const v = getFirstTryAnswerForQuestion(sequence, stepAnswers, i);
        if (isTextQuestion(q)) return typeof v === "string" ? v : "";
        return typeof v === "string" ? v : v == null ? "" : String(v);
      });

      const summary = gradeQuiz(qs, stepAnswers, sequence);
      const { pointsText, assessment } = summary;
      setFinishSummary(summary);

      let wrote = false;
      if (isFirebaseConfigured()) {
        const db = getFirebaseDb();
        if (!db) throw new Error("Firebase не е инициализиран (липсва конфигурация).");

        await addDoc(collection(db, "results"), {
          name: participantName.trim() || "Анонимен",
          points: pointsText,
          assessment,
          test: testId,
          testTitle: testTitle ?? title ?? "Тест",
          answers: summaryAnswers,
          correct: summary.firstTryCorrect ?? summary.correct,
          gradable: summary.firstTryGradable ?? summary.gradable,
          createdAt: serverTimestamp(),
        });
        wrote = true;
      }

      submittedRef.current = true;
      setFirebaseSaved(wrote);
      setDone(true);
    } catch (e) {
      setSaveError(e?.message || "Грешка при запис.");
    } finally {
      setSaving(false);
    }
  };

  if (!total) {
    return (
      <div className={styles.page}>
        <div className={styles.wrap}>
          <h1 style={{ marginTop: 0 }}>{title ?? "Тест"}</h1>
          <p>Няма въпроси за този тест.</p>
          <Link href="/test-pilot">Назад към тестове</Link>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className={styles.page}>
        <div className={styles.wrap}>
          <h1 style={{ marginTop: 0 }}>{testTitle ?? title ?? "Тест"}</h1>
          {participantName ? (
            <p style={{ color: "rgba(26,58,82,0.75)", marginTop: 6 }}>
              Участник: <strong style={{ color: "#1a3a52" }}>{participantName}</strong>
            </p>
          ) : null}
          <p style={{ color: "rgba(26,58,82,0.75)" }}>
            Завърши теста (ID: <code>{testId}</code>). Заключени стъпки: {lockedCount}/{seqLen}
          </p>
          {finishSummary && (
            <div className={styles.done} style={{ marginTop: 12 }}>
              <div style={{ fontSize: 18, fontWeight: 1000, color: "#1a3a52" }}>
                Резултат: {finishSummary.pointsText}
              </div>
              <div style={{ marginTop: 8, fontSize: 16, fontWeight: 1000, color: "#1a3a52" }}>
                Оценка: {finishSummary.assessment}
              </div>
            </div>
          )}
          <div className={styles.done}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link className={`${styles.btn} ${styles.next}`} href="/test-pilot" style={{ textDecoration: "none" }}>
                Към списъка с тестове
              </Link>
            </div>
            <p style={{ marginTop: 12, color: "rgba(26,58,82,0.65)" }}>
              {firebaseSaved
                ? "Резултатът е записан."
                : isFirebaseConfigured()
                  ? null
                  : "Firebase не е конфигуриран — няма запис в облака."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    const crumbSubject = subjectLabel ?? subject ?? "Тестове";
    return (
      <div className={styles.page}>
        <div className={styles.wrap}>
          <PageHero
            variant="page"
            title={testTitle ?? title ?? "Тест"}
            subtitle="Преди да започнеш, въведи име за резултатите."
            subtitleVariant="meta"
          />

          <section className={styles.card}>
            <div className={styles.cardTop}>
              <span>
                Начало <span aria-hidden>&gt;</span> {crumbSubject}
                {classNum ? (
                  <>
                    {" "}
                    <span aria-hidden>&gt;</span> {classNum}. клас
                  </>
                ) : null}
              </span>
            </div>

            <div className={styles.cardBody}>
              <p className={styles.nameGateLead}>
                Името се показва в класацията и се записва заедно с резултата.
              </p>
              <label className={styles.nameLabel} htmlFor="quiz-participant-name">
                Име <span style={{ color: "#b42318" }}>*</span>
              </label>
              <div className={styles.nameRow}>
                <input
                  id="quiz-participant-name"
                  className={`${styles.textInput} ${styles.textInputGrow}`}
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") startQuiz();
                  }}
                  autoComplete="name"
                  maxLength={120}
                  placeholder=""
                />
                <button
                  type="button"
                  className={`${styles.btn} ${styles.next}`}
                  disabled={!nameDraft.trim()}
                  onClick={startQuiz}
                >
                  Започни тест <span aria-hidden>›</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  const selected = currentStep ? stepAnswers.get(currentStep.key) : undefined;
  const options = Array.isArray(current?.options) ? current.options : [];
  const crumbSubject = subjectLabel ?? subject ?? "Тестове";
  const judgement = judgeAnswer(current, selected);
  const reveal = isLocked;

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <PageHero
          variant="page"
          title={testTitle ?? title ?? "Тест"}
          subtitle={`Стъпка ${step + 1} от ${seqLen} (оригинални въпроси: ${total})${
            currentStep?.isRetry ? " • Повторение" : ""
          } • Заключени: ${lockedCount}/${seqLen}`}
          subtitleVariant="meta"
        />

        <section className={styles.card}>
          <div className={styles.cardTop}>
            <span>
              Начало <span aria-hidden>&gt;</span> {crumbSubject}
              {classNum ? (
                <>
                  {" "}
                  <span aria-hidden>&gt;</span> {classNum}. клас
                </>
              ) : null}
            </span>
          </div>

          <div className={styles.cardBody}>
            <p className={styles.question}>{getQuestionText(current)}</p>
            <div className={styles.divider} />

            {isTextQuestion(current) ? (
              <>
                <input
                  className={styles.textInput}
                  value={typeof selected === "string" ? selected : ""}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitText();
                  }}
                  readOnly={isLocked}
                  autoComplete="off"
                  spellCheck={false}
                />
                {!isLocked && (
                  <div className={styles.textActions}>
                    <button type="button" className={`${styles.btn} ${styles.next}`} onClick={commitText}>
                      Провери
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className={styles.options}>
                {options.map((opt, i) => {
                  const value = normalizeOption(opt);
                  const key = `${currentStep.key}-${i}-${value}`;
                  const isSel = selected === value;
                  const gradable = isGradableQuestion(current);
                  const isCorr = reveal && gradable && isMcAnswerCorrect(current, value);
                  const isWrongSel = reveal && gradable && isSel && judgement.status === "wrong";
                  const isLockedNeutral = reveal && !gradable && isSel;

                  const cls = [
                    styles.option,
                    isSel && !reveal ? styles.optionSelected : "",
                    reveal && isCorr ? styles.optionCorrect : "",
                    isWrongSel ? styles.optionWrong : "",
                    isLockedNeutral ? styles.optionSelected : "",
                    reveal ? styles.optionDisabled : "",
                  ]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <label key={key} className={cls}>
                      <input
                        type="radio"
                        name={`q-${currentStep.key}`}
                        value={value}
                        checked={isSel}
                        disabled={reveal}
                        onChange={() => select(value)}
                      />
                      <span>{value}</span>
                    </label>
                  );
                })}
              </div>
            )}

            {reveal && (
              <div
                className={`${styles.feedback} ${
                  judgement.status === "correct"
                    ? styles.feedbackOk
                    : judgement.status === "wrong"
                      ? styles.feedbackBad
                      : styles.feedbackNeutral
                }`}
              >
                {judgement.status === "correct" && "Верен отговор!"}
                {judgement.status === "wrong" && "Грешен отговор."}
                {judgement.status === "unknown" && "Отговорът е заключен (няма ключ за автоматична проверка)."}
                {judgement.status === "wrong" && typeof current?.correct === "string" && (
                  <div className={styles.feedbackHint}>
                    Верен отговор: <span style={{ fontWeight: 1000 }}>{current.correct}</span>
                  </div>
                )}
              </div>
            )}

            <div className={styles.actions}>
              <button type="button" className={`${styles.btn} ${styles.back}`} onClick={prev} disabled={step === 0}>
                Назад
              </button>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
                <button type="button" className={`${styles.btn} ${styles.next}`} onClick={next} disabled={step >= seqLen - 1 || !isLocked}>
                  Напред <span aria-hidden>›</span>
                </button>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.finish}`}
                  onClick={finish}
                  disabled={lockedCount < seqLen || saving}
                >
                  {saving ? "Запис..." : "Завърши"}
                </button>
              </div>
            </div>
            {saveError && (
              <p style={{ marginTop: 12, color: "#b42318", fontWeight: 800 }}>
                {saveError}
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

