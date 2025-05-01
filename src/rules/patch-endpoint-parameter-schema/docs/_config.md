| Параметр                    | Описание                                                                                                               | Пример                                                                                                                                                                 | Типизация                                                                           | Дефолтное    |
|-----------------------------|------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|--------------|
| `endpointDescriptor`                     | [**обязательный**] Указание в каком endpoint нужно поменять схему параметра запроса.                                   | `'GET /api/list'`                                                                                                                                                     | `string`                                                                            |              |
| `parameterDescriptor`                     | [**обязательный**] Указание какой параметр запроса, на который ссылается `endpointDescriptor`, нужно поменять.         | `TestSchemaDTO`, `TestSchemaDTO.test`, `TestSchemaDTO[].testField`,  `TestObjectDTO.oneOf[1]`, `TestObjectDTO.allOf[1]` или  `TestObjectDTO.anyOf[1].testField`        | `string`                                                                            |              |
| `schemaDiff`                     | Изменения для схемы параметра [Примеры патчей схем](TODO)                                                              | `{type: "number"}`                                                                                                   | `OpenAPISchema`                                                                     |              |
| `objectDiff`                     | Изменения для самого параметра                                                                                         | `{ required: true }`                                                                                                    | `{name?: string; in?: 'query' / 'header' / 'path' / 'cookie'; required?: boolean;}` |              |
| `patchMethod`                    | Метод применения изменений, указанных в `objectDiff` и `schemaDiff`. [Различия между методами merge и deepmerge](TODO) | `'merge' /                                                                                                                                                  'deepmerge'` | `enum`                                                                              |  `merge` |

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
                    type: 'string',
                    enum: ['foo', 'bar'],
                },
                objectDiff: {
                    required: true,
                }
            },
        }
        // ... other rules
    ]
}
```

или можно указать более детально что нужно поменять в общем компоненте

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
                patchMethod: 'deepmerge',
                schemaDiff: {
                    type: 'string',
                    enum: ['foo', 'bar'],
                },
                objectDiff: {
                    name: 'newTest',
                    in: 'query',
                    required: true,
                }
            },
        }
        // ... other rules
    ]
}
```

**Если необходимо изменить несколько спецификаций**, вы можете использовать несколько раз данное правило в общем пайлайне конфигурации.