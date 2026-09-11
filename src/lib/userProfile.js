import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase";
import {
  emptyCups,
  emptySubjectPoints,
  isPassingPercent,
  recomputeSubjectPointsAndCups,
  rewardForKind,
  scorePercent,
} from "@/lib/rewards";

/**
 * @param {string} uid
 * @param {{ displayName?: string, email?: string }} data
 */
export async function ensureUserProfile(uid, data = {}) {
  if (!uid || !isFirebaseConfigured()) return null;
  const db = getFirebaseDb();
  if (!db) return null;

  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const existing = snap.data() || {};
    const patch = {};
    if (data.displayName && data.displayName !== existing.displayName) {
      patch.displayName = data.displayName;
    }
    if (data.email && data.email !== existing.email) {
      patch.email = data.email;
    }
    if (Object.keys(patch).length) {
      await setDoc(ref, { ...patch, updatedAt: serverTimestamp() }, { merge: true });
    }
    return { id: uid, ...existing, ...patch };
  }

  const profile = {
    displayName: data.displayName || "Ученик",
    email: data.email || "",
    subjectPoints: emptySubjectPoints(),
    cups: emptyCups(),
    bestByContent: {},
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(ref, profile);
  return { id: uid, ...profile };
}

/**
 * @param {string} uid
 */
export async function fetchUserProfile(uid) {
  if (!uid || !isFirebaseConfigured()) return null;
  const db = getFirebaseDb();
  if (!db) return null;
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

/**
 * Записва най-добър опит и преизчислява точки/купи.
 * @param {{
 *   uid: string,
 *   contentKey: string,
 *   subject: string,
 *   kind: "test" | "game",
 *   title?: string,
 *   correct: number,
 *   gradable: number,
 * }} payload
 */
export async function applyUserAttemptReward(payload) {
  const uid = payload?.uid;
  const contentKey = payload?.contentKey;
  if (!uid || !contentKey || !isFirebaseConfigured()) return null;

  const db = getFirebaseDb();
  if (!db) return null;

  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  const existing = snap.exists() ? snap.data() || {} : {};

  const percent = scorePercent(payload.correct, payload.gradable);
  const kind = payload.kind === "game" ? "game" : "test";
  const subject = typeof payload.subject === "string" ? payload.subject : "";
  const rewardPoints = rewardForKind(kind);
  const completedAtIso = new Date().toISOString();

  /** @type {Record<string, object>} */
  const bestByContent =
    existing.bestByContent && typeof existing.bestByContent === "object"
      ? { ...existing.bestByContent }
      : {};

  const prev = bestByContent[contentKey];
  const prevPercent = typeof prev?.percent === "number" ? prev.percent : -1;
  if (percent < prevPercent) {
    // По-слаб опит — не пипаме най-доброто, но връщаме текущия профил.
    return { id: uid, ...existing, bestByContent };
  }

  bestByContent[contentKey] = {
    percent,
    correct: Number(payload.correct) || 0,
    gradable: Number(payload.gradable) || 0,
    rewardPoints,
    subject,
    kind,
    title: typeof payload.title === "string" ? payload.title : contentKey,
    completedAtIso,
    passed: isPassingPercent(percent),
  };

  const { subjectPoints, cups } = recomputeSubjectPointsAndCups(bestByContent);

  const next = {
    displayName: existing.displayName || "Ученик",
    email: existing.email || "",
    bestByContent,
    subjectPoints,
    cups,
    updatedAt: serverTimestamp(),
  };
  if (!snap.exists()) {
    next.createdAt = serverTimestamp();
  }

  await setDoc(ref, next, { merge: true });
  return { id: uid, ...existing, ...next };
}
