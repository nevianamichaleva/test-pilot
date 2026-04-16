'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAllTests } from '@/data/tests';

function buildOptionLabel(test) {
  return `${test.title} (${test.questionCount} въпроса)`;
}

export default function TestPilot7NvoPage() {
  const router = useRouter();
  const tests = useMemo(() => getAllTests(), []);

  const bgTests = useMemo(
    () => tests.filter((t) => t.classNum === '7' && t.subject === 'bg'),
    [tests]
  );
  const mathTests = useMemo(
    () => tests.filter((t) => t.classNum === '7' && t.subject === 'matematika'),
    [tests]
  );

  const handleNavigate = (href) => {
    if (!href) return;
    router.push(href);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex flex-col">
      <Header />
      <main className="max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">7. клас НВО</h1>
            <p className="text-gray-600">Изберете тест от падащото меню по предмет.</p>
          </div>
          <Link
            href="/test-pilot"
            className="text-[#1a3a52] hover:text-[#1a3a52]/80 font-medium underline underline-offset-2"
          >
            Назад към тестове
          </Link>
        </div>

        <div className="space-y-6">
          <section className="bg-white/80 rounded-2xl shadow-lg p-5">
            <h2 className="text-xl font-semibold text-[#1a3a52] mb-3">Български език</h2>
            <select
              defaultValue=""
              onChange={(e) => handleNavigate(e.target.value)}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-800 focus:border-[#1a3a52] focus:ring-2 focus:ring-[#1a3a52]/20"
            >
              <option value="">Изберете тест по БЕЛ...</option>
              {bgTests.map((test) => (
                <option
                  key={`${test.classNum}|${test.subject}|${test.slug}`}
                  value={`/test-pilot/${test.classNum}/${test.subject}/${test.slug}`}
                >
                  {buildOptionLabel(test)}
                </option>
              ))}
            </select>
            {bgTests.length === 0 && (
              <p className="mt-3 text-sm text-gray-500">Все още няма добавени тестове за 7. клас по БЕЛ.</p>
            )}
          </section>

          <section className="bg-white/80 rounded-2xl shadow-lg p-5">
            <h2 className="text-xl font-semibold text-[#1a3a52] mb-3">Математика</h2>
            <select
              defaultValue=""
              onChange={(e) => handleNavigate(e.target.value)}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-800 focus:border-[#1a3a52] focus:ring-2 focus:ring-[#1a3a52]/20"
            >
              <option value="">Изберете тест по математика...</option>
              {mathTests.map((test) => (
                <option
                  key={`${test.classNum}|${test.subject}|${test.slug}`}
                  value={`/test-pilot/${test.classNum}/${test.subject}/${test.slug}`}
                >
                  {buildOptionLabel(test)}
                </option>
              ))}
            </select>
            {mathTests.length === 0 && (
              <p className="mt-3 text-sm text-gray-500">
                Все още няма добавени тестове за 7. клас по математика.
              </p>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
