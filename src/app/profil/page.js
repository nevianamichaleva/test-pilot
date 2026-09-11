"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/components/AuthProvider";
import Footer from "@/components/Footer";
import {
  CUP_LABELS,
  CUP_THRESHOLDS,
  isPassingPercent,
} from "@/lib/rewards";
import { SUBJECT_THUMB_SRC } from "@/lib/subjectImages";
import { SUBJECT_LABELS } from "@/lib/subjectLabels";

import styles from "./Profil.module.css";

const SUBJECT_ORDER = [
  "bg",
  "matematika",
  "english",
  "geografia",
  "istoriya",
  "priroda",
  "literatura",
];

const SUBJECT_TONES = {
  bg: { tone: "#fff1e0", accent: "#ea580c" },
  matematika: { tone: "#e0f2fe", accent: "#0284c7" },
  english: { tone: "#ede9fe", accent: "#7c3aed" },
  geografia: { tone: "#dcfce7", accent: "#16a34a" },
  istoriya: { tone: "#fef3c7", accent: "#d97706" },
  priroda: { tone: "#ccfbf1", accent: "#0d9488" },
  literatura: { tone: "#fce7f3", accent: "#db2777" },
};

const MATH_THUMB = "/images/igri/matematika-geometria-5.svg";

const CUP_META = {
  bronze: { emoji: "🥉", label: "Бронз", color: "#cd7f32" },
  silver: { emoji: "🥈", label: "Сребро", color: "#94a3b8" },
  gold: { emoji: "🥇", label: "Злато", color: "#eab308" },
  platinum: { emoji: "💎", label: "Платина", color: "#67e8f9" },
};

function formatDate(iso) {
  if (typeof iso !== "string" || !iso) return "–";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "–";
  return d.toLocaleDateString("bg-BG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function subjectThumb(subject) {
  if (subject === "matematika") return MATH_THUMB;
  return SUBJECT_THUMB_SRC[subject] || "/images/hero-pilot.png";
}

/**
 * @param {number} points
 */
function getCupProgress(points) {
  const n = Number(points) || 0;
  let current = null;
  let next = CUP_THRESHOLDS[0];

  for (let i = 0; i < CUP_THRESHOLDS.length; i += 1) {
    if (n >= CUP_THRESHOLDS[i].min) {
      current = CUP_THRESHOLDS[i];
      next = CUP_THRESHOLDS[i + 1] || null;
    }
  }

  if (!next) {
    return {
      current,
      next: null,
      fill: 1,
      remaining: 0,
      tip: "Платинена купа — върхът е достигнат!",
      nextLabel: null,
    };
  }

  const prevMin = current ? current.min : 0;
  const span = Math.max(1, next.min - prevMin);
  const fill = Math.min(1, Math.max(0, (n - prevMin) / span));
  const remaining = Math.max(0, next.min - n);
  const nextLabel = CUP_LABELS[next.id] || next.label;

  return {
    current,
    next,
    fill,
    remaining,
    tip:
      n === 0
        ? `Събери ${next.min} т. за ${nextLabel.toLowerCase()} медал!`
        : `Още ${remaining} т. до ${nextLabel.toLowerCase()} медал!`,
    nextLabel,
  };
}

function islandScale(points) {
  const n = Math.min(400, Math.max(0, Number(points) || 0));
  return 0.92 + (n / 400) * 0.16;
}

function useCountUp(target, durationMs = 900) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const end = Math.max(0, Math.round(Number(target) || 0));
    if (end === 0) {
      setValue(0);
      return undefined;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - (1 - t) ** 3;
      setValue(Math.round(end * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);

  return value;
}

function CountUp({ value, className }) {
  const shown = useCountUp(value);
  return <span className={className}>{shown}</span>;
}

function ConfettiBurst() {
  const bits = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        left: `${8 + ((i * 7) % 84)}%`,
        delay: `${(i % 6) * 0.05}s`,
        color: ["#ffb822", "#3b8ef0", "#28a745", "#db2777", "#7c3aed"][i % 5],
      })),
    []
  );

  return (
    <span className={styles.confetti} aria-hidden>
      {bits.map((b) => (
        <span
          key={b.id}
          className={styles.confettiBit}
          style={{ left: b.left, animationDelay: b.delay, background: b.color }}
        />
      ))}
    </span>
  );
}

function SubjectIsland({ item, index }) {
  const locked = item.points <= 0;
  const progress = getCupProgress(item.points);
  const tone = SUBJECT_TONES[item.subject] || { tone: "#e0f2fe", accent: "#3b8ef0" };
  const scale = islandScale(item.points);
  const cupMeta = item.cup ? CUP_META[item.cup] : null;

  return (
    <article
      className={`${styles.island} ${locked ? styles.islandLocked : styles.islandOpen}`}
      style={{
        "--tone": tone.tone,
        "--accent": tone.accent,
        "--scale": scale,
        "--delay": `${0.08 + index * 0.07}s`,
      }}
    >
      <div className={styles.islandTop}>
        <div className={styles.islandThumbWrap}>
          <img
            className={styles.islandThumb}
            src={subjectThumb(item.subject)}
            alt=""
            width={72}
            height={72}
            decoding="async"
          />
          {locked ? <span className={styles.lockBadge}>🔒</span> : null}
        </div>

        <div className={styles.islandHead}>
          <h3 className={styles.islandTitle}>{item.label}</h3>
          <p className={styles.islandPoints}>
            <CountUp value={item.points} /> т.
          </p>
        </div>

        <div className={styles.medalSlot}>
          {cupMeta ? (
            <div className={styles.medalPop} style={{ "--medal": cupMeta.color }}>
              <ConfettiBurst />
              <span className={styles.medalEmoji} aria-hidden>
                {cupMeta.emoji}
              </span>
              <span className={styles.medalLabel}>{cupMeta.label}</span>
            </div>
          ) : (
            <div className={styles.medalEmpty}>
              <span aria-hidden>{locked ? "🔒" : "❔"}</span>
              <span>{locked ? "Заключено" : "Без медал още"}</span>
            </div>
          )}
        </div>
      </div>

      <div className={styles.track} aria-hidden>
        {CUP_THRESHOLDS.map((t) => {
          const reached = item.points >= t.min;
          const meta = CUP_META[t.id];
          return (
            <span
              key={t.id}
              className={`${styles.trackNode} ${reached ? styles.trackNodeOn : ""}`}
              title={`${meta.label} · ${t.min} т.`}
            >
              {meta.emoji}
            </span>
          );
        })}
      </div>

      <div className={styles.barWrap}>
        <div className={styles.barTrack}>
          <div
            className={styles.barFill}
            style={{ width: `${Math.round(progress.fill * 100)}%` }}
          />
        </div>
        <div className={styles.barLabels}>
          <span>{progress.current ? CUP_LABELS[progress.current.id] : "Старт"}</span>
          <span>{progress.nextLabel || "Макс"}</span>
        </div>
      </div>

      <p className={styles.tip}>{progress.tip}</p>
    </article>
  );
}

export default function ProfilPage() {
  const router = useRouter();
  const { user, profile, loading, displayName, logout } = useAuth();

  const history = useMemo(() => {
    const map = profile?.bestByContent;
    if (!map || typeof map !== "object") return [];
    return Object.entries(map)
      .map(([key, entry]) => ({
        key,
        title: entry?.title || key,
        subject: entry?.subject || "",
        kind: entry?.kind === "game" ? "game" : "test",
        percent: Number(entry?.percent) || 0,
        correct: Number(entry?.correct) || 0,
        gradable: Number(entry?.gradable) || 0,
        completedAtIso: entry?.completedAtIso || "",
        passed: isPassingPercent(entry?.percent),
      }))
      .sort((a, b) => String(b.completedAtIso).localeCompare(String(a.completedAtIso)));
  }, [profile]);

  const islands = useMemo(() => {
    const points = profile?.subjectPoints || {};
    const cupMap = profile?.cups || {};
    return SUBJECT_ORDER.filter((s) => SUBJECT_LABELS[s])
      .map((subject) => ({
        subject,
        label: SUBJECT_LABELS[subject],
        points: Number(points[subject]) || 0,
        cup: cupMap[subject] || null,
      }))
      .sort((a, b) => b.points - a.points || a.label.localeCompare(b.label, "bg"));
  }, [profile]);

  const totalPoints = useMemo(
    () => islands.reduce((sum, i) => sum + i.points, 0),
    [islands]
  );
  const totalShown = useCountUp(totalPoints, 1100);
  const planeLift = Math.min(72, Math.round((Math.min(totalPoints, 800) / 800) * 72));

  useEffect(() => {
    if (!loading && !user) router.replace("/vhod");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className={styles.page}>
        <main className={styles.wrap}>
          <p className={styles.muted}>Зареждане на пътешествието…</p>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <main className={styles.wrap}>
        <header className={styles.hero}>
          <div className={styles.sky} aria-hidden>
            <span className={styles.cloud} style={{ left: "8%", top: "18%" }} />
            <span className={styles.cloud} style={{ left: "62%", top: "28%", width: 90 }} />
            <span className={styles.cloud} style={{ left: "78%", top: "12%", width: 56 }} />
          </div>

          <div
            className={styles.planeWrap}
            style={{ transform: `translateY(-${planeLift}px)` }}
          >
            <Image
              className={styles.plane}
              src="/test-pilot.png"
              alt=""
              width={120}
              height={120}
              priority
            />
            <span className={styles.planeTrail} aria-hidden />
          </div>

          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Моето пътешествие</p>
            <h1 className={styles.heroTitle}>{displayName || "Пилот"}</h1>
            <p className={styles.heroSub}>
              Събирай точки от тестове и игри. Всеки предмет е остров по маршрута —
              отключи медали и стигни до платина!
            </p>
            <div className={styles.totalChip}>
              <span className={styles.totalLabel}>Общо точки</span>
              <strong className={styles.totalValue}>{totalShown}</strong>
            </div>
          </div>
        </header>

        <div className={styles.actionsRow}>
          <Link className={styles.primaryBtn} href="/test-pilot">
            Към тестовете
          </Link>
          <Link className={styles.secondaryBtn} href="/igri">
            Към игрите
          </Link>
          <button
            type="button"
            className={styles.ghostBtn}
            onClick={async () => {
              await logout();
              router.push("/");
            }}
          >
            Изход
          </button>
        </div>

        <section className={styles.journey} aria-labelledby="islands-title">
          <div className={styles.sectionHead}>
            <h2 id="islands-title" className={styles.sectionTitle}>
              Острови по предмети
            </h2>
            <p className={styles.sectionLead}>
              Бронз 50 · Сребро 100 · Злато 200 · Платина 400 · Тест +10 · Игра +5 (≥75%)
            </p>
          </div>

          <div className={styles.islandGrid}>
            {islands.map((item, index) => (
              <SubjectIsland key={item.subject} item={item} index={index} />
            ))}
          </div>
        </section>

        <section className={styles.historySection} aria-labelledby="history-title">
          <div className={styles.sectionHead}>
            <h2 id="history-title" className={styles.sectionTitle}>
              Дневник на полетите
            </h2>
            <p className={styles.sectionLead}>Решени тестове и игри с дата и резултат.</p>
          </div>

          {history.length === 0 ? (
            <div className={styles.emptyHistory}>
              <p>Още няма записи. Реши тест или игра и маршрутът ще се напълни!</p>
              <div className={styles.actionsRow}>
                <Link className={styles.primaryBtn} href="/test-pilot">
                  Започни тест
                </Link>
                <Link className={styles.secondaryBtn} href="/igri">
                  Играй
                </Link>
              </div>
            </div>
          ) : (
            <div className={styles.historyList}>
              {history.map((item, index) => (
                <div
                  key={item.key}
                  className={styles.historyItem}
                  style={{ "--delay": `${0.04 + index * 0.03}s` }}
                >
                  <div className={styles.historyIcon} aria-hidden>
                    {item.kind === "game" ? "🎮" : "📝"}
                  </div>
                  <div className={styles.historyBody}>
                    <p className={styles.historyTitle}>
                      {item.title}
                      {item.passed ? (
                        <span className={styles.solvedBadge}>Вече решен</span>
                      ) : null}
                    </p>
                    <p className={styles.historyMeta}>
                      {(SUBJECT_LABELS[item.subject] ?? item.subject) || "—"} ·{" "}
                      {item.kind === "game" ? "Игра" : "Тест"} · {formatDate(item.completedAtIso)}
                    </p>
                  </div>
                  <div className={styles.historyScore}>
                    {item.gradable > 0
                      ? `${item.correct}/${item.gradable}`
                      : `${Math.round(item.percent)}%`}
                    <span className={styles.historyPercent}>
                      {Math.round(item.percent)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
