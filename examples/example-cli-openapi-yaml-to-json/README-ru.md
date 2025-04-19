# Пример конвертации OpenAPI из YAML в JSON

Этот пример демонстрирует использование `openapi-modifier` для конвертации OpenAPI спецификации из формата YAML в JSON с применением правил модификации.

## Структура проекта

```
example-cli-openapi-yaml-to-json/
├── input/
│   └── openapi.yml      # Входной файл OpenAPI в формате YAML
├── output/
│   └── openapi.json     # Выходной файл OpenAPI в формате JSON
├── openapi-modifier.config.ts  # Конфигурация правил модификации
└── package.json         # Зависимости проекта
```

## Установка

```bash
npm install
```

## Конфигурация

В файле `openapi-modifier.config.ts` определено правило для удаления `operationId` из всех операций API:

```typescript
import { ConfigT } from 'openapi-modifier';

const config: ConfigT = {
  pipeline: [
    {
      rule: 'remove-operation-id',
      config: {
        ignore: [],
      },
    },
  ],
};

export default config;
```

## Использование

Для запуска конвертации выполните:

```bash
npm start
```

или напрямую:

```bash
openapi-modifier --input=input/openapi.yml --output=output/openapi.json
```

## Результат

После выполнения команды:
1. Файл `input/openapi.yml` будет прочитан
2. К нему будут применены правила модификации (в данном случае - удаление всех `operationId`)
3. Результат будет сохранен в файл `output/openapi.json` в формате JSON

## Примечания

- Входной файл должен быть в формате YAML
- Выходной файл будет создан в формате JSON
- Все правила модификации применяются в порядке их определения в конфигурационном файле 