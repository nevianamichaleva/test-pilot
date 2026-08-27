/**
 * Grammar Detective: Spot the Thief – 5. клас
 * Кликни върху грешните думи; верните се поправят с анимация.
 * Грешен клик върху вярна дума → без наказание, само насърчение.
 */

/**
 * @typedef {{ t: string, ok?: boolean, fix?: string, tip?: string }} DetectiveToken
 * @typedef {{ who: 'alien'|'human'|'system', name: string, avatar: string, tokens: DetectiveToken[] }} DetectiveBubble
 * @typedef {{
 *   id: string,
 *   format: 'chat'|'letter',
 *   topic: string,
 *   title: string,
 *   intro: string,
 *   letterFrom?: string,
 *   bubbles: DetectiveBubble[],
 * }} DetectiveCase
 */

/** @type {DetectiveCase[]} */
export const DETECTIVE_CASES = [
  {
    id: "zorp-beach",
    format: "chat",
    topic: "Past Simple",
    title: "Чат с извънземното Zorp",
    intro: "Zorp разказва за лятото на Земята – но крадецът на граматика е бил тук!",
    bubbles: [
      {
        who: "alien",
        name: "Zorp",
        avatar: "👽",
        tokens: [
          { t: "Last" },
          { t: "summer" },
          { t: "I" },
          { t: "go", ok: false, fix: "went", tip: "Last summer = минало → went" },
          { t: "to" },
          { t: "the" },
          { t: "beach." },
          { t: "It" },
          { t: "were", ok: false, fix: "was", tip: "It → was (не were)" },
          { t: "very" },
          { t: "hot!" },
        ],
      },
      {
        who: "human",
        name: "Mia",
        avatar: "🕵️",
        tokens: [{ t: "Хвани" }, { t: "крадеца" }, { t: "в" }, { t: "съобщението" }, { t: "на" }, { t: "Zorp!" }],
      },
    ],
  },
  {
    id: "zorp-didnt",
    format: "chat",
    topic: "didn't + base verb",
    title: "Zorp и футболът",
    intro: "Zorp говори за уикенда. Две думи са откраднати от правилната граматика.",
    bubbles: [
      {
        who: "alien",
        name: "Zorp",
        avatar: "👽",
        tokens: [
          { t: "I" },
          { t: "didn't" },
          { t: "played", ok: false, fix: "play", tip: "След didn't → чист глагол: play" },
          { t: "football" },
          { t: "on" },
          { t: "Saturday." },
          { t: "My" },
          { t: "friend" },
          { t: "don't", ok: false, fix: "doesn't", tip: "He/She/My friend → doesn't" },
          { t: "like" },
          { t: "sport." },
        ],
      },
    ],
  },
  {
    id: "letter-school",
    format: "letter",
    topic: "Present Simple – he/she",
    title: "Писмо от планета Blip",
    intro: "Писмо до класната. Намери крадеца на -s!",
    letterFrom: "Captain Blip, Planet Zog",
    bubbles: [
      {
        who: "alien",
        name: "Captain Blip",
        avatar: "🛸",
        tokens: [
          { t: "Dear" },
          { t: "class," },
          { t: "My" },
          { t: "brother" },
          { t: "play", ok: false, fix: "plays", tip: "He/brother → plays (с -s)" },
          { t: "football" },
          { t: "every" },
          { t: "day." },
          { t: "He" },
          { t: "get", ok: false, fix: "gets", tip: "He → gets up" },
          { t: "up" },
          { t: "at" },
          { t: "7" },
          { t: "o'clock." },
          { t: "Please" },
          { t: "help!" },
        ],
      },
    ],
  },
  {
    id: "chat-questions",
    format: "chat",
    topic: "Questions – do/does",
    title: "Странен въпрос",
    intro: "Zorp задава въпроси… но спомагателният глагол е объркан.",
    bubbles: [
      {
        who: "alien",
        name: "Zorp",
        avatar: "👽",
        tokens: [
          { t: "Where" },
          { t: "you", ok: false, fix: "do you", tip: "Въпрос: Where do you live?" },
          { t: "live?" },
          { t: "Does" },
          { t: "she" },
          { t: "likes", ok: false, fix: "like", tip: "След Does → like (без -s)" },
          { t: "music?" },
        ],
      },
      {
        who: "human",
        name: "Leo",
        avatar: "🧑‍🎓",
        tokens: [{ t: "Детективе," }, { t: "кликни" }, { t: "счупените" }, { t: "думи!" }],
      },
    ],
  },
  {
    id: "was-were",
    format: "chat",
    topic: "was / were",
    title: "Вчера в киното",
    intro: "Zorp бърка was и were. Хвани и двете грешки!",
    bubbles: [
      {
        who: "alien",
        name: "Zorp",
        avatar: "👽",
        tokens: [
          { t: "Yesterday" },
          { t: "we" },
          { t: "was", ok: false, fix: "were", tip: "We/They/You → were" },
          { t: "at" },
          { t: "the" },
          { t: "cinema." },
          { t: "The" },
          { t: "film" },
          { t: "were", ok: false, fix: "was", tip: "The film / It → was" },
          { t: "fantastic!" },
        ],
      },
    ],
  },
  {
    id: "letter-frequency",
    format: "letter",
    topic: "Adverbs of frequency",
    title: "Дневник от космоса",
    intro: "Редът на наречието е сбъркан – и още една минала грешка.",
    letterFrom: "Zorp's space diary",
    bubbles: [
      {
        who: "alien",
        name: "Zorp",
        avatar: "👾",
        tokens: [
          { t: "I" },
          { t: "brush", ok: false, fix: "always", tip: "Редът е обърнат: I always brush…" },
          { t: "always", ok: false, fix: "brush", tip: "always стои преди глагола brush" },
          { t: "my" },
          { t: "teeth." },
          { t: "Last" },
          { t: "night" },
          { t: "I" },
          { t: "watch", ok: false, fix: "watched", tip: "Last night = минало → watched" },
          { t: "a" },
          { t: "film." },
        ],
      },
    ],
  },
  {
    id: "like-ing",
    format: "chat",
    topic: "like + -ing",
    title: "Какво обича Zorp?",
    intro: "След like искаме -ing. Намери крадеца!",
    bubbles: [
      {
        who: "alien",
        name: "Zorp",
        avatar: "👽",
        tokens: [
          { t: "I" },
          { t: "like" },
          { t: "play", ok: false, fix: "playing", tip: "like + -ing → playing" },
          { t: "computer" },
          { t: "games." },
          { t: "She" },
          { t: "hates" },
          { t: "get", ok: false, fix: "getting", tip: "hate/like + -ing → getting" },
          { t: "up" },
          { t: "early." },
        ],
      },
    ],
  },
  {
    id: "there-was",
    format: "letter",
    topic: "There was / There were",
    title: "Доклад от Земята",
    intro: "There was / were – класическа кражба!",
    letterFrom: "Space Scout Report",
    bubbles: [
      {
        who: "alien",
        name: "Scout Zorp",
        avatar: "📡",
        tokens: [
          { t: "There" },
          { t: "was", ok: false, fix: "were", tip: "a lot of people = множествено → There were" },
          { t: "a" },
          { t: "lot" },
          { t: "of" },
          { t: "people" },
          { t: "in" },
          { t: "the" },
          { t: "park." },
          { t: "There" },
          { t: "were", ok: false, fix: "was", tip: "a big dog = единствено → There was" },
          { t: "a" },
          { t: "big" },
          { t: "dog" },
          { t: "too." },
        ],
      },
    ],
  },
  {
    id: "did-question",
    format: "chat",
    topic: "Did + base verb",
    title: "Разпит на свидетел",
    intro: "Въпросите с Did са счупени. Бъди детектив!",
    bubbles: [
      {
        who: "alien",
        name: "Zorp",
        avatar: "👽",
        tokens: [
          { t: "Did" },
          { t: "you" },
          { t: "finished", ok: false, fix: "finish", tip: "Did + чист глагол → finish" },
          { t: "your" },
          { t: "homework?" },
          { t: "Did" },
          { t: "they" },
          { t: "went", ok: false, fix: "go", tip: "Did + go (не went)" },
          { t: "to" },
          { t: "school" },
          { t: "yesterday?" },
        ],
      },
    ],
  },
  {
    id: "object-pronouns",
    format: "chat",
    topic: "Object pronouns",
    title: "Дай го на… кого?",
    intro: "Личните местоимения след глагола са объркани.",
    bubbles: [
      {
        who: "alien",
        name: "Zorp",
        avatar: "👽",
        tokens: [
          { t: "Please" },
          { t: "give" },
          { t: "the" },
          { t: "book" },
          { t: "to" },
          { t: "I", ok: false, fix: "me", tip: "След to/глагол → me (не I)" },
          { t: "." },
          { t: "Do" },
          { t: "you" },
          { t: "like" },
          { t: "they", ok: false, fix: "them", tip: "like + them (не they)" },
          { t: "?" },
        ],
      },
    ],
  },
];

/** Всички грешни токени в случай (индекси bubble + token). */
export function listErrors(caseData) {
  const out = [];
  caseData.bubbles.forEach((b, bi) => {
    b.tokens.forEach((tok, ti) => {
      if (tok.ok === false) out.push({ bi, ti, tip: tok.tip, fix: tok.fix });
    });
  });
  return out;
}

export function countErrors(caseData) {
  return listErrors(caseData).length;
}
