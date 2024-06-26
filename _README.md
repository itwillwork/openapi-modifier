
# List
<a name="custom_anchor_rule_change-content-type"></a>
### change-content-type

Изменяет content-type для request и response в соответствии со словарем замены.

#### Config

| Параметр    | Описание                          | Пример                     | Типизация              | Дефолтное |
| -------- |-----------------------------------|----------------------------|------------------------|-----------|
| `map`  | [**обязательный**] Словарь замены | `{"*/*": "application/json"}` | `Record<string, string>` | `{}`        |


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


[Подрбонее про правило change-content-type](./src/rules/change-content-type/README.md)


# Table

| Правило | Краткое описание |
| -- | -- |
| [change-content-type](./src/rules/change-content-type/README.md) | Изменяет content-type для request и response в соответствии со словарем замены. |
