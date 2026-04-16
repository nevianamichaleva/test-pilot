export default function Footer() {
  return (
    <footer
      style={{
        padding: "18px 20px",
        borderTop: "1px solid rgba(0,0,0,0.08)",
        background: "linear-gradient(135deg, #1b4b93 0%, #15304a 100%)",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <small style={{ color: "rgba(255,255,255,0.75)" }}>
          © {new Date().getFullYear()} Учене и тестове. Всички права запазени.
        </small>
      </div>
    </footer>
  );
}

