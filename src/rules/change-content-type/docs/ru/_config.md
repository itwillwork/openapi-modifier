| Параметр | Описание                          | Пример                     | Типизация              | Дефолтное |
|----------|-----------------------------------|----------------------------|------------------------|-----------|
| `map`    | [**обязательный**] Словарь замены типов контента | `{"*/*": "application/json"}` | `Record<string, string>` | `{}`        |

Пример конфигурации:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "change-content-type",
            config: {
                map: {
                    "*/*": "application/json" // заменяем все типы контента на application/json
                }
            },
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
            rule: "change-content-type",
            config: {
                map: {
                    "application/xml": "application/json", // заменяем application/xml на application/json
                    "text/plain": "application/json", // заменяем text/plain на application/json
                    "*/*": "application/json" // заменяем все остальные типы контента на application/json
                }
            },
        }
        // ... other rules
    ]
}
```