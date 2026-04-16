import "./globals.css";

export const metadata = {
  title: "Test Pilot",
  description: "Test Pilot",
  icons: {
    icon: [{ url: "/images/favicon-32x32.png", sizes: "32x32", type: "image/png" }],
    shortcut: ["/images/favicon-32x32.png"],
    apple: ["/images/favicon-32x32.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="bg">
      <body>{children}</body>
    </html>
  );
}

