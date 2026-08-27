/**
 * Text Detective – четене с разбиране + доказателство в текста
 * Diagnostic English Test · Grade 6 · Въпроси 16–20 (An Unusual Hobby)
 *
 * True/False → маркирай изречението, което доказва отговора.
 * Ключов урок (въпрос 17): weekend = Saturdays and Sundays.
 */

/**
 * @typedef {{ id: string, text: string }} TextSentence
 * @typedef {{ id: string, sentences: TextSentence[] }} TextParagraph
 * @typedef {{
 *   id: string,
 *   question: string,
 *   answer: boolean,
 *   evidenceId: string,
 *   paragraphId: string,
 *   tip: string,
 *   wrongMarkTip?: string,
 * }} TextCase
 */

/** @type {{ title: string, paragraphs: TextParagraph[] }} */
export const TEXT_DETECTIVE_PASSAGE = {
  title: "An Unusual Hobby",
  paragraphs: [
    {
      id: "p1",
      sentences: [
        {
          id: "s1",
          text: "Most teenagers in my class love playing video games or going out with friends, but my friend Kevin has a very different hobby.",
        },
        {
          id: "s2",
          text: "He is twelve years old and he loves birdwatching.",
        },
        {
          id: "s3",
          text: "Every weekend, he wakes up at 5:00 AM, takes his camera and binoculars, and goes to the forest near Varna.",
        },
      ],
    },
    {
      id: "p2",
      sentences: [
        {
          id: "s4",
          text: "Right now, Kevin is sitting quietly behind a big tree.",
        },
        {
          id: "s5",
          text: "He is waiting to see a rare black stork.",
        },
        {
          id: "s6",
          text: "He usually spends four or five hours waiting.",
        },
        {
          id: "s7",
          text: "Kevin says his hobby is great because it helps him relax after a long week at school and teaches him a lot about nature.",
        },
      ],
    },
  ],
};

/** @type {TextCase[]} */
export const TEXT_DETECTIVE_CASES = [
  {
    id: "q16",
    question: "Kevin’s classmates share the same hobby as him.",
    answer: false,
    evidenceId: "s1",
    paragraphId: "p1",
    tip: "Текстът казва different hobby – съучениците НЕ споделят същото хоби.",
    wrongMarkTip: "Хмм, виж пак първия абзац!",
  },
  {
    id: "q17",
    question: "Kevin goes to the forest on Saturdays and Sundays.",
    answer: true,
    evidenceId: "s3",
    paragraphId: "p1",
    tip: "Every weekend = Saturdays and Sundays. Уикендът е точно събота и неделя!",
    wrongMarkTip: "Хмм, виж пак първия абзац! Търси думата weekend.",
  },
  {
    id: "q18",
    question: "Kevin is looking for a regular white stork at the moment.",
    answer: false,
    evidenceId: "s5",
    paragraphId: "p2",
    tip: "Той чака rare black stork, не обикновен бял щъркел.",
    wrongMarkTip: "Хмм, виж пак втория абзац!",
  },
  {
    id: "q19",
    question: "Kevin doesn’t spend more than two hours in the forest.",
    answer: false,
    evidenceId: "s6",
    paragraphId: "p2",
    tip: "Обикновено чака four or five hours – повече от два часа.",
    wrongMarkTip: "Хмм, виж пак втория абзац! Колко часа чака?",
  },
  {
    id: "q20",
    question: "Birdwatching helps Kevin feel less stressed about school.",
    answer: true,
    evidenceId: "s7",
    paragraphId: "p2",
    tip: "helps him relax after a long week at school = по-малко стрес.",
    wrongMarkTip: "Хмм, виж пак края на втория абзац!",
  },
];

export const TEXT_DETECTIVE_LIVES = 3;
