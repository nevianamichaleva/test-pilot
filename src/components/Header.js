import Link from "next/link";

export default function Header() {
  return (
    <header
      style={{
        padding: "16px 24px",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(8px)",
      }}
    >
      <nav style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <Link href="/" style={{ fontWeight: 700, textDecoration: "none" }}>
          Test Pilot
        </Link>
        <Link href="/test-pilot">Тестове</Link>
        <Link href="/test-pilot/7-nvo">7. клас НВО</Link>
        <Link href="/test-pilot/rezultati">Резултати</Link>
      </nav>
    </header>
  );
}

