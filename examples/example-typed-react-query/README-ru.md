[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)


# Пример: Генерация типов OpenAPI + React Query

Этот проект демонстрирует, как генерировать типы TypeScript из спецификации OpenAPI и использовать их с [react-query](https://tanstack.com/query/latest) в React-приложении.

## Структура проекта

```
examples/example-typed-react-query/
├── public/                  # Статические файлы
├── specs/                   # OpenAPI спецификации (оригинал и подготовленная)
│   ├── openapi.json         # Оригинальная спецификация OpenAPI
│   └── prepared-openapi.json# Модифицированная спецификация для генерации/мока
├── src/
│   ├── api/
│   │   ├── fetchPetById.ts  # Пример API-запроса с использованием сгенерированных типов
│   │   └── types/
│   │       ├── generated-api-types.d.ts # Сгенерированные типы из OpenAPI
│   │       └── models.ts    # Алиасы типов для использования в приложении
│   ├── App.tsx              # Основное React-приложение с интеграцией react-query
│   └── ...
├── openapi-modifier.config.ts           # Конфиг для модификации OpenAPI спецификации
├── simple-text-file-modifier.config.ts  # Конфиг для пост-обработки сгенерированных типов
├── package.json
└── ...
```

## Доступные npm-скрипты

- `generate-types` — Генерация TypeScript-типов из OpenAPI (`specs/prepared-openapi.json`) и их пост-обработка
- `prepare-generated-types` — Добавление предупреждения в начало сгенерированных типов
- `prepare-openapi` — Модификация оригинальной OpenAPI спецификации с помощью CLI `openapi-modifier`
- `mock:api` — Запуск мок-сервера на основе [Prism](https://github.com/stoplightio/prism)
- `dev` — Одновременный запуск мок-сервера и React-приложения

## Как это работает

### 1. Модификация OpenAPI спецификации
- Оригинальная спецификация (`specs/openapi.json`) обрабатывается через `openapi-modifier` (см. `openapi-modifier.config.ts`).
- Пример: изменение base path, фильтрация эндпоинтов, удаление неиспользуемых компонентов.
- Результат: `specs/prepared-openapi.json`.

### 2. Генерация типов
- Типы генерируются из подготовленной спецификации OpenAPI с помощью `dtsgenerator`.
- Результат: `src/api/types/generated-api-types.d.ts`.
- Далее файл обрабатывается `simple-text-file-modifier` для добавления предупреждения.

### 3. Интеграция с React Query
- API-функции (например, `fetchPetById`) используют сгенерированные типы для типизации.
- React-компоненты используют `@tanstack/react-query` для получения и кэширования данных.

### 4. Мок-сервер
- Мок-сервер (`mock:api`) запускает подготовленную спецификацию OpenAPI через Prism.
- Удобно для локальной разработки и тестирования без реального бэкенда.

### 5. Модификация типов и спецификации
- Типы могут быть дополнительно обработаны (например, добавление комментариев) через `simple-text-file-modifier`.
- Спецификация OpenAPI может быть программно изменена через CLI и конфиг `openapi-modifier`.

---

Изучайте код и конфиги для подробностей! 