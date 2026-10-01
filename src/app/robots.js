import { getSiteUrl } from "@/lib/site";

export default function robots() {
  const base = getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/test-pilot/rezultati", "/uroci"],
    },
    host: base,
    sitemap: `${base}/sitemap.xml`,
  };
}
