## filter-by-content-type

Изменяет content-type в соответствии со словарем.

### Конфигурация

| Параметр |                    Описание                     |
|----------|:-----------------------------------------------:|
| enabled  | Включенные content-type которые нужно сохранить |
| disabled | Выключенные content-type которые нужно удалить  |

Пример конфигурации:
```js
{
  enabled: [],
  disabled: [],
}
```

### Пример использования

**В конфиге** `openapi-modifier-config.js` добавьте правило `remove-max-items`:
```json
module.exports = {
    "rules": [
        {
            "name": "filter-by-content-type",
            "config": {
              "disabled": ["multipart/form-data"],
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
            "multipart/form-data":
              schema:
                type: "number"
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
            "*/*":
              schema:
                type: "object"
```
