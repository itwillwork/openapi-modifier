| Параметр    | Описание                                                                                                   | Пример                                                                       | Типизация                                        | Дефолтное                                |
| -------- |------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------|--------------------------------------------------|------------------------------------------|
| `descriptor`  | [**обязательный**] Описание компонента для модификации. [Подробнее про descriptor](TODO)                   | `"Pet.name"` или `{"componentName": "Pet", "correction": "properties.name"}` | `string | ComponentWithCorrectionDescriptorConfig` | - |
| `patchMethod`  | [**обязательный**] Метод применения патча. [Подробнее про различия между методами merge и deepmerge](TODO) | `"merge"`                                                                    | `"merge" \                                       | "replace"`                               | `"merge"` |
| `schemaDiff`  | [**обязательный**] Схема для патча. [Примеры патчей](TODO)                                                 | `{"type": "string", "description": "New description"}`                       | `OpenAPISchemaConfig`                            | -                                        |

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

или можно указать более детально что нужно поменять в общем компоненте

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "patch-component-schema",
            config: {
                patchMethod: 'deepmerge',
                descriptor: 'TestObjectDTO.oneOf[0].TestArraySchemaDTO[]',
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