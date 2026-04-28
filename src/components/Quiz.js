"use client";

import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import Link from "next/link";

import PageHero from "@/components/PageHero";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";

import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase";

import styles from "./Quiz.module.css";

function normalizeQuestions(questions) {
  if (!Array.isArray(questions)) return [];
  return questions.filter(Boolean);
}

function isTextQuestion(q) {
  return q?.type === "text" || q?.type === "rewrite";
}

function getQuestionText(q) {
  if (!q) return "—";
  const t = q.question ?? q.q;
  if (typeof t === "string" && t.trim()) return t.trim();
  if (isOrderingQuestion(q)) return "Подреди елементите в правилната последователност.";
  if (isMatchingQuestion(q)) return "Съчетай всеки елемент отляво с верния отдясно.";
  return "—";
}

function isOrderingQuestion(q) {
  return q?.type === "ordering" && Array.isArray(q.items) && q.items.filter(Boolean).length >= 2;
}

function isMatchingQuestion(q) {
  if (q?.type !== "matching" || !Array.isArray(q.pairs)) return false;
  return q.pairs.every((p) => Array.isArray(p) && p.length >= 2 && typeof p[0] === "string" && typeof p[1] === "string");
}

function hashStringToSeed(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

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

function dedupeOptionStrings(arr) {
  const seen = new Set();
  const out = [];
  for (const x of arr) {
    const key = normalizeText(x);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(typeof x === "string" ? x : String(x));
  }
  return out;
}

/**
 * Текст за четене (НВО и др.): най-близкият блок sectionIntro/passage/… от текущия въпрос назад.
 * Ако на източника има `readingContextEndQIndex` (индекс на последния въпрос, за който важи текстът),
 * при по-нататъшни въпроси върнете празен низ — големият текст не се показва за литература и др.
 */
function getReadingContextForQuestion(qs, qIndex) {
  if (!Array.isArray(qs) || qIndex < 0) return "";
  let introSourceIndex = -1;
  let raw = "";
  for (let i = qIndex; i >= 0; i -= 1) {
    const q = qs[i];
    const cand = q?.sectionIntro ?? q?.passage ?? q?.readingText ?? q?.contextText;
    if (typeof cand === "string" && cand.trim()) {
      introSourceIndex = i;
      raw = cand.trim();
      break;
    }
  }
  if (!raw) return "";
  const boundary = qs[introSourceIndex]?.readingContextEndQIndex;
  if (typeof boundary === "number" && Number.isFinite(boundary) && qIndex > boundary) {
    return "";
  }
  return raw;
}

/** Варианти за избор (без разбъркване): `options` или correct + wrong1… */
function getMcOptionsRaw(q) {
  if (!q || isTextQuestion(q)) return [];
  if (isOrderingQuestion(q) || isMatchingQuestion(q)) return [];
  if (Array.isArray(q.options) && q.options.length) {
    return dedupeOptionStrings(q.options.map(normalizeOption));
  }
  const raw = [q.correct, q.wrong1, q.wrong2, q.wrong3, q.wrong4].filter(
    (x) => typeof x === "string" && x.trim()
  );
  return dedupeOptionStrings(raw);
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
  if (isTextQuestion(q)) {
    const hasCorrect = typeof q.correct === "string" && String(q.correct).trim().length > 0;
    const hasAccepted = Array.isArray(q.acceptedAnswers) && q.acceptedAnswers.some((a) => normalizeText(a));
    return hasCorrect || hasAccepted;
  }
  if (isOrderingQuestion(q)) return true;
  if (isMatchingQuestion(q)) return true;
  if (typeof q.correct !== "string" || !String(q.correct).trim()) return false;
  const opts = getMcOptionsRaw(q);
  return opts.length >= 2;
}

function isTextAnswerCorrect(q, answer) {
  const user = normalizeText(answer);
  if (!user) return false;

  const accepted = Array.isArray(q.acceptedAnswers) ? q.acceptedAnswers : [];
  const candidates = [q.correct, ...accepted]
    .filter((x) => typeof x === "string" && x.trim())
    .map(normalizeText)
    .filter(Boolean);

  if (!candidates.length) return false;

  return candidates.some((c) => user === c || user.includes(c));
}

function isMcAnswerCorrect(q, answer) {
  if (typeof q.correct !== "string") return false;
  return normalizeText(answer) === normalizeText(q.correct);
}

function parseJsonSafe(s) {
  if (typeof s !== "string") return null;
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

function isOrderingAnswerCorrect(q, answer) {
  const userOrder = parseJsonSafe(answer);
  if (!Array.isArray(userOrder) || !Array.isArray(q.items)) return false;
  const canon = q.items.filter(Boolean).map(String);
  if (userOrder.length !== canon.length) return false;
  for (let i = 0; i < canon.length; i += 1) {
    if (normalizeText(userOrder[i]) !== normalizeText(canon[i])) return false;
  }
  return true;
}

function isMatchingAnswerCorrect(q, answer) {
  const obj = parseJsonSafe(answer);
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return false;
  for (const pair of q.pairs) {
    const [left, right] = pair;
    const sel = obj[left];
    if (typeof sel !== "string" || normalizeText(sel) !== normalizeText(right)) return false;
  }
  return Object.keys(obj).length === q.pairs.length;
}

function getQuestionPoints(q) {
  const raw = q?.points;
  if (typeof raw === "number" && Number.isFinite(raw) && raw >= 0) return raw;
  if (typeof raw === "string") {
    const n = Number(raw.replace(",", ".").trim());
    if (Number.isFinite(n) && n >= 0) return n;
  }
  return null;
}

function safeDisplayAnswer(value) {
  if (typeof value === "string") return value.trim() ? value : "—";
  if (value == null) return "—";
  const txt = String(value).trim();
  return txt || "—";
}

function getCorrectAnswerText(q) {
  if (!q) return "—";
  if (isOrderingQuestion(q)) {
    const rows = Array.isArray(q.items) ? q.items.filter(Boolean).map(String) : [];
    return rows.length ? rows.join(" -> ") : "—";
  }
  if (isMatchingQuestion(q)) {
    const pairs = Array.isArray(q.pairs) ? q.pairs : [];
    const txt = pairs
      .filter((p) => Array.isArray(p) && p.length >= 2)
      .map(([a, b]) => `${a} — ${b}`)
      .join(" ; ");
    return txt || "—";
  }
  if (typeof q.correct === "string" && q.correct.trim()) return q.correct.trim();
  return "—";
}

function summarizeQuestionResult(q, sequence, stepAnswers, qIndex) {
  const firstTry = getFirstTryAnswerForQuestion(sequence, stepAnswers, qIndex);
  const questionText = getQuestionText(q);
  const answerText = (() => {
    if (isOrderingQuestion(q) || isMatchingQuestion(q)) {
      const parsed = parseJsonSafe(firstTry);
      if (isOrderingQuestion(q) && Array.isArray(parsed)) return safeDisplayAnswer(parsed.join(" -> "));
      if (isMatchingQuestion(q) && parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return safeDisplayAnswer(
          Object.entries(parsed)
            .map(([a, b]) => `${a} — ${b}`)
            .join(" ; ")
        );
      }
    }
    return safeDisplayAnswer(firstTry);
  })();
  const judged = judgeAnswer(q, firstTry);
  const correctAnswer = getCorrectAnswerText(q);
  return {
    questionNumber: qIndex + 1,
    questionText,
    firstAnswer: answerText,
    status: judged.status,
    isCorrect: judged.status === "correct",
    correctAnswer,
  };
}

function gradeQuiz(qs, stepAnswers, sequence) {
  const seq = Array.isArray(sequence) && sequence.length ? sequence : buildInitialSequence(qs.length);

  let correct = 0;
  let gradable = 0;
  let totalDefinedPoints = 0;
  let earnedPoints = 0;

  for (let i = 0; i < qs.length; i += 1) {
    const q = qs[i];
    if (!isGradableQuestion(q)) continue;
    gradable += 1;

    const firstTry = getFirstTryAnswerForQuestion(seq, stepAnswers, i);
    let isCorrect = false;
    if (isTextQuestion(q)) isCorrect = isTextAnswerCorrect(q, firstTry);
    else if (isOrderingQuestion(q)) isCorrect = isOrderingAnswerCorrect(q, firstTry);
    else if (isMatchingQuestion(q)) isCorrect = isMatchingAnswerCorrect(q, firstTry);
    else isCorrect = isMcAnswerCorrect(q, firstTry);

    if (isCorrect) correct += 1;

    const qp = getQuestionPoints(q);
    if (qp !== null) {
      totalDefinedPoints += qp;
      if (isCorrect) earnedPoints += qp;
    }
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
          else if (isOrderingQuestion(q)) n += isOrderingAnswerCorrect(q, a) ? 1 : 0;
          else if (isMatchingQuestion(q)) n += isMatchingAnswerCorrect(q, a) ? 1 : 0;
          else n += isMcAnswerCorrect(q, a) ? 1 : 0;
        }
        return n;
      })();

  const hasDefinedPoints = totalDefinedPoints > 0;
  const pointsText = hasDefinedPoints
    ? `${earnedPoints}/${totalDefinedPoints} т.`
    : firstTryGradable > 0
      ? `${firstTryCorrect}/${firstTryGradable}`
      : gradable > 0
        ? `${correct}/${gradable}`
        : `${answered}/${total}`;

  return {
    correct,
    gradable,
    pointsText,
    firstTryCorrect,
    firstTryGradable,
    hasDefinedPoints,
    earnedPoints,
    totalDefinedPoints,
  };
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
  if (isOrderingQuestion(q)) {
    const ok = isOrderingAnswerCorrect(q, answer);
    return { status: ok ? "correct" : "wrong" };
  }
  if (isMatchingQuestion(q)) {
    const ok = isMatchingAnswerCorrect(q, answer);
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

function makeAttemptId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `attempt-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export default function Quiz({
  title,
  questions,
  testId,
  testTitle,
  classNum,
  subject,
  subjectLabel,
  subjectThumbnailSrc,
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
  const [quizSession, setQuizSession] = useState(0);
  const [participantName, setParticipantName] = useState("");
  const [attemptId, setAttemptId] = useState("");
  const [startedAtIso, setStartedAtIso] = useState("");
  const [resultDocId, setResultDocId] = useState("");
  const submittedRef = useRef(false);
  const stepRef = useRef(0);
  const orderDraftsRef = useRef(new Map());
  const matchDraftsRef = useRef(new Map());
  const [, rerenderUi] = useReducer((x) => x + 1, 0);

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
    setAttemptId("");
    setStartedAtIso("");
    setResultDocId("");
    submittedRef.current = false;
    orderDraftsRef.current = new Map();
    matchDraftsRef.current = new Map();
  }, [testId, questions, qs.length]);

  const total = qs.length;
  const seqLen = sequence.length;
  const currentStep = sequence[step];
  const qIndex = currentStep?.qIndex ?? 0;
  const current = qs[qIndex];
  const isSeventhGradeQuiz = String(classNum ?? "").trim() === "7";

  const shuffledOptionsByIndex = useMemo(() => {
    if (!quizStarted) return new Map();
    const m = new Map();
    for (let i = 0; i < qs.length; i += 1) {
      const qq = qs[i];
      const raw = getMcOptionsRaw(qq);
      if (raw.length >= 2) {
        m.set(i, shuffleArray([...raw], hashStringToSeed(`${testId}|${quizSession}|${i}`)));
      }
    }
    return m;
  }, [qs, testId, quizSession, quizStarted]);

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
    if (isSeventhGradeQuiz) return;
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

  const logQuizStartEvent = async (nameValue, sessionValue, localStartedAt, localAttemptId) => {
    if (!isFirebaseConfigured()) return;
    const db = getFirebaseDb();
    if (!db) return;
    try {
      await addDoc(collection(db, "quizStartEvents"), {
        test: testId,
        testTitle: testTitle ?? title ?? "Тест",
        classNum: classNum ?? "",
        subject: subject ?? "",
        subjectLabel: subjectLabel ?? "",
        participantName: String(nameValue ?? "").trim() || "Анонимен",
        quizSession: sessionValue,
        attemptId: localAttemptId,
        startedAtIso: localStartedAt,
        createdAt: serverTimestamp(),
      });
    } catch {
      // Не прекъсваме теста при грешка в логването.
    }
  };

  const logAnswerEvent = async ({
    stepKey,
    questionIndex,
    questionText,
    answerValue,
    judgedStatus,
    isRetryStep,
    isLockedStep,
  }) => {
    if (!isFirebaseConfigured()) return;
    const db = getFirebaseDb();
    if (!db) return;
    try {
      await addDoc(collection(db, "quizAnswerEvents"), {
        test: testId,
        testTitle: testTitle ?? title ?? "Тест",
        classNum: classNum ?? "",
        subject: subject ?? "",
        subjectLabel: subjectLabel ?? "",
        participantName: participantName.trim() || nameDraft.trim() || "Анонимен",
        quizSession,
        attemptId,
        startedAtIso,
        stepKey,
        stepNumber: step + 1,
        questionIndex,
        questionNumber: Number.isInteger(questionIndex) ? questionIndex + 1 : null,
        questionText: safeDisplayAnswer(questionText),
        answer: safeDisplayAnswer(answerValue),
        status: judgedStatus ?? "unknown",
        isRetryStep: Boolean(isRetryStep),
        isLockedStep: Boolean(isLockedStep),
        answeredAtIso: new Date().toISOString(),
        createdAt: serverTimestamp(),
      });
    } catch {
      // Не прекъсваме теста при грешка в логването.
    }
  };

  const computeDisplayResult = (summaryLike) => {
    if (isSeventhGradeQuiz) return `Точки: ${summaryLike.pointsText ?? "–"}`;
    const c = typeof summaryLike.firstTryCorrect === "number" ? summaryLike.firstTryCorrect : summaryLike.correct;
    const t =
      typeof summaryLike.firstTryGradable === "number" && summaryLike.firstTryGradable > 0
        ? summaryLike.firstTryGradable
        : summaryLike.gradable;
    return `Верни: ${c ?? 0} от ${t ?? 0}`;
  };

  const buildAnsweredQuestionResults = (answersMap, seq) => {
    const seen = new Set();
    const out = [];
    for (const s of seq) {
      if (!s || s.isRetry) continue;
      if (seen.has(s.qIndex)) continue;
      seen.add(s.qIndex);
      const ans = answersMap.get(s.key);
      if (typeof ans !== "string" || !ans.trim()) continue;
      out.push(summarizeQuestionResult(qs[s.qIndex], seq, answersMap, s.qIndex));
    }
    return out;
  };

  const upsertResultRecord = async ({
    localResultDocId,
    localAttemptId,
    localStartedAtIso,
    localName,
    stepAnswersMap,
    seq,
    completed,
    pointsLabel,
  }) => {
    if (!isFirebaseConfigured()) return;
    const db = getFirebaseDb();
    if (!db) return;
    const rid = localResultDocId || localAttemptId || resultDocId || attemptId;
    if (!rid) return;

    const safeAnswers = stepAnswersMap ?? stepAnswers;
    const safeSeq = seq ?? sequence;
    const summary = gradeQuiz(qs, safeAnswers, safeSeq);
    const progressQuestionResults = buildAnsweredQuestionResults(safeAnswers, safeSeq);
    const answeredCount = safeSeq.filter((s) => {
      const v = safeAnswers.get(s.key);
      return typeof v === "string" && v.trim().length > 0;
    }).length;

    await setDoc(
      doc(db, "results", rid),
      {
        name: String(localName ?? participantName ?? "").trim() || "Анонимен",
        test: testId,
        testTitle: testTitle ?? title ?? "Тест",
        classNum: classNum ?? "",
        subject: subject ?? "",
        subjectLabel: subjectLabel ?? "",
        attemptId: localAttemptId || attemptId || null,
        startedAtIso: localStartedAtIso || startedAtIso || null,
        points: pointsLabel ?? computeDisplayResult(summary),
        status: completed ? "completed" : "in_progress",
        completed: Boolean(completed),
        lockedCount: answeredCount,
        totalSteps: safeSeq.length,
        progressText: `Отговорени: ${answeredCount} от ${safeSeq.length}`,
        questionResults: completed
          ? qs.map((q, i) => summarizeQuestionResult(q, safeSeq, safeAnswers, i))
          : progressQuestionResults,
        correct: summary.firstTryCorrect ?? summary.correct,
        gradable: summary.firstTryGradable ?? summary.gradable,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  };

  const select = (value) => {
    if (!current) return;
    if (!currentStep) return;
    if (locked.get(currentStep.key)) return;
    if (isTextQuestion(current)) return;
    if (isOrderingQuestion(current) || isMatchingQuestion(current)) return;

    const next = new Map(stepAnswers);
    next.set(currentStep.key, value);
    setStepAnswers(next);

    const lockNext = new Map(locked);
    lockNext.set(currentStep.key, true);
    setLocked(lockNext);

    const judgement = judgeAnswer(current, value);
    maybeScheduleRetry(qIndex, judgement.status === "wrong", currentStep.isRetry);
    void upsertResultRecord({
      stepAnswersMap: next,
      seq: sequence,
      completed: false,
    });
    void logAnswerEvent({
      stepKey: currentStep.key,
      questionIndex: qIndex,
      questionText: getQuestionText(current),
      answerValue: value,
      judgedStatus: judgement.status,
      isRetryStep: currentStep.isRetry,
      isLockedStep: true,
    });
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
    void upsertResultRecord({
      stepAnswersMap: new Map(stepAnswers),
      seq: sequence,
      completed: false,
    });
    void logAnswerEvent({
      stepKey: currentStep.key,
      questionIndex: qIndex,
      questionText: getQuestionText(current),
      answerValue: v,
      judgedStatus: judgement.status,
      isRetryStep: currentStep.isRetry,
      isLockedStep: true,
    });
  };

  const next = () => setStep((v) => Math.min(v + 1, Math.max(seqLen - 1, 0)));
  const prev = () => setStep((v) => Math.max(v - 1, 0));

  const startQuiz = () => {
    const t = nameDraft.trim();
    if (!t) return;
    setParticipantName(t);
    const localAttemptId = makeAttemptId();
    const localStartedAt = new Date().toISOString();
    const localResultDocId = localAttemptId;
    setAttemptId(localAttemptId);
    setStartedAtIso(localStartedAt);
    setResultDocId(localResultDocId);
    setQuizSession((v) => {
      const nextSession = v + 1;
      let baseSequence = buildInitialSequence(qs.length);
      if (isSeventhGradeQuiz) {
        setSequence(baseSequence);
      } else {
        const order = shuffleArray(
          Array.from({ length: qs.length }, (_, i) => i),
          hashStringToSeed(`${testId}|${Date.now()}|${nextSession}|question-order`)
        );
        baseSequence = order.map((qIndex, idx) => ({
          key: `o-${idx}`,
          qIndex,
          isRetry: false,
        }));
        setSequence(baseSequence);
      }
      void logQuizStartEvent(t, nextSession, localStartedAt, localAttemptId);
      void upsertResultRecord({
        localResultDocId,
        localAttemptId,
        localStartedAtIso: localStartedAt,
        localName: t,
        stepAnswersMap: new Map(),
        seq: baseSequence,
        completed: false,
        pointsLabel: isSeventhGradeQuiz ? "Точки: 0" : "Верни: 0 от 0",
      });
      if (isFirebaseConfigured()) {
        const db = getFirebaseDb();
        if (db) {
          void setDoc(
            doc(db, "results", localResultDocId),
            {
              createdAt: serverTimestamp(),
            },
            { merge: true }
          );
        }
      }
      return nextSession;
    });
    setQuizStarted(true);
  };

  const getOrderDraftRows = () => {
    if (!current || !currentStep || !isOrderingQuestion(current)) return [];
    const saved = currentStep ? stepAnswers.get(currentStep.key) : undefined;
    if (isLocked && typeof saved === "string") {
      const parsed = parseJsonSafe(saved);
      return Array.isArray(parsed) ? parsed.map(String) : current.items.filter(Boolean).map(String);
    }
    const k = currentStep.key;
    if (!orderDraftsRef.current.has(k)) {
      const items = current.items.filter(Boolean).map(String);
      orderDraftsRef.current.set(
        k,
        shuffleArray([...items], hashStringToSeed(`${testId}|${quizSession}|${k}`))
      );
    }
    return orderDraftsRef.current.get(k) ?? [];
  };

  const moveOrderRow = (index, delta) => {
    if (!currentStep || isLocked) return;
    const k = currentStep.key;
    const rows = [...(orderDraftsRef.current.get(k) ?? [])];
    const j = index + delta;
    if (j < 0 || j >= rows.length) return;
    [rows[index], rows[j]] = [rows[j], rows[index]];
    orderDraftsRef.current.set(k, rows);
    rerenderUi();
  };

  const commitOrdering = () => {
    if (!current || !currentStep || !isOrderingQuestion(current)) return;
    if (isLocked) return;
    const rows = orderDraftsRef.current.get(currentStep.key);
    if (!rows?.length) return;

    const lockNext = new Map(locked);
    lockNext.set(currentStep.key, true);
    setLocked(lockNext);

    const payload = JSON.stringify(rows);
    const next = new Map(stepAnswers);
    next.set(currentStep.key, payload);
    setStepAnswers(next);

    const judgement = judgeAnswer(current, payload);
    maybeScheduleRetry(qIndex, judgement.status === "wrong", currentStep.isRetry);
    void upsertResultRecord({
      stepAnswersMap: next,
      seq: sequence,
      completed: false,
    });
    void logAnswerEvent({
      stepKey: currentStep.key,
      questionIndex: qIndex,
      questionText: getQuestionText(current),
      answerValue: payload,
      judgedStatus: judgement.status,
      isRetryStep: currentStep.isRetry,
      isLockedStep: true,
    });
  };

  const getMatchDraft = () => {
    if (!current || !currentStep || !isMatchingQuestion(current)) return null;
    const saved = currentStep ? stepAnswers.get(currentStep.key) : undefined;
    if (isLocked && typeof saved === "string") {
      const parsed = parseJsonSafe(saved);
      const rightsOrder = dedupeOptionStrings(current.pairs.map((p) => p[1]));
      const sel = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
      return { sel, rightsOrder };
    }
    const k = currentStep.key;
    if (!matchDraftsRef.current.has(k)) {
      const rights = dedupeOptionStrings(current.pairs.map((p) => p[1]));
      const rightsOrder = shuffleArray(
        [...rights],
        hashStringToSeed(`${testId}|${quizSession}|${k}|match`)
      );
      const sel = {};
      for (const pair of current.pairs) sel[pair[0]] = "";
      matchDraftsRef.current.set(k, { rightsOrder, sel });
    }
    return matchDraftsRef.current.get(k);
  };

  const setMatchSelection = (left, value) => {
    if (!currentStep || isLocked) return;
    const d = matchDraftsRef.current.get(currentStep.key);
    if (!d) return;
    d.sel[left] = value;
    matchDraftsRef.current.set(currentStep.key, d);
    rerenderUi();
  };

  const commitMatching = () => {
    if (!current || !currentStep || !isMatchingQuestion(current)) return;
    if (isLocked) return;
    const d = matchDraftsRef.current.get(currentStep.key);
    if (!d?.sel) return;
    if (current.pairs.some(([left]) => !String(d.sel[left] ?? "").trim())) return;

    const lockNext = new Map(locked);
    lockNext.set(currentStep.key, true);
    setLocked(lockNext);

    const payload = JSON.stringify(d.sel);
    const next = new Map(stepAnswers);
    next.set(currentStep.key, payload);
    setStepAnswers(next);

    const judgement = judgeAnswer(current, payload);
    maybeScheduleRetry(qIndex, judgement.status === "wrong", currentStep.isRetry);
    void upsertResultRecord({
      stepAnswersMap: next,
      seq: sequence,
      completed: false,
    });
    void logAnswerEvent({
      stepKey: currentStep.key,
      questionIndex: qIndex,
      questionText: getQuestionText(current),
      answerValue: payload,
      judgedStatus: judgement.status,
      isRetryStep: currentStep.isRetry,
      isLockedStep: true,
    });
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
      const questionResults = qs.map((q, i) => summarizeQuestionResult(q, sequence, stepAnswers, i));

      const summary = gradeQuiz(qs, stepAnswers, sequence);
      setFinishSummary({ ...summary, questionResults });
      const finalPointsLabel = computeDisplayResult(summary);

      let wrote = false;
      if (isFirebaseConfigured()) {
        const db = getFirebaseDb();
        if (!db) throw new Error("Firebase не е инициализиран (липсва конфигурация).");
        if (resultDocId) {
          await upsertResultRecord({
            localResultDocId: resultDocId,
            localAttemptId: attemptId,
            localStartedAtIso: startedAtIso,
            localName: participantName,
            stepAnswersMap: stepAnswers,
            seq: sequence,
            completed: true,
            pointsLabel: finalPointsLabel,
          });
          await setDoc(
            doc(db, "results", resultDocId),
            {
              answers: summaryAnswers,
              questionResults,
              createdAt: serverTimestamp(),
            },
            { merge: true }
          );
        } else {
          await addDoc(collection(db, "results"), {
            name: participantName.trim() || "Анонимен",
            points: finalPointsLabel,
            test: testId,
            testTitle: testTitle ?? title ?? "Тест",
            attemptId: attemptId || null,
            startedAtIso: startedAtIso || null,
            answers: summaryAnswers,
            questionResults,
            correct: summary.firstTryCorrect ?? summary.correct,
            gradable: summary.firstTryGradable ?? summary.gradable,
            status: "completed",
            completed: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
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
                {isSeventhGradeQuiz
                  ? `Точки: ${finishSummary.pointsText}`
                  : `Верни: ${
                      typeof finishSummary.firstTryCorrect === "number"
                        ? finishSummary.firstTryCorrect
                        : finishSummary.correct
                    } от ${
                      typeof finishSummary.firstTryGradable === "number" && finishSummary.firstTryGradable > 0
                        ? finishSummary.firstTryGradable
                        : finishSummary.gradable
                    }`}
              </div>
              {Array.isArray(finishSummary.questionResults) && finishSummary.questionResults.length > 0 && (
                <div className={styles.summaryList}>
                  {finishSummary.questionResults.map((item) => (
                    <div key={`summary-q-${item.questionNumber}`} className={styles.summaryItem}>
                      <div className={styles.summaryQuestion}>
                        Въпрос {item.questionNumber}: {item.questionText}
                      </div>
                      <div className={styles.summaryAnswer}>
                        Твой отговор: <strong>{item.firstAnswer}</strong> —{" "}
                        <span
                          className={item.isCorrect ? styles.summaryCorrect : styles.summaryWrong}
                        >
                          {item.isCorrect ? "верен" : "грешен"}
                        </span>
                      </div>
                      {!item.isCorrect && (
                        <div className={styles.summaryCorrectAnswer}>
                          Верен отговор: <strong>{item.correctAnswer}</strong>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
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
              {subjectThumbnailSrc ? (
                <img
                  className={styles.cardTopThumb}
                  src={subjectThumbnailSrc}
                  alt=""
                  width={56}
                  height={56}
                  decoding="async"
                />
              ) : null}
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
  const mcOptions =
    shuffledOptionsByIndex.get(qIndex) ?? (current ? getMcOptionsRaw(current) : []);
  const readingContext =
    current && typeof currentStep?.qIndex === "number"
      ? getReadingContextForQuestion(qs, currentStep.qIndex)
      : "";
  const crumbSubject = subjectLabel ?? subject ?? "Тестове";
  const judgement = judgeAnswer(current, selected);
  /** НВО 7. клас: без верен отговор между въпросите — само резюме след „Завърши“. */
  const revealAnswers = isLocked && !isSeventhGradeQuiz;

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
            {subjectThumbnailSrc ? (
              <img
                className={styles.cardTopThumb}
                src={subjectThumbnailSrc}
                alt=""
                width={56}
                height={56}
                decoding="async"
              />
            ) : null}
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
            {readingContext ? (
              <>
                <div className={styles.readingContext}>{readingContext}</div>
                <div className={styles.divider} />
              </>
            ) : null}
            {typeof current?.sentenceContext === "string" && current.sentenceContext.trim() ? (
              <>
                <div className={styles.sentenceContext}>{current.sentenceContext.trim()}</div>
                <div className={styles.divider} />
              </>
            ) : null}
            <p className={styles.question}>{getQuestionText(current)}</p>
            <div className={styles.divider} />

            {isTextQuestion(current) ? (
              <>
                {typeof current.rewriteText === "string" && current.rewriteText.trim() ? (
                  <div className={styles.rewriteSource}>{current.rewriteText}</div>
                ) : null}
                {current.type === "rewrite" || (typeof current.rewriteText === "string" && current.rewriteText.trim()) ? (
                  <textarea
                    className={`${styles.textInput} ${styles.textArea}`}
                    value={typeof selected === "string" ? selected : ""}
                    onChange={(e) => setText(e.target.value)}
                    readOnly={isLocked}
                    autoComplete="off"
                    spellCheck={false}
                    rows={6}
                  />
                ) : (
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
                )}
                {!isLocked && (
                  <div className={styles.textActions}>
                    <button type="button" className={`${styles.btn} ${styles.next}`} onClick={commitText}>
                      Провери
                    </button>
                  </div>
                )}
              </>
            ) : isOrderingQuestion(current) ? (
              <>
                <ol className={styles.orderList}>
                  {getOrderDraftRows().map((row, idx) => (
                    <li key={`${currentStep.key}-ord-${idx}`} className={styles.orderRow}>
                      <span className={styles.orderText}>{row}</span>
                      {!isLocked && (
                        <span className={styles.orderBtns}>
                          <button
                            type="button"
                            className={styles.orderBtn}
                            aria-label="Нагоре"
                            onClick={() => moveOrderRow(idx, -1)}
                            disabled={idx === 0}
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            className={styles.orderBtn}
                            aria-label="Надолу"
                            onClick={() => moveOrderRow(idx, 1)}
                            disabled={idx >= getOrderDraftRows().length - 1}
                          >
                            ↓
                          </button>
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
                {!isLocked && (
                  <div className={styles.textActions}>
                    <button type="button" className={`${styles.btn} ${styles.next}`} onClick={commitOrdering}>
                      Провери
                    </button>
                  </div>
                )}
              </>
            ) : isMatchingQuestion(current) ? (
              <>
                <div className={styles.matchGrid}>
                  {current.pairs.map(([left]) => {
                    const draft = getMatchDraft();
                    const rights = draft?.rightsOrder ?? [];
                    const val = draft?.sel?.[left] ?? "";
                    return (
                      <div key={left} className={styles.matchRow}>
                        <span className={styles.matchLeft}>{left}</span>
                        <select
                          className={styles.matchSelect}
                          value={val}
                          disabled={isLocked}
                          onChange={(e) => setMatchSelection(left, e.target.value)}
                        >
                          <option value="">Избери…</option>
                          {rights.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                </div>
                {!isLocked && (
                  <div className={styles.textActions}>
                    <button type="button" className={`${styles.btn} ${styles.next}`} onClick={commitMatching}>
                      Провери
                    </button>
                  </div>
                )}
              </>
            ) : mcOptions.length >= 2 ? (
              <div className={styles.options}>
                {mcOptions.map((opt, i) => {
                  const value = normalizeOption(opt);
                  const key = `${currentStep.key}-${i}-${value}`;
                  const isSel = selected === value;
                  const gradable = isGradableQuestion(current);
                  const isCorr = revealAnswers && gradable && isMcAnswerCorrect(current, value);
                  const isWrongSel = revealAnswers && gradable && isSel && judgement.status === "wrong";
                  const isLockedNeutral = revealAnswers && !gradable && isSel;

                  const cls = [
                    styles.option,
                    isSel && !revealAnswers ? styles.optionSelected : "",
                    revealAnswers && isCorr ? styles.optionCorrect : "",
                    isWrongSel ? styles.optionWrong : "",
                    isLockedNeutral ? styles.optionSelected : "",
                    isLocked ? styles.optionDisabled : "",
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
                        disabled={isLocked}
                        onChange={() => select(value)}
                      />
                      <span>{value}</span>
                    </label>
                  );
                })}
              </div>
            ) : (
              <p className={styles.noOptions}>За този въпрос липсват възможни отговори в данните.</p>
            )}

            {revealAnswers && (
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
                {(judgement.status === "wrong" || judgement.status === "correct") &&
                  isOrderingQuestion(current) && (
                  <div className={styles.feedbackHint}>
                    Верен ред:{" "}
                    <span style={{ fontWeight: 1000 }}>{current.items.filter(Boolean).join(" → ")}</span>
                  </div>
                )}
                {(judgement.status === "wrong" || judgement.status === "correct") &&
                  isMatchingQuestion(current) && (
                  <div className={styles.feedbackHint}>
                    Верни двойки:{" "}
                    <span style={{ fontWeight: 1000 }}>
                      {current.pairs.map(([a, b]) => `${a} — ${b}`).join(" · ")}
                    </span>
                  </div>
                )}
                {isGradableQuestion(current) &&
                  isTextQuestion(current) &&
                  typeof current?.correct === "string" &&
                  current.correct.trim() && (
                    <div className={`${styles.feedbackHint} ${styles.feedbackExemplar}`}>
                      {judgement.status === "wrong" ? "Очакван отговор (пример): " : "Примерен верен отговор: "}
                      <span style={{ fontWeight: 1000 }}>{current.correct}</span>
                    </div>
                  )}
                {isGradableQuestion(current) &&
                  !isTextQuestion(current) &&
                  !isOrderingQuestion(current) &&
                  !isMatchingQuestion(current) &&
                  typeof current?.correct === "string" &&
                  current.correct.trim() && (
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

