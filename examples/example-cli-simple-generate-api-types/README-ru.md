# Пример использования openapi-modifier для генерации типов API

Этот пример демонстрирует, как использовать `openapi-modifier` для модификации OpenAPI спецификации и последующей генерации TypeScript типов.

## Описание примера

В этом примере мы:
1. Модифицируем входной OpenAPI файл с помощью `openapi-modifier`
2. Генерируем TypeScript типы из модифицированного OpenAPI файла

## Структура проекта

```
example-cli-simple-generate-api-types/
├── input/
│   └── openapi.yaml         # Входной OpenAPI файл
├── output/
│   ├── openapi.yaml         # Модифицированный OpenAPI файл
│   └── generated-api-types.d.ts  # Сгенерированные TypeScript типы
├── openapi-modifier.config.ts    # Конфигурация openapi-modifier
└── package.json             # Зависимости и скрипты
```

## Конфигурация

В файле `openapi-modifier.config.ts` определены следующие правила модификации:

1. Изменение базового пути:
   - Удаление префикса `/api/external` из путей API

2. Фильтрация эндпоинтов:
   - Удаление всех путей, содержащих `/internal`

3. Удаление неиспользуемых компонентов:
   - Очистка схем, которые не используются в API

## Использование

1. Установите зависимости:
```bash
npm install
```

2. Запустите процесс модификации и генерации типов:
```bash
npm start
```

Это выполнит следующие шаги:
1. Модифицирует входной OpenAPI файл (`prepare-input-openapi`)
2. Генерирует TypeScript типы из модифицированного файла (`generate-api-types`)

## Результат

После выполнения скриптов в директории `output/` будут созданы:
- `openapi.yaml` - модифицированная версия OpenAPI спецификации
- `generated-api-types.d.ts` - сгенерированные TypeScript типы

## Зависимости

- `openapi-modifier` - для модификации OpenAPI спецификации
- `dtsgenerator` - для генерации TypeScript типов 