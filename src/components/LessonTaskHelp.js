"use client";

import Link from "next/link";

import ZoomableImage from "@/components/ZoomableImage";
import { renderLessonText } from "@/lib/lessonRichText";

import styles from "./LessonView.module.css";

const richStyles = {
  hl: styles.hl,
  quote: styles.quote,
  en: styles.en,
  metaphorLabel: styles.metaphorLabel,
};

/**
 * @param {{
 *   lesson: object,
 *   subjectLabel: string,
 *   backHref: string,
 * }} props
 */
export default function LessonTaskHelp({ lesson, subjectLabel, backHref }) {
  const help = lesson?.taskHelp;
  if (!help) return null;

  const tasks = Array.isArray(help.tasks) ? help.tasks : [];
  const textbookSrc = help.textbookImage || "";

  return (
    <div className={styles.root}>
      <header className={styles.heroBar}>
        <div className={styles.heroLeft}>
          <span className={styles.heroIcon} aria-hidden>
            📝
          </span>
          <div>
            <h1 className={styles.heroTitle}>{help.title || "Помощ по задачите"}</h1>
            <p className={styles.heroMeta}>
              {lesson.classNum}. клас · {subjectLabel}
              {help.subtitle ? ` · ${help.subtitle}` : ""}
            </p>
          </div>
        </div>
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.sideCard}>
            <div className={styles.sideCardHead}>
              <h2 className={styles.sideCardTitle}>Учебникът</h2>
              {help.textbookPages ? (
                <span className={styles.pageBadge}>{help.textbookPages}</span>
              ) : null}
            </div>
            {textbookSrc ? (
              <div className={styles.sideThumb}>
                <ZoomableImage src={textbookSrc} alt="Задачи от учебника" />
              </div>
            ) : null}
            {help.intro ? (
              <p className={styles.sideHint}>{renderLessonText(help.intro, richStyles)}</p>
            ) : null}
          </div>

          {tasks.length > 0 ? (
            <nav className={styles.sideCard} aria-label="Задачи">
              <h2 className={styles.sideCardTitle}>Задачи</h2>
              <ol className={styles.toc}>
                {tasks.map((t, i) => (
                  <li key={t.heading}>
                    <a className={styles.tocBtn} href={`#task-${i + 1}`}>
                      <span className={styles.tocNum}>{i + 1}.</span>
                      <span>{t.shortTitle || t.heading}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}
        </aside>

        <div className={styles.main}>
          {tasks.map((task, i) => (
            <section
              key={task.heading}
              id={`task-${i + 1}`}
              className={`${styles.sectionCard} ${styles.tone_practice}`}
            >
              <div className={styles.sectionHead}>
                <span className={styles.sectionIcon} aria-hidden>
                  {task.icon || "📝"}
                </span>
                <h2 className={styles.sectionTitle}>{task.heading}</h2>
              </div>

              {(task.body || []).map((p) => (
                <p key={p} className={styles.body}>
                  {renderLessonText(p, richStyles)}
                </p>
              ))}

              {Array.isArray(task.cards) && task.cards.length > 0 ? (
                <div className={styles.compareGrid}>
                  {task.cards.map((card) => (
                    <div key={card.title} className={styles.compareCard}>
                      <h3 className={styles.compareTitle}>{card.title}</h3>
                      <p className={styles.compareBody}>
                        {renderLessonText(card.body, richStyles)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}

              {Array.isArray(task.bullets) && task.bullets.length > 0 ? (
                <div className={styles.actionGrid}>
                  {task.bullets.map((item, bi) => (
                    <div key={item} className={styles.actionItem}>
                      <span className={styles.actionNum} aria-hidden>
                        {bi + 1}
                      </span>
                      <div>{renderLessonText(item, richStyles)}</div>
                    </div>
                  ))}
                </div>
              ) : null}

              {task.tip ? (
                <div className={styles.remember}>
                  <div className={styles.rememberLabel}>Подсказка</div>
                  <p>{renderLessonText(task.tip, richStyles)}</p>
                </div>
              ) : null}
            </section>
          ))}

          <div className={styles.actions}>
            <Link className={styles.btn} href={backHref}>
              ← Назад към урока
            </Link>
            <Link className={`${styles.btn} ${styles.btnGhost}`} href="/uroci">
              Всички уроци
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
