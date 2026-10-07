/** Споделен админски достъп (UI gate; не е сървърна защита). */

export const ADMIN_PASSWORD = "developer2026!";

/** SessionStorage ключ — една парола отключва резултати, уроци и заключени тестове. */
export const ADMIN_STORAGE_KEY = "tp_admin_ok";

/** Регистрирани потребители с директен достъп (без парола). */
export const LESSONS_ALLOWED_EMAILS = ["bori141114@gmail.com"];

/** Предмети, чиито тестове са заключени за всички освен admin / allowlist. */
export const LOCKED_TEST_SUBJECTS = ["bg", "english"];

export function normalizeEmail(email) {
  return String(email || "")
    .trim()
    .toLowerCase();
}

export function isLessonsEmailAllowed(email) {
  const n = normalizeEmail(email);
  if (!n) return false;
  return LESSONS_ALLOWED_EMAILS.some((e) => normalizeEmail(e) === n);
}

export function isTestSubjectLocked(subject) {
  const s = String(subject || "")
    .trim()
    .toLowerCase();
  return LOCKED_TEST_SUBJECTS.includes(s);
}
