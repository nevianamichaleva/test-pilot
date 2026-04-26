/**
 * Икони за предмети от /public/images (за разпознаваемост в UI).
 */
export const SUBJECT_THUMB_SRC = {
  bg: "/images/bel.png",
  english: "/images/english.png",
  geografia: "/images/geografy.png",
  istoriya: "/images/history.png",
  literatura: "/images/literature.png",
  priroda: "/images/nature.png",
};

const NVO_THUMB_SRC = "/images/nvo.png";

/**
 * Миниатюра за тест в списъци (начална страница, /test-pilot).
 * НВО БЕЛ в 7. клас: отделна иконка.
 */
export function getTestListThumbnailSrc(test) {
  if (!test || typeof test !== "object") return null;
  const classNum = String(test.classNum ?? "").trim();
  const subject = test.subject;
  const slug = String(test.slug ?? "");
  if (classNum === "7" && subject === "bg" && /^bel-/i.test(slug)) {
    return NVO_THUMB_SRC;
  }
  return SUBJECT_THUMB_SRC[subject] ?? null;
}

/** Миниатюра от testId (`клас|предмет|slug`). */
export function getThumbnailSrcFromTestId(testId) {
  if (!testId || typeof testId !== "string") return null;
  const parts = testId.split("|");
  if (parts.length >= 3) {
    return getTestListThumbnailSrc({
      classNum: parts[0],
      subject: parts[1],
      slug: parts[2],
    });
  }
  if (parts.length >= 2) return SUBJECT_THUMB_SRC[parts[1]] ?? null;
  return null;
}
