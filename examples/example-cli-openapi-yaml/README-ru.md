# Пример использования openapi-modifier с YAML файлом

Этот пример демонстрирует использование openapi-modifier для модификации OpenAPI спецификации в формате YAML.

## Структура проекта

```
example-cli-openapi-yaml/
├── input/
│   └── openapi.yml         # Входной файл OpenAPI спецификации
├── output/
│   └── openapi.yml         # Выходной файл после модификации
├── openapi-modifier.config.ts  # Конфигурация модификатора
└── package.json            # Зависимости проекта
```

## Установка

1. Установите зависимости:
```bash
npm install
```

## Конфигурация

В файле `openapi-modifier.config.ts` определена конфигурация для модификации OpenAPI спецификации:

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

В данном примере используется правило `remove-operation-id`, которое удаляет все `operationId` из OpenAPI спецификации.

## Запуск

Для запуска модификации выполните:

```bash
npm start
```

или напрямую:

```bash
openapi-modifier --input=input/openapi.yml --output=output/openapi.yml --config=openapi-modifier.config.ts
```

## Результат

После выполнения команды, в директории `output` будет создан файл `openapi.yml` с модифицированной OpenAPI спецификацией. В данном случае, все `operationId` будут удалены из спецификации.

## Входные данные

Входной файл `input/openapi.yml` содержит пример OpenAPI спецификации для Petstore API с различными эндпоинтами и схемами. После модификации все `operationId` будут удалены из спецификации. 