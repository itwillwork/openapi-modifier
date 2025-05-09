<a name="custom_anchor_motivation_1"></a>
### 1. Необходимо удалить устаревшие компоненты из спецификации

Практический пример:

**В файле `openapi.yaml`** есть устаревший компонент:

```yaml
components:
  schemas:
    OldPet:
      deprecated: true
      description: "This schema is deprecated, use Pet instead"
      type: object
      properties:
        name:
          type: string
```

**Нужно удалить этот компонент.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `remove-deprecated`:

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-deprecated",
            config: {
                showDeprecatedDescriptions: true
            },
        }
    ]
}
```

**После применения правила**, компонент `OldPet` будет удален из спецификации.

<a name="custom_anchor_motivation_2"></a>
### 2. Необходимо удалить устаревшие эндпоинты из спецификации

Практический пример:

**В файле `openapi.yaml`** есть устаревший эндпоинт:

```yaml
paths:
  /old-pets:
    get:
      deprecated: true
      description: "This endpoint is deprecated, use /pets instead"
      summary: List all old pets
      responses:
        200:
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/OldPet'
```

**Нужно удалить этот эндпоинт.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `remove-deprecated`:

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-deprecated",
            config: {
                showDeprecatedDescriptions: true
            },
        }
    ]
}
```

**После применения правила**, эндпоинт `/old-pets` будет удален из спецификации.
