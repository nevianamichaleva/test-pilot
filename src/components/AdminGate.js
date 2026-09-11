"use client";

import { useEffect, useState } from "react";

const ADMIN_PASSWORD = "developer2026!";
const STORAGE_KEY = "tp_admin_ok";

/**
 * Клиентска парола за админските резултати.
 * @param {{ children: import("react").ReactNode }} props
 */
export default function AdminGate({ children }) {
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY) === "1") {
        setUnlocked(true);
      }
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // ignore
      }
      setUnlocked(true);
      setError("");
      return;
    }
    setError("Грешна парола.");
  };

  if (!ready) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center", color: "rgba(26,43,75,0.65)" }}>
        Зареждане…
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div
        style={{
          maxWidth: 420,
          margin: "40px auto",
          padding: "28px 24px",
          borderRadius: 24,
          background: "#fff",
          border: "1px solid rgba(26,58,82,0.1)",
          boxShadow: "0 14px 36px rgba(26,43,75,0.1)",
        }}
      >
        <h1 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 900, color: "#1a2b4b" }}>
          Админ достъп
        </h1>
        <p style={{ margin: "0 0 16px", color: "rgba(26,43,75,0.65)", fontWeight: 650 }}>
          Въведи парола, за да видиш всички резултати.
        </p>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {error ? (
            <p
              style={{
                margin: 0,
                padding: "10px 12px",
                borderRadius: 12,
                background: "rgba(180,35,24,0.08)",
                color: "#b42318",
                fontWeight: 700,
              }}
            >
              {error}
            </p>
          ) : null}
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontWeight: 800 }}>
            Парола
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                padding: "12px 14px",
                borderRadius: 14,
                border: "1.5px solid rgba(26,58,82,0.16)",
                background: "#f8fbff",
              }}
            />
          </label>
          <button
            type="submit"
            style={{
              marginTop: 4,
              border: "none",
              cursor: "pointer",
              padding: "14px 18px",
              borderRadius: 999,
              fontWeight: 900,
              color: "#fff",
              background: "linear-gradient(180deg, #3dd16a 0%, #28a745 100%)",
            }}
          >
            Отключи
          </button>
        </form>
      </div>
    );
  }

  return children;
}
