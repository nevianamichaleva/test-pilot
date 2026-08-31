import Link from "next/link";
import { notFound } from "next/navigation";

import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Bel6ColorPainter from "@/components/games/Bel6ColorPainter";
import Bel6GiftBoxes from "@/components/games/Bel6GiftBoxes";
import Bel6TrainDriver from "@/components/games/Bel6TrainDriver";
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
import SignalLight from "@/components/games/SignalLight";
import VerbMagnet from "@/components/games/VerbMagnet";
import HintHangman from "@/components/games/HintHangman";
import TextDetective from "@/components/games/TextDetective";
import FractionAdventure from "@/components/games/FractionAdventure";
import GeometryAdventure from "@/components/games/GeometryAdventure";
import Geometry6Adventure from "@/components/games/Geometry6Adventure";
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
  const isBelTrainDriver = game.kind === "bel-train-driver";
  const isBelGiftBoxes = game.kind === "bel-gift-boxes";
  const isBelColorPainter = game.kind === "bel-color-painter";
  const isSentenceBuilder = game.kind === "sentence-builder";
  const isGrammarDetective = game.kind === "grammar-detective";
  const isBridgeOfRules = game.kind === "bridge-of-rules";
  const isSignalLight = game.kind === "signal-light";
  const isVerbMagnet = game.kind === "verb-magnet";
  const isHintHangman = game.kind === "hint-hangman";
  const isTextDetective = game.kind === "text-detective";
  const isFractionMode = game.kind === "fraction-mode" && game.mode;
  const isFractionAdventure = game.kind === "fraction-adventure";
  const isGeometryMode = game.kind === "geometry-mode" && game.mode;
  const isGeometryAdventure = game.kind === "geometry-adventure";
  const isGeometry6Mode = game.kind === "geometry6-mode" && game.mode;
  const isGeometry6Adventure = game.kind === "geometry6-adventure";
  const exitHref = `/igri?class=${encodeURIComponent(game.classNums?.[0] ?? "")}&subject=${encodeURIComponent(game.subject ?? "")}`;

  return (
    <div className={pageStyles.page}>
      <main className={pageStyles.wrap}>
        <PageHero
          variant="page"
          title={game.title}
          subtitle={`${game.subjectLabel} · ${game.classHint}`}
          subtitleVariant="meta"
          imageSrc={game.image || "/images/hero-pilot.png"}
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
        ) : isBelTrainDriver ? (
          <Bel6TrainDriver exitHref={exitHref} game={game} />
        ) : isBelGiftBoxes ? (
          <Bel6GiftBoxes exitHref={exitHref} game={game} />
        ) : isBelColorPainter ? (
          <Bel6ColorPainter exitHref={exitHref} game={game} />
        ) : isSentenceBuilder ? (
          <SentenceBuilder exitHref={exitHref} game={game} />
        ) : isGrammarDetective ? (
          <GrammarDetective exitHref={exitHref} game={game} />
        ) : isBridgeOfRules ? (
          <BridgeOfRules exitHref={exitHref} game={game} />
        ) : isSignalLight ? (
          <SignalLight exitHref={exitHref} game={game} />
        ) : isVerbMagnet ? (
          <VerbMagnet exitHref={exitHref} game={game} />
        ) : isHintHangman ? (
          <HintHangman exitHref={exitHref} game={game} />
        ) : isTextDetective ? (
          <TextDetective exitHref={exitHref} game={game} />
        ) : isFractionMode ? (
          <FractionAdventure initialMode={game.mode} exitHref={exitHref} game={game} />
        ) : isFractionAdventure ? (
          <FractionAdventure exitHref={exitHref} game={game} />
        ) : isGeometryMode ? (
          <GeometryAdventure initialMode={game.mode} exitHref={exitHref} game={game} />
        ) : isGeometryAdventure ? (
          <GeometryAdventure exitHref={exitHref} game={game} />
        ) : isGeometry6Mode ? (
          <Geometry6Adventure initialMode={game.mode} exitHref={exitHref} game={game} />
        ) : isGeometry6Adventure ? (
          <Geometry6Adventure exitHref={exitHref} game={game} />
        ) : (
          <GamePlay game={game} />
        )}
      </main>
      <Footer />
    </div>
  );
}
