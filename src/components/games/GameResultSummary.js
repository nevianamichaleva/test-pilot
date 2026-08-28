import styles from "./GameResultSummary.module.css";

/**
 * Списък грешно/вярно – същият формат като при тестовете.
 * @param {{ items?: Array<{
 *   questionNumber?: number,
 *   questionText?: string,
 *   firstAnswer?: string,
 *   correctAnswer?: string,
 *   isCorrect?: boolean,
 *   status?: string,
 * }> }} props
 */
export default function GameResultSummary({ items }) {
  const list = Array.isArray(items) ? items : [];
  if (list.length === 0) return null;

  return (
    <div className={styles.summaryList}>
      {list.map((item, idx) => {
        const isCorrect = item?.isCorrect === true || item?.status === "correct";
        const n = item?.questionNumber ?? idx + 1;
        return (
          <div key={`game-q-${n}-${idx}`} className={styles.summaryItem}>
            <p className={styles.summaryQuestion}>
              Въпрос {n}: {item?.questionText || "—"}
            </p>
            <p className={styles.summaryAnswer}>
              Твой отговор: <strong>{item?.firstAnswer || "—"}</strong> —{" "}
              <span className={isCorrect ? styles.summaryCorrect : styles.summaryWrong}>
                {isCorrect ? "верен" : "грешен"}
              </span>
            </p>
            {!isCorrect ? (
              <p className={styles.summaryCorrectAnswer}>
                Верен отговор: <strong>{item?.correctAnswer || "—"}</strong>
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
