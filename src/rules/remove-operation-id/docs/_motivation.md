<a name="custom_anchor_motivation_1"></a>
### 1. Необходимо удалить operationId из всех операций для улучшения читаемости спецификации

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

<a name="custom_anchor_motivation_2"></a>
### 2. Необходимо удалить operationId из всех операций, кроме определенных

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
  /pets/{id}:
    get:
      operationId: getPetById
      summary: Get pet by id
      responses:
        200:
          content:
            'application/json':
              schema:
                type: 'object'
```

**Нужно удалить operationId из всех операций, кроме `getPets`.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `remove-operation-id`:

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-operation-id",
            config: {
                ignore: ["getPets"]
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
      operationId: getPets
      summary: List all pets
      responses:
        200:
          content:
            'application/json':
              schema:
                type: 'object'
  /pets/{id}:
    get:
      summary: Get pet by id
      responses:
        200:
          content:
            'application/json':
              schema:
                type: 'object'
``` 