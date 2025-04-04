# OpenAPI Modifier

Инструмент для модификации OpenAPI спецификаций с помощью настраиваемых правил. Этот пакет позволяет автоматизировать процесс изменения OpenAPI спецификаций, применяя к ним набор предопределенных правил.

## Основные возможности

- Модификация OpenAPI спецификаций в форматах YAML и JSON
- Гибкая система правил для изменения спецификаций
- Поддержка как CLI, так и программного использования
- Настраиваемое логирование процесса модификации
- Валидация конфигурации с помощью Zod
- Поддержка TypeScript

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
        minLevel: 0 // Уровень логирования: 0 - trace, 1 - debug, 2 - info, 3 - warn, 4 - error
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
        minLevel: 0    // Минимальный уровень логирования
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

### change-content-type

Изменяет content-type для request и response в соответствии со словарем.

#### Параметры конфигурации

| Параметр | Описание | Пример | Тип | По умолчанию |
|----------|----------|---------|-----|-------------|
| `map` | Словарь замены content-type | `{"*/*": "application/json"}` | `Record<string, string>` | `{}` |

## Разработка

### Установка зависимостей

```bash
npm install
```

### Сборка

```bash
npm run build
```

### Тестирование

```bash
npm test
```

### Дополнительные команды

- `npm run clear` - Очистка директорий сборки
- `npm run format` - Форматирование кода
- `npm run tools:generate-readme` - Генерация документации
- `npm run tools:generate-rule-types` - Генерация типов правил

## Структура проекта

```
src/
├── cli/          # CLI интерфейс
├── config.ts     # Конфигурация и валидация
├── core/         # Основная логика
├── logger/       # Система логирования
├── openapi.ts    # Работа с OpenAPI файлами
├── rules/        # Правила модификации
└── index.ts      # Точка входа
```

## Лицензия

ISC 