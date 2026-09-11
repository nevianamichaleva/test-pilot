"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { useAuth } from "@/components/AuthProvider";
import styles from "../auth.module.css";

export default function RegistraciyaPage() {
  const router = useRouter();
  const { register, configured, user, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/profil");
  }, [loading, user, router]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await register({ name, email, password });
      router.push("/profil");
    } catch (err) {
      const code = err?.code || "";
      if (code === "auth/email-already-in-use") {
        setError("Този имейл вече е регистриран.");
      } else if (code === "auth/weak-password") {
        setError("Паролата трябва да е поне 6 символа.");
      } else if (code === "auth/invalid-email") {
        setError("Невалиден имейл.");
      } else {
        setError(err?.message || "Неуспешна регистрация.");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.wrap}>
        <PageHero
          variant="page"
          title="Регистрация"
          subtitle="Създай профил — без да пишеш име на всеки тест."
        />
        <section className={styles.card}>
          {!configured ? (
            <p className={styles.error}>Firebase не е конфигуриран — регистрацията не е налична.</p>
          ) : (
            <form className={styles.form} onSubmit={onSubmit}>
              {error ? <p className={styles.error}>{error}</p> : null}
              <label className={styles.label}>
                Име
                <input
                  className={styles.input}
                  type="text"
                  autoComplete="name"
                  required
                  maxLength={120}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label className={styles.label}>
                Имейл
                <input
                  className={styles.input}
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label className={styles.label}>
                Парола
                <input
                  className={styles.input}
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              <button className={styles.submit} type="submit" disabled={busy}>
                {busy ? "Създаване…" : "Създай акаунт"}
              </button>
            </form>
          )}
          <p className={styles.hint}>
            Вече имаш акаунт? <Link href="/vhod">Вход</Link>
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
