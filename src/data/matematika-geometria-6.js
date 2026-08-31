/** Геометрия 6. клас – мрежи, лице, класификатор. */

export const GEOMETRY6_MODES = [
  {
    id: "nets",
    title: "Магически мрежи",
    description: "Избери разгъвката, която съответства на 3D тялото.",
    tone: "#ddd6fe",
  },
  {
    id: "area",
    title: "Лице чрез пренареждане",
    description: "Премести △ и виж защо S = a · h.",
    tone: "#bfdbfe",
  },
  {
    id: "detector",
    title: "Геометричен детектор",
    description: "Сортирай фигурите по геометрични свойства.",
    tone: "#fde68a",
  },
];

export const NET_BODIES = {
  cube: { label: "Куб", emoji: "🧊" },
  prism: { label: "Правоъгълен паралелепипед", emoji: "📦" },
  cylinder: { label: "Цилиндър", emoji: "🥫" },
};

export const NET_ROUNDS = [
  {
    id: "n1",
    body: "cube",
    correct: "cube-cross",
    options: ["cube-cross", "cube-l", "cube-z", "cube-t"],
    hint: "Кубът има 6 квадратни стени. Търси мрежа от 6 равни квадрата.",
  },
  {
    id: "n2",
    body: "prism",
    correct: "prism-box",
    options: ["prism-box", "prism-l", "prism-cross", "prism-wrong"],
    hint: "Паралелепипедът има 6 правоъгълни стени — като разгъната кутия.",
  },
  {
    id: "n3",
    body: "cylinder",
    correct: "cylinder-roll",
    options: ["cylinder-roll", "cylinder-cross", "cylinder-l", "cylinder-wrong"],
    hint: "Цилиндърът: 2 кръга (основи) + 1 правоъгълник (околна повърхнина).",
  },
  {
    id: "n4",
    body: "cube",
    correct: "cube-cross",
    options: ["cube-t", "cube-cross", "cube-z", "cube-l"],
    hint: "Класическата кръстовидна мрежа на куб.",
  },
  {
    id: "n5",
    body: "prism",
    correct: "prism-box",
    options: ["prism-wrong", "prism-box", "prism-l", "prism-cross"],
    hint: "4 стени + 2 основи в един ред.",
  },
];

export const AREA_ROUNDS = [
  {
    id: "area1",
    kind: "parallelogram",
    base: 6,
    height: 4,
    prompt: "Премести триъгълника и направи правоъгълник",
    hint: "Когато △ пасне точно, получаваш правоъгълник с площ a · h.",
  },
  {
    id: "area2",
    kind: "parallelogram",
    base: 5,
    height: 3,
    prompt: "Отрежи △ отляво и го постави отдясно",
    hint: "Брои квадратчетата: 5 × 3 = 15 единицы площ.",
  },
  {
    id: "area3",
    kind: "trapezoid",
    baseA: 6,
    baseB: 4,
    height: 3,
    prompt: "Трапец → два △ + правоъгълник по средата",
    hint: "S = (a + b) / 2 · h. Средната линия е (6+4)/2 = 5, после × 3 = 15.",
  },
  {
    id: "area4",
    kind: "parallelogram",
    base: 8,
    height: 2,
    prompt: "Перфектно съвпадение → правоъгълник",
    hint: "8 · 2 = 16 квадратчета на мрежата.",
  },
];

export const DETECTOR_BUCKETS = [
  { id: "parallel", label: "Има поне една двойка успоредни страни" },
  { id: "equal", label: "Всички страни са равни" },
  { id: "obtuse", label: "Има тъп ъгъл" },
];

/** @type {Array<{ id: string, label: string, bucket: string, icon: string }>} */
export const DETECTOR_FIGURES = [
  { id: "f1", label: "Oстроъгълен △", bucket: "parallel", icon: "acute" },
  { id: "f2", label: "Тъпоъгълен △", bucket: "obtuse", icon: "obtuse" },
  { id: "f3", label: "Равностранен △", bucket: "equal", icon: "equilateral" },
  { id: "f4", label: "Квадрат", bucket: "equal", icon: "square" },
  { id: "f5", label: "Ромб", bucket: "equal", icon: "rhombus" },
  { id: "f6", label: "Успоредник", bucket: "parallel", icon: "parallelogram" },
  { id: "f7", label: "трапец", bucket: "parallel", icon: "trapezoid" },
  { id: "f8", label: "Правоъгълник", bucket: "parallel", icon: "rectangle" },
];

export const DETECTOR_ROUNDS = [
  { cards: ["f2", "f4", "f6", "f3"] },
  { cards: ["f7", "f5", "f8", "f2"] },
  { cards: ["f2", "f7", "f4", "f6", "f3"] },
];

export function detectorById(id) {
  return DETECTOR_FIGURES.find((f) => f.id === id);
}

export function bucketLabelDetector(bucketId) {
  return DETECTOR_BUCKETS.find((b) => b.id === bucketId)?.label ?? bucketId;
}

export function detectorQuestionNumber(roundIndex, cardId) {
  let n = 0;
  for (let i = 0; i < roundIndex; i += 1) n += DETECTOR_ROUNDS[i].cards.length;
  const idx = DETECTOR_ROUNDS[roundIndex]?.cards.indexOf(cardId) ?? -1;
  return idx >= 0 ? n + idx + 1 : n + 1;
}

export function taskTotalForGeometry6Mode(mode) {
  if (mode === "nets") return NET_ROUNDS.length;
  if (mode === "area") return AREA_ROUNDS.length;
  if (mode === "detector") {
    return DETECTOR_ROUNDS.reduce((s, r) => s + r.cards.length, 0);
  }
  return 0;
}

export const GEOMETRY6_QUIZ = [
  {
    q: "Намерете лицето на триъгълник със страна a = 8 см и съответна височина h_a = 5 см.",
    correct: "20 кв. см",
    wrong1: "40 кв. см",
    wrong2: "13 кв. см",
    wrong3: "10 кв. см",
    hint: "Формулата за лице на триъгълник: умножи страната по височината и раздели на 2.",
    reasons: {
      "20 кв. см":
        "Правилно! S = (a · h_a) / 2 = (8 · 5) / 2 = 20 кв. см.",
      "40 кв. см":
        "Забравил си да разделиш на 2. a · h е за успоредник; триъгълникът е половината.",
      "13 кв. см": "8 + 5 = 13 е събиране, не формула за лице.",
      "10 кв. см": "Правилно е (8 · 5) ÷ 2 = 20, не 10.",
    },
  },
  {
    q: "Трапец: основи a = 6 см, b = 4 см, височина h = 3 см. Колко е лицето S?",
    correct: "15 кв. см",
    wrong1: "30 кв. см",
    wrong2: "12 кв. см",
    wrong3: "24 кв. см",
    hint: "Събери основите, раздели на 2, умножи по височината.",
    reasons: {
      "15 кв. см":
        "Правилно! S = (a + b) / 2 · h = (6 + 4) / 2 · 3 = 15 кв. см.",
      "30 кв. см": "Умножил си (6 + 4) · 3, но не си разделил на 2.",
      "12 кв. см": "Провери: (6 + 4) / 2 = 5, после 5 · 3 = 15.",
      "24 кв. см": "Резултатът не следва от формулата с тези числа.",
    },
  },
  {
    q: "Паралелепипед: a = 5 см, b = 4 см, c = 3 см. Колко е обемът V?",
    correct: "60 куб. см",
    wrong1: "12 куб. см",
    wrong2: "20 куб. см",
    wrong3: "50 куб. см",
    hint: "Обем = a · b · c — умножи трите измерения.",
    reasons: {
      "60 куб. см": "Правилно! V = 5 · 4 · 3 = 60 куб. см.",
      "12 куб. см": "Умножил си само b · c — липсва a.",
      "20 куб. см": "20 е лицето на основата (5 · 4), но трябва и × 3.",
      "50 куб. см": "5 · 4 · 3 = 60, не 50.",
    },
  },
  {
    q: "Кое тяло има две успоредни кръгли основи и заоблена околна повърхнина?",
    correct: "Цилиндър",
    wrong1: "Конус",
    wrong2: "Кълбо",
    wrong3: "Куб",
    hint: "Помисли за кутийка с кръгло дъно и капаче.",
    reasons: {
      Цилиндър:
        "Правилно! Две кръгли основи + разгъната околна повърхнина (правоъгълник).",
      Конус: "Конусът има само една основа и един връх.",
      Кълбо: "Кълбото няма плоски основи.",
      Куб: "Кубът има квадратни, не кръгли стени.",
    },
  },
];
