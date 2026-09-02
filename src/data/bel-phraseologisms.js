/**
 * Фразеологични карти.
 * Три режима: флаш карти, свързване (drag & drop), викторина.
 */

export const PHRASE_MODES = [
  {
    id: "flash",
    title: "Флаш карти",
    desc: "Обърни картата — виж илюстрация, обяснение и пример.",
  },
  {
    id: "match",
    title: "Свържи двойки",
    desc: "Завлечи фразата до правилното значение (или докосни две карти).",
  },
  {
    id: "quiz",
    title: "Викторина",
    desc: "Разграничи смисъла на изречението.",
  },
];

export const PHRASE_ROUNDS = [
  { ids: ["kapki-voda", "sedmo-nebe", "kamuk-sartse", "udaril-kamuk"] },
  { ids: ["trun-glog", "kapka-more", "cherna-ovca", "muha-slon"] },
  { ids: ["riba-suho", "vulk-ovca", "pchelica", "kon"] },
  { ids: ["med-maslo", "glutna-ezik", "vurti-prast", "pluva-vodi"] },
  { ids: ["maslo-ogun", "migne-oko", "pogledna-krivo", "ubivam-vreme"] },
];

const ILLU = (id) => `/images/igri/frazeologizmi/${id}.png`;

/** @type {Array<{ id: string, phrase: string, meaning: string, example: string, hint: string, literalCaption: string, figurativeCaption: string, flashIllustration?: string }>} */
export const PHRASE_CARDS = [
  {
    id: "kapki-voda",
    phrase: "като две капки вода",
    meaning: "Много еднакви или неразличими хора или неща.",
    example: "Тези две момчета са като две капки вода.",
    hint: "Две капки вода изглеждат почти еднакво.",
    literalCaption: "Две капки вода",
    figurativeCaption: "Два много сходни човека",
    flashIllustration: ILLU("kapki-voda"),
  },
  {
    id: "kamuk-sartse",
    phrase: "камък ми падна от сърцето",
    meaning: "Огромно облекчение след като проблемът изчезне.",
    example: "Камък ми падна от сърцето, когато разбрах, че всички са добре.",
    hint: "Когато тревогата отмине, сякаш тежък камък е паднал.",
    literalCaption: "Камък пада върху сърце",
    figurativeCaption: "Човек решава някакъв проблем",
    flashIllustration: ILLU("kamuk-sartse"),
  },
  {
    id: "udaril-kamuk",
    phrase: "ударих на камък",
    meaning: "Неуспех, спънка или отказ — опитът не успя.",
    example: "Опитах се да го убедя, но ударих на камък.",
    hint: "Камъкът е твърд — не можеш да пробиеш през него.",
    literalCaption: "Удар по твърд камък",
    figurativeCaption: "Опитът не успява",
    flashIllustration: ILLU("udaril-kamuk"),
  },
  {
    id: "sedmo-nebe",
    phrase: "на седмото небе",
    meaning: "Много радостен, доволен и щастлив.",
    example: "След победата Ирина беше на седмото небе.",
    hint: "Седмото небе е най-високото — там си най-щастлив.",
    literalCaption: "Човек високо в облаците",
    figurativeCaption: "Много щастлив човек",
    flashIllustration: ILLU("sedmo-nebe"),
  },
  {
    id: "trun-glog",
    phrase: "от трън, та на глог",
    meaning: "От лошо по-лошо — ситуацията се влошава.",
    example: "Смених стария си развален телефон с модел на друга марка, но се оказа, че пак съм от трън, та на глог",
    hint: "И трън, и глог имат бодли — става още по-неприятно.",
    literalCaption: "Трън и глог с бодли",
    figurativeCaption: "Нещата стават по-лоши",
    flashIllustration: ILLU("trun-glog"),
  },
  {
    id: "kapka-more",
    phrase: "капка в морето",
    meaning: "Много малко спрямо целото — незначително.",
    example: "Това, което направихме днес, е капка в морето.",
    hint: "Една капка в огромно море почти не се забелязва.",
    literalCaption: "Една капка в море",
    figurativeCaption: "Много малко спрямо целото",
    flashIllustration: ILLU("kapka-more"),
  },
  {
    id: "cherna-ovca",
    phrase: "черната овца",
    meaning: "Различен от групата — нежеланият, непокорният.",
    example: "В класа го смятаха за черната овца.",
    hint: "Сред белите овце черната овца се откроява.",
    literalCaption: "Черна овца сред бели",
    figurativeCaption: "Различен от групата",
    flashIllustration: ILLU("cherna-ovca"),
  },
  {
    id: "muha-slon",
    phrase: "прави от мухата слон",
    meaning: "Преувеличава малък, незначителен проблем.",
    example: "Не прави от мухата слон – всичко ще се оправи.",
    hint: "Мухата е дребна, слонът — огромен.",
    literalCaption: "Муха и слон заедно",
    figurativeCaption: "Преувеличава малък проблем",
    flashIllustration: ILLU("muha-slon"),
  },
  {
    id: "riba-suho",
    phrase: "като риба на сухо",
    meaning: "Безпомощен в непозната или трудна ситуация.",
    example: "Без приятелите си Петър се чувстваше като риба на сухо.",
    hint: "Рибата извън водата не може да се справи сама.",
    literalCaption: "Риба извън водата",
    figurativeCaption: "Чувства се изгубен",
    flashIllustration: ILLU("riba-suho"),
  },
  {
    id: "vulk-ovca",
    phrase: "вълк в овча кожа",
    meaning: "Изглежда добър, но има лоши намерения.",
    example: "Всички знаеха, че Николай е вълк в овча кожа.",
    hint: "Вълкът се крие сред овцете, за да не го познаят.",
    literalCaption: "Вълк с овча кожа",
    figurativeCaption: "Лош човек, който се прави на добър",
    flashIllustration: ILLU("vulk-ovca"),
  },
  {
    id: "pchelica",
    phrase: "като пчеличка",
    meaning: "Работи много усърдно — трудолюбив.",
    example: "Мая цял ден работи като пчеличка в градината.",
    hint: "Пчелата не спира да трудува.",
    literalCaption: "Пчела, която лети",
    figurativeCaption: "Човек, който много работи",
    flashIllustration: ILLU("pchelica"),
  },
  {
    id: "kon",
    phrase: "разиграва си коня",
    meaning: "Прави каквото си иска, без да се съобразява с другите.",
    example: "Никой не му правеше забележка и той си разиграваше коня.",
    hint: "Конят скача наоколо — прави си каквото иска.",
    literalCaption: "Кон, който скача",
    figurativeCaption: "Прави каквото си иска",
    flashIllustration: ILLU("kon"),
  },
  {
    id: "med-maslo",
    phrase: "върви по мед и масло",
    meaning: "Всичко върви лесно, гладко и без проблеми.",
    example: "На новата работа всичко му върви по мед и масло.",
    hint: "Медът и маслото са гладки и сладки — всичко е лесно.",
    literalCaption: "Върви по мед и масло",
    figurativeCaption: "Всичко е лесно и радостно",
    flashIllustration: ILLU("med-maslo"),
  },
  {
    id: "glutna-ezik",
    phrase: "глътна си езика",
    meaning: "Каза нещо неуместно или изпусна тайна без да иска.",
    example: "Глътна си езика и разказа изненадата пред всички.",
    hint: "Понякога езикът „избързва“ пред мисълта.",
    literalCaption: "Езикът задавя",
    figurativeCaption: "Казва нещо, което не трябва",
    flashIllustration: ILLU("glutna-ezik"),
  },
  {
    id: "vurti-prast",
    phrase: "върти на малкия си пръст",
    meaning: "Всички се съобразяват с него — много влияе на другите.",
    example: "Детето въртеше всички на малкия си пръст.",
    hint: "Малкият пръст сякаш „води“ останалите.",
    literalCaption: "Хора на пръста",
    figurativeCaption: "Всички му се подчиняват",
    flashIllustration: ILLU("vurti-prast"),
  },
  {
    id: "pluva-vodi",
    phrase: "плува в свои води",
    meaning: "Чувства се добре и способен в позната, удобна среда.",
    example: "В училище той плуваше в свои води.",
    hint: "Рибата плува лесно там, където я познава.",
    literalCaption: "Плува в позната вода",
    figurativeCaption: "В стихията си",
    flashIllustration: ILLU("pluva-vodi"),
  },
  {
    id: "maslo-ogun",
    phrase: "наля масло в огъня",
    meaning: "Направи лошата ситуация още по-лоша.",
    example: "С постъпката си тя наля масло в огъня.",
    hint: "Маслото разпалва огъня още повече.",
    literalCaption: "Масло върху огън",
    figurativeCaption: "Влошава спора",
    flashIllustration: ILLU("maslo-ogun"),
  },
  {
    id: "migne-oko",
    phrase: "без да ми мигне окото",
    meaning: "Направи нещо лошо спокойно, без смущение или угризение.",
    example: "Излъгах го без да ми мигне окото.",
    hint: "Окото не трепва — няма притеснение.",
    literalCaption: "Окото не мигва",
    figurativeCaption: "Лъже спокойно",
    flashIllustration: ILLU("migne-oko"),
  },
  {
    id: "pogledna-krivo",
    phrase: "погледна на криво",
    meaning: "Погледна с неодобрение, подозрение или недоверие.",
    example: "Учителят го погледна на криво.",
    hint: "„На криво“ означава не с добро око.",
    literalCaption: "Кривоглед поглед",
    figurativeCaption: "Неодобрение и подозрение",
    flashIllustration: ILLU("pogledna-krivo"),
  },
  {
    id: "ubivam-vreme",
    phrase: "убивам си времето",
    meaning: "Правя нещо леко, за да мине времето, без реална полза.",
    example: "Убивам си времето с игрички.",
    hint: "Времето „минава“, докато правиш нещо приятно.",
    literalCaption: "Часовник и игра",
    figurativeCaption: "Губи си времето",
    flashIllustration: ILLU("ubivam-vreme"),
  },
];

/** @type {Array<{ id: string, sentence: string, question: string, options: Array<{ id: string, text: string, correct: boolean }> }>} */
export const PHRASE_QUIZ = [
  {
    id: "sedmo-nebe",
    sentence: "Ирина беше на седмото небе.",
    question: "Как се чувства Ирина?",
    options: [
      { id: "a", text: "Ирина лети в космоса", correct: false },
      { id: "b", text: "Много е щастлива и доволна", correct: true },
    ],
  },
  {
    id: "kamuk-sartse",
    sentence: "Камък ми падна от сърцето, когато видях, че брат ми е добре.",
    question: "Какво означава това?",
    options: [
      { id: "a", text: "Камък е паднал от сърцето му", correct: false },
      { id: "b", text: "Много се облекчих и успокоих", correct: true },
    ],
  },
  {
    id: "kapki-voda",
    sentence: "Момичетата в класа са като две капки вода.",
    question: "Какво се има предвид?",
    options: [
      { id: "a", text: "Мокри са от дъжд", correct: false },
      { id: "b", text: "Много приличат едно на друго", correct: true },
    ],
  },
  {
    id: "udaril-kamuk",
    sentence: "Опитах да го убедя, но ударих на камък.",
    question: "Какво се случи?",
    options: [
      { id: "a", text: "Ударих се в камък.", correct: false },
      { id: "b", text: "Не успях — той не ми повярва", correct: true },
    ],
  },
  {
    id: "trun-glog",
    sentence: "След като смени отбора, нещата станаха от трън, та на глог.",
    question: "Какво означава?",
    options: [
      { id: "a", text: "Събира тръни и плодове от храсти", correct: false },
      { id: "b", text: "Ситуацията стана още по-лоша", correct: true },
    ],
  },
  {
    id: "kapka-more",
    sentence: "Спасените пари са само капка в морето спрямо нуждите ни.",
    question: "Какво означава „капка в морето“?",
    options: [
      { id: "a", text: "В морето има много капки вода", correct: false },
      { id: "b", text: "Много малко спрямо цялото.", correct: true },
    ],
  },
  {
    id: "cherna-ovca",
    sentence: "В семейството той беше черната овца.",
    question: "Какво означава?",
    options: [
      { id: "a", text: "Те отглеждат черна овца като домашно животно", correct: false },
      { id: "b", text: "Той е различен и нежелан член в семейството", correct: true },
    ],
  },
  {
    id: "muha-slon",
    sentence: "Не прави от мухата слон!",
    question: "Какво се казва на човека?",
    options: [
      { id: "a", text: "Не се опитвай да превърнеш муха в слон", correct: false },
      { id: "b", text: "Да не преувеличава малък проблем", correct: true },
    ],
  },
  {
    id: "riba-suho",
    sentence: "На новото място се чувстваше като риба на сухо.",
    question: "Какво означава?",
    options: [
      { id: "a", text: "Рибите не могат да плуват извън водата", correct: false },
      { id: "b", text: "Безпомощен и изгубен в непозната среда", correct: true },
    ],
  },
  {
    id: "vulk-ovca",
    sentence: "Този човек е вълк в овча кожа.",
    question: "Какво означава?",
    options: [
      { id: "a", text: "Този човек има овча кожа като дреха", correct: false },
      { id: "b", text: "Изглежда добър, но има лоши намерения", correct: true },
    ],
  },
  {
    id: "pchelica",
    sentence: "Цял ден работи като пчеличка в градината.",
    question: "Какво означава?",
    options: [
      { id: "a", text: "Превърнал се е в пчела", correct: false },
      { id: "b", text: "Работи много усърдно и трудолюбиво", correct: true },
    ],
  },
  {
    id: "kon",
    sentence: "Никой не му правеше забележка и той си разиграваше коня.",
    question: "Какво прави той?",
    options: [
      { id: "a", text: "Той води кон на концерт", correct: false },
      { id: "b", text: "Прави каквото си иска, без да се съобразява", correct: true },
    ],
  },
  {
    id: "med-maslo",
    sentence: "На новата работа всичко му върви по мед и масло.",
    question: "Какво означава?",
    options: [
      { id: "a", text: "На новата работа има вкусен мед и масло", correct: false },
      { id: "b", text: "Всичко върви лесно и без проблеми", correct: true },
    ],
  },
  {
    id: "glutna-ezik",
    sentence: "Глътна си езика и разказа изненадата пред всички.",
    question: "Какво означава?",
    options: [
      { id: "a", text: "Задави се с езика си", correct: false },
      { id: "b", text: "Каза нещо, което не трябваше", correct: true },
    ],
  },
  {
    id: "vurti-prast",
    sentence: "Детето въртеше всички на малкия си пръст.",
    question: "Какво означава?",
    options: [
      { id: "a", text: "Върти хората около пръста си", correct: false },
      { id: "b", text: "Всички се съобразяваха с него", correct: true },
    ],
  },
  {
    id: "pluva-vodi",
    sentence: "В училище той плуваше в свои води.",
    question: "Какво означава?",
    options: [
      { id: "a", text: "Плува в басейна на училището", correct: false },
      { id: "b", text: "Чувства се добре и способен там", correct: true },
    ],
  },
  {
    id: "maslo-ogun",
    sentence: "С постъпката си тя наля масло в огъня.",
    question: "Какво означава?",
    options: [
      { id: "a", text: "Готви върху огън с масло", correct: false },
      { id: "b", text: "Направи ситуацията още по-лоша", correct: true },
    ],
  },
  {
    id: "migne-oko",
    sentence: "Излъгах го без да ми мигне окото.",
    question: "Какво означава?",
    options: [
      { id: "a", text: "Очите му не мигат", correct: false },
      { id: "b", text: "Излъга го спокойно, без притеснение", correct: true },
    ],
  },
  {
    id: "pogledna-krivo",
    sentence: "Учителят го погледна на криво.",
    question: "Какво означава?",
    options: [
      { id: "a", text: "Гледа го с наклонена глава", correct: false },
      { id: "b", text: "Гледа го с неодобрение и подозрение", correct: true },
    ],
  },
  {
    id: "ubivam-vreme",
    sentence: "Убивам си времето с игрички.",
    question: "Какво означава?",
    options: [
      { id: "a", text: "Унищожава часовника си", correct: false },
      { id: "b", text: "Прави нещо леко, докато мине времето", correct: true },
    ],
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

export function taskTotalForPhraseMode(mode) {
  if (mode === "flash") return PHRASE_CARDS.length;
  if (mode === "match") return totalPhrasePairs();
  if (mode === "quiz") return PHRASE_QUIZ.length;
  return 0;
}
