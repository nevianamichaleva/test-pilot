import AdminGate from "@/components/AdminGate";

export const metadata = {
  title: "Уроци",
  description: "Кратки уроци на достъпен език по предмети за ученици.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function UrociLayout({ children }) {
  return (
    <AdminGate
      title="Достъп до уроци"
      description="Уроците са за влезли потребители. Без вход можеш да ги отключиш с админска парола."
      allowLessonsEmail
    >
      {children}
    </AdminGate>
  );
}
