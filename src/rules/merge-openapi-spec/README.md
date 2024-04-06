## merge-openapi-spec

Добавляет в текущий openapi внешнюю документацию

### Мотивация

Часто нужно добавить в openapi будущие проектируемые API, которых еще нет в микросервисе, но оно согласовано.

### Конфигурация

| Параметр                 |                                     Описание                                     |
|--------------------------|:--------------------------------------------------------------------------------:|
| path                     | path до openapi файла (*.json, *.yaml, *.yml), который нужно добавить к текущему |

Пример конфигурации:

```js
{
    path: "./src/new-api-for-new-feature.yaml"
}
```

### Пример использования

**В конфиге** `openapi-modifier-config.js` добавьте правило `merge-openapi-spec`:

```json
module.exports = {
  path: "./src/new-api-for-new-feature.yaml"
}
```

В `new-api-for-new-feature.yaml` пишем yaml который нужно добавить к существующему.

**Файл `new-api-for-new-feature.yaml`**, следующую:
```
components:
  schemas:
    Pet:
      type: object
      required:
        - id
        - name
      properties:
        id:
          type: integer
          format: int64
        name:
          type: string
paths:
  /notifications:
    get:
      summary: Get all notifications
      responses:
        200:
          content:
            "*/*":
              schema:
                type: "array"
                items:
                  $ref: "#/components/schemas/Pet"
```

**До применения правила**, файл `openapi.yaml` выглядит так:

```yaml
paths:
  /pets:
    get:
      summary: List all pets
      responses:
        200:
          content:
            "*/*":
              schema:
                type: "object"
```

**После применения правила**, файл `openapi.yaml` выглядит так:

```yaml
components:
  schemas:
    Pet:
      type: object
      required:
        - id
        - name
      properties:
        id:
          type: integer
          format: int64
        name:
          type: string
paths:
  /notifications:
    get:
      summary: Get all notifications
      responses:
        200:
          content:
            "*/*":
              schema:
                type: "array"
                items:
                  $ref: "#/components/schemas/Pet"
  /pets:
    get:
      summary: List all pets
      responses:
        200:
          content:
            "*/*":
              schema:
                type: "object"
```
