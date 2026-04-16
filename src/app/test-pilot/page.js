'use client';

import { useState, useMemo } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAllTests } from '@/data/tests';
import Link from 'next/link';

const SUBJECT_LABELS = {
  english: 'Английски език',
  geografia: 'География',
  istoriya: 'История',
  literatura: 'Литература',
  matematika: 'Математика',
  bg: 'Български език',
  priroda: 'Човек и природа',
};

/** Ред на предметите: първо Български, English, География, История, Човек и природа, останалите по азбучен ред. */
const SUBJECT_ORDER = ['bg', 'english', 'geografia', 'istoriya', 'literatura', 'priroda'];

export default function TestPilotPage() {
  const [openSubject, setOpenSubject] = useState(null);

  const tests = useMemo(() => getAllTests(), []);

  const bySubject = useMemo(
    () =>
      tests.reduce((acc, t) => {
        if (!acc[t.subject]) acc[t.subject] = [];
        acc[t.subject].push(t);
        return acc;
      }, {}),
    [tests]
  );

  const sortedSubjects = useMemo(
    () => [
      ...SUBJECT_ORDER.filter((s) => bySubject[s]?.length),
      ...Object.keys(bySubject).filter((s) => !SUBJECT_ORDER.includes(s)).sort(),
    ],
    [bySubject]
  );

  const getClassesInSubject = (subjectTests) => {
    const byClass = subjectTests.reduce((acc, t) => {
      if (!acc[t.classNum]) acc[t.classNum] = [];
      acc[t.classNum].push(t);
      return acc;
    }, {});
    return Object.keys(byClass).sort((a, b) => Number(a) - Number(b));
  };

  const toggleSubject = (subject) => {
    setOpenSubject((prev) => (prev === subject ? null : subject));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex flex-col">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Тестове</h1>
            <p className="text-gray-600">
              Изберете предмет, след което клас и тест.
            </p>
          </div>
          <Link
            href="/test-pilot/rezultati"
            className="text-[#1a3a52] hover:text-[#1a3a52]/80 font-medium underline underline-offset-2"
          >
            Резултати
          </Link>
        </div>

        {tests.length === 0 ? (
          <p className="text-gray-600">Няма налични тестове.</p>
        ) : (
          <div className="space-y-3">
            {sortedSubjects.map((subject) => {
              const subjectTests = bySubject[subject];
              const isOpen = openSubject === subject;
              const sortedClasses = getClassesInSubject(subjectTests);
              return (
                <section
                  key={subject}
                  className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleSubject(subject)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-white/50 transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      {subject === 'bg' && (
                        <span className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                          <DotLottieReact
                            src="https://lottie.host/cb864bac-f60f-43d5-8054-d6088a79daf8/3KheOWE91t.lottie"
                            loop
                            autoplay
                            style={{ width: 48, height: 48 }}
                          />
                        </span>
                      )}
                      {subject === 'english' && (
                        <span className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                          <DotLottieReact
                            src="https://lottie.host/147cfae4-1cbd-4a9e-936c-cf9fe9d0a6b8/oQn5iEmMDV.lottie"
                            loop
                            autoplay
                            style={{ width: 48, height: 48 }}
                          />
                        </span>
                      )}
                      {subject === 'istoriya' && (
                        <span className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                          <DotLottieReact
                            src="https://lottie.host/34f73377-ce83-4474-bee5-9d20968bee03/r347qGmdiS.lottie"
                            loop
                            autoplay
                            style={{ width: 48, height: 48 }}
                          />
                        </span>
                      )}
                      {subject === 'geografia' && (
                        <span className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                          <DotLottieReact
                            src="https://lottie.host/39761b97-bc47-4bdc-ba04-b7324cc22ab0/T8hywMQJXO.lottie"
                            loop
                            autoplay
                            style={{ width: 48, height: 48 }}
                          />
                        </span>
                      )}
                    <span className="text-xl font-semibold text-[#1a3a52]">
                        {SUBJECT_LABELS[subject] ?? subject}
                      </span>
                    </span>
                    <span
                      className={`text-2xl text-[#1a3a52] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      aria-hidden
                    >
                      ▼
                    </span>
                  </button>
                  {isOpen && (
                    <div className="border-t border-[#1a3a52]/20 p-4 pt-2 space-y-6">
                      {sortedClasses.map((classNum) => {
                        const classTests = subjectTests.filter((t) => t.classNum === classNum);
                        return (
                          <div key={`${subject}-${classNum}`}>
                            <h3 className="text-lg font-medium text-gray-700 mb-3">
                              {classNum}. клас
                            </h3>
                            <ul className="space-y-2">
                              {classTests.map((test) => (
                                <li key={`${test.classNum}|${test.subject}|${test.slug}`}>
                                  <Link
                                    href={`/test-pilot/${test.classNum}/${test.subject}/${test.slug}`}
                                    className="flex items-center justify-between p-3 rounded-xl border-2 border-gray-200 bg-white hover:border-[#1a3a52] hover:bg-gray-50 transition-colors group"
                                  >
                                    <span className="font-medium text-gray-800 group-hover:text-[#1a3a52]">
                                      {test.title}
                                    </span>
                                    <span className="text-sm text-gray-500 flex-shrink-0 ml-2">
                                      {test.questionCount} въпроса
                                    </span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
