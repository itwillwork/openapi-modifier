[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# patch-endpoint-response-schema

Правило позволяет модифицировать схему ответа (response schema) для эндпоинтов в OpenAPI спецификации. 

## Конфигурация

| Параметр                | Описание                                                                                                                                            | Пример                                                                                                                                                                   | Типизация       | Дефолтное |
|-------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------|-----------|
| `endpointDescriptor`    | [**обязательный**] Указание в каком endpoint нужно поменять схему параметра запроса.                                                                | `'GET /api/list'`                                                                                                                                                        | `string`        |           |
| `correction`            | Путь к свойству схемы для модификации                                                                                                               | `"status"`                                                                                                                                                               | `string` | - |
| `code`                  | Указание к какому статус коду ответа нужно применить изменение. При отсутствии значения, будет применен к первому 2xx ответу.                       | `200`                                                                                                                                                                    | `number`        |  |
| `contentType`           | Указание к какому типу ответа (content-type) endpoint нужно применить изменение. При отсутствии значения, будут изменены все варианты типов ответов. | `'application/json'`                                                                                                                                                     | `string`        |  |
| `schemaDiff`            | [**обязательный**] Необходимое изменение в формате OpenAPI. [Примеры патчей схем](TODO)                                                             | `{type: "number"}`                                                                                                  | `OpenAPISchema` |           |
| `patchMethod`           | Метод применения изменений [Различия между методами merge и deepmerge](TODO)                                                                        | `'merge' /                                                                                                                                                  'deepmerge'` | `enum`                                                                              |  `merge` |

Пример конфигурации:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "patch-endpoint-response-schema",
            config: {
                endpointDescriptor: 'GET /api/list',
                correction: '[].status',
                schemaDiff: {
                    enum: ['foo', 'bar'],
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
            rule: "patch-endpoint-response-schema",
            config: {
                endpointDescriptor: 'GET /api/list',
                correction: '[].status',
                code: 200,
                contentType: 'application/json',
                schemaDiff: {
                    enum: ['foo', 'bar'],
                },
                patchMethod: 'deepmerge'
            },
        }
        // ... other rules
    ]
}
```

**Если необходимо изменить несколько спецификаций**, вы можете использовать несколько раз данное правило в общем пайлайне конфигурации.

## Мотивация

<a name="custom_anchor_motivation_1"></a>
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
                endpointDescriptor: 'GET /pets',
                code: "200",
                contentType: "application/json",
                correction: "items[]",
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

<a name="custom_anchor_motivation_2"></a>
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
                endpointDescriptor: "get /pets",
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

## Полезные ссылки

{{{links}}}
- [Примеры применения правила в тестах](./index.test.ts)  