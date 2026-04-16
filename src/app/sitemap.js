import { getAllTests } from "@/data/tests";
import { getSiteUrl } from "@/lib/site";

export default function sitemap() {
  const base = getSiteUrl();
  const lastModified = new Date();

  const tests = getAllTests();
  const testEntries = tests.map((t) => ({
    url: `${base}/test-pilot/${encodeURIComponent(t.classNum)}/${encodeURIComponent(t.subject)}/${encodeURIComponent(t.slug)}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  return [
    {
      url: `${base}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/test-pilot`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${base}/test-pilot/7-nvo`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    ...testEntries,
  ];
}
