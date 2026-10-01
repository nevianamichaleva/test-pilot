import {
  getSectionTone,
  renderLessonText,
} from "@/lib/lessonRichText";

import styles from "@/app/uroci/Uroci.module.css";

const richStyles = {
  hl: styles.hl,
  quote: styles.quote,
  en: styles.en,
  metaphorLabel: styles.metaphorLabel,
};

/**
 * @param {{
 *   intro?: string | null,
 *   sections?: {
 *     heading: string,
 *     body?: string[],
 *     bullets?: string[],
 *     tip?: string,
 *     tone?: string,
 *   }[],
 * }} props
 */
export default function LessonContent({ intro = null, sections }) {
  return (
    <>
      {intro ? (
        <p className={styles.lessonIntro}>{renderLessonText(intro, richStyles)}</p>
      ) : null}

      {(sections || []).map((section) => {
        const tone = getSectionTone(section);
        const toneClass = styles[`tone_${tone}`] || "";
        return (
          <section
            key={section.heading}
            className={`${styles.section} ${toneClass}`.trim()}
          >
            <h2 className={styles.sectionTitle}>{section.heading}</h2>
            {(section.body || []).map((p) => {
              const isMetaphor = /^Метафора:/i.test(p);
              return (
                <p
                  key={p}
                  className={`${styles.sectionBody}${isMetaphor ? ` ${styles.metaphor}` : ""}`}
                >
                  {renderLessonText(p, richStyles)}
                </p>
              );
            })}
            {Array.isArray(section.bullets) && section.bullets.length > 0 ? (
              <ul className={styles.bullets}>
                {section.bullets.map((item) => (
                  <li key={item}>{renderLessonText(item, richStyles)}</li>
                ))}
              </ul>
            ) : null}
            {section.tip ? (
              <p className={styles.tip}>{renderLessonText(section.tip, richStyles)}</p>
            ) : null}
          </section>
        );
      })}
    </>
  );
}
