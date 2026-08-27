/**
 * The Verb Magnet – do / play / make collocations
 * Diagnostic English Test · Grade 6 (Preparation)
 *
 * PLAY = отборни спортове с топка
 * DO   = индивидуални активности без топка
 * MAKE = създаване на нещо физическо
 *
 * Класическа грешка: make gymnastics (буквално от „правя гимнастика“).
 */

/**
 * @typedef {'do' | 'play' | 'make'} MagnetVerb
 * @typedef {{
 *   id: string,
 *   text: string,
 *   verb: MagnetVerb,
 *   tips?: Partial<Record<MagnetVerb, string>>,
 * }} MagnetWord
 * @typedef {{ id: string, title: string, words: MagnetWord[] }} MagnetRound
 */

export const MAGNET_VERBS = [
  {
    id: "do",
    label: "DO",
    rule: "индивидуално, без топка",
    tone: "#b45309",
  },
  {
    id: "play",
    label: "PLAY",
    rule: "спорт с топка / отбор",
    tone: "#0f766e",
  },
  {
    id: "make",
    label: "MAKE",
    rule: "създаваш нещо",
    tone: "#9a3412",
  },
];

/** @type {MagnetRound[]} */
export const MAGNET_ROUNDS = [
  {
    id: "wave-1",
    title: "Първа вълна",
    words: [
      {
        id: "gymnastics",
        text: "gymnastics",
        verb: "do",
        tips: {
          make: "Не е „правя гимнастика“ → make. Без топка, индивидуално → do gymnastics.",
          play: "Гимнастиката не е спорт с топка. Индивидуално → do gymnastics.",
        },
      },
      {
        id: "homework",
        text: "homework",
        verb: "do",
        tips: {
          make: "Не създаваш домашното като торта. Училищна задача → do homework.",
          play: "Домашното не е игра. → do homework.",
        },
      },
      {
        id: "football",
        text: "football",
        verb: "play",
        tips: {
          do: "Футболът е отборен спорт с топка → play football.",
          make: "Не правиш топката – играеш. → play football.",
        },
      },
      {
        id: "tennis",
        text: "tennis",
        verb: "play",
        tips: {
          do: "Тенисът е спорт с топка → play tennis.",
          make: "Не създаваш тениса. С топка → play tennis.",
        },
      },
      {
        id: "cake",
        text: "a cake",
        verb: "make",
        tips: {
          do: "Тортата се създава в кухнята → make a cake.",
          play: "Не се играе торта. Създаваш я → make a cake.",
        },
      },
      {
        id: "judo",
        text: "judo",
        verb: "do",
        tips: {
          play: "Джудото е без топка и е индивидуално → do judo.",
          make: "Не създаваш джудо. Активност без топка → do judo.",
        },
      },
    ],
  },
  {
    id: "wave-2",
    title: "Втора вълна",
    words: [
      {
        id: "karate",
        text: "karate",
        verb: "do",
        tips: {
          play: "Каратето е индивидуално, без топка → do karate.",
          make: "Не създаваш карате. → do karate.",
        },
      },
      {
        id: "basketball",
        text: "basketball",
        verb: "play",
        tips: {
          do: "Баскетболът е отборен спорт с топка → play basketball.",
          make: "Играеш, не правиш баскетбол. → play basketball.",
        },
      },
      {
        id: "sandwich",
        text: "a sandwich",
        verb: "make",
        tips: {
          do: "Сандвичът се прави (създава) → make a sandwich.",
          play: "Не се играе сандвич. → make a sandwich.",
        },
      },
      {
        id: "yoga",
        text: "yoga",
        verb: "do",
        tips: {
          play: "Йогата е индивидуална, без топка → do yoga.",
          make: "Не създаваш йога. → do yoga.",
        },
      },
      {
        id: "volleyball",
        text: "volleyball",
        verb: "play",
        tips: {
          do: "Волейболът е отборен спорт с топка → play volleyball.",
          make: "Играеш волейбол. → play volleyball.",
        },
      },
      {
        id: "card",
        text: "a card",
        verb: "make",
        tips: {
          do: "Правиш картичка – създаваш я → make a card.",
          play: "Тук не е игра на карти, а да направиш картичка → make a card.",
        },
      },
    ],
  },
];

export const MAGNET_LIVES = 3;

export function verbById(id) {
  return MAGNET_VERBS.find((v) => v.id === id);
}
