## remove-max-items

Убирает maxItems из всех сущностей.

### Конфигурация

| Параметр | Описание |
| -------- | :------: |

Пример конфигурации:

```js
{
}
```

### Пример использования

**В конфиге** `openapi-modifier-config.js` добавьте правило `remove-max-items`:

```json
module.exports = {
    "rules": [
        {
            "name": "remove-max-items"
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
      maxItems: 1
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
