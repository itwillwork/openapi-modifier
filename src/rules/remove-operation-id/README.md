## remove-operation-id

### Конфигурация

| Параметр |                 Описание                 |
|----------|:----------------------------------------:|
| ignore   | Список operationId которые нужно удалить |

Пример конфигурации:
```js
{
    "ignore": ["listPets"]
}
```

### Пример использования

**В конфиге** `openapi-modifier-config.js` добавьте правило `remove-operation-id`:
```json
module.exports = {
    "rules": [
        {
            "name": "remove-operation-id",
            "config": {
              "ignore": [] // list operationIds
            }
        }
    ]
}
```

**До применения правила**, файл `openapi.yaml` выглядит так:
```yaml
paths:
  /pets:
    get:
      summary: List all pets
      operationId: listPets
      tags:
        - pets
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
