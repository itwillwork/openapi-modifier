<a name="custom_anchor_motivation_1"></a>
### 1. Необходимо объединить несколько OpenAPI спецификаций в одну

Часто нужно добавить в OpenAPI будущие проектируемые API, которых еще нет в микросервисе, но формат API согласован и можно начать разрабатывать интерфейс.

Практический пример:

**В файле `openapi.yaml`** основная спецификация:

```yaml
openapi: 3.0.0
info:
  title: Main API
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

**В файле `additional-spec.yaml`** дополнительная спецификация:

```yaml
openapi: 3.0.0
info:
  title: Additional API
paths:
  /users:
    get:
      summary: List all users
      responses:
        200:
          content:
            'application/json':
              schema:
                type: 'object'
```

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `merge-openapi-spec`:

```js
module.exports = {
    pipeline: [
        {
            rule: "merge-openapi-spec",
            config: {
                path: "./additional-spec.yaml"
            },
        }
    ]
}
```

**После применения правила**, файл `openapi.yaml` будет содержать объединенную спецификацию:

```yaml
openapi: 3.0.0
info:
  title: Main API
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
  /users:
    get:
      summary: List all users
      responses:
        200:
          content:
            'application/json':
              schema:
                type: 'object'
```