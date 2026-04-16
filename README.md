## Test Pilot (подготовка за отделен проект)

Тази папка е **временен “износ”** на частта за тестовете от проекта `Home of art`.

### Какво е копирано

- `test-pilot/src/app/test-pilot/**` – страниците за тестовете
- `test-pilot/src/data/tests.js` – индексът на тестовете
- `test-pilot/src/data/*-tests.js` – банките с въпроси (реално копие)
- `test-pilot/public/test-pilot.png` и `test-pilot/public/images/test-pilot.png` – изображения

### Какво не е изнесено (засега)

Това копие **не е самостоятелен проект**. Страниците все още разчитат на общи неща от `Home of art`, напр.:

- `@/components/*` (напр. `Header`, `Footer`, `Quiz`)
- `@/lib/firebase` (за страницата с резултати)

Когато започнем отделния проект `Test Pilot`, ще копираме/преместим и тези зависимости, плюс `package.json`, `next.config.mjs` и останалата Next.js структура.
