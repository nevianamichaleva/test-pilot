/** Споделен админски достъп (UI gate; не е сървърна защита). */

export const ADMIN_PASSWORD = "developer2026!";

/** SessionStorage ключ — една парола отключва и резултати, и уроци. */
export const ADMIN_STORAGE_KEY = "tp_admin_ok";

/** Регистрирани потребители с директен достъп до уроците (без парола). */
export const LESSONS_ALLOWED_EMAILS = ["bori141114@gmail.com"];

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
