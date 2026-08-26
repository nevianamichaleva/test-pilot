export default function Footer() {
  return (
    <footer
      style={{
        padding: "20px 22px",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        background: "linear-gradient(135deg, #1a2b4b 0%, #15233f 100%)",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <small style={{ color: "rgba(255,255,255,0.72)", fontWeight: 600 }}>
          © {new Date().getFullYear()} TestPilot. Образователни тестове и игри. Всички права запазени.
        </small>
      </div>
    </footer>
  );
}
