| Параметр   | Описание                                             | Пример                 | Типизация       | Дефолтное |
|------------|------------------------------------------------------|------------------------|-----------------|--------|
| `enabled`  | [**опциональный**] Список разрешенных content-type. Если не указан, сохраняются все типы, не указанные в `disabled` | `['application/json']` | `Array<string>` |        |
| `disabled` | [**опциональный**] Список запрещенных content-type   | `['multipart/form-data']` | `Array<string>` |        |

Примеры конфигураций:

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
