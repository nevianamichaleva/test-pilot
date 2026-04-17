"use client";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
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
  return q?.type === "text";
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

/** Текст за четене (НВО и др.): важи за всички следващи въпроси до следващия блок с sectionIntro. */
function getReadingContextForQuestion(qs, qIndex) {
  if (!Array.isArray(qs) || qIndex < 0) return "";
  for (let i = qIndex; i >= 0; i -= 1) {
    const q = qs[i];
    const raw = q?.sectionIntro ?? q?.passage ?? q?.readingText ?? q?.contextText;
    if (typeof raw === "string" && raw.trim()) return raw.trim();
  }
  return "";
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
  if (isTextQuestion(q)) return typeof q.correct === "string" && String(q.correct).trim().length > 0;
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
  const candidates = [q.correct, ...accepted].filter(Boolean).map(normalizeText);
  return candidates.some((c) => c && user === c);
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
    if (isOrderingQuestion(q)) {
      if (isOrderingAnswerCorrect(q, firstTry)) correct += 1;
      continue;
    }
    if (isMatchingQuestion(q)) {
      if (isMatchingAnswerCorrect(q, firstTry)) correct += 1;
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
          else if (isOrderingQuestion(q)) n += isOrderingAnswerCorrect(q, a) ? 1 : 0;
          else if (isMatchingQuestion(q)) n += isMatchingAnswerCorrect(q, a) ? 1 : 0;
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
  const [quizSession, setQuizSession] = useState(0);
  const [participantName, setParticipantName] = useState("");
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
    submittedRef.current = false;
    orderDraftsRef.current = new Map();
    matchDraftsRef.current = new Map();
  }, [testId, questions, qs.length]);

  const total = qs.length;
  const seqLen = sequence.length;
  const currentStep = sequence[step];
  const qIndex = currentStep?.qIndex ?? 0;
  const current = qs[qIndex];

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
    if (isOrderingQuestion(current) || isMatchingQuestion(current)) return;

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
    setQuizSession((v) => v + 1);
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
  const mcOptions =
    shuffledOptionsByIndex.get(qIndex) ?? (current ? getMcOptionsRaw(current) : []);
  const readingContext =
    current && typeof currentStep?.qIndex === "number"
      ? getReadingContextForQuestion(qs, currentStep.qIndex)
      : "";
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
            {readingContext ? (
              <>
                <div className={styles.readingContext}>{readingContext}</div>
                <div className={styles.divider} />
              </>
            ) : null}
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
            ) : (
              <p className={styles.noOptions}>За този въпрос липсват възможни отговори в данните.</p>
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
                {judgement.status === "wrong" && isOrderingQuestion(current) && (
                  <div className={styles.feedbackHint}>
                    Верен ред:{" "}
                    <span style={{ fontWeight: 1000 }}>{current.items.filter(Boolean).join(" → ")}</span>
                  </div>
                )}
                {judgement.status === "wrong" && isMatchingQuestion(current) && (
                  <div className={styles.feedbackHint}>
                    Верни двойки:{" "}
                    <span style={{ fontWeight: 1000 }}>
                      {current.pairs.map(([a, b]) => `${a} — ${b}`).join(" · ")}
                    </span>
                  </div>
                )}
                {judgement.status === "wrong" &&
                  !isTextQuestion(current) &&
                  !isOrderingQuestion(current) &&
                  !isMatchingQuestion(current) &&
                  typeof current?.correct === "string" && (
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

