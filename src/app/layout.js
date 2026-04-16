import "./globals.css";

export const metadata = {
  title: "Test Pilot",
  description: "Test Pilot",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bg">
      <body>{children}</body>
    </html>
  );
}

