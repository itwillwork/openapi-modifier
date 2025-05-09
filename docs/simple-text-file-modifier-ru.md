[🇺🇸 English](./simple-text-file-modifier.md) | [🇷🇺 Русский](./simple-text-file-modifier-ru.md)  | [🇨🇳 中文](./simple-text-file-modifier-zh.md)

# Simple Text File Modifier

Простой инструмент для модификации текстовых файлов. Позволяет выполнять базовые операции с текстовыми файлами, такие как добавление текста в начало или конец файла, а также замена текста с использованием регулярных выражений.

## Мотивация и примеры использования

Например мы сгенерировали [типизацию для API](../examples/example-cli-generate-api-types/output/generated-api-types.d.ts).
И хотим явно пометить для других разработчиков: что файл не нужно менять вручную и переименовать некоторые сущности на более декларативные названия.
Пишем [файл конфигурации](../examples/example-cli-generate-api-types/simple-text-file-modifier.config.ts), описывающий все что нужно поменять с пояснительными комментариями.
Далее [при помощи этого файла конфигурации и cli simple-text-file-modifier](../examples/example-cli-generate-api-types/package.json#L9), и получается [модифицированный файл типиазации API](../examples/example-cli-generate-api-types/output/generated-api-types.d.ts).

## Установка

```bash
npm install --save-dev openapi-modifier
```

## Использование

```bash
simple-text-file-modifier --input=input/file.txt --output=output/file.txt --config=simple-text-file-modifier.config.js
```

[Примере использования](../examples/example-cli-generate-api-types/package.json#L9)

## Параметры командной строки

| Параметр  | Описание                                                                                                 | Пример                                | Обязательный |
| --------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------- | ------------ |
| **input** | Путь к входному файлу                                                                                    | `input/file.txt`                     | Да           |
| **output**| Путь к выходному файлу                                                                                   | `output/file.txt`                    | Да           |
| **config**| Путь к файлу конфигурации. Поддерживаются форматы: js, ts, json, yaml, yml                               | `simple-text-file-modifier.config.js` | Нет          |
| **verbose**| Включить подробный вывод                                                                                 | `--verbose`                          | Нет          |

## Конфигурация

Файл конфигурации может содержать следующие параметры:

| Параметр     | Тип                                                             | Пример                                                                 | Описание                                                                                 |
| ------------ | --------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **addAfter** | `string`                                                        | `"WARNING! This file was auto-generated"`                              | Текст, который будет добавлен в конец файла                                              |
| **addBefore**| `string`                                                        | `"/// <reference types=\"../../a\" />"`                                | Текст, который будет добавлен в начало файла                                             |
| **replace**  | `Array<{ searchValue: string \| RegExp; replaceValue: string }>`| `{ searchValue: /\ Components\./g, replaceValue: ' ApiComponents.' }`  | Массив замен. Поддерживает как строки, так и регулярные выражения                        |

## Примеры конфигурации

### JavaScript (simple-text-file-modifier.config.js)
```javascript
module.exports = {
    addBefore: "// This file was auto-generated. Do not edit manually.\n",
    addAfter: "\n// End of auto-generated file",
    replace: [
        {
            searchValue: /Components\./g,
            replaceValue: 'ApiComponents.'
        }
    ]
};
```

### TypeScript (simple-text-file-modifier.config.ts)
```typescript
export default {
    addBefore: "// This file was auto-generated. Do not edit manually.\n",
    addAfter: "\n// End of auto-generated file",
    replace: [
        {
            searchValue: /Components\./g,
            replaceValue: 'ApiComponents.'
        }
    ]
};
```

### JSON (simple-text-file-modifier.config.json)
```json
{
  "addBefore": "// This file was auto-generated. Do not edit manually.\n",
  "addAfter": "\n// End of auto-generated file",
  "replace": [
    {
      "searchValue": "Components.",
      "replaceValue": "ApiComponents."
    }
  ]
}
```

## Примеры использования

### Добавление предупреждения в начало файла
```bash
simple-text-file-modifier --input=input/file.txt --output=output/file.txt --config=simple-text-file-modifier.config.js
```

Где `simple-text-file-modifier.config.js` содержит:
```javascript
module.exports = {
    addBefore: "// WARNING: This file was auto-generated. Do not edit manually.\n"
};
```

### Замена текста в файле
```bash
simple-text-file-modifier --input=input/file.txt --output=output/file.txt --config=simple-text-file-modifier.config.js
```

Где `simple-text-file-modifier.config.js` содержит:
```javascript
module.exports = {
    replace: [
        {
            searchValue: /old\.namespace\./g,
            replaceValue: 'new.namespace.'
        }
    ]
};
```

## Примечания

- Если параметр `--config` не указан, утилита будет искать файл конфигурации с именем `simple-text-file-modifier.config` и расширениями: js, ts, json, yaml, yml
- Все операции выполняются последовательно: сначала замены, затем добавление текста в начало, и в конце - добавление текста в конец файла
- При использовании регулярных выражений в конфигурации JSON, их нужно указывать как строки

