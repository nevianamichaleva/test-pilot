import Link from "next/link";
import { notFound } from "next/navigation";

import Footer from "@/components/Footer";
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
          {lesson.image ? (
            <ZoomableImage src={lesson.image} alt={lesson.title} />
          ) : null}

          {(lesson.sections || []).map((section) => (
            <section key={section.heading} className={styles.section}>
              <h2 className={styles.sectionTitle}>{section.heading}</h2>
              {(section.body || []).map((p) => (
                <p key={p} className={styles.sectionBody}>
                  {p}
                </p>
              ))}
              {Array.isArray(section.bullets) && section.bullets.length > 0 ? (
                <ul className={styles.bullets}>
                  {section.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
              {section.tip ? <p className={styles.tip}>{section.tip}</p> : null}
            </section>
          ))}

          <div className={styles.actions}>
            <Link className={`${styles.btn} ${styles.btnGhost}`} href="/uroci">
              ← Всички уроци
            </Link>
            <Link className={styles.btn} href="/test-pilot?class=6">
              Към тестовете
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
