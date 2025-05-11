| Параметр    | Описание                                                                                 | Пример                                                                       | Типизация                                 | Дефолтное                                |
| -------- |------------------------------------------------------------------------------------------|------------------------------------------------------------------------------|-------------------------------------------|------------------------------------------|
| `descriptor`  | [**обязательный**] Описание компонента для модификации. [Подробнее про различия между простым и объектным дескриптором компонента с коррекцией]({{{rootPath}}}docs/descriptor{{{langPostfix}}}.md) | `"Pet.name"` или `{"componentName": "Pet", "correction": "properties.name"}` | `ComponentWithCorrectionDescriptorConfig` | - |
| `patchMethod`  | Метод применения патча. [Подробнее про различия между методами merge и deepmerge]({{{rootPath}}}docs/merge-vs-deepmerge{{{langPostfix}}}.md)  | `"merge"`                                                                    | `"merge" \ "deepmerge"`                   | `"merge"` |
| `schemaDiff`  | [**обязательный**] Схема для патча. [Подробные примеры спецификаций для OpenAPI]({{{rootPath}}}docs/schema-diff{{{langPostfix}}}.md)                          | `{"type": "string", "description": "New description"}`                       | `OpenAPISchema`                           | -                                        |

> [!IMPORTANT]
> Тонкости задачния параметра `descriptor`:
> - не предусмотрен переход по $ref'ам. Потому что может вызвать не преднамеренное изменение в общих компонентах, и тем самым создать не ожиданное изменение в другом месте спецификации. В таком случае лучше модифицировать напрямую ту сущность на которую ссылается $ref;
> - если необходим переход по элементам массива - нужно доуточнение в `descriptor` (соотвтественно `[]`), например, `TestSchemaDTO[].test`
> - если необходим переход по oneOf, allOf, anyOf нужно доуточнение в `descriptor` (соотвтественно `oneOf[{number}]`, `allOf[{number}]` или `anyOf[{number}]`), например, `TestObjectDTO.oneOf[1].TestSchemaDTO`, `TestObjectDTO.allOf[1].TestSchemaDTO` или  `TestObjectDTO.anyOf[1].TestSchemaDTO`;

Пример конфигурации:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "patch-component-schema",
            config: {
                descriptor: 'TestDTO',
                schemaDiff: {
                    type: 'string',
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
            rule: "patch-component-schema",
            config: {
                descriptor: 'TestObjectDTO.oneOf[0].TestArraySchemaDTO[]',
                schemaDiff: {
                    type: 'string',
                    enum: ['foo', 'bar'],
                },
                patchMethod: 'deepmerge',
            },
        }
        // ... other rules
    ]
}
```
