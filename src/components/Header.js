"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import styles from "./Header.module.css";

const NAV = [
  { href: "/", label: "Начало", match: (p) => p === "/" },
  { href: "/test-pilot", label: "Тестове", match: (p) => p.startsWith("/test-pilot") && !p.includes("/rezultati") },
  { href: "/igri", label: "Хайде да поиграем", match: (p) => p.startsWith("/igri") },
  { href: "/za-men", label: "За мен", match: (p) => p.startsWith("/za-men") },
  { href: "/test-pilot/rezultati", label: "Резултати", match: (p) => p.includes("/rezultati") },
];

export default function Header() {
  const pathname = usePathname() || "/";
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onPop = () => setMenuOpen(false);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <header className={styles.strip} role="banner">
      {menuOpen ? (
        <button type="button" className={styles.backdrop} aria-label="Затвори меню" onClick={close} />
      ) : null}

      <div className={styles.inner}>
        <Link href="/" className={styles.brand} onClick={close}>
          <span className={styles.brandMark} aria-hidden>
            <Image
              className={styles.brandMarkImg}
              src="/test-pilot.png"
              alt=""
              width={80}
              height={80}
              priority
            />
          </span>
          <span className={styles.brandCopy}>
            <span className={styles.brandName}>
              <span className={styles.brandTest}>Test</span>
              <span className={styles.brandPilot}>Pilot</span>
            </span>
            <span className={styles.brandTag}>Образователни тестове и игри</span>
          </span>
        </Link>

        <button
          type="button"
          className={styles.menuToggle}
          aria-expanded={menuOpen}
          aria-controls="site-main-nav"
          aria-label={menuOpen ? "Затвори меню" : "Отвори меню"}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="sr-only">Меню</span>
          <span className={styles.bars} aria-hidden>
            <span className={styles.bar} />
            <span className={styles.bar} />
            <span className={styles.bar} />
          </span>
        </button>

        <nav
          id="site-main-nav"
          className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}
          aria-label="Основна навигация"
        >
          {NAV.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                className={`${styles.link}${active ? ` ${styles.linkActive}` : ""}`}
                href={item.href}
                onClick={close}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
          <Link className={styles.cta} href="/test-pilot" onClick={close}>
            <span className={styles.ctaIcon} aria-hidden>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z"
                  fill="currentColor"
                />
                <path
                  d="M4.5 20.25a7.5 7.5 0 0 1 15 0"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            Вход / Регистрация
          </Link>
        </nav>
      </div>
    </header>
  );
}
