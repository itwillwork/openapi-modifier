| Параметр    | Описание                          | Пример | Дефолтное            |
| -------- |-----------------------------------|--------|----------------------|
| `map`  | [**обязательный**] Словарь замены | `{"*/*": "application/json"}`   |                      |


Пример конфигурации:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "change-content-type",
            config: {
                "*/*": "application/json"
            },
        }
        // ... other rules
    ]
}
```
