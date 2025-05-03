[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# patch-endpoint-parameter-schema

Правило позволяет модифицировать схему параметров эндпоинтов в OpenAPI спецификации. 

## Конфигурация

| Параметр              | Описание                                                                                                               | Пример                                                                                                                                                                 | Типизация                                                                           | Дефолтное    |
|-----------------------|------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|--------------|
| `endpointDescriptor`  | [**обязательный**] Указание в каком endpoint нужно поменять схему параметра запроса.                                   | `'GET /api/list'`                                                                                                                                                     | `string`                                                                            |              |
| `parameterDescriptor` | [**обязательный**] Указание какой параметр запроса, на который ссылается `endpointDescriptor`, нужно поменять.         | `TestSchemaDTO`, `TestSchemaDTO.test`, `TestSchemaDTO[].testField`,  `TestObjectDTO.oneOf[1]`, `TestObjectDTO.allOf[1]` или  `TestObjectDTO.anyOf[1].testField`        | `string`                                                                            |              |
| `schemaDiff`          | Изменения для схемы параметра [Примеры патчей схем](TODO)                                                              | `{type: "number"}`                                                                                                   | `OpenAPISchema`                                                                     |              |
| `objectDiff`          | Изменения для самого параметра                                                                                         | `{ required: true }`                                                                                                    | `{name?: string; in?: 'query' / 'header' / 'path' / 'cookie'; required?: boolean;}` |              |
| `patchMethod`         | Метод применения изменений, указанных в `objectDiff` и `schemaDiff`. [Различия между методами merge и deepmerge](TODO) | `'merge' /                                                                                                                                                  'deepmerge'` | `enum`                                                                              |  `merge` |

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

**Если необходимо изменить несколько спецификаций**, вы можете использовать несколько раз данное правило в общем пайлайне конфигурации.

## Мотивация

<a name="custom_anchor_motivation_1"></a>
### 1. Изменение схемы параметра эндпоинта

Практический пример:

**В файле `openapi.yaml`** параметр эндпоинта выглядит так:

```yaml
paths:
  /pets/{petId}:
    get:
      parameters:
        - name: petId
          in: path
          schema:
            type: string
```

**Нужно изменить схему параметра, добавив формат UUID и сделать его обязательным.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `patch-endpoint-parameter-schema`:

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-parameter-schema",
            config: {
                endpointDescriptor: "GET /pets/{petId}",
                parameterDescriptor: {
                    name: "petId",
                    in: "path"
                },
                schemaDiff: {
                    format: "uuid"
                },
                objectDiff: {
                    required: true
                }
            }
        }
    ]
}
```

**После применения правила**, файл `openapi.yaml` выглядит так:

```yaml
paths:
  /pets/{petId}:
    get:
      parameters:
        - name: petId
          in: path
          required: true
          schema:
            type: string
            format: uuid
```

<a name="custom_anchor_motivation_2"></a>
### 2. Изменение схемы компонента параметра

Практический пример:

**В файле `openapi.yaml`** компонент параметра выглядит так:

```yaml
components:
  parameters:
    PetIdParam:
      name: petId
      in: path
      schema:
        type: string
```

**Нужно изменить схему компонента параметра, добавив формат UUID.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `patch-endpoint-parameter-schema`:

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-parameter-schema",
            config: {
                parameterDescriptor: {
                    name: "petId",
                    in: "path"
                },
                schemaDiff: {
                    format: "uuid"
                }
            }
        }
    ]
}
```

**После применения правила**, файл `openapi.yaml` выглядит так:

```yaml
components:
  parameters:
    PetIdParam:
      name: petId
      in: path
      schema:
        type: string
        format: uuid
``` 

## Полезные ссылки

{{{links}}}
- [Примеры применения правила в тестах](./index.test.ts)  