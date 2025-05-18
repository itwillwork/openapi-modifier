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
            config: {} // удалить свойство maxItems из всех схем, не показывать предупреждения
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
                showUnusedWarning: true // показать предупреждение, если в спецификации не найдены схемы с maxItems
            }
        }
        // ... other rules
    ]
}
```