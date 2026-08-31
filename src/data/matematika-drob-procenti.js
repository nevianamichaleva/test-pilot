/** Дроби и проценти – данни за трите мини-игри. */

export const FRACTION_MODES = [
  {
    id: "lab",
    title: "Лаборатория за пица",
    description: "Оцвети точната част от шоколада или пицата.",
    tone: "#fcd34d",
  },
  {
    id: "cards",
    title: "Математически карти",
    description: "Подреди стойностите в правилната кутия.",
    tone: "#93c5fd",
  },
  {
    id: "numberline",
    title: "Постави флага",
    description: "Забий флага на точното място по числовата ос.",
    tone: "#86efac",
  },
];

export const LAB_ROUNDS = [
  {
    theme: "chocolate",
    shape: "rect",
    parts: 4,
    target: 0.75,
    prompt: "Оцвети 75% от шоколада",
    equivalents: ["3/4", "0,75"],
    hint: "75% = 3 от 4 части. Опитай да оцветиш точно 3 квадратчета.",
  },
  {
    theme: "pizza",
    shape: "circle",
    parts: 8,
    target: 0.5,
    prompt: "Вземи 1/2 от пицата",
    equivalents: ["50%", "0,5"],
    hint: "1/2 = половината. Оцвети 4 от 8 парчета.",
  },
  {
    theme: "chocolate",
    shape: "rect",
    parts: 10,
    target: 0.3,
    prompt: "Оцвети 30% от шоколада",
    equivalents: ["3/10", "0,3"],
    hint: "30% = 3 от 10 части.",
  },
  {
    theme: "pizza",
    shape: "circle",
    parts: 4,
    target: 0.25,
    prompt: "Вземи 1/4 от пицата",
    equivalents: ["25%", "0,25"],
    hint: "1/4 = едно парче от четири.",
  },
  {
    theme: "chocolate",
    shape: "rect",
    parts: 5,
    target: 0.6,
    prompt: "Оцвети 60% от шоколада",
    equivalents: ["3/5", "0,6"],
    hint: "60% = 3 от 5 части.",
  },
  {
    theme: "pizza",
    shape: "circle",
    parts: 6,
    target: 0.6666667,
    prompt: "Вземи 2/3 от пицата",
    equivalents: ["≈67%", "0,67"],
    hint: "2/3 = 4 от 6 парчета.",
  },
  {
    theme: "chocolate",
    shape: "rect",
    parts: 8,
    target: 0.875,
    prompt: "Оцвети 87,5% от шоколада",
    equivalents: ["7/8", "0,875"],
    hint: "7/8 = 7 от 8 части.",
  },
  {
    theme: "pizza",
    shape: "circle",
    parts: 5,
    target: 0.4,
    prompt: "Вземи 2/5 от пицата",
    equivalents: ["40%", "0,4"],
    hint: "2/5 = 2 от 5 парчета.",
  },
  {
    theme: "chocolate",
    shape: "rect",
    parts: 4,
    target: 0.5,
    prompt: "Оцвети 50% от шоколада",
    equivalents: ["1/2", "0,5"],
    hint: "50% = половината — 2 от 4 части.",
  },
  {
    theme: "pizza",
    shape: "circle",
    parts: 10,
    target: 0.8,
    prompt: "Вземи 80% от пицата",
    equivalents: ["4/5", "0,8"],
    hint: "80% = 8 от 10 парчета.",
  },
  {
    theme: "chocolate",
    shape: "rect",
    parts: 6,
    target: 0.3333333,
    prompt: "Оцвети 1/3 от шоколада",
    equivalents: ["≈33%", "0,33"],
    hint: "1/3 = 2 от 6 части.",
  },
];

export const CARD_BUCKETS = [
  { id: "lt50", label: "По-малко от 50%" },
  { id: "eq50", label: "Точно 50%" },
  { id: "gt50", label: "Повече от 50%" },
];

export const CARD_ROUNDS = [
  {
    cards: [
      { id: "a", label: "1/4", value: 0.25 },
      { id: "b", label: "0,6", value: 0.6 },
      { id: "c", label: "20%", value: 0.2 },
      { id: "d", label: "4/5", value: 0.8 },
    ],
  },
  {
    cards: [
      { id: "a", label: "1/2", value: 0.5 },
      { id: "b", label: "75%", value: 0.75 },
      { id: "c", label: "0,3", value: 0.3 },
      { id: "d", label: "3/4", value: 0.75 },
      { id: "e", label: "40%", value: 0.4 },
    ],
  },
  {
    cards: [
      { id: "a", label: "2/5", value: 0.4 },
      { id: "b", label: "0,55", value: 0.55 },
      { id: "c", label: "1/10", value: 0.1 },
      { id: "d", label: "50%", value: 0.5 },
      { id: "e", label: "0,9", value: 0.9 },
      { id: "f", label: "3/10", value: 0.3 },
    ],
  },
  {
    cards: [
      { id: "a", label: "0,45", value: 0.45 },
      { id: "b", label: "2/4", value: 0.5 },
      { id: "c", label: "15%", value: 0.15 },
      { id: "d", label: "7/10", value: 0.7 },
      { id: "e", label: "0,05", value: 0.05 },
    ],
  },
  {
    cards: [
      { id: "a", label: "1/5", value: 0.2 },
      { id: "b", label: "0,85", value: 0.85 },
      { id: "c", label: "1/2", value: 0.5 },
      { id: "d", label: "35%", value: 0.35 },
      { id: "d2", label: "0,65", value: 0.65 },
      { id: "e", label: "9/10", value: 0.9 },
    ],
  },
];

export const NUMBERLINE_ROUNDS = [
  {
    target: 0.4,
    prompt: "Постави флага на 40%",
    equivalents: ["2/5", "0,4"],
    hint: "40% е малко след средата на 0 и 50%.",
  },
  {
    target: 0.25,
    prompt: "Постави флага на 1/4",
    equivalents: ["25%", "0,25"],
    hint: "1/4 = 25% — четвърт от пътя от 0 до 100%.",
  },
  {
    target: 0.75,
    prompt: "Постави флага на 75%",
    equivalents: ["3/4", "0,75"],
    hint: "75% = 3/4 — три четвърти от пътя.",
  },
  {
    target: 0.6,
    prompt: "Постави флага на 0,6",
    equivalents: ["60%", "3/5"],
    hint: "0,6 = 60% — малко след средата.",
  },
  {
    target: 0.5,
    prompt: "Постави флага на 50%",
    equivalents: ["1/2", "0,5"],
    hint: "50% е точно по средата между 0 и 100%.",
  },
  {
    target: 0.2,
    prompt: "Постави флага на 1/5",
    equivalents: ["20%", "0,2"],
    hint: "1/5 = 20% — близо до началото на скалата.",
  },
  {
    target: 0.8,
    prompt: "Постави флага на 80%",
    equivalents: ["4/5", "0,8"],
    hint: "80% = 4/5 — близо до края на скалата.",
  },
  {
    target: 0.125,
    prompt: "Постави флага на 1/8",
    equivalents: ["12,5%", "0,125"],
    hint: "1/8 = 12,5% — малко след 0%.",
  },
  {
    target: 0.33,
    prompt: "Постави флага на ≈33%",
    equivalents: ["1/3", "0,33"],
    hint: "1/3 ≈ 33% — една трета от пътя.",
  },
  {
    target: 0.9,
    prompt: "Постави флага на 90%",
    equivalents: ["9/10", "0,9"],
    hint: "90% = 9/10 — почти в края на скалата.",
  },
];

/** @param {number} value */
export function bucketForValue(value) {
  if (Math.abs(value - 0.5) < 0.001) return "eq50";
  return value < 0.5 ? "lt50" : "gt50";
}

/** @param {number} value */
export function formatPercent(value) {
  const pct = Math.round(value * 100);
  return `${pct}%`;
}

/** @param {number} filled @param {number} total @param {number} target */
export function valuesMatch(filled, total, target) {
  const actual = filled / total;
  return Math.abs(actual - target) < 0.001;
}

/** @param {number} pos 0–1 @param {number} target */
export function numberLineMatch(pos, target) {
  return Math.abs(pos - target) <= 0.03;
}

/** @param {number} target @param {number} parts */
export function targetPartCount(target, parts) {
  return Math.round(target * parts);
}

export function totalCardCount() {
  return CARD_ROUNDS.reduce((sum, round) => sum + round.cards.length, 0);
}

/** @param {number} roundIndex @param {string} cardId */
export function cardQuestionNumber(roundIndex, cardId) {
  let offset = 0;
  for (let i = 0; i < roundIndex; i += 1) {
    offset += CARD_ROUNDS[i].cards.length;
  }
  const idx = CARD_ROUNDS[roundIndex]?.cards.findIndex((c) => c.id === cardId) ?? -1;
  return idx >= 0 ? offset + idx + 1 : offset + 1;
}

/** @param {string} bucketId */
export function bucketLabel(bucketId) {
  return CARD_BUCKETS.find((b) => b.id === bucketId)?.label ?? bucketId;
}

export function taskTotalForMode(mode) {
  if (mode === "lab") return LAB_ROUNDS.length;
  if (mode === "cards") return totalCardCount();
  if (mode === "numberline") return NUMBERLINE_ROUNDS.length;
  return 0;
}
