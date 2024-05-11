## filter-endpoints

Фильтрует endpoints по path и методу

### Конфигурация

| Параметр           |                     Описание                     |
| ------------------ | :----------------------------------------------: |
| enabled            |  Включенные endpoint'ы, которые нужно сохранить  |
| enabled.path       |    path endpoint'а (например, /pets или т.п.)    |
| enabled.method     | method endpoint'а (например, GET, POST или т.п.) |
| enabledPathRegExp  |  Включенные endpoint'ы, которые нужно сохранить  |
| disabled           |  Выключенные endpoint'ы, которые нужно удалить   |
| disabled.path      |    path endpoint'а (например, /pets или т.п.)    |
| disabled.method    | method endpoint'а (например, GET, POST или т.п.) |
| disabledPathRegExp |  Выключенные endpoint'ы, которые нужно удалить   |

Пример конфигурации:

```js
{
  enabled: [
      {
          path: '/pets',
          method: 'GET',
      },
  ],
}
```

### Пример использования

**В конфиге** `openapi-modifier-config.js` добавьте правило `remove-max-items`:

```json
module.exports = {
    "rules": [
        {
            "name": "filter-endpoints",
            "config": {
              enabled: [
                {
                  path: '/pets',
                  method: 'GET',
                },
              ],
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
        200:
          content:
            '*/*':
              schema:
                type: 'object'
  /test/pets:
    get:
      summary: Test endpoint
      responses:
        200:
          content:
            '*/*':
              schema:
                type: 'object'
```

**После применения правила**, файл `openapi.yaml` выглядит так:

```yaml
paths:
  /pets:
    get:
      summary: List all pets
      responses:
        200:
          content:
            '*/*':
              schema:
                type: 'object'
```
