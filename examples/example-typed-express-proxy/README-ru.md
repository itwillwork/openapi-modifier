[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)


# example-typed-express-proxy

Этот проект демонстрирует пример типизированного Express proxy приложения на Node.js с использованием OpenAPI и TypeScript.

## Структура проекта

- `src/` — исходный код приложения
  - `index.ts` — основной файл, регистрация роутов, контроллеры, генерация моков
  - `middlewares/` — собственные мидлвары (логгер, обработка ответов)
  - `services/petstore/generated-api-types.d.ts` — сгенерированные из OpenAPI типы TypeScript
  - `@types/` — собственные определения типов (включая TypedController)
  - `errors.ts` — собственные классы ошибок
  - `example.test.ts` — примеры тестов генерации моков/сэмплов
- `specs/` — спецификации OpenAPI
  - `petstore.json` — оригинальная спецификация OpenAPI
  - `prepared-petstore.json` — модифицированная спецификация (после openapi-modifier)
- `openapi-modifier.config.ts` — конфиг для модификации OpenAPI спецификации
- `simple-text-file-modifier.config.ts` — конфиг для пост-обработки сгенерированных типов
- `package.json` — конфигурация и npm-скрипты

## Доступные npm-скрипты

- `start` — запуск Express proxy сервера
- `prepare-openapi-spec` — модификация OpenAPI спецификации через openapi-modifier
- `generate-types` — генерация TypeScript типов из OpenAPI (с пост-обработкой)
- `prepare-generated-types` — пост-обработка сгенерированных типов для единообразия имен
- `test` — запуск тестов (Jest)

## Как это работает

### Генерация типов из OpenAPI
- Спецификация OpenAPI (`specs/petstore.json`) модифицируется с помощью `openapi-modifier` (см. `openapi-modifier.config.ts`) и сохраняется как `specs/prepared-petstore.json`.
- Типы генерируются из подготовленной спецификации с помощью `dtsgenerator` и пост-обрабатываются для единообразия имен.
- В результате получается строго типизированный контракт API в `src/services/petstore/generated-api-types.d.ts`.

### Типизация контроллеров через TypedController
- Контроллеры типизируются с помощью интерфейса `TypedController<T>`, где `T` описывает структуру запроса/ответа для каждого endpoint.
- Это обеспечивает полную типобезопасность для параметров запроса, тела, query и ответов, включая обработку ошибок.

### Генерация моков ответов endpoint'ов с помощью getMockFromOpenApi
- Утилита `getMockFromOpenApi` генерирует моки ответов для endpoint'ов, конвертируя схемы OpenAPI в JSON Schema и используя `json-schema-faker`.
- Это позволяет мгновенно получать тестовые данные для любого endpoint/ответа, определённого в спецификации.

### Генерация sample сущностей в тестах
- Утилиты `createEndpointResponseSampleFromOpenApi` и `createEntitySampleFromOpenApi` генерируют сэмплы данных для endpoint'ов и сущностей в тестах, используя ту же логику конвертации OpenAPI → JSON Schema и json-schema-faker.

### Модификация спецификации OpenAPI через openapi-modifier
- CLI-инструмент `openapi-modifier` используется для предобработки OpenAPI спецификации (например, удаления operationId для лучшей генерации типов).
- Модификация настраивается через pipeline в `openapi-modifier.config.ts`.

---

Для подробностей смотрите исходный код и комментарии в файлах. 