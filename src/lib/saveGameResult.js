import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase";

/**
 * @typedef {{
 *   questionNumber: number,
 *   questionText: string,
 *   firstAnswer?: string,
 *   correctAnswer?: string,
 *   isCorrect: boolean,
 *   status?: "correct" | "wrong",
 * }} GameQuestionResult
 */

/**
 * @param {number} correct
 * @param {number} total
 */
export function buildGamePointsLabel(correct, total) {
  const c = Number.isFinite(correct) ? correct : 0;
  const t = Number.isFinite(total) ? total : 0;
  return `Верни: ${c} от ${t}`;
}

/**
 * @param {{ subject?: string, slug?: string }} game
 */
export function buildGameTestId(game) {
  const subject = typeof game?.subject === "string" && game.subject ? game.subject : "game";
  const slug = typeof game?.slug === "string" && game.slug ? game.slug : "unknown";
  return `game|${subject}|${slug}`;
}

/**
 * Нормализира списък с резултати по въпрос (съвместим с тестовете).
 * @param {GameQuestionResult[] | null | undefined} items
 * @returns {GameQuestionResult[]}
 */
export function normalizeGameQuestionResults(items) {
  if (!Array.isArray(items)) return [];
  return items
    .filter((item) => item && typeof item === "object")
    .map((item, idx) => {
      const isCorrect = item.isCorrect === true || item.status === "correct";
      return {
        questionNumber:
          typeof item.questionNumber === "number" && item.questionNumber > 0
            ? item.questionNumber
            : idx + 1,
        questionText: typeof item.questionText === "string" ? item.questionText : "—",
        firstAnswer:
          typeof item.firstAnswer === "string" && item.firstAnswer.trim()
            ? item.firstAnswer
            : "—",
        correctAnswer:
          typeof item.correctAnswer === "string" && item.correctAnswer.trim()
            ? item.correctAnswer
            : "—",
        isCorrect,
        status: isCorrect ? "correct" : "wrong",
      };
    });
}

/**
 * Записва завършена игра в Firestore `results` (същата колекция като тестовете).
 * @param {{
 *   game: { slug?: string, title?: string, subject?: string, subjectLabel?: string, classHint?: string, kind?: string },
 *   questionResults?: GameQuestionResult[],
 *   correct?: number,
 *   total?: number,
 *   completed?: boolean,
 *   won?: boolean,
 *   name?: string,
 * }} payload
 * @returns {Promise<string | null>} document id или null
 */
export async function saveGameResult(payload) {
  const game = payload?.game && typeof payload.game === "object" ? payload.game : {};
  if (!game.slug) return null;
  if (!isFirebaseConfigured()) return null;

  const db = getFirebaseDb();
  if (!db) return null;

  const questionResults = normalizeGameQuestionResults(payload.questionResults);
  const total =
    typeof payload.total === "number" && payload.total >= 0
      ? payload.total
      : questionResults.length;
  const correct =
    typeof payload.correct === "number" && payload.correct >= 0
      ? payload.correct
      : questionResults.filter((q) => q.isCorrect).length;
  const points = buildGamePointsLabel(correct, total);
  const completed = payload.completed !== false;
  const won = payload.won !== false;
  const name =
    typeof payload.name === "string" && payload.name.trim() ? payload.name.trim() : "Анонимен";
  const nameKey = name
    .toLowerCase()
    .replace(/\s+/g, " ");
  const startedAtIso = new Date().toISOString();
  const testId = buildGameTestId(game);

  try {
    const ref = await addDoc(collection(db, "results"), {
      source: "game",
      name,
      nameKey,
      points,
      test: testId,
      testTitle: game.title || game.slug,
      gameSlug: game.slug,
      gameKind: game.kind || "",
      subject: game.subject || "",
      subjectLabel: game.subjectLabel || "",
      classHint: game.classHint || "",
      questionResults,
      correct,
      gradable: total,
      progressText: completed ? `Отговорени: ${total} от ${total}` : points,
      status: completed ? "completed" : "in_progress",
      completed,
      won,
      startedAtIso,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      completedAt: completed ? serverTimestamp() : null,
    });
    return ref.id;
  } catch {
    return null;
  }
}
