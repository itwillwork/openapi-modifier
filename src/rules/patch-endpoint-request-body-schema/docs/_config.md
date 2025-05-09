| Параметр                    | Описание                                                                                                                                                | Пример                                                                                                                                                                | Типизация      | Дефолтное |
|-----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|-----------|
| `endpointDescriptor`        | [**обязательный**] Указание в каком endpoint нужно поменять схему параметра запроса.                                                                    | `'GET /api/list'`                                                                                                                                                     | `string`       |           |
| `contentType`               | Указание к какому типу запросов (content-type) endpoint'а нужно применить изменение. При отсутствии значения, будут изменены все варианты типов запросов. | `'application/json'`                                                                                                                                                  | `string`       |  |
| `correction`                | Путь к полю в схеме для модификации                                                                                                                     | `"name"` | `string` | - |
| `schemaDiff`                | [**обязательный**] Изменения для применения к схеме. [Подробные примеры спецификаций для OpenAPI]({{{rootPath}}}docs/schema-diff{{{langPostfix}}}.md)                                                                                                                          | `{type: "number"}` или см. больше примеров OpenAPISchema TODO ссылка                                                                                                  | `OpenAPISchema` |           |
| `patchMethod`               | Метод применения изменений [Подробнее про различия между методами merge и deepmerge]({{{rootPath}}}docs/merge-vs-deepmerge{{{langPostfix}}}.md) | `'merge' /                                                                                                                                                  'deepmerge'` | `enum`                                                                              |  `merge` |

Примеры конфигурации:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "patch-endpoint-request-body-schema",
            config: {
                endpointDescriptor: 'POST /api/order',
                correction: "status",
                schemaDiff: {
                    enum: ['foo', 'bar'],
                },
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
            rule: "patch-endpoint-request-body-schema",
            config: {
                endpointDescriptor: 'POST /api/order',
                contentType: "application/json",
                schemaDiff: {
                    properties: {
                        testField: {
                            type: 'number',
                        },
                    },
                },
                patchMethod: "deepmerge"
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
            rule: "patch-endpoint-request-body-schema",
            config: {
                endpointDescriptor: 'POST /api/orders',
                correction: '[].status',
                schemaDiff: {
                    enum: ['foo', 'bar'],
                },
                patchMethod: "deepmerge"
            },
        }
        // ... other rules
    ]
}
```
