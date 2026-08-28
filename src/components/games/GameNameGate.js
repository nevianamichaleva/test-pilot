"use client";

import { useState } from "react";

import styles from "./GameNameGate.module.css";

/**
 * Форма за име преди старт на игра (като при тестовете).
 * @param {{
 *   onStart: (name: string) => void,
 *   buttonLabel?: string,
 *   lead?: string,
 *   inputId?: string,
 * }} props
 */
export default function GameNameGate({
  onStart,
  buttonLabel = "Започни играта",
  lead = "Името се показва в класацията и се записва заедно с резултата.",
  inputId = "game-participant-name",
}) {
  const [nameDraft, setNameDraft] = useState("");
  const trimmed = nameDraft.trim();

  const submit = () => {
    if (!trimmed) return;
    onStart(trimmed);
  };

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
            if (e.key === "Enter") submit();
          }}
          autoComplete="name"
          maxLength={120}
          placeholder=""
        />
        <button
          type="button"
          className={styles.startBtn}
          disabled={!trimmed}
          onClick={submit}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
