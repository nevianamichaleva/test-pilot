"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import ZoomableImage from "@/components/ZoomableImage";
import {
  getSectionTone,
  renderLessonText,
} from "@/lib/lessonRichText";

import styles from "./LessonView.module.css";

const richStyles = {
  hl: styles.hl,
  quote: styles.quote,
  en: styles.en,
  metaphorLabel: styles.metaphorLabel,
};

function sectionId(index) {
  return `lesson-section-${index}`;
}

function isVocabSection(section) {
  return getSectionTone(section) === "vocab" || /речник/i.test(section?.heading || "");
}

function splitGlossary(bullets) {
  return (bullets || []).map((item) => {
    const plain = String(item).replace(/\*\*/g, "");
    const parts = plain.split(/\s+[—–-]\s+/);
    if (parts.length >= 2) {
      return { term: parts[0].trim(), meaning: parts.slice(1).join(" — ").trim() };
    }
    return { term: plain, meaning: "" };
  });
}

/**
 * @param {{
 *   lesson: object,
 *   subjectLabel: string,
 *   relatedTestHref?: string | null,
 *   taskHelpHref?: string | null,
 * }} props
 */
export default function LessonView({ lesson, subjectLabel, relatedTestHref, taskHelpHref }) {
  const sections = lesson.sections || [];
  const mainSections = sections.filter((s) => !isVocabSection(s));
  const vocabSection = sections.find((s) => isVocabSection(s));
  const glossary = splitGlossary(vocabSection?.bullets).slice(0, 6);

  const [readMap, setReadMap] = useState(() => ({}));
  const [fontStep, setFontStep] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState(null);

  const readCount = useMemo(
    () => mainSections.reduce((n, _, i) => n + (readMap[i] ? 1 : 0), 0),
    [mainSections, readMap]
  );
  const totalMain = mainSections.length;
  const progressPct = totalMain > 0 ? Math.round((readCount / totalMain) * 100) : 0;

  const textbookSrc = lesson.textbookImage || lesson.image || "";
  const hasTextbookBlock = Boolean(textbookSrc || lesson.intro || lesson.textbookPages);
  const quick = lesson.quickQuestion;
  const quizCorrect =
    quick && quizAnswer != null
      ? String(quizAnswer) === String(quick.correct)
      : null;

  const fontClass =
    fontStep > 0 ? styles.fontLg : fontStep < 0 ? styles.fontSm : "";

  const scrollTo = (index) => {
    const el = document.getElementById(sectionId(index));
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const markRead = (index) => {
    setReadMap((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <div className={`${styles.root} ${fontClass}`.trim()}>
      <header className={styles.heroBar}>
        <div className={styles.heroLeft}>
          <span className={styles.heroIcon} aria-hidden>
            🛰️
          </span>
          <div>
            <h1 className={styles.heroTitle}>{lesson.title}</h1>
            <p className={styles.heroMeta}>
              {lesson.classNum}. клас · {subjectLabel}
              {lesson.subtitle ? ` · ${lesson.subtitle}` : ""}
            </p>
          </div>
        </div>
        <div className={styles.heroRight}>
          <div className={styles.progressBlock} aria-label="Напредък по урока">
            <span className={styles.progressLabel}>
              {readCount}/{totalMain}
            </span>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
            </div>
          </div>
          <button
            type="button"
            className={styles.fontBtn}
            onClick={() => setFontStep((v) => (v >= 1 ? -1 : v + 1))}
            aria-label="Смени размера на шрифта"
            title="Размер на шрифта"
          >
            Aa
          </button>
        </div>
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          {hasTextbookBlock ? (
            <div className={styles.sideCard}>
              <div className={styles.sideCardHead}>
                <h2 className={styles.sideCardTitle}>Учебникът</h2>
                {lesson.textbookPages ? (
                  <span className={styles.pageBadge}>{lesson.textbookPages}</span>
                ) : null}
              </div>
              {textbookSrc ? (
                <div className={styles.sideThumb}>
                  <ZoomableImage src={textbookSrc} alt="Страници от учебника" />
                </div>
              ) : null}
              {lesson.intro ? (
                <p className={styles.sideHint}>{renderLessonText(lesson.intro, richStyles)}</p>
              ) : (
                <p className={styles.sideHint}>
                  Отвори учебника и чети заедно с обясненията вдясно.
                </p>
              )}
              {taskHelpHref ? (
                <Link className={styles.helpBtn} href={taskHelpHref}>
                  📝 Помощ по задачите
                </Link>
              ) : null}
            </div>
          ) : null}

          {mainSections.length > 0 ? (
            <nav className={styles.sideCard} aria-label="Съдържание">
              <h2 className={styles.sideCardTitle}>Съдържание</h2>
              <ol className={styles.toc}>
                {mainSections.map((s, i) => (
                  <li key={s.heading}>
                    <button
                      type="button"
                      className={`${styles.tocBtn}${readMap[i] ? ` ${styles.tocDone}` : ""}`}
                      onClick={() => scrollTo(i)}
                    >
                      <span className={styles.tocNum}>{i + 1}.</span>
                      <span>{s.shortTitle || s.heading}</span>
                      {readMap[i] ? <span aria-hidden>✓</span> : null}
                    </button>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}

          {glossary.length > 0 ? (
            <div className={styles.sideCard}>
              <h2 className={styles.sideCardTitle}>Малък речник</h2>
              <dl className={styles.glossary}>
                {glossary.map((g) => (
                  <div key={g.term} className={styles.glossaryRow}>
                    <dt>{g.term}</dt>
                    {g.meaning ? <dd>{g.meaning}</dd> : null}
                  </div>
                ))}
              </dl>
            </div>
          ) : null}

          {quick ? (
            <div className={styles.sideCard}>
              <h2 className={styles.sideCardTitle}>Бърз въпрос</h2>
              <p className={styles.quizQ}>{quick.q}</p>
              <div className={styles.quizOpts}>
                {(quick.options || []).map((opt) => {
                  const selected = quizAnswer === opt;
                  const show =
                    quizAnswer != null &&
                    (opt === quick.correct
                      ? styles.quizCorrect
                      : selected
                        ? styles.quizWrong
                        : "");
                  return (
                    <button
                      key={opt}
                      type="button"
                      className={`${styles.quizOpt} ${show || ""}`.trim()}
                      onClick={() => setQuizAnswer(opt)}
                      disabled={quizAnswer != null}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {quizCorrect === true ? (
                <p className={styles.quizFeedbackOk}>Верно! Браво!</p>
              ) : null}
              {quizCorrect === false ? (
                <p className={styles.quizFeedbackBad}>
                  Не точно — верният отговор е {quick.correct}.
                </p>
              ) : null}
            </div>
          ) : null}
        </aside>

        <div className={styles.main}>
          {mainSections.map((section, i) => {
            const metaphors = (section.body || []).filter((p) => /^Метафора:/i.test(p));
            const body = (section.body || []).filter((p) => !/^Метафора:/i.test(p));
            const tone = getSectionTone(section);
            return (
              <section
                key={section.heading}
                id={sectionId(i)}
                className={`${styles.sectionCard} ${styles[`tone_${tone}`] || ""}`}
              >
                <div className={styles.sectionHead}>
                  <span className={styles.sectionIcon} aria-hidden>
                    {section.icon || (tone === "practice" ? "🛠️" : tone === "key" ? "⭐" : "📘")}
                  </span>
                  <h2 className={styles.sectionTitle}>{section.heading}</h2>
                </div>

                {body.map((p) => (
                  <p key={p} className={styles.body}>
                    {renderLessonText(p, richStyles)}
                  </p>
                ))}

                {metaphors.map((p) => (
                  <div key={p} className={styles.imagine}>
                    <div className={styles.imagineLabel}>Представи си</div>
                    <p className={styles.imagineText}>{renderLessonText(p, richStyles)}</p>
                  </div>
                ))}

                {Array.isArray(section.cards) && section.cards.length > 0 ? (
                  <div className={styles.compareGrid}>
                    {section.cards.map((card) => (
                      <div key={card.title} className={styles.compareCard}>
                        <h3 className={styles.compareTitle}>{card.title}</h3>
                        <p className={styles.compareBody}>
                          {renderLessonText(card.body, richStyles)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}

                {Array.isArray(section.bullets) && section.bullets.length > 0 ? (
                  <div className={styles.actionGrid}>
                    {section.bullets.map((item, bi) => (
                      <div key={item} className={styles.actionItem}>
                        <span className={styles.actionNum} aria-hidden>
                          {bi + 1}
                        </span>
                        <div>{renderLessonText(item, richStyles)}</div>
                      </div>
                    ))}
                  </div>
                ) : null}

                {section.tip ? (
                  <div className={styles.remember}>
                    <div className={styles.rememberLabel}>Запомни</div>
                    <p>{renderLessonText(section.tip, richStyles)}</p>
                  </div>
                ) : null}

                {tone === "key" && !section.tip ? (
                  <div className={styles.remember}>
                    <div className={styles.rememberLabel}>Запомни</div>
                    <p>Прегледай точките по-горе — това е най-важното от урока.</p>
                  </div>
                ) : null}

                <button
                  type="button"
                  className={`${styles.readBtn}${readMap[i] ? ` ${styles.readBtnDone}` : ""}`}
                  onClick={() => markRead(i)}
                >
                  {readMap[i] ? "Прочетено ✓" : "Прочетох това ✓"}
                </button>
              </section>
            );
          })}

          <div className={styles.actions}>
            <Link className={`${styles.btn} ${styles.btnGhost}`} href="/uroci">
              ← Всички уроци
            </Link>
            {taskHelpHref ? (
              <Link className={styles.btn} href={taskHelpHref}>
                📝 Помощ по задачите
              </Link>
            ) : null}
            {relatedTestHref ? (
              <Link className={styles.btn} href={relatedTestHref}>
                {lesson.relatedTest?.label || "Реши теста по урока"}
              </Link>
            ) : null}
            <Link
              className={`${styles.btn} ${styles.btnGhost}`}
              href={`/test-pilot?class=${encodeURIComponent(lesson.classNum)}`}
            >
              Към тестовете
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
