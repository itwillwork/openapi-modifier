# OpenAPI Modifier

Инструмент для модификации OpenAPI спецификаций с помощью настраиваемых правил. Этот пакет позволяет автоматизировать процесс изменения OpenAPI спецификаций, применяя к ним набор предопределенных правил.

## Основные возможности

- Модификация OpenAPI спецификаций в форматах YAML и JSON
- Гибкая система правил для изменения спецификаций
- Поддержка как CLI, так и программного использования c поддержкой TypeScript

## Установка

```bash
npm install openapi-modifier
```

## Использование

### CLI

```bash
openapi-modifier --input ./openapi.yaml --output ./modified-openapi.yaml --config ./config.js
```

### Программное использование

```typescript
import { OpenAPIModifier } from 'openapi-modifier';

const modifier = new OpenAPIModifier({
    input: './openapi.yaml',
    output: './modified-openapi.yaml',
    config: './config.js',
    logger: {
        verbose: true,
        minLevel: 0
    }
});

await modifier.run();
```

## Конфигурация

Создайте файл конфигурации (например, `config.js`) со следующей структурой:

```javascript
module.exports = {
    // Настройки логгера (опционально)
    logger: {
        verbose: true, // Включить подробное логирование
        minLevel: 0    // Минимальный уровень логирования: 0 - trace, 1 - debug, 2 - info, 3 - warn, 4 - error
    },
    // Путь к входному файлу OpenAPI спецификации
    input: './openapi.yaml',
    // Путь к выходному файлу
    output: './modified-openapi.yaml',
    // Конвейер правил для применения
    pipeline: [
        {
            rule: "change-content-type",
            disabled: false, // Опционально: отключить правило
            config: {
                map: {
                    "*/*": "application/json"
                }
            }
        }
        // Другие правила...
    ]
}
```

## Доступные правила

{{{ruleTable}}}

## Краткие описания правил

{{{rulesDescription}}}