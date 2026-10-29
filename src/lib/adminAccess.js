/** Споделен админски достъп (UI gate; не е сървърна защита). */

export const ADMIN_PASSWORD = "developer2026!";

/** SessionStorage ключ — една парола отключва резултати, уроци и заключени тестове. */
export const ADMIN_STORAGE_KEY = "tp_admin_ok";

/** Предмети, чиито тестове са заключени за всички освен логнат потребител / admin парола. */
export const LOCKED_TEST_SUBJECTS = ["bg", "english"];

export function normalizeEmail(email) {
  return String(email || "")
    .trim()
    .toLowerCase();
}

export function isTestSubjectLocked(subject) {
  const s = String(subject || "")
    .trim()
    .toLowerCase();
  return LOCKED_TEST_SUBJECTS.includes(s);
}
