| Параметр                    | Описание                                                              | Пример               | Типизация                | Дефолтное |
|-----------------------------|-----------------------------------------------------------------------|----------------------|--------------------------|-----------|
| `map`                       | [**обязательный**] Словарь замены путей                                     | `{"/api/v1": "/v1"}` | `Record<string, string>` | `{}`      |
| `ignoreOperationCollisions` | Игнорировать возникающие коллизии endpoint'ов после применения замены | `true`               | `boolean`                | `false`        |


Пример конфигурации:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "change-endpoints-basepath",
            config: {
               map: { 
                   '/public/api': '', // удаляем префикс /public/api из всех путей
               },
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
            rule: "change-endpoints-basepath",
            config: {
               map: { 
                   '/public/v1/service/api': '/api', // заменяем префикс /public/v1/service/api на /api
               }, 
               ignoreOperationCollisions: false, // не игнорируем конфликты операций при замене путей
            },
        }
        // ... other rules
    ]
}
```
               

