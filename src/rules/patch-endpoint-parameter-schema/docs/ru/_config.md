| Параметр              | Описание                                                                                                               | Пример                                                                                                                                                                 | Типизация                                                                           | Дефолтное    |
|-----------------------|------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|--------------|
| `endpointDescriptor`  | [**обязательный**] Указание в каком endpoint нужно поменять схему параметра запроса.                                   | `'GET /api/list'`                                                                                                                                                     | `EndpointDescriptorConfig`                                                                            |              |
| `parameterDescriptor` | [**обязательный**] Указание какой параметр запроса, на который ссылается `endpointDescriptor`, нужно поменять.         | `'TestSchemaDTO'`, `'TestSchemaDTO.test'`, `'TestSchemaDTO[].testField'`,  `'TestObjectDTO.oneOf[1]'`, `'TestObjectDTO.allOf[1]'` или  `'TestObjectDTO.anyOf[1].testField'`        | `string`                                                                            |              |
| `schemaDiff`          | Изменения для схемы параметра [Подробные примеры спецификаций для OpenAPI]({{{rootPath}}}docs/schema-diff{{{langPostfix}}}.md)                                                              | `{type: "number"}`                                                                                                   | `OpenAPISchema`                                                                     |              |
| `objectDiff`          | Изменения для самого параметра                                                                                         | `{ required: true }`                                                                                                    | `{name?: string; in?: 'query' / 'header' / 'path' / 'cookie'; required?: boolean;}` |              |
| `patchMethod`         | Метод применения изменений, указанных в `objectDiff` и `schemaDiff`. [Подробнее про различия между методами merge и deepmerge]({{{rootPath}}}docs/merge-vs-deepmerge{{{langPostfix}}}.md) | `"merge"` | `"merge" \ "deepmerge"` | `"merge"` |

Пример конфигурации:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "patch-endpoint-parameter-schema",
            config: {
                endpointDescriptor: 'GET /api/list',
                parameterDescriptor: {
                    name: 'test',
                    in: 'query',
                },
                schemaDiff: {
                    enum: ['foo', 'bar'],
                }
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
            rule: "patch-endpoint-parameter-schema",
            config: {
                endpointDescriptor: 'GET /api/list',
                parameterDescriptor: {
                    name: 'test',
                    in: 'path',
                },
                schemaDiff: {
                    type: 'string',
                    enum: ['foo', 'bar'],
                },
                objectDiff: {
                    name: 'newTest',
                    in: 'query',
                    required: true,
                },
                patchMethod: 'deepmerge',
            },
        }
        // ... other rules
    ]
}
```