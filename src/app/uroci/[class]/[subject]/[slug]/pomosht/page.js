import { notFound } from "next/navigation";

import Footer from "@/components/Footer";
import LessonTaskHelp from "@/components/LessonTaskHelp";
import { getAllLessons, getLesson } from "@/data/lessons";
import { SUBJECT_LABELS } from "@/lib/subjectLabels";

import styles from "../../../../Uroci.module.css";

export function generateStaticParams() {
  return getAllLessons()
    .filter((l) => l.taskHelp)
    .map((l) => ({
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
  if (!lesson?.taskHelp) return { title: "Помощта не е намерена" };
  const helpTitle = lesson.taskHelp.title || "Помощ по задачите";
  return {
    title: `${helpTitle} · ${lesson.title}`,
    description: lesson.taskHelp.subtitle || helpTitle,
    alternates: {
      canonical: `/uroci/${lesson.classNum}/${lesson.subject}/${lesson.slug}/pomosht`,
    },
  };
}

export default async function LessonTaskHelpPage({ params }) {
  const resolved = await params;
  const classNum = decodeURIComponent(resolved.class ?? "");
  const subject = decodeURIComponent(resolved.subject ?? "");
  const slug = decodeURIComponent(resolved.slug ?? "");
  const lesson = getLesson(classNum, subject, slug);
  if (!lesson?.taskHelp) notFound();

  const subjectLabel = SUBJECT_LABELS[lesson.subject] ?? lesson.subject;
  const backHref = `/uroci/${encodeURIComponent(lesson.classNum)}/${encodeURIComponent(lesson.subject)}/${encodeURIComponent(lesson.slug)}`;

  return (
    <div className={styles.page}>
      <main className={`${styles.wrap} ${styles.wrapLesson}`}>
        <LessonTaskHelp
          lesson={lesson}
          subjectLabel={subjectLabel}
          backHref={backHref}
        />
      </main>
      <Footer />
    </div>
  );
}
