import Link from "next/link";
import { notFound } from "next/navigation";

import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Bel6Adventure from "@/components/games/Bel6Adventure";
import DidYouKnowCrossword from "@/components/games/DidYouKnowCrossword";
import GamePlayTracker from "@/components/games/GamePlayTracker";
import GeoAdventure from "@/components/games/GeoAdventure";
import GeoAdventure6Vhodno from "@/components/games/GeoAdventure6Vhodno";
import HistoryReviewAdventure from "@/components/games/HistoryReviewAdventure";
import NatureMaze from "@/components/games/NatureMaze";
import PartsOfSpeechPuzzle from "@/components/games/PartsOfSpeechPuzzle";
import BridgeOfRules from "@/components/games/BridgeOfRules";
import GrammarDetective from "@/components/games/GrammarDetective";
import SentenceBuilder from "@/components/games/SentenceBuilder";
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
  const isGeoVhodno = game.kind === "geo-vhodno";
  const isNatureMaze = game.kind === "nature-maze";
  const isPosPuzzle = game.kind === "pos-puzzle";
  const isDidYouKnow = game.kind === "did-you-know";
  const isHistoryReview = game.kind === "history-review";
  const isBel6 = game.kind === "bel-6";
  const isSentenceBuilder = game.kind === "sentence-builder";
  const isGrammarDetective = game.kind === "grammar-detective";
  const isBridgeOfRules = game.kind === "bridge-of-rules";
  const exitHref = `/igri?class=${encodeURIComponent(game.classNums?.[0] ?? "")}&subject=${encodeURIComponent(game.subject ?? "")}`;

  return (
    <div className={pageStyles.page}>
      <main className={pageStyles.wrap}>
        <PageHero
          variant="page"
          title={game.title}
          subtitle={`${game.subjectLabel} · ${game.classHint}`}
          subtitleVariant="meta"
          imageSrc={game.image || "/test-pilot.png"}
          imageAlt={game.title}
          actions={
            <Link href="/igri" className={pageStyles.start}>
              ← Всички игри
            </Link>
          }
        />
        <GamePlayTracker game={game} />
        {isDidYouKnow ? (
          <DidYouKnowCrossword exitHref={exitHref} />
        ) : isGeoMode ? (
          <GeoAdventure initialMode={game.mode} exitHref={exitHref} />
        ) : isGeoVhodno ? (
          <GeoAdventure6Vhodno exitHref={exitHref} />
        ) : isNatureMaze ? (
          <NatureMaze exitHref={exitHref} />
        ) : isPosPuzzle ? (
          <PartsOfSpeechPuzzle exitHref={exitHref} />
        ) : isHistoryReview ? (
          <HistoryReviewAdventure exitHref={exitHref} />
        ) : isBel6 ? (
          <Bel6Adventure exitHref={exitHref} />
        ) : isSentenceBuilder ? (
          <SentenceBuilder exitHref={exitHref} />
        ) : isGrammarDetective ? (
          <GrammarDetective exitHref={exitHref} />
        ) : isBridgeOfRules ? (
          <BridgeOfRules exitHref={exitHref} />
        ) : (
          <GamePlay game={game} />
        )}
      </main>
      <Footer />
    </div>
  );
}
