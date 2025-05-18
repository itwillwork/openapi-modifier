| Параметр                       | Описание                                               | Пример | Типизация | Дефолтное     |
|--------------------------------|--------------------------------------------------------|---------|------------|---------------|
| `endpointDescriptor`           | [**обязательный**] Описание эндпоинта для патчинга     | `{ path: "/pets", method: "get" }` | `{ path: string, method: string }` | -             |
| `endpointDescriptorCorrection` | Путь к конкретному полю в схеме эндпоинта для патчинга | `"responses.200.content.application/json.schema"` | `string` | -             |
| `schemaDiff`                   | [**обязательный**] Необходимое изменение в формате OpenAPI. [Подробные примеры спецификаций для OpenAPI]({{{rootPath}}}docs/schema-diff{{{langPostfix}}}.md)              | `{ type: "object", properties: { ... } }` | `OpenAPISchema` | -             |
| `patchMethod`                    | Метод применения изменений [Подробнее про различия между методами merge и deepmerge]({{{rootPath}}}docs/merge-vs-deepmerge{{{langPostfix}}}.md)                                                                       | `"merge"` | `"merge" \ "deepmerge"` | `"merge"` |

Пример конфигурации:

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-schema",
            config: {
                endpointDescriptor: "GET /pets", // указываем эндпоинт, который нужно изменить
                patchMethod: "merge", // используем метод merge для применения изменений
                schemaDiff: {
                    "security": [ // добавляем секцию security к схеме
                        {
                            "bearerAuth": []
                        }
                    ]
                }
            }
        }
    ]
}
```

Пример более детальной конфигурации:

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-schema",
            config: {
                patchMethod: 'merge',
                endpointDescriptor: "GET /pets",
                endpointDescriptorCorrection: 'responses.200.content.*/*.schema',
                schemaDiff: {
                    enum: ['3', '4'],
                },
            }
        }
    ]
}
```
