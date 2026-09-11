"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { useAuth } from "@/components/AuthProvider";
import styles from "../auth.module.css";

export default function VhodPage() {
  const router = useRouter();
  const { login, configured, user, loading } = useAuth();
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
      await login({ email, password });
      router.push("/profil");
    } catch (err) {
      const code = err?.code || "";
      if (code === "auth/invalid-credential" || code === "auth/wrong-password") {
        setError("Грешен имейл или парола.");
      } else if (code === "auth/user-not-found") {
        setError("Няма акаунт с този имейл.");
      } else {
        setError(err?.message || "Неуспешен вход.");
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
          title="Вход"
          subtitle="Влез в профила си, за да трупаш точки и купи."
        />
        <section className={styles.card}>
          {!configured ? (
            <p className={styles.error}>Firebase не е конфигуриран — входът не е наличен.</p>
          ) : (
            <form className={styles.form} onSubmit={onSubmit}>
              {error ? <p className={styles.error}>{error}</p> : null}
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
                  autoComplete="current-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              <button className={styles.submit} type="submit" disabled={busy}>
                {busy ? "Влизане…" : "Влез"}
              </button>
            </form>
          )}
          <p className={styles.hint}>
            Нямаш акаунт? <Link href="/registraciya">Регистрация</Link>
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
