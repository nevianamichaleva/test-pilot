/**
 * Рендира текст от урок с акценти: **важно**, „цитати“, (English).
 * @param {string} text
 * @param {{ hl: string, quote: string, en: string, metaphor: string }} styles
 * @returns {import("react").ReactNode[]}
 */
export function renderLessonText(text, styles) {
  const src = String(text ?? "");
  if (!src) return null;

  const metaphorMatch = /^(Метафора:\s*)([\s\S]*)$/i.exec(src);
  if (metaphorMatch) {
    return [
      <span key="m-label" className={styles.metaphorLabel}>
        {metaphorMatch[1]}
      </span>,
      ...tokenizeInline(metaphorMatch[2], styles, "m-"),
    ];
  }

  return tokenizeInline(src, styles, "");
}

function tokenizeInline(src, styles, keyPrefix) {
  // **важно** | „цитат“ | (English/Term)
  const re = /\*\*([^*]+)\*\*|„([^“]+)“|\(([A-Za-z][A-Za-z0-9 /&._-]{1,40})\)/g;
  const nodes = [];
  let last = 0;
  let m;
  let i = 0;

  while ((m = re.exec(src)) !== null) {
    if (m.index > last) {
      nodes.push(src.slice(last, m.index));
    }
    if (m[1]) {
      nodes.push(
        <strong key={`${keyPrefix}hl-${i}`} className={styles.hl}>
          {m[1]}
        </strong>
      );
    } else if (m[2]) {
      nodes.push(
        <span key={`${keyPrefix}q-${i}`} className={styles.quote}>
          „{m[2]}“
        </span>
      );
    } else if (m[3]) {
      nodes.push(
        <span key={`${keyPrefix}en-${i}`} className={styles.en}>
          ({m[3]})
        </span>
      );
    }
    last = m.index + m[0].length;
    i += 1;
  }

  if (last < src.length) nodes.push(src.slice(last));
  return nodes;
}

/**
 * Визуален тон на секция според заглавието / tone поле.
 * @param {{ heading?: string, tone?: string }} section
 */
export function getSectionTone(section) {
  if (section?.tone) return section.tone;
  const h = String(section?.heading || "").toLowerCase();
  if (h.includes("важно") || h.includes("запомни") || h.includes("обобщ")) return "key";
  if (h.includes("речник")) return "vocab";
  if (h.includes("мисия") || h.includes("практич") || h.includes("задач")) return "practice";
  return "default";
}
