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