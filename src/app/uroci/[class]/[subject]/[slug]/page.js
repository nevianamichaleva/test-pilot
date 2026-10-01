import { notFound } from "next/navigation";

import Footer from "@/components/Footer";
import LessonView from "@/components/LessonView";
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
      <main className={`${styles.wrap} ${styles.wrapLesson}`}>
        <LessonView
          lesson={lesson}
          subjectLabel={subjectLabel}
          relatedTestHref={relatedTestHref}
        />
      </main>
      <Footer />
    </div>
  );
}
