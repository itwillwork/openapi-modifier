### 1. Необходимо заменить/доуточнить content-type `*/*` на что-то более конкртеное для кодегерации типизации

<a name="custom_anchor_motivation_1"></a>

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
            '*/*':
              schema:
                type: 'object'
```
**Нужно заменить `*/*` на `application/json`.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `change-content-type`:

```js
module.exports = {
    pipeline: [
        {
            rule: "change-content-type",
            config: {
              "*/*": "application/json"
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

### 2. Допущена опечатка в content-type 

<a name="custom_anchor_motivation_2"></a>

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
            'json':
              schema:
                type: 'object'
```
**Нужно заменить `json` на `application/json`.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `change-content-type`:

```js
module.exports = {
    pipeline: [
        {
            rule: "change-content-type",
            config: {
              "json": "application/json"
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
