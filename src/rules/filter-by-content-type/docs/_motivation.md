<a name="custom_anchor_motivation_1"></a>
### 1. Необходимо оставить только определенные content-type для кодегерации типизации

Практический пример:

**В файле `openapi.yaml`** документация на endpoint выглядит так:

```yaml
paths:
  /pets:
    get:
      summary: List all pets
      responses:
        403:
          content:
            'application/xml':
              schema:
                type: 'number'
            'application/json':
              schema:
                type: 'object'
```
**Нужно удалить ответы/запросы в формате `application/xml`, который не используется приложением.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `filter-by-content-type`:

```js
module.exports = {
    pipeline: [
        {
            rule: "filter-by-content-type",
            config: {
                enabled: ["application/json"],
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
        403:
          content:
            'application/json':
              schema:
                type: 'object'
```

<a name="custom_anchor_motivation_2"></a>
### 2. Необходимо исключить определенные content-type

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
            'text/plain':
              schema:
                type: 'string'
```

**Нужно исключить `text/plain`.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `filter-by-content-type`:

```js
module.exports = {
    pipeline: [
        {
            rule: "filter-by-content-type",
            config: {
                disabled: ["text/plain"]
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