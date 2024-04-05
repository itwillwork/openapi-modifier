## change-endpoints-basepath

Изменяет basepath у endpoint'ов в соответствии со словарем.

### Конфигурация

| Параметр |                 Описание                 |
|----------|:----------------------------------------:|
| map      | Словарь замены                           |

Пример конфигурации:
```js
{
  map: {
     "/api/v1": "/proxy",
  }
}
```

### Пример использования

**В конфиге** `openapi-modifier-config.js` добавьте правило `remove-max-items`:
```json
module.exports = {
  "rules": [
    {
      "name": "change-endpoints-basepath",
      "config": {
        map: {
          "/api/v1": "/proxy"
        }
      }
    }
  ]
}
```

**До применения правила**, файл `openapi.yaml` выглядит так:
```yaml
paths:
  /api/v1/pets:
    get:
      responses:
        200: 
          content:
            "*/*":
              schema:
                type: "object"
```

**После применения правила**, файл `openapi.yaml` выглядит так:
```yaml
paths:
  /proxy/pets:
    get:
      responses:
        200:
          content:
            "*/*":
              schema:
                type: "object"
```
