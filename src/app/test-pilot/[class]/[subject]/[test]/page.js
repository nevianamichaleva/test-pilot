import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Quiz from '@/components/Quiz';
import { getTest } from '@/data/tests';
import Link from 'next/link';

export default async function TestPage({ params }) {
  const resolved = await params;
  const classNum = decodeURIComponent(resolved.class ?? '');
  const subject = decodeURIComponent(resolved.subject ?? '');
  const testSlug = decodeURIComponent(resolved.test ?? '');

  const testData = getTest(classNum, subject, testSlug);

  if (!testData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-8">Тестът не е намерен</p>
            <Link
              href="/"
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Обратно към началната страница
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Header />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8">
          <Quiz
            title={testData.title}
            questions={testData.questions}
            testId={`${classNum}|${subject}|${testSlug}`}
            testTitle={testData.title}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
