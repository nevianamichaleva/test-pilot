import "./globals.css";

import Header from "@/components/Header";

export const metadata = {
  title: "Test Pilot",
  description: "Test Pilot",
  verification: {
    google: "Oy0En63Uyai0neE-iKGDoAALX1zPDXljM7KfiABcrxg",
  },
  icons: {
    icon: [{ url: "/images/favicon-32x32.png", sizes: "32x32", type: "image/png" }],
    shortcut: ["/images/favicon-32x32.png"],
    apple: ["/images/favicon-32x32.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="bg">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}

