"use client";

import { useState } from "react";

import { useAuth } from "@/components/AuthProvider";
import { buildGameTestId } from "@/lib/saveGameResult";
import { isPassingPercent } from "@/lib/rewards";

import styles from "./GameNameGate.module.css";

/**
 * Форма за име преди старт на игра (като при тестовете).
 * Логнатите пропускат полето за име и ползват displayName.
 * @param {{
 *   onStart: (name: string) => void,
 *   buttonLabel?: string,
 *   lead?: string,
 *   inputId?: string,
 *   game?: { slug?: string, subject?: string } | null,
 *   contentKey?: string,
 * }} props
 */
export default function GameNameGate({
  onStart,
  buttonLabel = "Започни играта",
  lead = "Името се показва в класацията и се записва заедно с резултата.",
  inputId = "game-participant-name",
  game = null,
  contentKey: contentKeyProp = "",
}) {
  const { user, displayName, loading, getBestForContent } = useAuth();
  const [nameDraft, setNameDraft] = useState("");
  const trimmed = nameDraft.trim();

  const contentKey =
    contentKeyProp ||
    (game?.slug ? buildGameTestId(game) : "");
  const best = contentKey ? getBestForContent(contentKey) : null;
  const solved = Boolean(best && isPassingPercent(best.percent));
  const solvedPercent = solved ? Math.round(Number(best.percent) || 0) : null;

  const submitGuest = () => {
    if (!trimmed) return;
    onStart(trimmed);
  };

  const submitLoggedIn = () => {
    const name = (displayName || user?.email || "Ученик").trim();
    if (!name) return;
    onStart(name);
  };

  if (loading) {
    return (
      <div className={styles.gate}>
        <p className={styles.lead}>Зареждане…</p>
      </div>
    );
  }

  if (user) {
    return (
      <div className={styles.gate}>
        <p className={styles.lead}>
          Играеш като <strong>{displayName || "Ученик"}</strong>.
        </p>
        {solved ? (
          <p className={styles.solvedNote}>
            Вече решен ({solvedPercent}%) — можеш да опиташ отново. Брои се най-добрият резултат.
          </p>
        ) : null}
        <button type="button" className={styles.startBtn} onClick={submitLoggedIn}>
          {solved ? "Реши отново" : buttonLabel}
        </button>
      </div>
    );
  }

  return (
    <div className={styles.gate}>
      <p className={styles.lead}>{lead}</p>
      <label className={styles.label} htmlFor={inputId}>
        Име <span className={styles.required}>*</span>
      </label>
      <div className={styles.row}>
        <input
          id={inputId}
          className={styles.input}
          value={nameDraft}
          onChange={(e) => setNameDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submitGuest();
          }}
          autoComplete="name"
          maxLength={120}
          placeholder=""
        />
        <button
          type="button"
          className={styles.startBtn}
          disabled={!trimmed}
          onClick={submitGuest}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
