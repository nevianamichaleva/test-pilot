/** Геометрия 5. клас – данни за визуалните мини-игри. */

export const GEOMETRY_MODES = [
  {
    id: "shapes",
    title: "Фигурна сортировка",
    description: "Подреди фигурите в правилната кутия.",
    tone: "#c4b5fd",
  },
  {
    id: "angles",
    title: "Ъглови карти",
    description: "Класифицирай ъглите: остър, прав или тъп.",
    tone: "#fde68a",
  },
  {
    id: "symmetry",
    title: "Огледална симетрия",
    description: "Довърши фигурата като огледален образ.",
    tone: "#a5f3fc",
  },
  {
    id: "perimeter",
    title: "Обиколка на решетка",
    description: "Преброй външните страни на фигурата.",
    tone: "#bbf7d0",
  },
];

export const SHAPE_BUCKETS = [
  { id: "triangle", label: "Триъгълник" },
  { id: "quad", label: "Четириъгълник" },
  { id: "circle", label: "Кръг" },
  { id: "polygon", label: "Многоъгълник" },
];

/** @type {Array<{ id: string, label: string, bucket: string, sides: number }>} */
export const SHAPE_CARDS = [
  { id: "s1", label: "Равностранен △", bucket: "triangle", sides: 3 },
  { id: "s2", label: "Равнобедрен △", bucket: "triangle", sides: 3 },
  { id: "s3", label: "Разностранен △", bucket: "triangle", sides: 3 },
  { id: "s4", label: "Квадрат", bucket: "quad", sides: 4 },
  { id: "s5", label: "Правоъгълник", bucket: "quad", sides: 4 },
  { id: "s6", label: "Ромб", bucket: "quad", sides: 4 },
  { id: "s7", label: "Успоредник", bucket: "quad", sides: 4 },
  { id: "s8", label: "трапец", bucket: "quad", sides: 4 },
  { id: "s9", label: "Кръг", bucket: "circle", sides: 0 },
  { id: "s10", label: "Елипса", bucket: "circle", sides: 0 },
  { id: "s11", label: "Петоъгълник", bucket: "polygon", sides: 5 },
  { id: "s12", label: "Шестоъгълник", bucket: "polygon", sides: 6 },
  { id: "s13", label: "Октоъгълник", bucket: "polygon", sides: 8 },
];

export const SHAPE_ROUNDS = [
  { cards: ["s1", "s4", "s9", "s5"] },
  { cards: ["s2", "s6", "s10", "s11"] },
  { cards: ["s3", "s7", "s12", "s8", "s9"] },
  { cards: ["s1", "s5", "s11", "s13", "s4", "s10"] },
];

export const ANGLE_BUCKETS = [
  { id: "acute", label: "Остър ъгъл (< 90°)" },
  { id: "right", label: "Прав ъгъл (90°)" },
  { id: "obtuse", label: "Тъп ъгъл (> 90°)" },
];

/** @type {Array<{ id: string, label: string, degrees: number, bucket: string }>} */
export const ANGLE_CARDS = [
  { id: "a1", label: "30°", degrees: 30, bucket: "acute" },
  { id: "a2", label: "45°", degrees: 45, bucket: "acute" },
  { id: "a3", label: "60°", degrees: 60, bucket: "acute" },
  { id: "a4", label: "90°", degrees: 90, bucket: "right" },
  { id: "a5", label: "100°", degrees: 100, bucket: "obtuse" },
  { id: "a6", label: "120°", degrees: 120, bucket: "obtuse" },
  { id: "a7", label: "135°", degrees: 135, bucket: "obtuse" },
  { id: "a8", label: "150°", degrees: 150, bucket: "obtuse" },
  { id: "a9", label: "75°", degrees: 75, bucket: "acute" },
  { id: "a10", label: "110°", degrees: 110, bucket: "obtuse" },
];

export const ANGLE_ROUNDS = [
  { cards: ["a1", "a4", "a6", "a2"] },
  { cards: ["a3", "a5", "a7", "a4", "a9"] },
  { cards: ["a2", "a8", "a10", "a4", "a1", "a6"] },
];

/**
 * Симетрия: axis "v" = вертикална ос, "h" = хоризонтална.
 * filled: [row, col] клетки на „готовата“ половина.
 * @type {Array<{ id: string, rows: number, cols: number, axis: string, axisIndex: number, filled: number[][], hint: string }>}
 */
export const SYMMETRY_ROUNDS = [
  {
    id: "sym1",
    rows: 4,
    cols: 6,
    axis: "v",
    axisIndex: 2,
    filled: [
      [0, 0],
      [1, 0],
      [1, 1],
      [2, 0],
    ],
    hint: "Всяка оцветена клетка има „близнак“ от другата страна на оста.",
  },
  {
    id: "sym2",
    rows: 6,
    cols: 6,
    axis: "v",
    axisIndex: 3,
    filled: [
      [0, 0],
      [0, 1],
      [1, 0],
      [2, 1],
      [3, 0],
    ],
    hint: "Огледалният образ е на същото разстояние от оста.",
  },
  {
    id: "sym3",
    rows: 6,
    cols: 8,
    axis: "h",
    axisIndex: 2,
    filled: [
      [0, 1],
      [0, 3],
      [1, 2],
    ],
    hint: "При хоризонтална ос редът се отразява нагоре/надолу.",
  },
  {
    id: "sym4",
    rows: 4,
    cols: 8,
    axis: "v",
    axisIndex: 4,
    filled: [
      [0, 0],
      [0, 1],
      [1, 2],
      [2, 1],
      [3, 0],
    ],
    hint: "Провери кой ред и колона отговарят на оцветените клетки.",
  },
  {
    id: "sym5",
    rows: 6,
    cols: 6,
    axis: "h",
    axisIndex: 2,
    filled: [
      [0, 2],
      [1, 1],
      [1, 3],
      [1, 4],
    ],
    hint: "Симетричната клетка е на същата колона, но от другата страна на оста.",
  },
];

/**
 * @type {Array<{ id: string, prompt: string, cells: number[][], options: number[], answer: number, hint: string }>}
 */
export const PERIMETER_ROUNDS = [
  {
    id: "p1",
    prompt: "Колко е обиколката на квадрата?",
    cells: [
      [1, 1],
      [1, 2],
      [2, 1],
      [2, 2],
    ],
    options: [8, 10, 12],
    answer: 8,
    hint: "Квадрат 2×2: 2+2+2+2 = 8 единици по ръба.",
  },
  {
    id: "p2",
    prompt: "Колко е обиколката на правоъгълника?",
    cells: [
      [1, 1],
      [1, 2],
      [1, 3],
      [2, 1],
      [2, 2],
      [2, 3],
    ],
    options: [10, 12, 14],
    answer: 10,
    hint: "3 единици + 2 единици + 3 + 2 = 10.",
  },
  {
    id: "p3",
    prompt: "Преброй външните страни на фигурата:",
    cells: [
      [1, 1],
      [1, 2],
      [2, 1],
      [2, 2],
      [2, 3],
    ],
    options: [8, 10, 12],
    answer: 10,
    hint: "Фигурата във формата „Г“ — броим всеки външен сегмент.",
  },
  {
    id: "p4",
    prompt: "Колко е обиколката?",
    cells: [
      [1, 2],
      [2, 1],
      [2, 2],
      [2, 3],
      [3, 2],
    ],
    options: [12, 14, 16],
    answer: 12,
    hint: "Кръстовидна фигура – внимавай да не броиш вътрешните страни.",
  },
  {
    id: "p5",
    prompt: "Колко е обиколката на фигурата?",
    cells: [
      [1, 1],
      [1, 2],
      [1, 3],
      [1, 4],
      [2, 1],
      [2, 4],
      [3, 1],
      [3, 4],
    ],
    options: [16, 18, 20],
    answer: 18,
    hint: "Кух правоъгълник: броим само външните страни на клетките.",
  },
  {
    id: "p6",
    prompt: "Преброй обиколката:",
    cells: [
      [2, 1],
      [2, 2],
      [2, 3],
      [3, 1],
      [3, 2],
      [3, 3],
    ],
    options: [8, 10, 12],
    answer: 10,
    hint: "2×3 клетки — обиколката обхваща само външния контур.",
  },
];

export function shapeById(id) {
  return SHAPE_CARDS.find((c) => c.id === id);
}

export function angleById(id) {
  return ANGLE_CARDS.find((c) => c.id === id);
}

export function bucketLabelShape(bucketId) {
  return SHAPE_BUCKETS.find((b) => b.id === bucketId)?.label ?? bucketId;
}

export function bucketLabelAngle(bucketId) {
  return ANGLE_BUCKETS.find((b) => b.id === bucketId)?.label ?? bucketId;
}

/** @param {number} roundIndex @param {string} cardId */
export function shapeQuestionNumber(roundIndex, cardId) {
  let n = 0;
  for (let i = 0; i < roundIndex; i += 1) n += SHAPE_ROUNDS[i].cards.length;
  const idx = SHAPE_ROUNDS[roundIndex]?.cards.indexOf(cardId) ?? -1;
  return idx >= 0 ? n + idx + 1 : n + 1;
}

/** @param {number} roundIndex @param {string} cardId */
export function angleQuestionNumber(roundIndex, cardId) {
  let n = 0;
  for (let i = 0; i < roundIndex; i += 1) n += ANGLE_ROUNDS[i].cards.length;
  const idx = ANGLE_ROUNDS[roundIndex]?.cards.indexOf(cardId) ?? -1;
  return idx >= 0 ? n + idx + 1 : n + 1;
}

export function totalShapeCards() {
  return SHAPE_ROUNDS.reduce((s, r) => s + r.cards.length, 0);
}

export function totalAngleCards() {
  return ANGLE_ROUNDS.reduce((s, r) => s + r.cards.length, 0);
}

/** @param {typeof SYMMETRY_ROUNDS[0]} round */
export function mirrorCell(round, row, col) {
  if (round.axis === "v") {
    const dist = round.axisIndex - col;
    return [row, round.axisIndex + dist];
  }
  const dist = round.axisIndex - row;
  return [round.axisIndex + dist, col];
}

/** @param {typeof SYMMETRY_ROUNDS[0]} round */
export function targetMirrorCells(round) {
  return round.filled.map(([r, c]) => mirrorCell(round, r, c));
}

/** @param {typeof SYMMETRY_ROUNDS[0]} round @param {number} row @param {number} col */
export function isOnMirrorSide(round, row, col) {
  if (round.axis === "v") {
    return col > round.axisIndex;
  }
  return row > round.axisIndex;
}

/** @param {typeof SYMMETRY_ROUNDS[0]} round @param {number} row @param {number} col */
export function isOnSourceSide(round, row, col) {
  if (round.axis === "v") {
    return col < round.axisIndex;
  }
  return row < round.axisIndex;
}

/** @param {number[][]} cells */
export function computeGridPerimeter(cells) {
  const set = new Set(cells.map(([r, c]) => `${r},${c}`));
  let perimeter = 0;
  for (const [r, c] of cells) {
    const neighbors = [
      [r - 1, c],
      [r + 1, c],
      [r, c - 1],
      [r, c + 1],
    ];
    for (const [nr, nc] of neighbors) {
      if (!set.has(`${nr},${nc}`)) perimeter += 1;
    }
  }
  return perimeter;
}

export function taskTotalForGeometryMode(mode) {
  if (mode === "shapes") return totalShapeCards();
  if (mode === "angles") return totalAngleCards();
  if (mode === "symmetry") return SYMMETRY_ROUNDS.length;
  if (mode === "perimeter") return PERIMETER_ROUNDS.length;
  return 0;
}
