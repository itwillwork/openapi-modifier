## remove-min-items

Убирает minItems из всех сущностей.

### Конфигурация

| Параметр |                 Описание                 |
|----------|:----------------------------------------:|

Пример конфигурации:
```js
{

}
```

### Пример использования

**В конфиге** `openapi-modifier-config.js` добавьте правило `remove-min-items`:
```json
module.exports = {
    "rules": [
        {
            "name": "remove-min-items"
        }
    ]
}
```

**До применения правила**, файл `openapi.yaml` выглядит так:
```yaml
components:
  schemas:
    ExmapleDTO:
      type: array
      minItems: 1
      items:
        type: number

```

**После применения правила**, файл `openapi.yaml` выглядит так:
```yaml
components:
  schemas:
    ExmapleDTO:
      type: array
      items:
        type: number
```
