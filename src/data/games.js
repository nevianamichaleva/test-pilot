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
 * - "bel-train-driver": подлог и сказуемо – „Кой кара влака?“ (6. клас)
 * - "bel-gift-boxes": допълнение – „Подаръци в кутии“ (6. клас)
 * - "bel-color-painter": определение – „Цветният художник“ (6. клас)
 * - "sentence-builder": английски конструктор на изречения (5. клас)
 * - "grammar-detective": хващане на граматически грешки в чат/писмо (5. клас)
 * - "bridge-of-rules": сравнителна и превъзходна степен (5. клас)
 * - "signal-light": Present Simple vs Continuous – сигнална лампа (Grade 6 Diagnostic)
 * - "verb-magnet": do / play / make – магнит за глаголи (Grade 6 Diagnostic)
 * - "hint-hangman": бесеница с контекст, гласни и иконки (Grade 6 Diagnostic 11–15)
 * - "text-detective": True/False + маркирай доказателството в текста (Diagnostic 16–20)
 * - "fraction-mode": една мини-игра за дроби и проценти (mode: lab|cards|numberline)
 * - "geometry-adventure": визуални игри по геометрия 5. клас (меню)
 * - "geometry-mode": една геометрична мини-игра (mode: shapes|angles|symmetry|perimeter)
 * - "geometry6-adventure": визуални игри по геометрия 6. клас (меню)
 * - "geometry6-mode": една геометрична мини-игра 6. клас (mode: nets|area|detector)
 * - "phrase-cards": фразеологични карти — свържи фраза и значение
 *
 * classNums: масив от класове (напр. ["5","6","7"]).
 * image: път към картинка в /public
 */

import { SUBJECT_LABELS } from "@/lib/subjectLabels";
import { GEOMETRY6_QUIZ } from "@/data/matematika-geometria-6";

export const GAMES = [
  {
    slug: "bel-frazeologichni-karti",
    title: "БЕЛ – Фразеологични карти",
    description:
      "Флаш карти, свързване и викторина — с визуализация „буквално срещу преносно“. Без таймер. По Силвия Анова.",
    subject: "bg",
    classNums: ["5", "6", "7"],
    tone: "#ffedd5",
    accent: "#ea580c",
    status: "ready",
    kind: "phrase-cards",
    image: "/images/igri/bel-frazeologizmi.png",
  },
  {
    slug: "english-text-detective-6",
    title: "Английски – Text Detective",
    description:
      "Текст детектив: True/False, после маркирай изречението-доказателство. weekend = Saturdays and Sundays. Diagnostic 16–20.",
    subject: "english",
    classNums: ["5", "6"],
    tone: "#dbeafe",
    accent: "#1d4ed8",
    status: "ready",
    kind: "text-detective",
    image: "/images/igri/english-text-detective.png",
  },
  {
    slug: "english-hint-hangman-6",
    title: "Английски – Hint Hangman",
    description:
      "Бесеница с подсказка: изречение-контекст, първа буква, купуване на гласни и иконки (Пинокио за honest). Diagnostic 11–15.",
    subject: "english",
    classNums: ["5", "6"],
    tone: "#ffedd5",
    accent: "#c2410c",
    status: "ready",
    kind: "hint-hangman",
    image: "/images/igri/english-hint-hangman.png",
  },
  {
    slug: "english-verb-magnet-6",
    title: "Английски – The Verb Magnet",
    description:
      "Магнит за глаголи: завлечи gymnastics, football, a cake към DO, PLAY или MAKE. Без буквален превод на „правя“. Diagnostic Grade 6.",
    subject: "english",
    classNums: ["5", "6"],
    tone: "#fef3c7",
    accent: "#b45309",
    status: "ready",
    kind: "verb-magnet",
    image: "/images/igri/english-verb-magnet.png",
  },
  {
    slug: "english-signal-light-6",
    title: "Английски – The Signal Light",
    description:
      "Сигнална лампа: търси жокерите за „сега“ или навик, после светни синьо (Continuous) или зелено (Simple). Diagnostic Grade 6.",
    subject: "english",
    classNums: ["5", "6"],
    tone: "#e0f2fe",
    accent: "#0284c7",
    status: "ready",
    kind: "signal-light",
    image: "/images/igri/english-signal-light.png",
  },
  {
    slug: "english-sentence-builder-5",
    title: "Английски – The Sentence Builder",
    description:
      "Гръмотевичен конструктор: нареди думите във влакчето. Didn't е лакомо чудовище – изяжда миналото време! Преговор (5.–6. клас).",
    subject: "english",
    classNums: ["5", "6"],
    tone: "#ccfbf1",
    accent: "#0d9488",
    status: "ready",
    kind: "sentence-builder",
    image: "/images/igri/english-sentence-builder.png",
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
    image: "/images/igri/english-grammar-detective.png",
  },
  {
    slug: "english-bridge-of-rules-5",
    title: "Английски – The Bridge of Rules",
    description:
      "Мостът на сравненията: -er / more за две неща, -est / the most за три+. Преговор (5.–6. клас).",
    subject: "english",
    classNums: ["5", "6"],
    tone: "#ffedd5",
    accent: "#d97706",
    status: "ready",
    kind: "bridge-of-rules",
    image: "/images/igri/english-bridge-of-rules.png",
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
    slug: "bel-6-koi-kara-vlaka",
    title: "БЕЛ – Кой кара влака?",
    description:
      "Подлог и сказуемо: машинистът управлява, локомотивът движи изречението. Маркирай думите с две линии — както в училище!",
    subject: "bg",
    classNums: ["6"],
    tone: "#ffedd5",
    accent: "#ea580c",
    status: "ready",
    kind: "bel-train-driver",
    image: "/images/igri/bg-chasti-rech.png",
  },
  {
    slug: "bel-6-podaraci-v-kutii",
    title: "БЕЛ – Подаръци в кутии",
    description:
      "Допълнение: думата е в кутия — избери ключа КАКВО?, КОГО?, КОГА? или КАК?, за да я отвориш. Задачи 12–13.",
    subject: "bg",
    classNums: ["6"],
    tone: "#faf5ff",
    accent: "#7c3aed",
    status: "ready",
    kind: "bel-gift-boxes",
    image: "/images/igri/bg-chasti-rech.png",
  },
  {
    slug: "bel-6-tsvetniyat-hudozhnik",
    title: "БЕЛ – Цветният художник",
    description:
      "Определение: оцвети с четката думите, които описват предметите — Какъв? Чий? Вълнообразно подчертаване. Задача 16.",
    subject: "bg",
    classNums: ["6"],
    tone: "#fdf4ff",
    accent: "#a855f7",
    status: "ready",
    kind: "bel-color-painter",
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
    slug: "matematika-drob-procenti",
    title: "Математика – Дроби и проценти",
    description:
      "Три спокойни игри: оцвети част от пицата, подреди математически карти и постави флага на числовата ос.",
    subject: "matematika",
    classNums: ["5", "6"],
    tone: "#fef3c7",
    accent: "#d97706",
    status: "ready",
    kind: "fraction-adventure",
    image: "/images/igri/matematika-drob-procenti.svg",
  },
  {
    slug: "matematika-laboratoriya-pitza",
    title: "Математика – Лаборатория за пица",
    description:
      "Оцвети точната част от шоколада или пицата — 75% = 3/4 = 0,75. Визуална връзка между дроб, десетична дроб и процент.",
    subject: "matematika",
    classNums: ["5", "6"],
    tone: "#fef3c7",
    accent: "#d97706",
    status: "ready",
    kind: "fraction-mode",
    mode: "lab",
    image: "/images/igri/matematika-laboratoriya.svg",
  },
  {
    slug: "matematika-matematicheski-karti",
    title: "Математика – Математически карти",
    description:
      "Подреди стойностите в кутии: по-малко от 50%, точно 50% или повече от 50%. Дроби, проценти и десетични числа.",
    subject: "matematika",
    classNums: ["5", "6"],
    tone: "#dbeafe",
    accent: "#2563eb",
    status: "ready",
    kind: "fraction-mode",
    mode: "cards",
    image: "/images/igri/matematika-karti.svg",
  },
  {
    slug: "matematika-chislova-os",
    title: "Математика – Постави флага",
    description:
      "Числова ос от 0% до 100%: забий флага на точното място за 2/5, 40% или 0,6. Без таймер, с визуални подсказки.",
    subject: "matematika",
    classNums: ["5", "6"],
    tone: "#d1fae5",
    accent: "#059669",
    status: "ready",
    kind: "fraction-mode",
    mode: "numberline",
    image: "/images/igri/matematika-chislova-os.svg",
  },
  {
    slug: "matematika-geometria-5",
    title: "Математика – Геометрия 5. клас",
    description:
      "Четири визуални игри: фигури, ъгли, огледална симетрия и обиколка на решетка. Без таймер.",
    subject: "matematika",
    classNums: ["5"],
    tone: "#ede9fe",
    accent: "#7c3aed",
    status: "ready",
    kind: "geometry-adventure",
    image: "/images/igri/matematika-geometria-5.svg",
  },
  {
    slug: "matematika-figuri-5",
    title: "Математика – Фигурна сортировка",
    description:
      "Подреди триъгълници, четириъгълници, кръгове и многоъгълници в правилните кутии.",
    subject: "matematika",
    classNums: ["5"],
    tone: "#ede9fe",
    accent: "#7c3aed",
    status: "ready",
    kind: "geometry-mode",
    mode: "shapes",
    image: "/images/igri/matematika-geometria-5.svg",
  },
  {
    slug: "matematika-ugli-5",
    title: "Математика – Ъглови карти",
    description:
      "Класифицирай ъглите: остър (< 90°), прав (90°) или тъп (> 90°). С визуална диаграма.",
    subject: "matematika",
    classNums: ["5"],
    tone: "#fef3c7",
    accent: "#d97706",
    status: "ready",
    kind: "geometry-mode",
    mode: "angles",
    image: "/images/igri/matematika-ugli-5.svg",
  },
  {
    slug: "matematika-simetria-5",
    title: "Математика – Огледална симетрия",
    description:
      "Довърши фигурата като огледален образ спрямо пунктираната ос.",
    subject: "matematika",
    classNums: ["5"],
    tone: "#ecfeff",
    accent: "#0891b2",
    status: "ready",
    kind: "geometry-mode",
    mode: "symmetry",
    image: "/images/igri/matematika-simetria-5.svg",
  },
  {
    slug: "matematika-obikolka-5",
    title: "Математика – Обиколка на решетка",
    description:
      "Преброй външните страни на фигура върху единична решетка — периметър на 5. клас.",
    subject: "matematika",
    classNums: ["5"],
    tone: "#dcfce7",
    accent: "#059669",
    status: "ready",
    kind: "geometry-mode",
    mode: "perimeter",
    image: "/images/igri/matematika-obikolka-5.svg",
  },
  {
    slug: "matematika-geometria-6",
    title: "Математика – Геометрия 6. клас",
    description:
      "Магически мрежи, лице чрез пренареждане и геометричен детектор. a — синьо, h — червено, мрежа като тетрадка.",
    subject: "matematika",
    classNums: ["6"],
    tone: "#ede9fe",
    accent: "#7c3aed",
    status: "ready",
    kind: "geometry6-adventure",
    image: "/images/igri/matematika-geometria-6.svg",
  },
  {
    slug: "matematika-magicheski-mreji-6",
    title: "Математика – Магически мрежи",
    description:
      "Избери разгъвката на куб, паралелепипед или цилиндър. 3D модел + мрежа.",
    subject: "matematika",
    classNums: ["6"],
    tone: "#ddd6fe",
    accent: "#7c3aed",
    status: "ready",
    kind: "geometry6-mode",
    mode: "nets",
    image: "/images/igri/matematika-geometria-6.svg",
  },
  {
    slug: "matematika-lice-prenarejdane-6",
    title: "Математика – Лице чрез пренареждане",
    description:
      "Премести △ от успоредника и виж защо S = a · h. Успоредник и трапец на мрежа.",
    subject: "matematika",
    classNums: ["6"],
    tone: "#dbeafe",
    accent: "#2563eb",
    status: "ready",
    kind: "geometry6-mode",
    mode: "area",
    image: "/images/igri/matematika-geometria-6.svg",
  },
  {
    slug: "matematika-geometrichen-detektor-6",
    title: "Математика – Геометричен детектор",
    description:
      "Сортирай фигури: успоредни страни, равни страни или тъп ъгъл.",
    subject: "matematika",
    classNums: ["6"],
    tone: "#fef3c7",
    accent: "#d97706",
    status: "ready",
    kind: "geometry6-mode",
    mode: "detector",
    image: "/images/igri/matematika-geometria-6.svg",
  },
  {
    slug: "matematika-pregled-geometria-6",
    title: "Математика – Преговор: Геометрия 6. клас",
    description:
      "Лице на триъгълник и трапец, обем на паралелепипед, елементи на тела. С подсказки и обяснения.",
    subject: "matematika",
    classNums: ["6"],
    tone: "#e0e7ff",
    accent: "#4338ca",
    status: "ready",
    kind: "quiz",
    image: "/images/igri/matematika-geometria-6.svg",
    questions: GEOMETRY6_QUIZ,
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
