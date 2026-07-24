/**
 * Хайде да поиграем (/igri).
 * URL: /igri/[slug]
 * Филтри: /igri?class=6&subject=geografia
 *
 * kind:
 * - "quiz": прости MC въпроси
 * - "geo-mode": една мини-игра от Географско приключение (mode: hangman|scramble|sort|odd_one|match)
 * - "did-you-know": факти „Знаеш ли, че…“ + кръстословица
 *
 * classNums: масив от класове (напр. ["5","6","7"]).
 * image: път към картинка в /public
 */

import { SUBJECT_LABELS } from "@/lib/subjectLabels";

export const GAMES = [
  {
    slug: "geografia-znaesh-li-yuzhna-amerika-6",
    title: "География – Знаеш ли, че…",
    description:
      "Южна Америка: прочети весели факти и после реши кръстословицата. По 5 точки за дума!",
    subject: "geografia",
    classNums: ["6"],
    tone: "#bae6fd",
    accent: "#0284c7",
    status: "ready",
    kind: "did-you-know",
    image: "/images/igri/geo-znaesh-li.png",
  },
  {
    slug: "geografia-besilka-6",
    title: "География – Бесилка",
    description: "Познай географското понятие по описание. Весела бесилка за 6. клас.",
    subject: "geografia",
    classNums: ["6"],
    tone: "#bfdbfe",
    accent: "#2563eb",
    status: "ready",
    kind: "geo-mode",
    mode: "hangman",
    image: "/images/igri/geo-besilka.png",
  },
  {
    slug: "geografia-razbarkani-bukvi-6",
    title: "География – Разбъркани букви",
    description: "Подреди буквите и познай географския обект.",
    subject: "geografia",
    classNums: ["6"],
    tone: "#a7f3d0",
    accent: "#059669",
    status: "ready",
    kind: "geo-mode",
    mode: "scramble",
    image: "/images/igri/geo-razbarkani.png",
  },
  {
    slug: "geografia-kontinenti-6",
    title: "География – Континенти",
    description: "На кой континент се намира обектът? Сортирай бързо и точно.",
    subject: "geografia",
    classNums: ["6"],
    tone: "#fde68a",
    accent: "#d97706",
    status: "ready",
    kind: "geo-mode",
    mode: "sort",
    image: "/images/igri/geo-kontinenti.png",
  },
  {
    slug: "geografia-izlishnoto-6",
    title: "География – Излишното",
    description: "Открий кой обект или понятие не принадлежи към групата.",
    subject: "geografia",
    classNums: ["6"],
    tone: "#ddd6fe",
    accent: "#7c3aed",
    status: "ready",
    kind: "geo-mode",
    mode: "odd_one",
    image: "/images/igri/geo-izlishnoto.png",
  },
  {
    slug: "geografia-dvoiki-6",
    title: "География – Двойки",
    description: "Свържи понятията с верните им дефиниции.",
    subject: "geografia",
    classNums: ["6"],
    tone: "#fecdd3",
    accent: "#e11d48",
    status: "ready",
    kind: "geo-mode",
    mode: "match",
    image: "/images/igri/geo-dvoiki.png",
  },
  {
    slug: "chasti-na-rechta",
    title: "БЕЛ – Части на речта",
    description: "Бързи въпроси: разпознай съществително, прилагателно, глагол и наречие.",
    subject: "bg",
    classNums: ["5", "6", "7"],
    tone: "#ffedd5",
    accent: "#ea580c",
    status: "ready",
    kind: "quiz",
    image: "/images/igri/bg-chasti-rech.png",
    questions: [
      {
        q: "Коя дума е съществително име?",
        correct: "ученик",
        wrong1: "бързо",
        wrong2: "четя",
        wrong3: "красив",
      },
      {
        q: "Коя дума е прилагателно име?",
        correct: "смел",
        wrong1: "смелост",
        wrong2: "смело",
        wrong3: "смее се",
      },
      {
        q: "Коя дума е глагол?",
        correct: "пиша",
        wrong1: "писмо",
        wrong2: "писмен",
        wrong3: "писмено",
      },
      {
        q: "Коя дума е наречие?",
        correct: "тихо",
        wrong1: "тишина",
        wrong2: "тих",
        wrong3: "затихвам",
      },
      {
        q: "В изречението „Децата играят навън.“ думата „навън“ е:",
        correct: "наречие",
        wrong1: "предлог",
        wrong2: "съществително",
        wrong3: "прилагателно",
      },
      {
        q: "В изречението „Новата книга е интересна.“ думата „новата“ е:",
        correct: "прилагателно име",
        wrong1: "наречие",
        wrong2: "глагол",
        wrong3: "съюз",
      },
      {
        q: "Коя дума НЕ е изменяема част на речта?",
        correct: "предлог",
        wrong1: "глагол",
        wrong2: "съществително",
        wrong3: "местоимение",
      },
      {
        q: "Коя дума е числително име?",
        correct: "седем",
        wrong1: "седмица",
        wrong2: "седмичен",
        wrong3: "седмично",
      },
    ],
  },
  {
    slug: "stolitsi-evropa",
    title: "География – Столици на Европа",
    description: "Познай столицата на европейската държава. Бърза и цветна игра.",
    subject: "geografia",
    classNums: ["5", "6", "7"],
    tone: "#cffafe",
    accent: "#0891b2",
    status: "ready",
    kind: "quiz",
    image: "/images/igri/geo-stolitsi.png",
    questions: [
      {
        q: "Коя е столицата на Франция?",
        correct: "Париж",
        wrong1: "Лион",
        wrong2: "Марсилия",
        wrong3: "Бордо",
      },
      {
        q: "Коя е столицата на Италия?",
        correct: "Рим",
        wrong1: "Милано",
        wrong2: "Венеция",
        wrong3: "Неапол",
      },
      {
        q: "Коя е столицата на Германия?",
        correct: "Берлин",
        wrong1: "Мюнхен",
        wrong2: "Хамбург",
        wrong3: "Франкфурт",
      },
      {
        q: "Коя е столицата на Гърция?",
        correct: "Атина",
        wrong1: "Солун",
        wrong2: "Патра",
        wrong3: "Ираклион",
      },
      {
        q: "Коя е столицата на Испания?",
        correct: "Мадрид",
        wrong1: "Барселона",
        wrong2: "Валенсия",
        wrong3: "Севиля",
      },
      {
        q: "Коя е столицата на Полша?",
        correct: "Варшава",
        wrong1: "Краков",
        wrong2: "Гданск",
        wrong3: "Вроцлав",
      },
      {
        q: "Коя е столицата на Румъния?",
        correct: "Букурещ",
        wrong1: "Клуж-Напока",
        wrong2: "Тимишоара",
        wrong3: "Яш",
      },
      {
        q: "Коя е столицата на Австрия?",
        correct: "Виена",
        wrong1: "Залцбург",
        wrong2: "Грац",
        wrong3: "Инсбрук",
      },
    ],
  },
];

function normalizeClassNums(classNums) {
  if (!Array.isArray(classNums)) return [];
  return classNums
    .map((c) => {
      const n = Number(c);
      return Number.isFinite(n) ? String(n) : String(c ?? "").trim();
    })
    .filter(Boolean);
}

export function formatGameClassHint(classNums) {
  const nums = normalizeClassNums(classNums);
  if (nums.length === 0) return "";
  if (nums.length === 1) return `${nums[0]}. клас`;
  const sorted = [...nums].sort((a, b) => Number(a) - Number(b));
  return `${sorted[0]}.–${sorted[sorted.length - 1]}. клас`;
}

export function gameMatchesClass(game, classNum) {
  if (!classNum) return true;
  const nums = normalizeClassNums(game.classNums);
  return nums.includes(String(classNum));
}

export function getAllGames() {
  return GAMES.map(({ questions, ...rest }) => {
    const classNums = normalizeClassNums(rest.classNums);
    return {
      ...rest,
      classNums,
      subjectLabel: SUBJECT_LABELS[rest.subject] ?? rest.subject,
      classHint: formatGameClassHint(classNums),
      questionCount: Array.isArray(questions) ? questions.length : 0,
    };
  });
}

export function getGameBySlug(slug) {
  const list = getAllGames();
  const found = list.find((g) => g.slug === slug);
  if (!found) return null;
  const raw = GAMES.find((g) => g.slug === slug);
  return raw?.questions ? { ...found, questions: raw.questions } : found;
}
