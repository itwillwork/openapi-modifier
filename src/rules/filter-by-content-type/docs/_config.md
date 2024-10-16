| Параметр    | Описание                                         | Пример                 | Типизация       | Дефолтное |
| -------- |--------------------------------------------------|------------------------|-----------------|--------|
| `enabled`  | Включенные content-type, которые нужно сохранить | `['application/json']` | `Array<string>` |        |
| `disabled`  | Выключенные content-type, которые нужно удалить  | `['multipart/form-data']` | `Array<string>` |        |

Пример конфигурации:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "filter-by-content-type",
            config: {
                enabled: ['application/json'],
            },
        }
        // ... other rules
    ]
}
```

или

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "filter-by-content-type",
            config: {
                disabled: ['multipart/form-data'],
            },
        }
        // ... other rules
    ]
}
```
