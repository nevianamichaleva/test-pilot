/**
 * Каноничен публичен URL на сайта (за metadataBase, sitemap, robots).
 * Задайте NEXT_PUBLIC_SITE_URL в продукция (напр. https://www.example.com).
 */
export function getSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  return "http://localhost:3000";
}
