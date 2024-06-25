## patch-endpoint-parameter-schema

Патчит параметр в endpoint'е через сливание или замену.

### Конфигурация

| Параметр                 |                       Описание                        |
| ------------------------ | :---------------------------------------------------: |
| descriptor.path          |               Path целевого endpoint'а                |
| descriptor.method        |               Метод целевого endpoint'а               |
| parameterDescriptor.name | Название параметра которым нужно сделать обязательным |
| parameterDescriptor.in   |    Где параметр используется в целевом endpoint'е     |
| required                 |            Будет ли параметр обязательным             |

Пример конфигурации:

```js
{
    descriptor: {
        path: "/pets",
        method: "GET",
    },
    parameterDescriptor: {
        name: "filter",
        in: "query",
    },

}
```

### Пример использования

**В конфиге** `openapi-modifier-config.js` добавьте правило `patch-parameter`:

```json
module.exports = {
  "rule": {
    descriptor: {
      path: "/pets",
      method: "GET"
    },
    parameterDescriptor: {
      name: "filter",
      in: "query"
    },
    "patchMethod": "",
    "scr"
  }
}
```

**До применения правила**, файл `openapi.yaml` выглядит так:

```yaml
paths:
  /pets:
    get:
      summary: List all pets
      tags:
        - pets
      parameters:
        - in: 'query'
          name: 'filter'
          required: false
          schema:
            format: 'int64'
            type: 'integer'
```

**После применения правила**, файл `openapi.yaml` выглядит так:

```yaml
paths:
  /pets:
    get:
      summary: List all pets
      tags:
        - pets
      parameters:
        - in: 'query'
          name: 'filter'
          required: true
          schema:
            format: 'int64'
            type: 'integer'
```
