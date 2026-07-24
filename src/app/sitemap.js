import { getAllGames } from "@/data/games";
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

  const games = getAllGames().filter((g) => g.status === "ready");
  const gameEntries = games.map((g) => ({
    url: `${base}/igri/${encodeURIComponent(g.slug)}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.7,
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
      url: `${base}/igri`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/test-pilot/7-nvo`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    ...testEntries,
    ...gameEntries,
  ];
}
