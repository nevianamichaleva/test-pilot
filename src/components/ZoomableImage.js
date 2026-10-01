"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

import styles from "./ZoomableImage.module.css";

export default function ZoomableImage({ src, alt = "", className = "" }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const titleId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!src) return null;

  const lightbox =
    open && mounted
      ? createPortal(
          <div
            className={styles.overlay}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={() => setOpen(false)}
          >
            <p id={titleId} className={styles.srOnly}>
              Уголемена картинка
            </p>
            <button
              type="button"
              className={styles.close}
              onClick={() => setOpen(false)}
              aria-label="Затвори"
            >
              ×
            </button>
            <div
              className={styles.stage}
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className={styles.full} src={src} alt={alt} />
            </div>
            <p className={styles.overlayHint}>Кликни извън картинката или Escape за затваряне</p>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <button
        type="button"
        className={`${styles.trigger} ${className}`.trim()}
        onClick={() => setOpen(true)}
        aria-label="Увеличи картинката"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} />
        <span className={styles.hint} aria-hidden>
          кликни за уголемяване
        </span>
      </button>
      {lightbox}
    </>
  );
}
