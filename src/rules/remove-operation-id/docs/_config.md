| Параметр    | Описание                          | Пример                     | Типизация              | Дефолтное |
| -------- |-----------------------------------|----------------------------|------------------------|-----------|
| `ignore`  | [**опциональный**] Список operationId для игнорирования | `["getPets", "createPet"]` | `string[]` | `[]` |

Пример конфигурации:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "remove-operation-id",
            config: {
                ignore: ["getPets", "createPet"]
            },
        }
        // ... other rules
    ]
}
```