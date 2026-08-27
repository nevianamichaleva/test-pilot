/**
 * The Signal Light – Present Simple vs Present Continuous
 * Diagnostic English Test · Grade 6 (Preparation)
 *
 * Син = Continuous (сега: Listen!, Look!, Where is…?, at the moment, now…)
 * Зелен = Simple (навик: usually, always, every day, often…)
 */

/**
 * @typedef {'continuous' | 'simple'} SignalAnswer
 * @typedef {{
 *   id: string,
 *   sentence: string,
 *   highlight?: string,
 *   answer: SignalAnswer,
 *   tip: string,
 * }} SignalRound
 */

/** @type {SignalRound[]} */
export const SIGNAL_ROUNDS = [
  {
    id: "alex-room",
    sentence: "Where is Alex? – In his room. He is playing computer games.",
    highlight: "Where is",
    answer: "continuous",
    tip: "„Where is…?“ + „в стаята си“ = действието се случва СЕГА → Present Continuous.",
  },
  {
    id: "listen-rain",
    sentence: "Listen! It is raining outside.",
    highlight: "Listen!",
    answer: "continuous",
    tip: "Listen! е жокер за „сега“. Ползваме Present Continuous.",
  },
  {
    id: "usually-bus",
    sentence: "She usually takes the bus to school.",
    highlight: "usually",
    answer: "simple",
    tip: "usually = навик, не само в този момент → Present Simple.",
  },
  {
    id: "look-bird",
    sentence: "Look! The bird is flying over the tree.",
    highlight: "Look!",
    answer: "continuous",
    tip: "Look! сочи към нещо, което се случва точно сега → Continuous.",
  },
  {
    id: "every-day",
    sentence: "They play football every day after school.",
    highlight: "every day",
    answer: "simple",
    tip: "every day = повтарящо се действие → Present Simple.",
  },
  {
    id: "at-the-moment",
    sentence: "Mum is cooking dinner at the moment.",
    highlight: "at the moment",
    answer: "continuous",
    tip: "at the moment = точно сега → Present Continuous.",
  },
  {
    id: "always-late",
    sentence: "Tom always gets up early on Mondays.",
    highlight: "always",
    answer: "simple",
    tip: "always / on Mondays = рутина → Present Simple.",
  },
  {
    id: "right-now",
    sentence: "Be quiet! The baby is sleeping right now.",
    highlight: "right now",
    answer: "continuous",
    tip: "right now и „Be quiet!“ показват действие в момента → Continuous.",
  },
  {
    id: "often-read",
    sentence: "I often read comics in the evening.",
    highlight: "often",
    answer: "simple",
    tip: "often = колко често се случва → Present Simple.",
  },
  {
    id: "where-are-kids",
    sentence: "Where are the children? – In the garden. They are playing hide and seek.",
    highlight: "Where are",
    answer: "continuous",
    tip: "„Къде са…?“ + мястото им = правят го сега → Continuous. (като въпроса за Алекс!)",
  },
  {
    id: "never-eat",
    sentence: "Dad never eats sweets before lunch.",
    highlight: "never",
    answer: "simple",
    tip: "never описва навик/правило → Present Simple.",
  },
  {
    id: "now-watching",
    sentence: "We are watching a film now. Don't turn on the light!",
    highlight: "now",
    answer: "continuous",
    tip: "now + „Don't turn on…“ = действието тече в момента → Continuous.",
  },
];

export const SIGNAL_LIVES = 3;
