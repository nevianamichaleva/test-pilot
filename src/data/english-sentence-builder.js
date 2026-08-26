/**
 * The Sentence Builder – Live Beat 5. клас
 * Drag & drop изречения + „лакоми чудовища“ (didn't/don't/doesn't/did),
 * които изяждат грешната глаголна форма.
 */

export const SENTENCE_BUILDER_LIVES = 5;

/** Глобални капани: спомагателен глагол + грешна форма до него. */
export const AUX_MONSTER_TRAPS = [
  {
    aux: ["didn't", "Didn't"],
    forbidden: ["went", "played", "watched", "studied", "finished", "liked", "wanted", "walked", "cooked", "was", "were", "had", "did", "saw", "came", "made"],
    hint: "Didn't е лакомо чудовище – то вече е изяло миналото време! Трябва ти чист глагол (go, play, watch…).",
  },
  {
    aux: ["don't", "Don't"],
    forbidden: ["goes", "plays", "watches", "studies", "likes", "has", "does", "is", "are", "went", "played"],
    hint: "Don't е лакомо чудовище – то иска чист глагол без -s (go, play, like…), не минало и не goes/plays!",
  },
  {
    aux: ["doesn't", "Doesn't"],
    forbidden: ["goes", "plays", "watches", "studies", "likes", "has", "does", "went", "played", "is", "are"],
    hint: "Doesn't вече е изяло -s! След него слагай чист глагол: go, play, like… (не goes/plays).",
  },
  {
    aux: ["did", "Did"],
    forbidden: ["went", "played", "watched", "studied", "finished", "liked", "wanted", "was", "were", "had", "saw", "came"],
    hint: "Did е лакомо чудовище – миналото време вече е „изядено“. Сложи чист глагол: go, play, finish…",
  },
  {
    aux: ["does", "Does"],
    forbidden: ["goes", "plays", "watches", "studies", "likes", "has", "does", "went", "played"],
    hint: "Does вече носи -s! След него глаголът е чист: play, live, like…",
  },
  {
    aux: ["do", "Do"],
    forbidden: ["goes", "plays", "watches", "studies", "likes", "went", "played"],
    hint: "След do слагай чист глагол без -s и без минало време.",
  },
];

/**
 * @typedef {{
 *   id: string,
 *   topic: string,
 *   hintBg: string,
 *   correct: string[],
 *   distractors: string[],
 * }} SentenceRound
 */

/** @type {SentenceRound[]} */
export const SENTENCE_BUILDER_ROUNDS = [
  {
    id: "didnt-go",
    topic: "Past Simple – didn't + base verb",
    hintBg: "Той не отиде на училище вчера.",
    correct: ["He", "didn't", "go", "to", "school", "yesterday"],
    distractors: ["went", "goes"],
  },
  {
    id: "didnt-play",
    topic: "Past Simple – didn't + base verb",
    hintBg: "Те не играха футбол в събота.",
    correct: ["They", "didn't", "play", "football", "on", "Saturday"],
    distractors: ["played", "plays"],
  },
  {
    id: "does-she-like",
    topic: "Present Simple – questions with does",
    hintBg: "Харесва ли тя музика?",
    correct: ["Does", "she", "like", "music"],
    distractors: ["likes", "liked", "Do"],
  },
  {
    id: "he-plays",
    topic: "Present Simple – he/she + -s",
    hintBg: "Той играе футбол всеки ден.",
    correct: ["He", "plays", "football", "every", "day"],
    distractors: ["play", "playing", "played"],
  },
  {
    id: "she-doesnt-watch",
    topic: "Present Simple – doesn't",
    hintBg: "Тя не гледа телевизия вечер.",
    correct: ["She", "doesn't", "watch", "TV", "in", "the", "evening"],
    distractors: ["watches", "watched", "don't"],
  },
  {
    id: "where-do-you-live",
    topic: "Questions – do/does",
    hintBg: "Къде живееш?",
    correct: ["Where", "do", "you", "live"],
    distractors: ["lives", "living", "are"],
  },
  {
    id: "i-always-brush",
    topic: "Adverbs of frequency",
    hintBg: "Винаги си мия зъбите сутрин.",
    correct: ["I", "always", "brush", "my", "teeth", "in", "the", "morning"],
    distractors: ["brushing", "brushed", "never"],
  },
  {
    id: "they-were",
    topic: "Past of be – was/were",
    hintBg: "Те бяха в киното вчера.",
    correct: ["They", "were", "at", "the", "cinema", "yesterday"],
    distractors: ["was", "are", "is"],
  },
  {
    id: "she-was-not",
    topic: "Past of be – wasn't",
    hintBg: "Тя не беше вкъщи снощи.",
    correct: ["She", "wasn't", "at", "home", "last", "night"],
    distractors: ["weren't", "isn't", "didn't"],
  },
  {
    id: "did-you-finish",
    topic: "Past Simple – Did + base verb",
    hintBg: "Приключи ли домашното си вчера?",
    correct: ["Did", "you", "finish", "your", "homework", "yesterday"],
    distractors: ["finished", "finishes", "Do"],
  },
  {
    id: "i-like-playing",
    topic: "like + -ing",
    hintBg: "Обичам да играя компютърни игри.",
    correct: ["I", "like", "playing", "computer", "games"],
    distractors: ["play", "plays", "played"],
  },
  {
    id: "he-gets-up",
    topic: "Have / go / do / get",
    hintBg: "Той става в 7 часа всеки ден.",
    correct: ["He", "gets", "up", "at", "7", "o'clock", "every", "day"],
    distractors: ["get", "getting", "got"],
  },
  {
    id: "we-dont-speak",
    topic: "Present Simple – don't",
    hintBg: "Ние не говорим френски у дома.",
    correct: ["We", "don't", "speak", "French", "at", "home"],
    distractors: ["speaks", "spoke", "doesn't"],
  },
  {
    id: "there-were",
    topic: "There was / There were",
    hintBg: "В парка вчера имаше много хора.",
    correct: ["There", "were", "a", "lot", "of", "people", "in", "the", "park", "yesterday"],
    distractors: ["was", "is", "are"],
  },
];

export function shuffleTiles(tiles) {
  const a = [...tiles];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Уникални id за плочки (дублирани думи са възможни между рундове). */
export function buildTilePool(round) {
  const words = [...round.correct, ...round.distractors];
  return shuffleTiles(
    words.map((text, i) => ({
      id: `${round.id}-${i}-${text}`,
      text,
    }))
  );
}

/**
 * Ако поставянето на `word` в `slotIndex` нарушава правило за „лакомо чудовище“,
 * връща hint; иначе null.
 * @param {(string|null)[]} slots
 * @param {number} slotIndex
 * @param {string} word
 */
export function getMonsterTrapHint(slots, slotIndex, word) {
  const left = slotIndex > 0 ? slots[slotIndex - 1] : null;
  const right = slotIndex < slots.length - 1 ? slots[slotIndex + 1] : null;

  for (const trap of AUX_MONSTER_TRAPS) {
    const auxSet = new Set(trap.aux.map((a) => a.toLowerCase()));
    const forbidden = new Set(trap.forbidden.map((f) => f.toLowerCase()));
    const w = word.toLowerCase();

    if (left && auxSet.has(String(left).toLowerCase()) && forbidden.has(w)) {
      return trap.hint;
    }
    if (right && auxSet.has(w) && forbidden.has(String(right).toLowerCase())) {
      return trap.hint;
    }
  }
  return null;
}

export function slotsMatchCorrect(slots, correct) {
  if (slots.length !== correct.length) return false;
  return slots.every((s, i) => String(s ?? "").toLowerCase() === String(correct[i]).toLowerCase());
}
