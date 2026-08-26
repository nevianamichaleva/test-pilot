import Image from "next/image";

import styles from "./PageHero.module.css";

const PILOT_SRC = "/images/hero-pilot.png";

/**
 * Обща синя hero секция с илюстрацията от началната страница.
 * @param {"home" | "page"} variant — еднаква визия; `home` запазен за съвместимост.
 * @param {"blend" | "cover"} imageFit — `blend` за небесния пилот; `cover` за картинки на игри.
 */
export default function PageHero({
  variant = "page",
  title,
  subtitle,
  subtitleVariant = "body",
  children,
  actions,
  features,
  imageSrc = PILOT_SRC,
  imageAlt = "",
  imageFit,
}) {
  const src = imageSrc || PILOT_SRC;
  const fit = imageFit || (src === PILOT_SRC ? "blend" : "cover");
  const isBlend = fit === "blend";

  const shellClass =
    variant === "home" ? `${styles.hero} ${styles.heroHome}` : `${styles.hero} ${styles.heroPage}`;
  const subClass = subtitleVariant === "meta" ? styles.heroSubMeta : styles.heroSub;
  const artClass = isBlend ? styles.heroArt : `${styles.heroArt} ${styles.heroArtCover}`;
  const imgClass = isBlend ? styles.heroImg : `${styles.heroImg} ${styles.heroImgCover}`;

  return (
    <section className={shellClass}>
      <div className={styles.clouds} aria-hidden>
        <span className={`${styles.cloud} ${styles.cloud1}`} />
        <span className={`${styles.cloud} ${styles.cloud2}`} />
        <span className={`${styles.cloud} ${styles.cloud3}`} />
      </div>

      <div className={styles.heroInner}>
        <div className={styles.heroCopy}>
          <h1 className={styles.heroTitle}>{title}</h1>
          {subtitle ? <p className={subClass}>{subtitle}</p> : null}

          {features?.length ? (
            <ul className={styles.features}>
              {features.map((f) => (
                <li key={f.label} className={styles.feature}>
                  <span className={styles.featureIcon} aria-hidden>
                    {f.icon}
                  </span>
                  <span className={styles.featureLabel}>{f.label}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {children ? <div className={styles.filtersSlot}>{children}</div> : null}
          {actions ? <div className={styles.heroActions}>{actions}</div> : null}
        </div>

        <div className={artClass}>
          <Image
            className={imgClass}
            src={src}
            alt={imageAlt}
            width={720}
            height={460}
            priority
          />
        </div>
      </div>
    </section>
  );
}
