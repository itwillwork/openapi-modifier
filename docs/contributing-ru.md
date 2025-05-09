[🇺🇸 English](./contributing.md) | [🇷🇺 Русский](./contributing-ru.md)  | [🇨🇳 中文](./contributing-zh.md)

# Добавление нового правила

Необходимо в папку `src/rules` добавить папку с именем вновь созданного правила с 6 файлами:

- `index.ts` - основной файл с логикой правила - должны быть экспортированы: `processor` (дефолтный экспорт) и `configSchema` (именованный экспорт)
- `index.test.ts` - тесты на правило покрывающие все поля конфигурации и примеры их использования
- `/docs/{lang}/_description.md` - файл с описанием правила
- `/docs/{lang}/_motivation.md` - файл с описанием мотивации создания правила с примерами (в каких случаях на практике может быть полезно)
- `/docs/{lang}/_config.md` - файл с описанием конфигурации для правила

Для вывода подробных логов необходимых для отладки [см. пункт "Отладка"](#custom_anchor_debug).

Все названия правил должны начинаться с обозначения действия.

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

<a name="custom_anchor_debug"></a>

## Отладка

Внутри используется для детального логирования npm-пакет - [debug](https://www.npmjs.com/package/debug)

Для вывода всех debug логов:

```bash
DEBUG=openapi-modifier:* openapi-modifier
```

Для вывода debug логов по правилу, например по правилу `remove-operation-id`:

```bash
DEBUG=openapi-modifier:rule:remove-operation-id openapi-modifier
```