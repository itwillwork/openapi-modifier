## remove-unused-components

Удаляет параметр из endpoint'а

### Мотивация

После применений правил `filter-endpoint`, `filter-by-content-tpye`, `patch-schemas` и т.п. Некоторые компоненты могут быть больше не используемыми, и их лучше удалить.

### Конфигурация

| Параметр | Описание |
| -------- | :------: |

Пример конфигурации:

```js
{
}
```

### Пример использования

**В конфиге** `openapi-modifier-config.js` добавьте правило `remove-unused-components`:

```json
module.exports = {
  "rule": {}
}
```

**До применения правила**, файл `openapi.yaml` выглядит так:

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
  /pets:
    get:
      summary: List all pets
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

Из схемы исчез компонент `Pet`.
