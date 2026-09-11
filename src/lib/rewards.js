import { SUBJECT_LABELS } from "@/lib/subjectLabels";

export const TEST_REWARD = 10;
export const GAME_REWARD = 5;
export const PASS_PERCENT = 75;

export const CUP_THRESHOLDS = [
  { id: "bronze", min: 50, label: "Бронз" },
  { id: "silver", min: 100, label: "Сребро" },
  { id: "gold", min: 200, label: "Злато" },
  { id: "platinum", min: 400, label: "Платина" },
];

export const CUP_LABELS = {
  bronze: "Бронз",
  silver: "Сребро",
  gold: "Злато",
  platinum: "Платина",
};

/** @returns {Record<string, number>} */
export function emptySubjectPoints() {
  /** @type {Record<string, number>} */
  const m = {};
  for (const key of Object.keys(SUBJECT_LABELS)) {
    m[key] = 0;
  }
  return m;
}

/** @returns {Record<string, string | null>} */
export function emptyCups() {
  /** @type {Record<string, string | null>} */
  const m = {};
  for (const key of Object.keys(SUBJECT_LABELS)) {
    m[key] = null;
  }
  return m;
}

/**
 * @param {number} points
 * @returns {string | null}
 */
export function cupForPoints(points) {
  const n = Number(points) || 0;
  let cup = null;
  for (const t of CUP_THRESHOLDS) {
    if (n >= t.min) cup = t.id;
  }
  return cup;
}

/**
 * @param {number} correct
 * @param {number} gradable
 */
export function scorePercent(correct, gradable) {
  const c = Number(correct);
  const g = Number(gradable);
  if (!Number.isFinite(c) || !Number.isFinite(g) || g <= 0) return 0;
  return (c / g) * 100;
}

/**
 * @param {number} percent
 */
export function isPassingPercent(percent) {
  return Number(percent) >= PASS_PERCENT;
}

/**
 * @param {"test" | "game"} kind
 */
export function rewardForKind(kind) {
  return kind === "game" ? GAME_REWARD : TEST_REWARD;
}

/**
 * Преизчислява точки и купи от bestByContent.
 * @param {Record<string, {
 *   percent?: number,
 *   kind?: string,
 *   subject?: string,
 *   rewardPoints?: number,
 * }>} bestByContent
 */
export function recomputeSubjectPointsAndCups(bestByContent) {
  const subjectPoints = emptySubjectPoints();
  const map = bestByContent && typeof bestByContent === "object" ? bestByContent : {};

  for (const entry of Object.values(map)) {
    if (!entry || typeof entry !== "object") continue;
    const subject = typeof entry.subject === "string" ? entry.subject : "";
    if (!subject || !(subject in subjectPoints)) continue;
    if (!isPassingPercent(entry.percent)) continue;
    const kind = entry.kind === "game" ? "game" : "test";
    const pts =
      typeof entry.rewardPoints === "number" && entry.rewardPoints > 0
        ? entry.rewardPoints
        : rewardForKind(kind);
    subjectPoints[subject] += pts;
  }

  /** @type {Record<string, string | null>} */
  const cups = emptyCups();
  for (const subject of Object.keys(cups)) {
    cups[subject] = cupForPoints(subjectPoints[subject] ?? 0);
  }

  return { subjectPoints, cups };
}
