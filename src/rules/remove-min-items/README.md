# remove-min-items

Удаляет свойство `minItems` из всех схем в OpenAPI спецификации.

## Config

| Параметр    | Описание                          | Пример                     | Типизация              | Дефолтное |
| -------- |-----------------------------------|----------------------------|------------------------|-----------|
| `showUnusedWarning`  | [**опциональный**] Показывать предупреждение, если не найдено схем с `minItems` | `true` | `boolean` | `false`        |

Пример конфигурации:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "remove-min-items",
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
### 1. Необходимо удалить ограничение на минимальное количество элементов в массивах

Практический пример:

**В файле `openapi.yaml`** схема выглядит так:

```yaml
components:
  schemas:
    PetList:
      type: array
      items:
        $ref: '#/components/schemas/Pet'
      minItems: 1
```

**Нужно удалить ограничение `minItems: 1`.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `remove-min-items`:

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-min-items",
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
    PetList:
      type: array
      items:
        $ref: '#/components/schemas/Pet'
```

<a name="custom_anchor_motivation_2"></a>
### 2. Упрощение схемы для генерации кода

В некоторых случаях ограничение `minItems` может мешать генерации кода или создавать ненужные проверки. Удаление этого свойства позволяет сделать схему более гибкой и универсальной. 