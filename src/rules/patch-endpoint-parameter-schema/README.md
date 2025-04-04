# patch-endpoint-parameter-schema

Правило для изменения схемы параметра эндпоинта или компонента параметра в OpenAPI спецификации.

## Config

| Параметр | Описание | Пример | Типизация | Дефолтное |
|----------|-----------|---------|-----------|-----------|
| `endpointDescriptor` | [**опциональный**] Описание эндпоинта для поиска параметра | `{ path: "/pets", method: "get" }` | `EndpointDescriptorConfig` | - |
| `parameterDescriptor` | [**обязательный**] Описание параметра для поиска | `{ name: "petId", in: "path" }` | `EndpointParameterWithCorrectionDescriptorConfig` | - |
| `patchMethod` | [**опциональный**] Метод применения изменений | `"merge"` | `"merge" \| "replace"` | `"merge"` |
| `schemaDiff` | [**опциональный**] Изменения для схемы параметра | `{ type: "string" }` | `OpenAPISchemaConfig` | - |
| `objectDiff` | [**опциональный**] Изменения для самого параметра | `{ required: true }` | `{ name?: string, in?: string, required?: boolean }` | - |

Пример конфигурации:

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-parameter-schema",
            config: {
                endpointDescriptor: {
                    path: "/pets/{petId}",
                    method: "get"
                },
                parameterDescriptor: {
                    name: "petId",
                    in: "path",
                    correction: "schema"
                },
                patchMethod: "merge",
                schemaDiff: {
                    type: "string",
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

## Motivation

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
                endpointDescriptor: {
                    path: "/pets/{petId}",
                    method: "get"
                },
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