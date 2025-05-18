| Параметр                    | Описание                                                                                                                                                | Пример                                                                                                                                                                | Типизация      | Дефолтное |
|-----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|-----------|
| `endpointDescriptor`        | [**обязательный**] Указание в каком endpoint нужно поменять схему параметра запроса.                                                                    | `'GET /api/list'`                                                                                                                                                     | `EndpointDescriptorConfig`       |           |
| `contentType`               | Указание к какому типу запросов (content-type) endpoint'а нужно применить изменение. При отсутствии значения, будут изменены все варианты типов запросов. | `'application/json'`                                                                                                                                                  | `string`       |  |
| `correction`                | Путь к полю в схеме для модификации                                                                                                                     | `"name"` | `string` | - |
| `schemaDiff`                | [**обязательный**] Изменения для применения к схеме. [Подробные примеры спецификаций для OpenAPI]({{{rootPath}}}docs/schema-diff{{{langPostfix}}}.md)                                                                                                                          | `{type: "number"}`                                                                                                 | `OpenAPISchema` |           |
| `patchMethod`               | Метод применения изменений [Подробнее про различия между методами merge и deepmerge]({{{rootPath}}}docs/merge-vs-deepmerge{{{langPostfix}}}.md) | `"merge"` | `"merge" \ "deepmerge"` | `"merge"` |

Примеры конфигураций:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "patch-endpoint-request-body-schema",
            config: {
                endpointDescriptor: 'POST /api/order', // указываем эндпоинт, который нужно изменить
                correction: "status", // указываем путь к полю status в теле запроса
                schemaDiff: {
                    enum: ['foo', 'bar'], // добавляем enum к полю status
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
                endpointDescriptor: 'POST /api/order', // указываем эндпоинт, который нужно изменить
                contentType: "application/json", // указываем тип контента, для которого применяем изменения
                schemaDiff: {
                    properties: {
                        testField: {
                            type: 'number', // меняем тип поля testField на number
                        },
                    },
                },
                patchMethod: "deepmerge" // используем метод deepmerge для глубокого слияния изменений
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
