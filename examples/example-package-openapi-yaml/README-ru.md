# Пример использования openapi-modifier с YAML

Этот пример демонстрирует использование библиотеки `openapi-modifier` для модификации OpenAPI спецификации в формате YAML.

## Структура проекта

```
example-package-openapi-yaml/
├── input/
│   └── openapi.yml      # Входной файл OpenAPI спецификации
├── output/
│   └── openapi.yml      # Выходной файл после модификации
├── generate.ts          # Скрипт для запуска модификации
└── package.json         # Зависимости проекта
```

## Установка

```bash
npm install
```

## Использование

1. Поместите вашу OpenAPI спецификацию в формате YAML в директорию `input/openapi.yml`
2. Запустите скрипт модификации:

```bash
npm start
```

3. Модифицированная спецификация будет сохранена в `output/openapi.yml`

## Пример кода

В этом примере используется правило `remove-operation-id` для удаления всех `operationId` из спецификации:

```typescript
import { openapiModifier } from 'openapi-modifier';

(async () => {
  try {
    await openapiModifier({
      input: 'input/openapi.yml',
      output: 'output/openapi.yml',
      pipeline: [
        {
          rule: 'remove-operation-id',
          config: {
            ignore: [], // Можно указать operationId, которые нужно сохранить
          },
        },
      ],
    });

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
```

## Результат

После выполнения скрипта, все `operationId` будут удалены из спецификации, сохраняя при этом остальную структуру документа без изменений.

## Зависимости

- openapi-modifier
- ts-node 