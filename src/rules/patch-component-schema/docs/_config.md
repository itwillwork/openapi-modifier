| Параметр                    | Описание                                                                                                                                                              | Пример                                                                                                                                                                | Типизация       | Дефолтное    |
|-----------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------|--------------|
| `descriptor`                     | [**обязательный**] Указание в каком общем компоненте (возможно с доуточнением) нужно поменять схему. Подробнее про особенности дескрипторов читайте ниже. TODO ссылка | `TestSchemaDTO`, `TestSchemaDTO.test`, `TestSchemaDTO[].testField`,  `TestObjectDTO.oneOf[1]`, `TestObjectDTO.allOf[1]` или  `TestObjectDTO.anyOf[1].testField`       | `string`        |              |
| `schemaDiff`                     | Необходимое изменение в формате OpenAPI для схемы на которую указывает `descriptor` в спецификации.                                                                   | `{type: "number"}` или см. больше примеров OpenAPISchema TODO ссылка                                                                                                  | `OpenAPISchema` |              |
| `patchMethod`                    | Стратегия слияния схем указанных в `descriptor` и `schemaDiff`. Подробнее о стратегиях слияния на примерах. TODO ссылка                                                                                                      | `'merge'                                                                                                                                                 / 'deepmerge'` | `enum`          |  `merge` |

Подробнее про `descriptor`:
- не предусмотрен переход по $ref'ам. Потому что может вызвать не преднамеренное изменение в общих компонентах, и тем самым создать не ожиданное изменение в другом месте спецификации. В таком случае лучше модифицировать напрямую ту сущность на которую ссылается $ref;
- если необходим переход по элементам массива - нужно доуточнение в `descriptor` (соотвтественно `[]`), например, `TestSchemaDTO[].test`
- если необходим переход по oneOf, allOf, anyOf нужно доуточнение в `descriptor` (соотвтественно `oneOf[{number}]`, `allOf[{number}]` или `anyOf[{number}]`), например, `TestObjectDTO.oneOf[1].TestSchemaDTO`, `TestObjectDTO.allOf[1].TestSchemaDTO` или  `TestObjectDTO.anyOf[1].TestSchemaDTO`;

Подробнее про формат `schemaDiff` и `OpenAPISchema` TODO ссылка

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