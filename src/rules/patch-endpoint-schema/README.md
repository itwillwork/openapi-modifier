# patch-endpoint-schema

Правило для патчинга схемы эндпоинта в OpenAPI спецификации. Позволяет модифицировать схему конкретного эндпоинта с помощью различных методов патчинга.

## Config

| Параметр | Описание | Пример | Типизация | Дефолтное |
|----------|-----------|---------|------------|-----------|
| `endpointDescriptor` | [**обязательный**] Описание эндпоинта для патчинга | `{ path: "/pets", method: "get" }` | `{ path: string, method: string }` | - |
| `endpointDescriptorCorrection` | Путь к конкретному полю в схеме эндпоинта для патчинга | `"responses.200.content.application/json.schema"` | `string` | - |
| `patchMethod` | [**обязательный**] Метод патчинга | `"merge"` | `"merge" \| "replace" \| "remove"` | - |
| `schemaDiff` | [**обязательный**] Схема для патчинга | `{ type: "object", properties: { ... } }` | `object` | - |

Пример конфигурации:

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-schema",
            config: {
                endpointDescriptor: {
                    path: "/pets",
                    method: "get"
                },
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

<a name="custom_anchor_motivation_1"></a>
### 1. Необходимо добавить новое поле в схему ответа эндпоинта

Практический пример:

**В файле `openapi.yaml`** документация на endpoint выглядит так:

```yaml
paths:
  /pets:
    get:
      summary: List all pets
      responses:
        200:
          content:
            'application/json':
              schema:
                type: 'object'
                properties:
                  id:
                    type: 'integer'
```

**Нужно добавить поле `name` в схему ответа.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `patch-endpoint-schema`:

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-schema",
            config: {
                endpointDescriptor: {
                    path: "/pets",
                    method: "get"
                },
                patchMethod: "merge",
                schemaDiff: {
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

**После применения правила**, файл `openapi.yaml` выглядит так:

```yaml
paths:
  /pets:
    get:
      summary: List all pets
      responses:
        200:
          content:
            'application/json':
              schema:
                type: 'object'
                properties:
                  id:
                    type: 'integer'
                  name:
                    type: 'string'
```

<a name="custom_anchor_motivation_2"></a>
### 2. Необходимо заменить схему конкретного поля в ответе

Практический пример:

**В файле `openapi.yaml`** документация на endpoint выглядит так:

```yaml
paths:
  /pets:
    get:
      summary: List all pets
      responses:
        200:
          content:
            'application/json':
              schema:
                type: 'object'
                properties:
                  status:
                    type: 'string'
                    enum: ['active', 'inactive']
```

**Нужно изменить схему поля `status`.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `patch-endpoint-schema`:

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-schema",
            config: {
                endpointDescriptor: {
                    path: "/pets",
                    method: "get"
                },
                endpointDescriptorCorrection: "responses.200.content.application/json.schema.properties.status",
                patchMethod: "replace",
                schemaDiff: {
                    type: "string",
                    enum: ["active", "inactive", "pending"]
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
    get:
      summary: List all pets
      responses:
        200:
          content:
            'application/json':
              schema:
                type: 'object'
                properties:
                  status:
                    type: 'string'
                    enum: ['active', 'inactive', 'pending']
``` 