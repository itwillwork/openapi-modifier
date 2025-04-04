# patch-endpoint-response-schema

Правило для изменения схемы ответа эндпоинта путем применения патча к существующей схеме.

## Config

| Параметр | Описание | Пример | Типизация | Дефолтное |
|----------|-----------|---------|------------|-----------|
| `endpointDescriptor` | [**обязательный**] Описание эндпоинта | `{"path": "/pets", "method": "get"}` | `EndpointDescriptorConfig` | - |
| `code` | Код ответа для модификации | `"200"` | `string` | - |
| `contentType` | Тип контента для модификации | `"application/json"` | `string` | - |
| `correction` | Путь к свойству схемы для модификации | `"properties.items"` | `string` | - |
| `patchMethod` | [**обязательный**] Метод патчинга | `"merge"` | `"merge" \| "replace"` | `"merge"` |
| `schemaDiff` | [**обязательный**] Схема для патчинга | `{"type": "object", "properties": {...}}` | `OpenAPISchemaConfig` | - |

Пример конфигурации:

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-response-schema",
            config: {
                endpointDescriptor: {
                    path: "/pets",
                    method: "get"
                },
                code: "200",
                contentType: "application/json",
                patchMethod: "merge",
                schemaDiff: {
                    type: "object",
                    properties: {
                        items: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "string" },
                                    name: { type: "string" }
                                }
                            }
                        }
                    }
                }
            }
        }
    ]
}
```

## Motivation

### 1. Необходимо обновить схему ответа эндпоинта

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
                  items:
                    type: 'array'
                    items:
                      type: 'object'
                      properties:
                        id: { type: 'string' }
                        name: { type: 'string' }
```

**Нужно добавить новое поле `description` в схему каждого элемента массива.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `patch-endpoint-response-schema`:

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-response-schema",
            config: {
                endpointDescriptor: {
                    path: "/pets",
                    method: "get"
                },
                code: "200",
                contentType: "application/json",
                correction: "properties.items.items.properties",
                patchMethod: "merge",
                schemaDiff: {
                    description: { type: "string" }
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
                  items:
                    type: 'array'
                    items:
                      type: 'object'
                      properties:
                        id: { type: 'string' }
                        name: { type: 'string' }
                        description: { type: 'string' }
```

### 2. Необходимо полностью заменить схему ответа

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
                  items:
                    type: 'array'
                    items:
                      type: 'object'
                      properties:
                        id: { type: 'string' }
                        name: { type: 'string' }
```

**Нужно полностью заменить схему ответа на новую.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `patch-endpoint-response-schema`:

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-response-schema",
            config: {
                endpointDescriptor: {
                    path: "/pets",
                    method: "get"
                },
                code: "200",
                contentType: "application/json",
                patchMethod: "replace",
                schemaDiff: {
                    type: "object",
                    properties: {
                        data: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "string" },
                                    name: { type: "string" },
                                    description: { type: "string" }
                                }
                            }
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
                  data:
                    type: 'array'
                    items:
                      type: 'object'
                      properties:
                        id: { type: 'string' }
                        name: { type: 'string' }
                        description: { type: 'string' }
``` 