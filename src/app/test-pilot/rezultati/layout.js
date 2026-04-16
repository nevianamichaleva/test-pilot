export const metadata = {
  title: "Резултати",
  description:
    "Преглед на запазените резултати от решени тестове по предмет и клас.",
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Резултати от тестове | Test Pilot",
    description: "Преглед на запазените резултати от решени тестове.",
  },
};

export default function RezultatiLayout({ children }) {
  return children;
}
