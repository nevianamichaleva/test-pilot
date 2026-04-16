# Test Pilot — тестове за учене

Това е малък **Next.js** проект, създаден в помощ на **моите деца** в ученето: кратки тестове по предмети и класове, с ясен екран за избор и екран за решаване на въпросите.

## Какво има в проекта

- **Начална страница** (`/`) — ориентиране и бързи връзки към тестовете
- **Списък с тестове** (`/test-pilot`) — филтри по клас/предмет и карти към конкретни тестове
- **Решаване на тест** (`/test-pilot/[class]/[subject]/[test]`) — въпроси с избор и попълване (според данните)
- **7. клас НВО** (`/test-pilot/7-nvo`) — удобен вход към избрани тестове
- **Резултати** (`/test-pilot/rezultati`) — чете последните резултати от **Firestore** колекция `results` (след като конфигурираш Firebase по-долу)

## Данни за тестовете

Въпросите и индексът на тестовете са в:

- `src/data/tests.js` — дефиниции/ключове и помощни функции (`getTest`, `getAllTests`)
- `src/data/*-tests.js` — банките с въпроси

## Технологии

- **Next.js** (App Router)
- **React**
- **npm**

## Локално пускане

Изисквания: **Node.js 18+** (препоръчително **20.x**).

```bash
cd /home/nevyana/Documents/test-pilot
npm install
npm run dev
```

Отвори `http://localhost:3000`.

### Полезни команди

```bash
npm run build
npm run start
npm run lint
```

## Бележки (важно)

- **Firebase (Firestore)**: конфигурацията се подава през `.env.local` (виж `.env.example`). Кодът за инициализация е в `src/lib/firebase.js`.
- **Запис на резултати**: при “Завърши” в теста се прави `addDoc` към Firestore колекция **`results`** (полетата са съвместими с `/test-pilot/rezultati`). Ако Firebase не е конфигуриран, тестът приключва, но **няма облачен запис**.
- **Правила за сигурност**: за production не оставяй публични правила “allow all”. За семейна употреба често се ползва Firebase Auth + правила по `request.auth`.
  - За бърз локален тест (само при теб!) може временно да позволиш запис/четене на `results`, но това е рисковано ако проектът стане публичен.

## Firebase настройка (накратко)

1. В [Firebase Console](https://console.firebase.google.com/) създай проект (или използвай съществуващ).
2. Добави **Web app** и копирай конфигурацията.
3. Включи **Firestore** (Create database).
4. Локално създай файл `.env.local` по шаблона `.env.example` и попълни `NEXT_PUBLIC_FIREBASE_*`.
5. Рестартирай `npm run dev`.

Очаквана колекция: `results` с документи, които имат полета като `name`, `points`, `assessment`, `test`, `testTitle`, `createdAt` (както е в `src/app/test-pilot/rezultati/page.js`).

- **UI компоненти**: има минимални `Header`/`Footer`/`Quiz`, за да може проектът да се стартира самостоятелно извън оригиналния “голям” проект.

## Git / деплой

Ако качваш в GitHub, стандартно:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <URL>
git push -u origin main
```
