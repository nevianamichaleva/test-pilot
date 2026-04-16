import Image from "next/image";

import styles from "./PageHero.module.css";

/**
 * Обща синя hero секция с изображение (като началната страница).
 * @param {"home" | "page"} variant — `home`: по-силно заобляне вдясно; `page`: стандартно.
 */
export default function PageHero({ variant = "page", title, subtitle, subtitleVariant = "body", children, actions }) {
  const shellClass =
    variant === "home" ? `${styles.hero} ${styles.heroHome}` : `${styles.hero} ${styles.heroPage}`;
  const subClass = subtitleVariant === "meta" ? styles.heroSubMeta : styles.heroSub;

  return (
    <section className={shellClass}>
      <div className={styles.heroInner}>
        <div>
          <h1 className={styles.heroTitle}>{title}</h1>
          {subtitle ? <p className={subClass}>{subtitle}</p> : null}
          {children ? <div className={styles.filtersSlot}>{children}</div> : null}
          {actions ? <div className={styles.heroActions}>{actions}</div> : null}
        </div>

        <div className={styles.heroArt}>
          <Image
            className={styles.heroImg}
            src="/test-pilot.png"
            alt=""
            width={720}
            height={460}
            priority
          />
        </div>
      </div>
    </section>
  );
}
