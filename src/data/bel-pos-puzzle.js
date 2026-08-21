/**
 * БЕЛ – пъзел „Части на речта“
 * Сортирай думите в правилната кошница.
 */

export const POS_CATEGORIES = [
  { id: "noun", label: "Съществително", short: "Същ.", tone: "#3b82f6" },
  { id: "adj", label: "Прилагателно", short: "Прил.", tone: "#8b5cf6" },
  { id: "verb", label: "Глагол", short: "Глаг.", tone: "#ea580c" },
  { id: "adv", label: "Наречие", short: "Нар.", tone: "#059669" },
];

/** Няколко рунда – всеки е отделен пъзел */
export const POS_PUZZLE_ROUNDS = [
  {
    title: "Пъзел 1 – Разпознай думите",
    words: [
      { word: "ученик", cat: "noun" },
      { word: "книга", cat: "noun" },
      { word: "смел", cat: "adj" },
      { word: "красив", cat: "adj" },
      { word: "пиша", cat: "verb" },
      { word: "чета", cat: "verb" },
      { word: "тихо", cat: "adv" },
      { word: "бързо", cat: "adv" },
    ],
  },
  {
    title: "Пъзел 2 – Внимавай за приликите",
    words: [
      { word: "смелост", cat: "noun" },
      { word: "смел", cat: "adj" },
      { word: "смело", cat: "adv" },
      { word: "писмо", cat: "noun" },
      { word: "писмен", cat: "adj" },
      { word: "пиша", cat: "verb" },
      { word: "тишина", cat: "noun" },
      { word: "тих", cat: "adj" },
    ],
  },
  {
    title: "Пъзел 3 – Смесена група",
    words: [
      { word: "деца", cat: "noun" },
      { word: "нова", cat: "adj" },
      { word: "играят", cat: "verb" },
      { word: "навън", cat: "adv" },
      { word: "интересна", cat: "adj" },
      { word: "седмица", cat: "noun" },
      { word: "тичат", cat: "verb" },
      { word: "бавно", cat: "adv" },
    ],
  },
  {
    title: "Пъзел 4 – Финален микс",
    words: [
      { word: "учител", cat: "noun" },
      { word: "весел", cat: "adj" },
      { word: "рисува", cat: "verb" },
      { word: "високо", cat: "adv" },
      { word: "училище", cat: "noun" },
      { word: "зелен", cat: "adj" },
      { word: "скача", cat: "verb" },
      { word: "ясно", cat: "adv" },
    ],
  },
];

export const POS_PUZZLE_LIVES = 3;
