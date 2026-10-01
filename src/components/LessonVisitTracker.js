"use client";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useEffect, useRef } from "react";

import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase";

/**
 * Записва едно отваряне на урок в Firestore (`lessonVisitEvents`),
 * за статистика в /test-pilot/rezultati.
 */
export default function LessonVisitTracker({ lesson, subjectLabel }) {
  const loggedRef = useRef(false);
  const key = lesson
    ? `${lesson.classNum}|${lesson.subject}|${lesson.slug}`
    : "";

  useEffect(() => {
    if (!key || loggedRef.current) return;
    loggedRef.current = true;

    async function logVisit() {
      if (!isFirebaseConfigured()) return;
      const db = getFirebaseDb();
      if (!db) return;
      try {
        await addDoc(collection(db, "lessonVisitEvents"), {
          classNum: String(lesson.classNum ?? ""),
          subject: lesson.subject || "",
          subjectLabel: subjectLabel || "",
          slug: lesson.slug || "",
          title: lesson.title || lesson.slug || "Урок",
          subtitle: lesson.subtitle || "",
          lessonKey: key,
          startedAtIso: new Date().toISOString(),
          createdAt: serverTimestamp(),
        });
      } catch {
        // Не прекъсваме урока при грешка в логването.
      }
    }

    void logVisit();
    // Логваме веднъж при отваряне на страницата на урока.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- само key; lesson е стабилен от SSR
  }, [key]);

  return null;
}
