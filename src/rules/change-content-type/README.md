## change-content-type

Изменяет content-type в соответствии со словарем.

### Конфигурация

| Параметр |                 Описание                 |
|----------|:----------------------------------------:|
| map      | Словарь замены                           |

Пример конфигурации:
```js
{
  map: {
    "*/*": "application/json"
  }
}
```

### Пример использования

**В конфиге** `openapi-modifier-config.js` добавьте правило `remove-max-items`:
```json
module.exports = {
    "rules": [
        {
            "name": "change-content-type",
            "config": {
              "*/*": "application/json"
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
      responses:
        403: 
          content:
            "*/*":
              schema:
                type: "object"
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
            "application/json":
              schema:
                type: "object"
```
