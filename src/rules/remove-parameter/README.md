# remove-parameter

Удаляет параметр из эндпоинта или компонента в OpenAPI спецификации

## Config

| Параметр    | Описание                          | Пример                     | Типизация              | Дефолтное |
| -------- |-----------------------------------|----------------------------|------------------------|-----------|
| `endpointDescriptor`  | [**опциональный**] Описание эндпоинта, из которого нужно удалить параметр | `{"path": "/pets", "method": "get"}` | `EndpointDescriptorConfig` | `undefined` |
| `parameterDescriptor`  | [**опциональный**] Описание параметра, который нужно удалить | `{"name": "petId", "in": "path"}` | `EndpointParameterDescriptorConfig` | `undefined` |

Пример конфигурации:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "remove-parameter",
            config: {
                endpointDescriptor: {
                    path: "/pets/{petId}",
                    method: "get"
                },
                parameterDescriptor: {
                    name: "petId",
                    in: "path"
                }
            },
        }
        // ... other rules
    ]
}
```

## Motivation

<a name="custom_anchor_motivation_1"></a>
### 1. Необходимо удалить неиспользуемый параметр из эндпоинта

Практический пример:

**В файле `openapi.yaml`** документация на endpoint выглядит так:

```yaml
paths:
  /pets/{petId}:
    get:
      summary: Get pet by ID
      parameters:
        - name: petId
          in: path
          required: true
          schema:
            type: string
        - name: version
          in: query
          required: false
          schema:
            type: string
```

**Нужно удалить неиспользуемый параметр `version`.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `remove-parameter`:

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-parameter",
            config: {
                endpointDescriptor: {
                    path: "/pets/{petId}",
                    method: "get"
                },
                parameterDescriptor: {
                    name: "version",
                    in: "query"
                }
            },
        }
    ]
}
```

**После применения правила**, файл `openapi.yaml` выглядит так:

```yaml
paths:
  /pets/{petId}:
    get:
      summary: Get pet by ID
      parameters:
        - name: petId
          in: path
          required: true
          schema:
            type: string
```

<a name="custom_anchor_motivation_2"></a>
### 2. Необходимо удалить параметр из компонентов

Практический пример:

**В файле `openapi.yaml`** есть компонент с параметром:

```yaml
components:
  parameters:
    ApiKeyHeader:
      name: X-API-Key
      in: header
      required: true
      schema:
        type: string
```

**Нужно удалить компонент параметра `ApiKeyHeader`.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `remove-parameter`:

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-parameter",
            config: {
                parameterDescriptor: {
                    name: "X-API-Key",
                    in: "header"
                }
            },
        }
    ]
}
```

**После применения правила**, файл `openapi.yaml` выглядит так:

```yaml
components:
  parameters: {}
``` 