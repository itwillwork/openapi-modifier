| Параметр                | Описание                                                                                                                                            | Пример                                                                                                                                                                   | Типизация       | Дефолтное |
|-------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------|-----------|
| `endpointDescriptor`    | [**обязательный**] Указание в каком endpoint нужно поменять схему параметра запроса.                                                                | `'GET /api/list'`                                                                                                                                                        | `EndpointDescriptorConfig`        |           |
| `correction`            | Путь к свойству схемы для модификации                                                                                                               | `"status"`                                                                                                                                                               | `string` | - |
| `code`                  | Указание к какому статус коду ответа нужно применить изменение. При отсутствии значения, будет применен к первому 2xx ответу.                       | `200`                                                                                                                                                                    | `number`        |  |
| `contentType`           | Указание к какому типу ответа (content-type) endpoint нужно применить изменение. При отсутствии значения, будут изменены все варианты типов ответов. | `'application/json'`                                                                                                                                                     | `string`        |  |
| `schemaDiff`            | [**обязательный**] Необходимое изменение в формате OpenAPI. [Подробные примеры спецификаций для OpenAPI]({{{rootPath}}}docs/schema-diff{{{langPostfix}}}.md)                                                             | `{type: "number"}`                                                                                                  | `OpenAPISchema` |           |
| `patchMethod`           | Метод применения изменений [Подробнее про различия между методами merge и deepmerge]({{{rootPath}}}docs/merge-vs-deepmerge{{{langPostfix}}}.md)                                                                        | `"merge"` | `"merge" \ "deepmerge"` | `"merge"` |

Пример конфигурации:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "patch-endpoint-response-schema",
            config: {
                endpointDescriptor: 'GET /api/list', // указываем эндпоинт, который нужно изменить
                correction: '[].status', // указываем путь к полю status в массиве ответа
                schemaDiff: {
                    enum: ['foo', 'bar'], // добавляем enum к полю status
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
                endpointDescriptor: 'GET /api/list', // указываем эндпоинт, который нужно изменить
                correction: '[].status', // указываем путь к полю status в массиве ответа
                code: 200, // указываем код ответа, для которого применяем изменения
                contentType: 'application/json', // указываем тип контента, для которого применяем изменения
                schemaDiff: {
                    enum: ['foo', 'bar'], // добавляем enum к полю status
                },
                patchMethod: 'deepmerge' // используем метод deepmerge для глубокого слияния изменений
            },
        }
        // ... other rules
    ]
}
```