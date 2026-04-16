'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

const SUBJECT_LABELS = {
  bg: 'Български език',
  english: 'Английски език',
  geografia: 'География',
  istoriya: 'История',
  matematika: 'Математика',
};

const SUBJECT_ORDER = ['bg', 'english', 'geografia', 'istoriya'];

/** Извлича предмет от testId (напр. "5|bg|morfolojiya" -> "bg"). */
function getSubject(testId) {
  if (!testId || typeof testId !== 'string') return null;
  const parts = testId.split('|');
  return parts.length >= 2 ? parts[1] : null;
}

/** Извлича числова оценка от assessment (напр. "5 (Отличен)" -> 5). */
function getGradeFromAssessment(assessment) {
  if (!assessment || typeof assessment !== 'string') return 0;
  const num = parseFloat(assessment);
  return Number.isFinite(num) ? num : 0;
}

/** Преобразува Firestore Timestamp / обект във native Date. */
function toJsDate(timestamp) {
  if (!timestamp) return null;
  try {
    if (timestamp.toDate) return timestamp.toDate();
    if (typeof timestamp.seconds === 'number') return new Date(timestamp.seconds * 1000);
  } catch {
    // ignore
  }
  return null;
}

/** Форматира дата от Firestore Timestamp или обект. */
function formatDate(timestamp) {
  const date = toJsDate(timestamp);
  if (!date) return '–';
  return date.toLocaleDateString('bg-BG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function RezultatiPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchResults() {
      try {
        const snap = await getDocs(collection(db, 'results'));
        if (cancelled) return;
        const list = [];
        snap.forEach((doc) => {
          const data = doc.data();
          list.push({
            id: doc.id,
            name: data.name || 'Анонимен',
            points: data.points || '–',
            assessment: data.assessment || '–',
            test: data.test || '',
            testTitle: data.testTitle || data.test || '–',
            createdAt: data.createdAt ?? null,
            subject: getSubject(data.test),
            grade: getGradeFromAssessment(data.assessment),
          });
        });
        list.sort((a, b) => {
          if (!a.createdAt) return 1;
          if (!b.createdAt) return -1;
          try {
            const tA = a.createdAt.toDate ? a.createdAt.toDate() : new Date(0);
            const tB = b.createdAt.toDate ? b.createdAt.toDate() : new Date(0);
            return tB.getTime() - tA.getTime();
          } catch {
            return 0;
          }
        });
        // Показваме само последните 15 резултата.
        setResults(list.slice(0, 15));
      } catch (err) {
        if (!cancelled) setError(err?.message || 'Грешка при зареждане.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchResults();
    return () => { cancelled = true; };
  }, []);

  const bySubject = {};
  results.forEach((r) => {
    const sub = r.subject || 'друг';
    if (!bySubject[sub]) bySubject[sub] = [];
    bySubject[sub].push(r);
  });
  SUBJECT_ORDER.forEach((s) => {
    if (bySubject[s]) bySubject[s].sort((a, b) => b.grade - a.grade);
  });
  const otherSubject = bySubject['друг'];
  if (otherSubject) otherSubject.sort((a, b) => b.grade - a.grade);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex flex-col">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Резултати от тестовете</h1>
            <p className="text-gray-600">
              Последните 15 резултата и класация по предмет.
            </p>
          </div>
          <Link
            href="/test-pilot"
            className="text-[#1a3a52] hover:text-[#1a3a52]/80 font-medium underline underline-offset-2"
          >
            Назад към тестове
          </Link>
        </div>

        {loading && (
          <p className="text-gray-600 text-center py-12">Зареждане...</p>
        )}

        {error && !results.length && (
          <p className="text-red-600 bg-red-50 p-4 rounded-xl">{error}</p>
        )}

        {!loading && results.length === 0 && (
          <p className="text-gray-600 bg-white/70 rounded-xl p-8 text-center">
            Все още няма записани резултати. Резултатите се записват автоматично при завършване на тест.
          </p>
        )}

        {!loading && results.length > 0 && (
          <div className="space-y-10">
            {/* Всички резултати */}
            <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
              <h2 className="text-xl font-semibold text-[#1a3a52] px-6 py-4 border-b border-gray-200">
                Последни 15 резултата
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 font-semibold text-gray-700">Дата</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">Име</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">Предмет</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">Тест</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">Точки</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">Оценка</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r) => (
                      <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                        <td className="px-4 py-3 text-gray-600 text-sm">{formatDate(r.createdAt)}</td>
                        <td className="px-4 py-3 font-medium text-gray-800">{r.name}</td>
                        <td className="px-4 py-3 text-gray-700">
                          {SUBJECT_LABELS[r.subject] || r.subject || '–'}
                        </td>
                        <td className="px-4 py-3 text-gray-700 max-w-[200px] truncate" title={r.testTitle}>
                          {r.testTitle}
                        </td>
                        <td className="px-4 py-3 text-gray-700">{r.points}</td>
                        <td className="px-4 py-3 font-semibold text-[#1a3a52]">{r.assessment}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Класация по предмет */}
            <section className="space-y-6">
              <h2 className="text-2xl font-semibold text-[#1a3a52]">Класация по предмет</h2>
              <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
                {SUBJECT_ORDER.filter((s) => bySubject[s]?.length).map((subject) => (
                  <div
                    key={subject}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden"
                  >
                    <h3 className="text-lg font-semibold text-[#1a3a52] px-6 py-4 border-b border-gray-200">
                      {SUBJECT_LABELS[subject]}
                    </h3>
                    <ol className="divide-y divide-gray-100">
                      {bySubject[subject].slice(0, 10).map((r, i) => (
                        <li key={r.id} className="flex items-center justify-between px-6 py-3">
                          <span className="flex items-center gap-3">
                            <span className="text-lg font-bold text-gray-400 w-6">
                              {i + 1}.
                            </span>
                            <span className="font-medium text-gray-800">{r.name}</span>
                          </span>
                          <span className="text-sm text-gray-600">
                            {r.assessment} <span className="text-gray-400">({r.points})</span>
                          </span>
                        </li>
                      ))}
                    </ol>
                    {bySubject[subject].length > 10 && (
                      <p className="px-6 py-2 text-sm text-gray-500">
                        и още {bySubject[subject].length - 10} резултата
                      </p>
                    )}
                  </div>
                ))}
                {otherSubject?.length > 0 && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
                    <h3 className="text-lg font-semibold text-[#1a3a52] px-6 py-4 border-b border-gray-200">
                      Други
                    </h3>
                    <ol className="divide-y divide-gray-100">
                      {otherSubject.slice(0, 10).map((r, i) => (
                        <li key={r.id} className="flex items-center justify-between px-6 py-3">
                          <span className="flex items-center gap-3">
                            <span className="text-lg font-bold text-gray-400 w-6">{i + 1}.</span>
                            <span className="font-medium text-gray-800">{r.name}</span>
                          </span>
                          <span className="text-sm text-gray-600">
                            {r.assessment} <span className="text-gray-400">({r.points})</span>
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
