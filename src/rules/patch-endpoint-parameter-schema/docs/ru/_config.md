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
                endpointDescriptor: 'GET /api/list', // указываем эндпоинт, который нужно изменить
                parameterDescriptor: {
                    name: 'test', // указываем имя параметра
                    in: 'query', // указываем, что параметр находится в query
                },
                schemaDiff: {
                    enum: ['foo', 'bar'], // добавляем enum к параметру
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
                endpointDescriptor: 'GET /api/list', // указываем эндпоинт, который нужно изменить
                parameterDescriptor: {
                    name: 'test', // указываем имя параметра
                    in: 'query', // указываем, что параметр находится в query
                },
                schemaDiff: {
                    type: 'string', // меняем тип параметра на string
                    enum: ['foo', 'bar'], // добавляем enum к параметру
                },
                objectDiff: {
                    name: 'newTest',
                    in: 'query',
                    required: true, // делаем параметр обязательным
                },
                patchMethod: 'deepmerge' // используем метод deepmerge для глубокого слияния изменений
            },
        }
        // ... other rules
    ]
}
```