/**
 * Оценка по скала (точки или процент).
 * gradeScale: масив { min, grade, label } — най-високият подходящ праг печели.
 * Ако няма custom скала, ползва се стандартна % скала 2–6.
 */

export const DEFAULT_PERCENT_GRADE_SCALE = [
  { min: 90, grade: 6, label: "Отличен 6" },
  { min: 75, grade: 5, label: "Много добър 5" },
  { min: 60, grade: 4, label: "Добър 4" },
  { min: 50, grade: 3, label: "Среден 3" },
  { min: 0, grade: 2, label: "Слаб 2" },
];

/**
 * @param {number} score
 * @param {{ min: number, grade: number, label: string }[]} scale
 */
export function pickGradeFromScale(score, scale) {
  const n = Number(score);
  const safe = Number.isFinite(n) ? n : 0;
  const sorted = [...(scale || [])].sort((a, b) => Number(b.min) - Number(a.min));
  for (const row of sorted) {
    if (safe >= Number(row.min)) {
      return {
        grade: row.grade,
        label: row.label || `Оценка ${row.grade}`,
      };
    }
  }
  const last = sorted[sorted.length - 1];
  return {
    grade: last?.grade ?? 2,
    label: last?.label || "Слаб 2",
  };
}

/**
 * @param {{
 *   hasDefinedPoints?: boolean,
 *   earnedPoints?: number,
 *   totalDefinedPoints?: number,
 *   correct?: number,
 *   gradable?: number,
 *   firstTryCorrect?: number,
 *   firstTryGradable?: number,
 *   gradeScale?: { min: number, grade: number, label: string }[] | null,
 * }} input
 */
export function computeAssessment(input) {
  const scale =
    Array.isArray(input?.gradeScale) && input.gradeScale.length
      ? input.gradeScale
      : DEFAULT_PERCENT_GRADE_SCALE;

  const usePoints =
    input?.hasDefinedPoints === true &&
    Number(input.totalDefinedPoints) > 0 &&
    Array.isArray(input?.gradeScale) &&
    input.gradeScale.length > 0;

  if (usePoints) {
    const earned = Number(input.earnedPoints) || 0;
    const total = Number(input.totalDefinedPoints) || 0;
    const picked = pickGradeFromScale(earned, scale);
    const percent = total > 0 ? (earned / total) * 100 : 0;
    return {
      ...picked,
      score: earned,
      total,
      percent,
      mode: "points",
      display: picked.label,
    };
  }

  const correct =
    typeof input?.firstTryCorrect === "number"
      ? input.firstTryCorrect
      : Number(input?.correct) || 0;
  const gradable =
    typeof input?.firstTryGradable === "number" && input.firstTryGradable > 0
      ? input.firstTryGradable
      : Number(input?.gradable) || 0;

  const percent = gradable > 0 ? (correct / gradable) * 100 : 0;
  const earned =
    input?.hasDefinedPoints && Number(input.totalDefinedPoints) > 0
      ? Number(input.earnedPoints) || 0
      : correct;
  const total =
    input?.hasDefinedPoints && Number(input.totalDefinedPoints) > 0
      ? Number(input.totalDefinedPoints) || 0
      : gradable;

  // Без custom скала: винаги %; ако има точки без скала — също % от точките
  const scoreForScale =
    input?.hasDefinedPoints && Number(input.totalDefinedPoints) > 0
      ? (Number(input.earnedPoints) / Number(input.totalDefinedPoints)) * 100
      : percent;

  const picked = pickGradeFromScale(scoreForScale, DEFAULT_PERCENT_GRADE_SCALE);
  return {
    ...picked,
    score: earned,
    total,
    percent: scoreForScale,
    mode: input?.hasDefinedPoints ? "points-percent" : "percent",
    display: picked.label,
  };
}
