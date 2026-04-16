import { getSiteUrl } from "@/lib/site";

/** Структурирани данни WebSite за търсачки (schema.org). */
export default function SiteJsonLd() {
  const url = getSiteUrl();
  const payload = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Test Pilot",
    url,
    inLanguage: "bg-BG",
    description:
      "Безплатни онлайн тестове и упражнения за ученици от 1. до 7. клас по български език, математика, английски, география, история и други предмети.",
    publisher: {
      "@type": "Organization",
      name: "Test Pilot",
      url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
