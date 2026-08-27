/**
 * The Bridge of Rules – 5. клас
 * Сравнителна (-er / more) и превъзходна (-est / the most) степен.
 * Правилният избор преминава моста; грешният го разклаща с обяснение.
 */

/**
 * @typedef {{ id: string, emoji: string, label: string, size: 1|2|3 }} BridgeFigure
 * @typedef {{ text: string, correct?: boolean, tip?: string, stomp?: boolean }} BridgeOption
 * @typedef {{
 *   id: string,
 *   topic: string,
 *   sentence: string,
 *   figures: BridgeFigure[],
 *   focusIds: string[],
 *   stompId?: string,
 *   options: BridgeOption[],
 * }} BridgeRound
 */

/** @type {BridgeRound[]} */
export const BRIDGE_ROUNDS = [
  {
    id: "cat-bigger",
    topic: "Comparative · -er (две неща)",
    sentence: "The cat is _______ than the mouse.",
    figures: [
      { id: "mouse", emoji: "🐭", label: "mouse", size: 1 },
      { id: "cat", emoji: "🐱", label: "cat", size: 2 },
      { id: "elephant", emoji: "🐘", label: "elephant", size: 3 },
    ],
    focusIds: ["cat", "mouse"],
    stompId: "elephant",
    options: [
      { text: "big", tip: "big е основната форма. За две неща ползваме bigger." },
      { text: "bigger", correct: true },
      {
        text: "the biggest",
        tip: "Слонът е най-голям, но тук сравняваме само котката и мишката (две неща)!",
        stomp: true,
      },
    ],
  },
  {
    id: "elephant-tallest",
    topic: "Superlative · -est (три+)",
    sentence: "The elephant is _______ of the three.",
    figures: [
      { id: "mouse", emoji: "🐭", label: "mouse", size: 1 },
      { id: "cat", emoji: "🐱", label: "cat", size: 2 },
      { id: "elephant", emoji: "🐘", label: "elephant", size: 3 },
    ],
    focusIds: ["elephant"],
    stompId: "elephant",
    options: [
      { text: "tall", tip: "tall е основната форма. Тук избираме „най-…“." },
      {
        text: "taller",
        tip: "taller е за две неща. Тук са три животни → the tallest!",
        stomp: true,
      },
      { text: "the tallest", correct: true },
    ],
  },
  {
    id: "rabbit-faster",
    topic: "Comparative · -er",
    sentence: "The rabbit is _______ than the tortoise.",
    figures: [
      { id: "tortoise", emoji: "🐢", label: "tortoise", size: 1 },
      { id: "rabbit", emoji: "🐇", label: "rabbit", size: 2 },
      { id: "cheetah", emoji: "🐆", label: "cheetah", size: 3 },
    ],
    focusIds: ["rabbit", "tortoise"],
    stompId: "cheetah",
    options: [
      { text: "fast", tip: "Нужна е сравнителна степен: faster." },
      { text: "faster", correct: true },
      {
        text: "the fastest",
        tip: "Гепардът е the fastest, но тук сравняваме само заека и костенурката!",
        stomp: true,
      },
    ],
  },
  {
    id: "mountain-highest",
    topic: "Superlative · -est",
    sentence: "Mount Everest is _______ mountain in the world.",
    figures: [
      { id: "hill", emoji: "🏞", label: "hill", size: 1 },
      { id: "mountain", emoji: "⛰", label: "mountain", size: 2 },
      { id: "everest", emoji: "🏔", label: "Everest", size: 3 },
    ],
    focusIds: ["everest"],
    stompId: "everest",
    options: [
      { text: "high", tip: "high е основната форма." },
      {
        text: "higher",
        tip: "higher е за две неща. „В света“ = сред много → the highest!",
        stomp: true,
      },
      { text: "the highest", correct: true },
    ],
  },
  {
    id: "flower-more",
    topic: "Comparative · more + adjective",
    sentence: "The rose is _______ than the daisy.",
    figures: [
      { id: "daisy", emoji: "🌼", label: "daisy", size: 1 },
      { id: "rose", emoji: "🌹", label: "rose", size: 2 },
      { id: "garden", emoji: "🌸", label: "garden", size: 3 },
    ],
    focusIds: ["rose", "daisy"],
    stompId: "garden",
    options: [
      { text: "beautiful", tip: "Дълги прилагателни: more beautiful (не beautiful-er)." },
      { text: "more beautiful", correct: true },
      {
        text: "the most beautiful",
        tip: "the most = за три+. Тук сравняваме само две цветя!",
        stomp: true,
      },
    ],
  },
  {
    id: "film-most",
    topic: "Superlative · the most",
    sentence: "This film is _______ of all.",
    figures: [
      { id: "ok", emoji: "📀", label: "OK film", size: 1 },
      { id: "good", emoji: "🎬", label: "good film", size: 2 },
      { id: "best", emoji: "🏆", label: "best film", size: 3 },
    ],
    focusIds: ["best"],
    stompId: "best",
    options: [
      { text: "interesting", tip: "Нужна е превъзходна степен." },
      {
        text: "more interesting",
        tip: "more = две неща. „of all“ = сред всички → the most interesting!",
        stomp: true,
      },
      { text: "the most interesting", correct: true },
    ],
  },
  {
    id: "test-better",
    topic: "Irregular · good / better / best",
    sentence: "My result is _______ than yours.",
    figures: [
      { id: "ok", emoji: "📝", label: "OK", size: 1 },
      { id: "better", emoji: "📈", label: "better", size: 2 },
      { id: "best", emoji: "🥇", label: "best", size: 3 },
    ],
    focusIds: ["better", "ok"],
    stompId: "best",
    options: [
      { text: "good", tip: "good → better (не gooder!) при две неща." },
      { text: "better", correct: true },
      {
        text: "the best",
        tip: "the best е за три+. Тук сравняваме само два резултата!",
        stomp: true,
      },
    ],
  },
  {
    id: "weather-worst",
    topic: "Irregular · bad / worse / worst",
    sentence: "Monday was _______ day of the week.",
    figures: [
      { id: "ok", emoji: "🌤", label: "OK day", size: 1 },
      { id: "bad", emoji: "🌧", label: "bad day", size: 2 },
      { id: "worst", emoji: "⛈", label: "worst day", size: 3 },
    ],
    focusIds: ["worst"],
    stompId: "worst",
    options: [
      { text: "bad", tip: "bad е основната форма." },
      {
        text: "worse",
        tip: "worse = две неща. „of the week“ = сред седем → the worst!",
        stomp: true,
      },
      { text: "the worst", correct: true },
    ],
  },
  {
    id: "building-older",
    topic: "Comparative · -er",
    sentence: "This house is _______ than that flat.",
    figures: [
      { id: "flat", emoji: "🏢", label: "flat", size: 1 },
      { id: "house", emoji: "🏠", label: "house", size: 2 },
      { id: "castle", emoji: "🏰", label: "castle", size: 3 },
    ],
    focusIds: ["house", "flat"],
    stompId: "castle",
    options: [
      { text: "old", tip: "Сравни две неща → older." },
      { text: "older", correct: true },
      {
        text: "the oldest",
        tip: "Замъкът може да е the oldest, но тук сравняваме само къщата и апартамента!",
        stomp: true,
      },
    ],
  },
  {
    id: "city-most",
    topic: "Superlative · the most + adjective",
    sentence: "Sofia is _______ city in Bulgaria.",
    figures: [
      { id: "town", emoji: "🏘", label: "small town", size: 1 },
      { id: "city", emoji: "🏙", label: "city", size: 2 },
      { id: "sofia", emoji: "🌆", label: "Sofia", size: 3 },
    ],
    focusIds: ["sofia"],
    stompId: "sofia",
    options: [
      { text: "crowded", tip: "Нужна е превъзходна степен." },
      {
        text: "more crowded",
        tip: "more crowded = две неща. „in Bulgaria“ = сред много → the most crowded!",
        stomp: true,
      },
      { text: "the most crowded", correct: true },
    ],
  },
  {
    id: "dog-smaller",
    topic: "Comparative · -er",
    sentence: "The puppy is _______ than the dog.",
    figures: [
      { id: "puppy", emoji: "🐶", label: "puppy", size: 1 },
      { id: "dog", emoji: "🐕", label: "dog", size: 2 },
      { id: "wolf", emoji: "🐺", label: "wolf", size: 3 },
    ],
    focusIds: ["puppy", "dog"],
    stompId: "wolf",
    options: [
      { text: "small", tip: "За две неща: smaller." },
      { text: "smaller", correct: true },
      {
        text: "the smallest",
        tip: "Тук сравняваме само кученцето и кучето (две неща), не „най-малкия“!",
        stomp: true,
      },
    ],
  },
  {
    id: "book-easier",
    topic: "Comparative · -er (y → i)",
    sentence: "This book is _______ than that one.",
    figures: [
      { id: "hard", emoji: "📕", label: "hard book", size: 1 },
      { id: "easy", emoji: "📗", label: "easy book", size: 2 },
      { id: "easiest", emoji: "📘", label: "easiest", size: 3 },
    ],
    focusIds: ["easy", "hard"],
    stompId: "easiest",
    options: [
      { text: "easy", tip: "easy → easier (y става i + er)." },
      { text: "easier", correct: true },
      {
        text: "the easiest",
        tip: "the easiest е за три+. Тук сравняваме две книги!",
        stomp: true,
      },
    ],
  },
];

export const BRIDGE_LIVES = 4;
