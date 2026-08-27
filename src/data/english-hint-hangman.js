/**
 * Hint Hangman – лексика и правопис с контекст
 * Diagnostic English Test · Grade 6 · Въпроси 11–15
 *
 * Първата буква е дадена. Можеш да купиш гласни или да видиш иконка-подсказка,
 * за да намалиш стреса от „белия лист“ при дълги думи.
 */

/**
 * @typedef {{
 *   id: string,
 *   word: string,
 *   accepted?: string[],
 *   sentence: string,
 *   blank: string,
 *   icon: string,
 *   iconLabel: string,
 *   tip: string,
 * }} HintHangmanRound
 */

/** @type {HintHangmanRound[]} */
export const HINT_HANGMAN_ROUNDS = [
  {
    id: "activity",
    word: "activity",
    sentence: "My sister loves playing the guitar. Her favourite free-time _____ is music.",
    blank: "a_______",
    icon: "🎸",
    iconLabel: "китара / свободно време",
    tip: "activity = занимание, дейност в свободното време.",
  },
  {
    id: "housework",
    word: "housework",
    sentence:
      "I always help my parents around the house and do my _____ every Saturday morning.",
    blank: "h________",
    icon: "🧹",
    iconLabel: "домакинска работа",
    tip: "housework = работата по къщата. homework = домашното от училище!",
  },
  {
    id: "individual",
    word: "individual",
    sentence:
      "Football and basketball are team sports, but tennis and swimming are _____ sports.",
    blank: "i__________",
    icon: "🧍",
    iconLabel: "един човек, не отбор",
    tip: "individual = индивидуален (сам), противоположно на team.",
  },
  {
    id: "honest",
    word: "honest",
    sentence: "Mark never tells the truth. He is not a very _____ person.",
    blank: "h_____",
    icon: "🤥",
    iconLabel: "Пинокио с дълъг нос",
    tip: "honest = честен. Който лъже, не е honest (като Пинокио).",
  },
  {
    id: "pyjamas",
    word: "pyjamas",
    accepted: ["pyjamas", "pajamas"],
    sentence: "Before I go to bed, I always brush my teeth and put on my _____.",
    blank: "p______",
    icon: "😴",
    iconLabel: "нощни дрехи за сън",
    tip: "pyjamas (или pajamas) = пижама. Слагаш ги преди лягане.",
  },
];

export const HINT_HANGMAN_LIVES = 6;
export const HINT_HANGMAN_START_COINS = 4;
export const VOWEL_COST = 1;

export const VOWELS = ["a", "e", "i", "o", "u"];

export const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");

export function isVowel(letter) {
  return VOWELS.includes(String(letter).toLowerCase());
}

export function lettersInWord(word) {
  return [...new Set(String(word).toLowerCase().replace(/[^a-z]/g, "").split(""))];
}
