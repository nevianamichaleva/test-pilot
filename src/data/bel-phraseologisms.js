/**
 * Фразеологични карти — по „Златното българско слово“, Силвия Анова.
 * Игра: свържи фразеологизма със значението му.
 */

export const PHRASE_ROUNDS = [
  { ids: ["kapki-voda", "sedmo-nebe", "kamuk-sartse", "udaril-kamuk"] },
  { ids: ["trun-glog", "kapka-more", "cherna-ovca", "muha-slon"] },
  { ids: ["riba-suho", "vulk-ovca", "pchelica", "kon"] },
];

/** @type {Array<{ id: string, phrase: string, meaning: string, example: string, icon: string, hint: string }>} */
export const PHRASE_CARDS = [
  {
    id: "kapki-voda",
    phrase: "като две капки вода",
    meaning: "Много еднакви или неразличими хора или неща.",
    example: "Тези две момчета са като две капки вода.",
    icon: "💧",
    hint: "Две капки вода изглеждат почти еднакво.",
  },
  {
    id: "kamuk-sartse",
    phrase: "камък ми падна от сърцето",
    meaning: "Огромно облекчение след като проблемът изчезне.",
    example: "Камък ми падна от сърцето, когато разбрах, че всички са добре.",
    icon: "🪨",
    hint: "Когато тревогата отмине, сякаш тежък камък е паднал.",
  },
  {
    id: "udaril-kamuk",
    phrase: "ударих на камък",
    meaning: "Неуспех, спънка или отказ — опитът не успя.",
    example: "Опитах се да го убедя, но ударих на камък.",
    icon: "🧱",
    hint: "Камъкът е твърд — не можеш да пробиеш през него.",
  },
  {
    id: "sedmo-nebe",
    phrase: "на седмото небе",
    meaning: "Много радостен, доволен и щастлив.",
    example: "След победата Ирина беше на седмото небе.",
    icon: "☁️",
    hint: "Седмото небе е най-високото — там си най-щастлив.",
  },
  {
    id: "trun-glog",
    phrase: "от трън, та на глог",
    meaning: "От лошо по-лошо — ситуацията се влошава.",
    example: "Отиде в нов отбор, но ситуацията стана от трън, та на глог.",
    icon: "🌿",
    hint: "И трън, и глог имат бодли — става още по-неприятно.",
  },
  {
    id: "kapka-more",
    phrase: "капка в морето",
    meaning: "Много малко спрямо целото — незначително.",
    example: "Това, което направихме днес, е капка в морето.",
    icon: "🌊",
    hint: "Една капка в огромно море почти не се забелязва.",
  },
  {
    id: "cherna-ovca",
    phrase: "черната овца",
    meaning: "Различен от групата — нежеланият, непокорният.",
    example: "В класа го смятаха за черната овца.",
    icon: "🐑",
    hint: "Сред белите овце черната овца се откроява.",
  },
  {
    id: "muha-slon",
    phrase: "прави от мухата слон",
    meaning: "Преувеличава малък, незначителен проблем.",
    example: "Не прави от мухата слон – всичко ще се оправи.",
    icon: "🐘",
    hint: "Мухата е дребна, слонът — огромен.",
  },
  {
    id: "riba-suho",
    phrase: "като риба на сухо",
    meaning: "Безпомощен в непозната или трудна ситуация.",
    example: "Без приятелите си Петър се чувстваше като риба на сухо.",
    icon: "🐟",
    hint: "Рибата извън водата не може да се справи сама.",
  },
  {
    id: "vulk-ovca",
    phrase: "вълк в овча кожа",
    meaning: "Изглежда добър, но има лоши намерения.",
    example: "Понякога човек е вълк в овча кожа.",
    icon: "🐺",
    hint: "Вълкът се крие сред овцете, за да не го познаят.",
  },
  {
    id: "pchelica",
    phrase: "като пчеличка",
    meaning: "Работи много усърдно — трудолюбив.",
    example: "Мая цял ден работи като пчеличка в градината.",
    icon: "🐝",
    hint: "Пчелата не спира да трудува.",
  },
  {
    id: "kon",
    phrase: "разиграва си коня",
    meaning: "Прави каквото си иска, без да се съобразява с другите.",
    example: "Никой не му правеше забележка и той си разиграваше коня.",
    icon: "🐴",
    hint: "Конят скача наоколо — прави си каквото иска.",
  },
];

export function phraseById(id) {
  return PHRASE_CARDS.find((c) => c.id === id);
}

export function totalPhrasePairs() {
  return PHRASE_ROUNDS.reduce((s, r) => s + r.ids.length, 0);
}

/** @param {number} roundIndex @param {string} id */
export function phraseQuestionNumber(roundIndex, id) {
  let n = 0;
  for (let i = 0; i < roundIndex; i += 1) n += PHRASE_ROUNDS[i].ids.length;
  const idx = PHRASE_ROUNDS[roundIndex]?.ids.indexOf(id) ?? -1;
  return idx >= 0 ? n + idx + 1 : n + 1;
}
