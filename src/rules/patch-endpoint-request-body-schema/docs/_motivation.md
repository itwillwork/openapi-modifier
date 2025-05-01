<a name="custom_anchor_motivation_1"></a>
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
                endpointDescriptor: "POST /pets",
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

<a name="custom_anchor_motivation_2"></a>
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
                endpointDescriptor: "POST /pets",
                contentType: "application/json",
                correction: "name",
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