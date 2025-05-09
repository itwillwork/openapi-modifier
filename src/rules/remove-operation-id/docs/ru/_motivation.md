<a name="custom_anchor_motivation_1"></a>
### 1. Необходимо удалить operationId из всех операций для генерации TypeScript типов

Практический пример:

**В файле `openapi.yaml`** документация на endpoint выглядит так:

```yaml
paths:
  /pets:
    get:
      operationId: getPets
      summary: List all pets
      responses:
        200:
          content:
            'application/json':
              schema:
                type: 'object'
```

**Нужно удалить operationId из всех операций.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `remove-operation-id`:

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-operation-id",
            config: {
                ignore: []
            },
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
```
