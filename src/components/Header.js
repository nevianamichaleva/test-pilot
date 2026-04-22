"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import styles from "./Header.module.css";

export default function Header() {
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
          <span>Учене и тестове</span>
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
          <Link className={styles.link} href="/" onClick={close}>
            Начало
          </Link>
          <Link className={styles.link} href="/test-pilot" onClick={close}>
            Тестове
          </Link>
          <Link className={styles.link} href="/za-men" onClick={close}>
            За мен
          </Link>
          <Link className={styles.link} href="/test-pilot/rezultati" onClick={close}>
            Резултати
          </Link>
          <Link className={styles.cta} href="/test-pilot" onClick={close}>
            Вход / Регистрация
          </Link>
        </nav>
      </div>
    </header>
  );
}
