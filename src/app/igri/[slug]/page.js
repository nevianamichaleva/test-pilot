import Link from "next/link";
import { notFound } from "next/navigation";

import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import GeoAdventure from "@/components/games/GeoAdventure";
import { getAllGames, getGameBySlug } from "@/data/games";

import pageStyles from "../Igri.module.css";
import GamePlay from "./GamePlay";

export function generateStaticParams() {
  return getAllGames().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }) {
  const resolved = await params;
  const game = getGameBySlug(resolved.slug);
  if (!game) {
    return { title: "Играта не е намерена" };
  }
  return {
    title: game.title,
    description: game.description,
    alternates: { canonical: `/igri/${game.slug}` },
  };
}

export default async function GamePage({ params }) {
  const resolved = await params;
  const game = getGameBySlug(resolved.slug);
  if (!game || game.status !== "ready") notFound();

  const isGeoMode = game.kind === "geo-mode" && game.mode;
  const exitHref = `/igri?class=${encodeURIComponent(game.classNums?.[0] ?? "")}&subject=${encodeURIComponent(game.subject ?? "")}`;

  return (
    <div className={pageStyles.page}>
      <main className={pageStyles.wrap}>
        <PageHero
          variant="page"
          title={game.title}
          subtitle={`${game.subjectLabel} · ${game.classHint}`}
          subtitleVariant="meta"
          actions={
            <Link href="/igri" className={pageStyles.start}>
              ← Всички игри
            </Link>
          }
        />
        {isGeoMode ? (
          <GeoAdventure initialMode={game.mode} exitHref={exitHref} />
        ) : (
          <GamePlay game={game} />
        )}
      </main>
      <Footer />
    </div>
  );
}
