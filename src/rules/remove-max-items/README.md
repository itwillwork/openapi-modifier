# remove-max-items

Удаляет ограничение `maxItems` из всех схем в OpenAPI спецификации.

## Config

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
            config: {
                showUnusedWarning: true
            },
        }
        // ... other rules
    ]
}
```

## Motivation

<a name="custom_anchor_motivation_1"></a>
### 1. Необходимо удалить ограничение `maxItems` из схем для более гибкой валидации

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

<a name="custom_anchor_motivation_2"></a>
### 2. Ограничение `maxItems` больше не актуально и должно быть удалено

Практический пример:

**В файле `openapi.yaml`** схема выглядит так:

```yaml
components:
  schemas:
    Order:
      type: object
      properties:
        items:
          type: array
          maxItems: 5
          items:
            $ref: '#/components/schemas/OrderItem'
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
    Order:
      type: object
      properties:
        items:
          type: array
          items:
            $ref: '#/components/schemas/OrderItem'
``` 