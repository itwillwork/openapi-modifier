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
                enabled: ['application/json'], // оставить только content-type application/json, удалить все остальные
            }
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
                disabled: ['multipart/form-data'], // удалить content-type multipart/form-data, оставить все остальные
            }
        }
        // ... other rules
    ]
}
```

> [!IMPORTANT]
> 1. Если указаны оба параметра `enabled` и `disabled`, сначала применяется фильтр `enabled`, затем `disabled`
> 2. Правило выводит предупреждения для content-type, указанных в конфигурации, но не найденных в спецификации
