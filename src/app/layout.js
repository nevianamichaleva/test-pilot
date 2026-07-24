import "./globals.css";

import Header from "@/components/Header";
import SiteJsonLd from "@/components/SiteJsonLd";
import { getSiteUrl } from "@/lib/site";

const siteUrl = getSiteUrl();

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "Образователни тестове и игри | Test Pilot",
    template: "%s | Test Pilot",
  },
  description:
    "Образователни тестове и игри за ученици от 1. до 7. клас: български език, математика, английски, география, история, природа, литература и подготовка за НВО.",
  keywords: [
    "онлайн тестове",
    "образователни игри",
    "тестове за ученици",
    "НВО 7 клас",
    "математика тест",
    "български език тест",
    "упражнения училище",
  ],
  authors: [{ name: "Test Pilot" }],
  creator: "Test Pilot",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "bg_BG",
    url: "/",
    siteName: "Test Pilot",
    title:
      "Образователни тестове и игри | Test Pilot",
    description:
      "Образователни тестове и игри по основни училищни предмети за 1.–7. клас.",
    images: [{ url: "/images/favicon-32x32.png", width: 32, height: 32, alt: "Test Pilot" }],
  },
  twitter: {
    card: "summary",
    title:
      "Образователни тестове и игри | Test Pilot",
    description:
      "Образователни тестове и игри по основни училищни предмети за 1.–7. клас.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
        <SiteJsonLd />
        <Header />
        {children}
      </body>
    </html>
  );
}

