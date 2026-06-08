# Event Calendar

[![Actions Status](https://github.com/buravlev-arthur/ai-for-developers-project-387/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/buravlev-arthur/ai-for-developers-project-387/actions)

**Календарь событий** — веб-приложение для бронирования времени. Гости могут просматривать доступные слоты и бронировать их, а владелец календаря — управлять типами событий и просматривать все брони.

## Демо-стенд

Приложение развёрнуто на Render: [event-calendar-5v7j.onrender.com](https://event-calendar-5v7j.onrender.com)

## Архитектура

Проект — монорепозиторий (npm workspaces) с двумя частями:

- **`client/`** — frontend на React + Vite + Ant Design
- **`backend/`** — backend на Express + in-memory хранилище

## Стек технологий

| Компонент | Технологии |
|-----------|-----------|
| Frontend | React 18, TypeScript, Vite, Ant Design, Day.js, React Router 7, axios, MSW |
| Backend | Node.js, Express, TypeScript, tsx (hot-reload) |
| E2E-тесты | Playwright (Chromium) |
| API-спецификация | TypeSpec → OpenAPI 3.0 |

## Быстрый старт

```bash
# Установка зависимостей (все workspaces)
npm ci

# Запуск frontend и backend одновременно
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Команды

### Разработка

```bash
npm run dev                  # Запуск frontend + backend одновременно
npm run client:dev           # Запуск только frontend (Vite dev-сервер)
npm run server:start         # Запуск только backend (Express)
```

### Сборка

```bash
npm run client:build         # Сборка frontend (TypeScript + Vite)
```

### Линтинг и форматирование

```bash
npm run client:lint          # ESLint frontend
npm run client:lint:fix      # Автоисправление frontend
npm run client:format        # Prettier frontend

npm run server:lint          # ESLint backend
npm run server:lint:fix      # Автоисправление backend
npm run server:format        # Prettier backend
```

### Тестирование

```bash
npm run test:e2e             # E2E-тесты Playwright (headless)
npm run test:e2e:debug       # Запуск с Playwright Inspector
npm run test:e2e:ui          # Запуск с Playwright UI Mode
```

> E2E-тесты запускают реальный backend (порт 3001) и frontend (порт 5173) без MSW-заглушек.

### API-спецификация

```bash
npm run compile              # Компиляция TypeSpec → docs/openapi.yaml
```

### Docker

```bash
npm run docker:build         # Сборка образа
npm run docker:start         # Запуск контейнера
```

Или напрямую:

```bash
# Сборка образа
docker build -t event-calendar .

# Запуск контейнера (на хосте: http://localhost:8080)
docker run -e PORT=5145 -p 8080:5145 event-calendar
```

## API-спецификация

OpenAPI-спецификация: [`docs/openapi.yaml`](docs/openapi.yaml)
TypeSpec-исходники: [`api/main.tsp`](api/main.tsp)
