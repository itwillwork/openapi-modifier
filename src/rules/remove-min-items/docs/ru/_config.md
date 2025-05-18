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
            config: {} // удалить свойство minItems из всех схем, не показывать предупреждения
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
            rule: "remove-min-items",
            config: {
                showUnusedWarning: true // показать предупреждение, если в спецификации не найдены схемы с minItems
            }
        }
        // ... other rules
    ]
}
```