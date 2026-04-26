import Footer from "@/components/Footer";
import Quiz from "@/components/Quiz";
import { getTest } from "@/data/tests";
import { getTestListThumbnailSrc } from "@/lib/subjectImages";
import { SUBJECT_LABELS } from "@/lib/subjectLabels";
import Link from "next/link";

export async function generateMetadata({ params }) {
  const resolved = await params;
  const classNum = decodeURIComponent(resolved.class ?? "");
  const subject = decodeURIComponent(resolved.subject ?? "");
  const testSlug = decodeURIComponent(resolved.test ?? "");
  const testData = getTest(classNum, subject, testSlug);
  const subjectLabel = SUBJECT_LABELS[subject] ?? subject;

  if (!testData) {
    return {
      title: "Тестът не е намерен",
      description: "Търсеният тест не съществува или е премахнат.",
      robots: { index: false, follow: true },
    };
  }

  const title = `${testData.title} (${classNum}. клас)`;
  const description = `Интерактивен онлайн тест с ${testData.questionCount} въпроса по ${subjectLabel} за ${classNum}. клас: ${testData.title}.`;

  const path = `/test-pilot/${encodeURIComponent(classNum)}/${encodeURIComponent(subject)}/${encodeURIComponent(testSlug)}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      type: "website",
      url: path,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function TestPage({ params }) {
  const resolved = await params;
  const classNum = decodeURIComponent(resolved.class ?? "");
  const subject = decodeURIComponent(resolved.subject ?? "");
  const testSlug = decodeURIComponent(resolved.test ?? "");

  const testData = getTest(classNum, subject, testSlug);
  const subjectLabel = SUBJECT_LABELS[subject] ?? subject;

  if (!testData) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, display: "grid", placeItems: "center", padding: 24 }}>
          <div style={{ textAlign: "center", maxWidth: 520 }}>
            <h1 style={{ margin: 0, fontSize: 44, color: "#1a3a52" }}>404</h1>
            <p style={{ marginTop: 10, fontSize: 18, color: "rgba(26,58,82,0.75)" }}>
              Тестът не е намерен
            </p>
            <div style={{ marginTop: 18 }}>
              <Link
                href="/"
                style={{
                  display: "inline-block",
                  textDecoration: "none",
                  background: "#6f45ff",
                  color: "white",
                  padding: "12px 16px",
                  borderRadius: 12,
                  fontWeight: 900,
                }}
              >
                Обратно към началната страница
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const subjectThumbnailSrc = getTestListThumbnailSrc({
    classNum,
    subject,
    slug: testSlug,
  });

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Quiz
        title={testData.title}
        questions={testData.questions}
        testId={`${classNum}|${subject}|${testSlug}`}
        testTitle={testData.title}
        classNum={classNum}
        subject={subject}
        subjectLabel={subjectLabel}
        subjectThumbnailSrc={subjectThumbnailSrc}
      />
      <Footer />
    </div>
  );
}
