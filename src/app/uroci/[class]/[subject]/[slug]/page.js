import Link from "next/link";
import { notFound } from "next/navigation";

import Footer from "@/components/Footer";
import LessonContent from "@/components/LessonContent";
import PageHero from "@/components/PageHero";
import ZoomableImage from "@/components/ZoomableImage";
import { getAllLessons, getLesson } from "@/data/lessons";
import { SUBJECT_LABELS } from "@/lib/subjectLabels";

import styles from "../../../Uroci.module.css";

export function generateStaticParams() {
  return getAllLessons().map((l) => ({
    class: l.classNum,
    subject: l.subject,
    slug: l.slug,
  }));
}

export async function generateMetadata({ params }) {
  const resolved = await params;
  const lesson = getLesson(
    decodeURIComponent(resolved.class ?? ""),
    decodeURIComponent(resolved.subject ?? ""),
    decodeURIComponent(resolved.slug ?? "")
  );
  if (!lesson) return { title: "Урокът не е намерен" };
  return {
    title: lesson.title,
    description: lesson.subtitle || lesson.title,
    alternates: {
      canonical: `/uroci/${lesson.classNum}/${lesson.subject}/${lesson.slug}`,
    },
  };
}

export default async function LessonPage({ params }) {
  const resolved = await params;
  const classNum = decodeURIComponent(resolved.class ?? "");
  const subject = decodeURIComponent(resolved.subject ?? "");
  const slug = decodeURIComponent(resolved.slug ?? "");
  const lesson = getLesson(classNum, subject, slug);
  if (!lesson) notFound();

  const subjectLabel = SUBJECT_LABELS[lesson.subject] ?? lesson.subject;
  const relatedTest = lesson.relatedTest;
  const relatedTestHref =
    relatedTest?.slug
      ? `/test-pilot/${encodeURIComponent(lesson.classNum)}/${encodeURIComponent(lesson.subject)}/${encodeURIComponent(relatedTest.slug)}`
      : null;

  return (
    <div className={styles.page}>
      <main className={styles.wrap}>
        <PageHero
          variant="page"
          title={lesson.title}
          subtitle={`${lesson.classNum}. клас · ${subjectLabel}${lesson.subtitle ? ` · ${lesson.subtitle}` : ""}`}
          subtitleVariant="meta"
        />

        <article className={styles.card}>
          <LessonContent intro={lesson.intro} sections={[]} />
          {lesson.image ? (
            <ZoomableImage src={lesson.image} alt={lesson.title} />
          ) : null}
          <LessonContent sections={lesson.sections} />

          <div className={styles.actions}>
            <Link className={`${styles.btn} ${styles.btnGhost}`} href="/uroci">
              ← Всички уроци
            </Link>
            {relatedTestHref ? (
              <Link className={styles.btn} href={relatedTestHref}>
                {relatedTest?.label || "Реши теста по урока"}
              </Link>
            ) : null}
            <Link className={`${styles.btn} ${styles.btnGhost}`} href={`/test-pilot?class=${encodeURIComponent(lesson.classNum)}`}>
              Към тестовете
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
