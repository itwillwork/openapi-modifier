[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# patch-component-schema

Правило позволяет модифицировать схему компонента в OpenAPI спецификации.



## Конфигурация

| Параметр    | Описание                                                                                 | Пример                                                                       | Типизация                                        | Дефолтное                                |
| -------- |------------------------------------------------------------------------------------------|------------------------------------------------------------------------------|--------------------------------------------------|------------------------------------------|
| `descriptor`  | [**обязательный**] Описание компонента для модификации. [Подробнее про различия между простым и объектным дескриптором компонента с коррекцией](../../../docs/descriptor-ru.md) | `"Pet.name"` или `{"componentName": "Pet", "correction": "properties.name"}` | `string | ComponentWithCorrectionDescriptorConfig` | - |
| `patchMethod`  | Метод применения патча. [Подробнее про различия между методами merge и deepmerge](../../../docs/merge-vs-deepmerge-ru.md)  | `"merge"`                                                                    | `"merge" \                                       | "deepmerge"`                             | `"merge"` |
| `schemaDiff`  | [**обязательный**] Схема для патча. [Подробные примеры спецификаций для OpenAPI](../../../docs/schema-diff-ru.md)                          | `{"type": "string", "description": "New description"}`                       | `OpenAPISchemaConfig`                            | -                                        |

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

**Если необходимо изменить несколько спецификаций**, вы можете использовать несколько раз данное правило в общем пайлайне конфигурации.

## Мотивация

<a name="custom_anchor_motivation_1"></a>
### 1. Необходимо обновить описание конкретного свойства в схеме компонента

Практический пример:

**В файле `openapi.yaml`** схема компонента выглядит так:

```yaml
components:
  schemas:
    Pet:
      type: object
      properties:
        status:
          type: string
          enum:
            - status1
            - status2
```

**Нужно обновить описание свойства `type`, расширив enum дополнительными значениями.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `patch-component-schema`:

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-component-schema",
            config: {
                descriptor: "Pet.status",
                patchMethod: "deepmerge",
                schemaDiff: {
                    enum: ['status3', 'status4'],
                }
            },
        }
    ]
}
```

**После применения правила**, файл `openapi.yaml` выглядит так:

```yaml
components:
  schemas:
    Pet:
      type: object
      properties:
        status:
          type: string
          enum:
            - status1
            - status2
            - status3
            - status4
```

<a name="custom_anchor_motivation_2"></a>
### 2. Необходимо полностью заменить схему компонента

Практический пример:

**В файле `openapi.yaml`** схема компонента выглядит так:

```yaml
components:
  schemas:
    Pet:
      type: object
      properties:
        name:
          type: string
```

**Нужно полностью заменить схему компонента.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `patch-component-schema`:

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-component-schema",
            config: {
                descriptor: {
                    componentName: "Pet"
                },
                patchMethod: "merge",
                schemaDiff: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            description: "Pet id"
                        },
                        age: {
                            type: "integer",
                            description: "Pet age"
                        }
                    }
                }
            },
        }
    ]
}
```

**После применения правила**, файл `openapi.yaml` выглядит так:

```yaml
components:
  schemas:
    Pet:
      type: object
      properties:
        id:
          type: string
          description: Pet id
        age:
          type: integer
          description: Pet age
```

## Важные замечания

-

## Полезные ссылки

- [Примеры применения правила в тестах](./index.test.ts)  
- [Различия между простым и объектным дескриптором компонента с коррекцией](../../../docs/descriptor-ru.md)
- [Различия между методами merge и deepmerge](../../../docs/merge-vs-deepmerge-ru.md)
- [Примеры спецификаций для OpenAPI](../../../docs/schema-diff-ru.md)