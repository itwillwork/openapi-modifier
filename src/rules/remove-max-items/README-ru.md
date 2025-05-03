[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# remove-max-items

Удаляет свойство `maxItems` из всех схем в OpenAPI спецификации.


## Конфигурация

| Параметр    | Описание                          | Пример                     | Типизация              | Дефолтное |
| -------- |-----------------------------------|----------------------------|------------------------|-----------|
| `showUnusedWarning`  | [**опциональный**] Показывать предупреждение, если не найдено схем с maxItems | `true` | `boolean` | `false`        |

Пример конфигурации:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "remove-max-items",
            config: {},
        }
        // ... other rules
    ]
}
```

Пример более детальной конфигурации:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "remove-max-items",
            config: {
                showUnusedWarning: true
            },
        }
        // ... other rules
    ]
}
```

**Если необходимо изменить несколько спецификаций**, вы можете использовать несколько раз данное правило в общем пайлайне конфигурации.

## Мотивация

<a name="custom_anchor_motivation_1"></a>
### 1. Необходимо удалить ограничение `maxItems` из схем для генерации TypeScript типов

В некоторых случаях ограничение `maxItems` может мешать генерации кода или создавать ненужные проверки. Удаление этого свойства позволяет сделать схему более гибкой и универсальной.

Практический пример:

**В файле `openapi.yaml`** схема выглядит так:

```yaml
components:
  schemas:
    Pet:
      type: object
      properties:
        tags:
          type: array
          maxItems: 10
          items:
            type: string
```

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `remove-max-items`:

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-max-items",
            config: {
                showUnusedWarning: true
            },
        }
    ]
}
```

**После применения правила**, файл `openapi.yaml` выглядит так:

```yaml
components:
  schemas:
    Pet:
      type: object
      properties:
        tags:
          type: array
          items:
            type: string
```


## Полезные ссылки

{{{links}}}
- [Примеры применения правила в тестах](./index.test.ts)  