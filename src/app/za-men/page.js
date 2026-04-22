import Link from "next/link";

import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import styles from "./ZaMen.module.css";

export const metadata = {
  title: "За мен",
  alternates: { canonical: "/za-men" },
};

export default function ZaMenPage() {
  return (
    <div className={styles.page}>
      <main className={styles.wrap}>
        <PageHero
          variant="page"
          title="За мен и за проекта"
          subtitle="Създадено с грижа за по-лесно и по-уверено учене."
          actions={
            <Link href="/test-pilot" className={styles.heroAction}>
              Към тестовете <span aria-hidden>›</span>
            </Link>
          }
        />

        <section className={styles.card}>
        <div className={styles.hero}>
          <div className={styles.heroText}>
            <h2 className={styles.title}>Лична инициатива с образователна цел</h2>
            <p className={styles.lead}>
              Казвам се Невяна Михалева. Майка на три деца, две от които са още ученици. Създадох тази платформа като личен образователен помощник за моите деца, за да
              упражняваме уроците по по-достъпен и практичен начин.
            </p>
          </div>

          <div className={styles.photoSlot} aria-label="Място за снимка">
            <span className={styles.photoLabel}>Твоята снимка тук</span>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.subtitle}>Какво представлява Test Pilot</h2>
          <p className={styles.text}>
            Проектът събира тестове и упражнения по основни предмети засега за 5. и 7. клас - български
            език, математика, английски език, география, история, литература и човек и природа.
            Материалите са подредени по клас, предмет и тема, за да може детето бързо да намери
            точно това, което учи в момента.
          </p>
          <p className={styles.text}>
            Включени са различни типове задачи - избор от отговори, попълване, кратък свободен
            отговор, както и по-дълги варианти на класни работи. Идеята е ученето да е по-лесно,
            по-редовно и по-спокойно за цялото семейство.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.subtitle}>Важно уточнение</h2>
          <p className={styles.text}>
            Не претендирам, че всичко е напълно безгрешно. Възможни са неточности и всеки използва
            платформата на своя отговорност.
          </p>
          <p className={styles.text}>
            Ако забележиш грешка или имаш идея за подобрение, ще се радвам да ми пишеш на{" "}
            <a className={styles.link} href="mailto:nevianamichaleva@gmail.com">
              nevianamichaleva@gmail.com
            </a>
            .
          </p>
          <p className={styles.text}>
            Благодаря на всички родители, ученици и учители за обратната връзка. Надявам се
            проектът да е полезен и на други деца.
          </p>
        </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
