"use client";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useEffect, useRef } from "react";

import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase";

/**
 * Записва едно отваряне на игра в Firestore (`gamePlayEvents`),
 * за да се следи интересът към игрите в /test-pilot/rezultati.
 */
export default function GamePlayTracker({ game }) {
  const loggedRef = useRef(false);

  useEffect(() => {
    if (!game?.slug || loggedRef.current) return;
    loggedRef.current = true;

    async function logPlay() {
      if (!isFirebaseConfigured()) return;
      const db = getFirebaseDb();
      if (!db) return;
      try {
        await addDoc(collection(db, "gamePlayEvents"), {
          slug: game.slug,
          title: game.title || game.slug,
          subject: game.subject || "",
          subjectLabel: game.subjectLabel || "",
          classNums: Array.isArray(game.classNums) ? game.classNums : [],
          classHint: game.classHint || "",
          kind: game.kind || "",
          mode: game.mode || "",
          startedAtIso: new Date().toISOString(),
          createdAt: serverTimestamp(),
        });
      } catch {
        // Не прекъсваме играта при грешка в логването.
      }
    }

    void logPlay();
    // Логваме веднъж при отваряне на страницата на играта.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- само slug; game е стабилен от SSR
  }, [game?.slug]);

  return null;
}
