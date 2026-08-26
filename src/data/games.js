/**
 * Хайде да поиграем (/igri).
 * URL: /igri/[slug]
 * Филтри: /igri?class=6&subject=geografia
 *
 * kind:
 * - "quiz": прости MC въпроси
 * - "geo-mode": една мини-игра от Географско приключение (mode: hangman|scramble|sort|odd_one|match)
 * - "did-you-know": факти „Знаеш ли, че…“ + кръстословица
 * - "history-review": начален преговор по история (линия, картинки, свързване)
 * - "bel-6": езикова работилница 6. клас (правопис, времена, причастия…)
 * - "sentence-builder": английски конструктор на изречения (Live Beat 5)
 * - "grammar-detective": хващане на граматически грешки в чат/писмо (Live Beat 5)
 * - "bridge-of-rules": сравнителна и превъзходна степен (Live Beat 5)
 *
 * classNums: масив от класове (напр. ["5","6","7"]).
 * image: път към картинка в /public
 */

import { SUBJECT_LABELS } from "@/lib/subjectLabels";

export const GAMES = [
  {
    slug: "english-sentence-builder-5",
    title: "Английски – The Sentence Builder",
    description:
      "Гръмотевичен конструктор: нареди думите във влакчето. Didn't е лакомо чудовище – изяжда миналото време! Преговор Live Beat (5.–6. клас).",
    subject: "english",
    classNums: ["5", "6"],
    tone: "#ccfbf1",
    accent: "#0d9488",
    status: "ready",
    kind: "sentence-builder",
    image: "/images/english.png",
  },
  {
    slug: "english-grammar-detective-5",
    title: "Английски – Grammar Detective",
    description:
      "Spot the Thief: хвани счупените думи в чата и писмата на извънземното Zorp. Преговор Live Beat (5.–6. клас).",
    subject: "english",
    classNums: ["5", "6"],
    tone: "#e0f2fe",
    accent: "#0284c7",
    status: "ready",
    kind: "grammar-detective",
    image: "/images/english.png",
  },
  {
    slug: "english-bridge-of-rules-5",
    title: "Английски – The Bridge of Rules",
    description:
      "Мостът на сравненията: -er / more за две неща, -est / the most за три+. Преговор Live Beat (5.–6. клас).",
    subject: "english",
    classNums: ["5", "6"],
    tone: "#ffedd5",
    accent: "#d97706",
    status: "ready",
    kind: "bridge-of-rules",
    image: "/images/english.png",
  },
  {
    slug: "bel-6-ezikova-rabotilnica",
    title: "БЕЛ – Езикова работилница 6. клас",
    description:
      "Синоними и омоними, правопис, глаголни времена, причастия, части на изречението и бърз тест.",
    subject: "bg",
    classNums: ["6"],
    tone: "#ffedd5",
    accent: "#c2410c",
    status: "ready",
    kind: "bel-6",
    image: "/images/igri/bg-chasti-rech.png",
  },
  {
    slug: "istoriya-6-nachalen-pregled",
    title: "История – Начален преговор",
    description:
      "6. клас: линия на времето, цивилизации с картинки, понятия и християнството. Подреждане и свързване.",
    subject: "istoriya",
    classNums: ["6"],
    tone: "#f3ebe0",
    accent: "#0f766e",
    status: "ready",
    kind: "history-review",
    image: "/images/igri/istoriya-6/cover.jpg",
  },
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
    slug: "geografia-6-vhodno-avantyura",
    title: "География – Входно приключение 6. клас",
    description: "5 мини-игри: бесилка, разбъркани букви, сортиране, излишното и двойки. По темите от входното ниво.",
    subject: "geografia",
    classNums: ["6"],
    tone: "#e0f2fe",
    accent: "#0284c7",
    status: "ready",
    kind: "geo-vhodno",
    image: "/images/igri/geo-stolitsi.png",
  },
  {
    slug: "priroda-6-labirint",
    title: "Човек и природа – Лабиринт на знанието",
    description:
      "Намери изхода през лабиринта. Отключвай врати с верни отговори по физика, химия и биология.",
    subject: "priroda",
    classNums: ["6"],
    tone: "#d1fae5",
    accent: "#059669",
    status: "ready",
    kind: "nature-maze",
    image: "/images/igri/geo-kontinenti.png",
  },
  {
    slug: "chasti-na-rechta",
    title: "БЕЛ – Части на речта",
    description:
      "Пъзел: нареди думите в кошниците – съществително, прилагателно, глагол или наречие.",
    subject: "bg",
    classNums: ["5", "6", "7"],
    tone: "#ffedd5",
    accent: "#ea580c",
    status: "ready",
    kind: "pos-puzzle",
    image: "/images/igri/bg-chasti-rech.png",
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
