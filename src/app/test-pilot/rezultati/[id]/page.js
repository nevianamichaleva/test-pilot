"use client";

import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase";
import { getThumbnailSrcFromTestId } from "@/lib/subjectImages";

import tp from "../../TestPilot.module.css";
import styles from "../Rezultati.module.css";

function toJsDate(timestamp) {
  if (!timestamp) return null;
  if (timestamp instanceof Date) return timestamp;
  try {
    if (timestamp.toDate) return timestamp.toDate();
    if (typeof timestamp.seconds === "number") return new Date(timestamp.seconds * 1000);
  } catch {
    // ignore
  }
  return null;
}

function formatDateTime(timestamp) {
  const date = toJsDate(timestamp);
  if (!date) return "–";
  return date.toLocaleString("bg-BG", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function parseIsoDate(isoValue) {
  if (typeof isoValue !== "string" || !isoValue.trim()) return null;
  const d = new Date(isoValue);
  return Number.isNaN(d.getTime()) ? null : d;
}

export default function ResultDetailsPage() {
  const params = useParams();
  const resultId = typeof params?.id === "string" ? params.id : "";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchResult() {
      try {
        if (!resultId) {
          if (!cancelled) setError("Липсва ID на резултат.");
          return;
        }
        if (!isFirebaseConfigured()) {
          if (!cancelled) setError("Firebase не е конфигуриран.");
          return;
        }
        const db = getFirebaseDb();
        if (!db) {
          if (!cancelled) setError("Firebase не може да се инициализира.");
          return;
        }
        const snap = await getDoc(doc(db, "results", resultId));
        if (cancelled) return;
        if (!snap.exists()) {
          setError("Резултатът не е намерен.");
          return;
        }
        const data = snap.data();
        setResult({
          id: snap.id,
          name: data.name || "Анонимен",
          points: data.points || "–",
          testTitle: data.testTitle || data.test || "Тест",
          test: data.test || "",
          createdAt: data.createdAt ?? null,
          updatedAt: data.updatedAt ?? null,
          startedAtIso: data.startedAtIso || null,
          status: data.status || "completed",
          completed: Boolean(data.completed),
          progressText: data.progressText || "",
          questionResults: Array.isArray(data.questionResults) ? data.questionResults : [],
        });
      } catch (e) {
        if (!cancelled) setError(e?.message || "Грешка при зареждане на резултата.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchResult();
    return () => {
      cancelled = true;
    };
  }, [resultId]);

  const detailThumb = useMemo(
    () => (result ? getThumbnailSrcFromTestId(result.test) : null),
    [result]
  );

  return (
    <div className={tp.page}>
      <main className={tp.wrap}>
        <PageHero
          variant="page"
          title={result?.testTitle || "Детайли за резултат"}
          subtitle="Подробен преглед на отговори."
          actions={
            <Link href="/test-pilot/rezultati" className={styles.backLink}>
              Към резултатите <span aria-hidden>›</span>
            </Link>
          }
        />

        {loading && <p className={`${styles.message} ${styles.messageCenter}`}>Зареждане...</p>}

        {!loading && error && <p className={styles.messageError}>{error}</p>}

        {!loading && !error && result && (
          <>
            <section className={styles.panel}>
              <div className={styles.detailHead}>
                {detailThumb ? (
                  <img
                    className={styles.detailThumb}
                    src={detailThumb}
                    alt=""
                    width={80}
                    height={80}
                    decoding="async"
                  />
                ) : null}
                <div className={styles.detailMetaCol}>
                  <p className={styles.detailMeta}>
                    Тест: <strong>{result.testTitle}</strong>
                  </p>
                  <p className={styles.detailMeta}>
                    Дете: <strong>{result.name}</strong>
                  </p>
                  <p className={styles.detailMeta}>
                    Начало: <strong>{formatDateTime(parseIsoDate(result.startedAtIso) || result.createdAt)}</strong>
                  </p>
                  <p className={styles.detailMeta}>
                    Статус: <strong>{result.completed ? "Завършен" : "Незавършен"}</strong>
                  </p>
                  <p className={styles.detailMeta}>
                    {result.completed
                      ? <>Резултат: <strong>{result.points}</strong></>
                      : <>Прогрес: <strong>{result.progressText || result.points || "–"}</strong></>}
                  </p>
                </div>
              </div>

              {result.questionResults.length > 0 ? (
                <div className={styles.summaryList}>
                  {result.questionResults.map((item, idx) => {
                    const isCorrect = item?.isCorrect === true || item?.status === "correct";
                    return (
                      <div key={`detail-q-${item?.questionNumber ?? idx + 1}`} className={styles.summaryItem}>
                        <p className={styles.summaryQuestion}>
                          Въпрос {item?.questionNumber ?? idx + 1}: {item?.questionText || "—"}
                        </p>
                        <p className={styles.summaryAnswer}>
                          Отговор: <strong>{item?.firstAnswer || "—"}</strong> —{" "}
                          <span className={isCorrect ? styles.summaryCorrect : styles.summaryWrong}>
                            {isCorrect ? "верен" : "грешен"}
                          </span>
                        </p>
                        {!isCorrect && (
                          <p className={styles.summaryCorrectAnswer}>
                            Верен отговор: <strong>{item?.correctAnswer || "—"}</strong>
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className={styles.message} style={{ margin: "12px 18px 18px" }}>
                  Няма детайлни данни за въпросите в този запис.
                </p>
              )}
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
