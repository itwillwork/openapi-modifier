| Параметр                | Описание                                                                                                                                            | Пример                                                                                                                                                                   | Типизация       | Дефолтное |
|-------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------|-----------|
| `endpointDescriptor`    | [**обязательный**] Указание в каком endpoint нужно поменять схему параметра запроса.                                                                | `'GET /api/list'`                                                                                                                                                        | `string`        |           |
| `correction`            | Путь к свойству схемы для модификации                                                                                                               | `"status"`                                                                                                                                                               | `string` | - |
| `code`                  | Указание к какому статус коду ответа нужно применить изменение. При отсутствии значения, будет применен к первому 2xx ответу.                       | `200`                                                                                                                                                                    | `number`        |  |
| `contentType`           | Указание к какому типу ответа (content-type) endpoint нужно применить изменение. При отсутствии значения, будут изменены все варианты типов ответов. | `'application/json'`                                                                                                                                                     | `string`        |  |
| `schemaDiff`            | [**обязательный**] Необходимое изменение в формате OpenAPI. [Примеры патчей схем](TODO)                                                             | `{type: "number"}`                                                                                                  | `OpenAPISchema` |           |
| `patchMethod`           | Метод применения изменений [Различия между методами merge и deepmerge](TODO)                                                                        | `'merge' /                                                                                                                                                  'deepmerge'` | `enum`                                                                              |  `merge` |

Пример конфигурации:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "patch-endpoint-response-schema",
            config: {
                endpointDescriptor: 'GET /api/list',
                correction: '[].status',
                schemaDiff: {
                    enum: ['foo', 'bar'],
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
            rule: "patch-endpoint-response-schema",
            config: {
                endpointDescriptor: 'GET /api/list',
                correction: '[].status',
                code: 200,
                contentType: 'application/json',
                schemaDiff: {
                    enum: ['foo', 'bar'],
                },
                patchMethod: 'deepmerge'
            },
        }
        // ... other rules
    ]
}
```