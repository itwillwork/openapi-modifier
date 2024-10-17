| Параметр                    | Описание                                                                                                                                            | Пример                                                                                                                                                                   | Типизация       | Дефолтное |
|-----------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------|-----------|
| `endpointDescriptor`                    | [**обязательный**] Указание в каком endpoint нужно поменять схему параметра запроса.                                                                | `'GET /api/list'`                                                                                                                                                        | `string`        |           |
| `descriptor`                     | [**обязательный**] Указание к какой части response, на который ссылается `endpointDescriptor`, нужно поменять `schemaDiff`.                         | `test`, `[].testField`,  `oneOf[1]`, `allOf[1]` или  `anyOf[1].testField`                                                                                                | `string`        |           |
| `code`                    | Указание к какому статус коду ответа нужно применить изменение. При отсутствии значения, будет применен к первому 2xx ответу.                       | `200`                                                                                                                                                                    | `number`        |  |
| `contentType`                    | Указание к какому типу ответа (content-type) endpoint нужно применить изменение. При отсутствии значения, будут изменены все варианты типов ответов. | `'application/json'`                                                                                                                                                     | `string`        |  |
| `patchMethod`                    | Стратегия слияния схем. Подробнее о стратегиях слияния на примерах. TODO ссылка                                                                     | `'merge' /                                                                                                                                                  'deepmerge'` | `enum`          |  `merge` |
| `schemaDiff`                     | Необходимое изменение в формате OpenAPI на которую указывает `endpointDescriptor` и `descriptor` в спецификации.                                    | `{type: "number"}` или см. больше примеров OpenAPISchema TODO ссылка                                                                                                     | `OpenAPISchema` |           |

Подробнее про формат `schemaDiff` и `OpenAPISchema` TODO ссылка

Пример конфигурации:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "patch-endpoint-response-schema",
            config: {
                endpointDescriptor: 'GET /api/list',
                descriptor: 'foo.bar',
                schemaDiff: {
                    type: 'string',
                    enum: ['foo', 'bar'],
                },
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
            rule: "patch-endpoint-response-schema",
            config: {
                endpointDescriptor: 'GET /api/list',
                contentType: 'application/json',
                descriptor: 'foo.bar',
                code: 200,
                patchMethod: 'deepmerge',
                schemaDiff: {
                    type: 'string',
                    enum: ['foo', 'bar'],
                },
            },
        }
        // ... other rules
    ]
}
```

**Если необходимо изменить несколько спецификаций**, вы можете использовать несколько раз данное правило в общем пайлайне конфигурации.