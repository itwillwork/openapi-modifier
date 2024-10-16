| Параметр                    | Описание                                                                                                                            | Пример                                                                                                                                                                  | Типизация                                                                           | Дефолтное    |
|-----------------------------|-------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|--------------|
| `endpointDescriptor`                     | [**обязательный**] Указание в каком endpoint нужно поменять схему параметра запроса.                                                | `'GET /api/list'`                                                                                                                                                      | `string`                                                                            |              |
| `parameterDescriptor`                     | [**обязательный**] Указание какой параметр запроса, на который ссылается `endpointDescriptor`, нужно поменять.                      | `TestSchemaDTO`, `TestSchemaDTO.test`, `TestSchemaDTO[].testField`,  `TestObjectDTO.oneOf[1]`, `TestObjectDTO.allOf[1]` или  `TestObjectDTO.anyOf[1].testField`         | `string`                                                                            |              |
| `schemaDiff`                     | Необходимое изменение в формате OpenAPI для **схемы значения** параметра на которую указывает `parameterDescriptor` в спецификации. | `{type: "number"}` или см. больше примеров OpenAPISchema TODO ссылка                                                                                                    | `OpenAPISchema`                                                                     |              |
| `objectDiff`                     | Необходимое изменение в формате OpenAPI для **схемы** параметра на которую указывает `parameterDescriptor` в спецификации.                                    | `{type: "number"}` или см. больше примеров OpenAPISchema TODO ссылка                                                                                                    | `{name?: string; in?: 'query' / 'header' / 'path' / 'cookie'; required?: boolean;}` |              |
| `patchMethod`                    | Стратегия слияния схем указанных в `objectDiff` и `schemaDiff`.                                                                     | `'merge' /                                                                                                                                                  'deepmerge'` | `enum`                                                                              |  `merge` |

Подробнее про формат `schemaDiff` и `OpenAPISchema` TODO ссылка

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