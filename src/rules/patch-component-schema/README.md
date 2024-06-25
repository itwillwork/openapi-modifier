## patch-component-schema

Патчит сущности через сливание или замену.

Через присваивание undefined можно удалить поля.

Если используете ref, то необходимо сослаться на него!

### Конфигурация

| Параметр |           Описание            |
| -------- | :---------------------------: |
| merge    | Изменение происходит слиянием |
| replace  | Изменение происходит заменой  |

Пример конфигурации:

```js
{
    "merge": {
        "FilterDTO": {
            "properties": {
                "status": {
                    "type": "string"
                }
            }
        }
    },
    "replace": {
        "CounterDTO": {
            "type": "number"
        }
    },
}
```

### Пример использования

**В конфиге** `openapi-modifier-config.js` добавьте правило `patch-schemas`:

```json
module.exports = {
  "rules": [
    {
      "name": "patch-schemas",
      "config": {
        "merge": {
          "FilterDTO": {
            "required": [
              "status"
            ],
            "properties": {
              "status": {
                "type": "string"
              }
            }
          }
        },
        "replace": {
          "CounterDTO": {
            "type": "number"
          }
        }
      }
    }
  ]
}
```

**До применения правила**, файл `openapi.yaml` выглядит так:

```yaml
components:
  schemas:
    FilterDTO:
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
    CounterDTO:
      type: array
      maxItems: 100
      items:
        $ref: '#/components/schemas/Pet'
```

**После применения правила**, файл `openapi.yaml` выглядит так:

```yaml
paths:
  /pets:
    get:
      summary: List all pets
      tags:
        - pets
```
