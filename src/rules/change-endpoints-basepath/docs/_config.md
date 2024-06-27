| Параметр    | Описание                                                              | Пример                  | Типизация                | Дефолтное |
| -------- |-----------------------------------------------------------------------|-------------------------|--------------------------|-----------|
| `map`  | [**обязательный**] Словарь замены                                     | `{ '/public/api': '' }` | `Record<string, string>` | `{}`      |
| `ignoreOperarionCollisions`  | Игнорировать возникающие коллизии endpoint'ов после применения замены | `false`                 | `boolean`                | `false`        |


Пример конфигурации:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "change-endpoints-basepath",
            config: {
               map: { 
                   '/public/api': '',
               },
               ignoreOperarionCollisions: false,
            },
        }
        // ... other rules
    ]
}
```
