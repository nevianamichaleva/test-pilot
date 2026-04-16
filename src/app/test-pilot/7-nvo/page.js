"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRouter } from "next/navigation";

import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { getAllTests } from "@/data/tests";

import tp from "../TestPilot.module.css";
import styles from "./NvoPage.module.css";

function buildOptionLabel(test) {
  return `${test.title} (${test.questionCount} въпроса)`;
}

export default function TestPilot7NvoPage() {
  const router = useRouter();
  const tests = useMemo(() => getAllTests(), []);

  const bgTests = useMemo(
    () => tests.filter((t) => t.classNum === "7" && t.subject === "bg"),
    [tests]
  );
  const mathTests = useMemo(
    () => tests.filter((t) => t.classNum === "7" && t.subject === "matematika"),
    [tests]
  );

  const handleNavigate = (href) => {
    if (!href) return;
    router.push(href);
  };

  return (
    <div className={tp.page}>
      <main className={tp.wrap}>
        <PageHero
          variant="page"
          title="7. клас НВО"
          subtitle="Избери тест по Български език или математика от менютата по-долу — отваря се директно тестът."
          actions={
            <Link href="/test-pilot" className={styles.backLink}>
              Към тестовете <span aria-hidden>›</span>
            </Link>
          }
        />

        <div className={styles.stack}>
          <section className={styles.panel} aria-labelledby="nvo-bel-heading">
            <h2 id="nvo-bel-heading" className={styles.panelHead}>
              Български език
            </h2>
            <div className={styles.panelBody}>
              <label className="sr-only" htmlFor="nvo-select-bel">
                Избор на тест по БЕЛ
              </label>
              <select
                id="nvo-select-bel"
                className={`${tp.select} ${styles.selectFull}`}
                defaultValue=""
                onChange={(e) => handleNavigate(e.target.value)}
              >
                <option value="">Изберете тест по БЕЛ…</option>
                {bgTests.map((test) => (
                  <option
                    key={`${test.classNum}|${test.subject}|${test.slug}`}
                    value={`/test-pilot/${test.classNum}/${test.subject}/${test.slug}`}
                  >
                    {buildOptionLabel(test)}
                  </option>
                ))}
              </select>
              {bgTests.length === 0 ? (
                <p className={styles.emptyHint}>Все още няма добавени тестове за 7. клас по БЕЛ.</p>
              ) : null}
            </div>
          </section>

          <section className={styles.panel} aria-labelledby="nvo-math-heading">
            <h2 id="nvo-math-heading" className={styles.panelHead}>
              Математика
            </h2>
            <div className={styles.panelBody}>
              <label className="sr-only" htmlFor="nvo-select-math">
                Избор на тест по математика
              </label>
              <select
                id="nvo-select-math"
                className={`${tp.select} ${styles.selectFull}`}
                defaultValue=""
                onChange={(e) => handleNavigate(e.target.value)}
              >
                <option value="">Изберете тест по математика…</option>
                {mathTests.map((test) => (
                  <option
                    key={`${test.classNum}|${test.subject}|${test.slug}`}
                    value={`/test-pilot/${test.classNum}/${test.subject}/${test.slug}`}
                  >
                    {buildOptionLabel(test)}
                  </option>
                ))}
              </select>
              {mathTests.length === 0 ? (
                <p className={styles.emptyHint}>Все още няма добавени тестове за 7. клас по математика.</p>
              ) : null}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
