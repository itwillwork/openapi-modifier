# Пример использования openapi-modifier с JSON файлом

Этот пример демонстрирует базовое использование openapi-modifier для модификации OpenAPI спецификации в формате JSON.

## Структура проекта

```
example-cli-openapi-json/
├── input/                  # Директория с входными файлами
│   └── openapi.json       # Исходный OpenAPI файл
├── output/                 # Директория с выходными файлами
│   └── openapi.json       # Модифицированный OpenAPI файл
├── openapi-modifier.config.ts  # Конфигурация openapi-modifier
└── package.json           # Зависимости и скрипты
```

## Установка

```bash
npm install
```

## Использование

Для запуска модификации OpenAPI файла выполните:

```bash
npm start
```

Это выполнит следующую команду:
```bash
openapi-modifier --input=input/openapi.json --output=output/openapi.json --config=openapi-modifier.config.ts
```

## Конфигурация

В данном примере используется простая конфигурация, которая удаляет все operationId из OpenAPI спецификации:

```typescript
import { ConfigT } from 'openapi-modifier';

const config: ConfigT = {
  pipeline: [
    {
      rule: 'remove-operation-id',
      config: {
        ignore: [], // Можно указать operationId, которые нужно сохранить
      },
    },
  ],
};

export default config;
```

## Результат

После выполнения скрипта, модифицированный OpenAPI файл будет сохранен в директории `output/`. Все operationId будут удалены из спецификации, что может быть полезно при необходимости очистить документацию от внутренних идентификаторов операций. 