/**
 * Антоними — пъзел от противоположности.
 */

/** @type {Array<{ id: string, a: string, b: string, iconA: string, iconB: string }>} */
export const ANTONYM_PAIRS = [
  { id: "otvoren-zatvoren", a: "отворен", b: "затворен", iconA: "🚪", iconB: "🔒" },
  { id: "prazen-pulen", a: "празен", b: "пълен", iconA: "📦", iconB: "🎁" },
  { id: "otkluchen-zakluchen", a: "отключен", b: "заключен", iconA: "🔓", iconB: "🔐" },
  { id: "byala-cherna", a: "бяла", b: "черна", iconA: "⚪", iconB: "⚫" },
  { id: "kus-dulug", a: "къс", b: "дълъг", iconA: "📏", iconB: "📐" },
  { id: "momche-momiche", a: "момче", b: "момиче", iconA: "👦", iconB: "👧" },
  { id: "mlad-star", a: "млад", b: "стар", iconA: "🌱", iconB: "🌳" },
  { id: "golyam-maluk", a: "голям", b: "малък", iconA: "🐘", iconB: "🐭" },
  { id: "sladuk-kisel", a: "сладък", b: "кисел", iconA: "🍬", iconB: "🍋" },
  { id: "malko-mnogo", a: "малко", b: "много", iconA: "1️⃣", iconB: "💯" },
  { id: "placha-smeya", a: "плача", b: "смея се", iconA: "😢", iconB: "😄" },
  { id: "lyato-zima", a: "лято", b: "зима", iconA: "☀️", iconB: "❄️" },
  { id: "pravilno-nepravilno", a: "правилно", b: "неправилно", iconA: "✅", iconB: "❌" },
  { id: "lek-tezhuk", a: "лек", b: "тежък", iconA: "🪶", iconB: "🏋️" },
  { id: "dobur-losh", a: "добър", b: "лош", iconA: "😊", iconB: "😠" },
  { id: "baven-burz", a: "бавен", b: "бърз", iconA: "🐢", iconB: "🐇" },
  { id: "svetul-tumen", a: "светъл", b: "тъмен", iconA: "💡", iconB: "🌑" },
  { id: "vkluchvam-izkluchvam", a: "включвам", b: "изключвам", iconA: "🔛", iconB: "📴" },
  { id: "tup-ostur", a: "тъп", b: "остър", iconA: "🥄", iconB: "🔪" },
  { id: "den-nosht", a: "ден", b: "нощ", iconA: "🌤️", iconB: "🌙" },
  { id: "slunce-luna", a: "слънце", b: "луна", iconA: "🌞", iconB: "🌕" },
  { id: "blizko-dalech", a: "близко", b: "далече", iconA: "📍", iconB: "🗺️" },
  { id: "hvarlyam-hvashtam", a: "хвърлям", b: "хващам", iconA: "🤾", iconB: "🤲" },
  { id: "zdrav-skusan", a: "здрав", b: "скъсан", iconA: "👕", iconB: "🩹" },
  { id: "mokra-suha", a: "мокра", b: "суха", iconA: "💧", iconB: "🏜️" },
  { id: "svezho-izsuhnalo", a: "свежо", b: "изсъхнало", iconA: "🌿", iconB: "🍂" },
  { id: "chisti-mrusni", a: "чисти", b: "мръсни", iconA: "✨", iconB: "🧹" },
  { id: "velikan-dzhudzhe", a: "великан", b: "джудже", iconA: "🗽", iconB: "🍄" },
  { id: "mek-tvurd", a: "мек", b: "твърд", iconA: "🧸", iconB: "🪨" },
  { id: "ogun-led", a: "огън", b: "лед", iconA: "🔥", iconB: "🧊" },
  { id: "novi-stari", a: "нови", b: "стари", iconA: "🆕", iconB: "📜" },
  { id: "govorya-mulcha", a: "говоря", b: "мълча", iconA: "🗣️", iconB: "🤫" },
  { id: "nisuk-visok", a: "нисък", b: "висок", iconA: "⬇️", iconB: "⬆️" },
  { id: "slab-debel", a: "слаб", b: "дебел", iconA: "🧍", iconB: "🐻" },
  { id: "nalyavo-nadyasno", a: "наляво", b: "надясно", iconA: "⬅️", iconB: "➡️" },
  { id: "nagore-nadolu", a: "нагоре", b: "надолу", iconA: "🔼", iconB: "🔽" },
  { id: "prava-kudrava", a: "права", b: "къдрава", iconA: "➖", iconB: "〰️" },
  { id: "otdolu-otgore", a: "отдолу", b: "отгоре", iconA: "⬇️", iconB: "⬆️" },
  { id: "vutre-vun", a: "вътре", b: "вън", iconA: "🏠", iconB: "🌳" },
  { id: "slizam-kachvam", a: "слизам", b: "качвам се", iconA: "⬇️", iconB: "🪜" },
  { id: "zaspivam-subuzhdam", a: "заспивам", b: "събуждам се", iconA: "😴", iconB: "⏰" },
  { id: "otpred-otzad", a: "отпред", b: "отзад", iconA: "👈", iconB: "👉" },
  { id: "goresht-studen", a: "горещ", b: "студен", iconA: "🥵", iconB: "🥶" },
  { id: "krasiva-grozna", a: "красива", b: "грозна", iconA: "🌸", iconB: "🥀" },
  { id: "tesen-shirok", a: "тесен", b: "широк", iconA: "🚪", iconB: "🚪" },
  { id: "sit-gladen", a: "сит", b: "гладен", iconA: "😋", iconB: "🍽️" },
  { id: "gladuk-grapav", a: "гладък", b: "грапав", iconA: "🪞", iconB: "🧱" },
  { id: "bogat-beden", a: "богат", b: "беден", iconA: "💰", iconB: "🪙" },
  { id: "padam-stavam", a: "падам", b: "ставам", iconA: "⬇️", iconB: "🧍" },
  { id: "cherveno-zeleno", a: "червено", b: "зелено", iconA: "🔴", iconB: "🟢" },
  { id: "angel-dyavol", a: "ангел", b: "дявол", iconA: "😇", iconB: "😈" },
  { id: "pustinya-oazis", a: "пустиня", b: "оазис", iconA: "🏜️", iconB: "🏝️" },
  { id: "umen-glupav", a: "умен", b: "глупав", iconA: "🧠", iconB: "🤪" },
  { id: "bolen-zdrav", a: "болен", b: "здрав", iconA: "🤒", iconB: "💪" },
  { id: "sugnat-razgunat", a: "сгънат", b: "разгънат", iconA: "📄", iconB: "📃" },
  { id: "sresana-roshava", a: "сресана", b: "рошава", iconA: "💇", iconB: "🌪️" },
];

export const ANTONYM_DEFINITION = {
  title: "Какво е антоним?",
  text: "Антонимите са думи с противоположно значение. Например: празен – пълен, горещ – студен, ден – нощ.",
  examples: [
    { a: "празен", b: "пълен" },
    { a: "горещ", b: "студен" },
    { a: "ден", b: "нощ" },
  ],
};

/** Колко опции да се показват вдясно (включително верния отговор). */
export const CHOICE_COUNT = 4;

/** Колко двойки на една сесия. */
export const ROUND_SIZE = 12;

export function antonymById(id) {
  return ANTONYM_PAIRS.find((p) => p.id === id);
}

export function totalAntonymPairs() {
  return ANTONYM_PAIRS.length;
}

/**
 * Взима произволни други думи за дистрактори (от противоположната „страна“ на двойките).
 * @param {string} excludeId
 * @param {number} count
 * @param {"a"|"b"} side — от коя страна на двойката да вземем грешни думи
 */
export function pickDistractors(excludeId, count, side = "b") {
  const pool = ANTONYM_PAIRS.filter((p) => p.id !== excludeId);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((p) => ({
    id: p.id,
    word: side === "a" ? p.a : p.b,
    icon: side === "a" ? p.iconA : p.iconB,
    correct: false,
  }));
}
