# Проект: "Календарь событий"

Это календарь событий - проект, где гости могут бронировать время события. А один единственный владелец календаря может создавать типы событий и просматривать в календаре созданные брони гостей.

API-спецификация хранится в: `docs/openapi.yaml`.
Исходные файлы TypeSpec-спецификации и API-контракта хранятся в: `api/main.tsp`.

## Фронтенд

Фронтенд-часть расположена в директории `client/`.

### Структура

```
client/
├── public/
│   └── mockServiceWorker.js   # MSW Service Worker (генер. npx msw init)
├── src/
│   ├── api/                   # Слой работы с API
│   │   ├── client.ts          # axios-инстанс (baseURL: /api)
│   │   ├── endpoints.ts       # Функции для каждого эндпоинта
│   │   └── types.ts           # TypeScript-интерфейсы (из openapi.yaml)
│   ├── components/            # Переиспользуемые компоненты
│   │   ├── AppHeader.tsx      # Шапка с логотипом CalMe и навигацией
│   │   ├── PageContent.tsx    # Контейнер с отступами и высотой для контента страниц
│   │   ├── GuestLayout.tsx    # Layout для гостевой страницы (AppHeader + контент)
│   │   └── OwnerLayout.tsx    # Layout панели владельца (AppHeader + Sider)
│   ├── mocks/                 # MSW-заглушки
│   │   ├── browser.ts         # Инициализация MSW worker
│   │   └── handlers.ts        # Хендлеры на все эндпоинты API
│   ├── pages/                 # Страницы приложения
│   │   ├── OwnerCalendarPage.tsx    # Календарь с бронями (владелец)
│   │   ├── EventTypesPage.tsx       # CRUD типов событий (владелец)
│   │   ├── HomePage.tsx              # Приветственная страница (гость)
│   │   └── GuestBookingPage.tsx     # Бронирование времени (гость)
│   ├── App.tsx                # Роутинг (React Router)
 │   ├── main.tsx               # Точка входа (инициализация MSW + React)
 │   ├── index.css              # Глобальные стили (сброс body margin)
 │   └── vite-env.d.ts
├── .prettierrc               # Настройки форматирования Prettier
├── eslint.config.js          # Flat config ESLint (JS+TS+React+Prettier)
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Команды

```bash
# Запуск dev-сервера фронтенда
npm run client:dev

# Сборка фронтенда
npm run client:build

# Линтинг и форматирование
npm run client:lint           # Проверка ESLint
npm run client:lint:fix       # Автоисправление ESLint
npm run client:format         # Форматирование Prettier
```

### Стек технологий

- Основная фронтенд-библиотека: **React 18+**;
- Ротутер: **React Router 7+**;
- Типизация: **TypeScript**;
- Сборщик: **Vite**;
- Библиотека **Day.js**;
- UI-библиотека **Ant Design (antd)**;
- Mock-сервис: **MSW (Mock Service Worker)**;
- Работа с API-запросами: **axios**;
- Линтер: **ESLint 9+** (flat config);
- Форматирование: **Prettier**.

## Бэкенд

Бэкенд-часть расположена в директории `backend/`.

### Структура

```
backend/
├── src/
│   ├── index.ts            # Точка входа (Express-сервер, роуты API)
│   ├── types.ts            # TypeScript-интерфейсы (Owner, EventType, Slot, Appointment и др.)
│   ├── store.ts            # In-memory хранилище и функции (CRUD)
│   └── slots.ts            # Генерация временных слотов для бронирования
├── package.json
└── tsconfig.json
```

### Команды

```bash
# Запуск dev-сервера бэкенда (без hot-reload)
npm run server:start

# Запуск фронтенда и бэкенда одновременно
npm run dev

# Dev-сервер с hot-reload (из директории backend/)
cd backend && npm run dev

# Линтинг и форматирование
npm run server:lint           # Проверка ESLint
npm run server:lint:fix       # Автоисправление ESLint
npm run server:format         # Форматирование Prettier
```

### Стек технологий

- Язык: **TypeScript**;
- Среда выполнения: **Node.js**;
- Веб-фреймворк: **Express**;
- Запуск и hot-reload: **tsx** (TypeScript Execute);
- Хранилище: **In-memory** (без внешней БД);
- CORS- middleware: **cors**.

## Тестирование

### E2E-тесты (Playwright)

E2E-тесты расположены в `e2e/`. Используется **Playwright** (Chromium).

Конфигурация: `playwright.config.ts`

- При запуске автоматически стартуют бэкенд (порт 3001) и фронтенд (порт 5173 с `VITE_E2E=true`).
- Флаг `VITE_E2E=true` отключает MSW-заглушки, чтобы тесты ходили в реальный бэкенд.
- In-memory хранилище бэкенда сбрасывается при каждом запуске сервера.

### Команды

```bash
npm run test:e2e           # Запуск всех E2E-тестов (headless)
npm run test:e2e:debug     # Запуск с Playwright Inspector
npm run test:e2e:ui        # Запуск с Playwright UI Mode
```

### Структура тестов

```
e2e/
├── booking.spec.ts        # Бронирование (гость): happy path, валидация, ошибка API (page.route)
└── event-types.spec.ts    # Типы событий (владелец): создание, валидация
```

### Важные замечания

- Тесты используют **реальный бэкенд**, а не MSW.
- Дата бронирования вычисляется динамически (следующий рабочий день) — тесты воспроизводимы в любой день.
- Для имитации ошибок API (например, 500) используй `page.route()`.
- Результаты тестов (скриншоты, видео, trace) сохраняются в `test-results/` (`.gitignore`).
