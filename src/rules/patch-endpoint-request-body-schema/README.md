# patch-endpoint-request-body-schema

Правило для изменения схемы request body в OpenAPI спецификации. Позволяет модифицировать схему запроса для указанного эндпоинта.

## Config

| Параметр | Описание | Пример | Типизация | Дефолтное |
|----------|-----------|---------|------------|------------|
| `endpointDescriptor` | [**обязательный**] Описание эндпоинта | `"/pets"` или `{"path": "/pets", "method": "post"}` | `string \| {path: string, method: string}` | - |
| `contentType` | Тип контента для модификации | `"application/json"` | `string` | - |
| `correction` | Путь к полю в схеме для модификации | `"properties.name"` | `string` | - |
| `patchMethod` | [**обязательный**] Метод патчинга схемы | `"merge"` | `"merge" \| "replace"` | `"merge"` |
| `schemaDiff` | [**обязательный**] Изменения для применения к схеме | `{"type": "string"}` | `object` | - |

Пример конфигурации:

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-request-body-schema",
            config: {
                endpointDescriptor: "/pets",
                contentType: "application/json",
                patchMethod: "merge",
                schemaDiff: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string"
                        }
                    }
                }
            }
        }
    ]
}
```

## Motivation

### 1. Необходимость обновления схемы request body для конкретного эндпоинта

Практический пример:

**В файле `openapi.yaml`** документация на endpoint выглядит так:

```yaml
paths:
  /pets:
    post:
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
```

**Нужно обновить схему, добавив новое поле `age`.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `patch-endpoint-request-body-schema`:

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-request-body-schema",
            config: {
                endpointDescriptor: "/pets",
                contentType: "application/json",
                patchMethod: "merge",
                schemaDiff: {
                    properties: {
                        age: {
                            type: "number"
                        }
                    }
                }
            }
        }
    ]
}
```

**После применения правила**, файл `openapi.yaml` выглядит так:

```yaml
paths:
  /pets:
    post:
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                age:
                  type: number
```

### 2. Необходимость изменения конкретного поля в схеме

Практический пример:

**В файле `openapi.yaml`** документация на endpoint выглядит так:

```yaml
paths:
  /pets:
    post:
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                  description: Pet name
```

**Нужно изменить описание поля `name`.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `patch-endpoint-request-body-schema`:

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-request-body-schema",
            config: {
                endpointDescriptor: "/pets",
                contentType: "application/json",
                correction: "properties.name",
                patchMethod: "merge",
                schemaDiff: {
                    description: "Name of the pet"
                }
            }
        }
    ]
}
```

**После применения правила**, файл `openapi.yaml` выглядит так:

```yaml
paths:
  /pets:
    post:
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                  description: Name of the pet
``` 