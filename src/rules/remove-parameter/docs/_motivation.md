<a name="custom_anchor_motivation_1"></a>
### 1. Необходимо удалить неиспользуемый параметр из эндпоинта, чтобы перестать его использовать и удалить в дальнейшем

Практический пример:

**В файле `openapi.yaml`** документация на endpoint выглядит так:

```yaml
paths:
  /pets/{petId}:
    get:
      summary: Get pet by ID
      parameters:
        - name: petId
          in: path
          required: true
          schema:
            type: string
        - name: version
          in: query
          required: false
          schema:
            type: string
```

**Нужно удалить неиспользуемый параметр `version`.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `remove-parameter`:

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-parameter",
            config: {
                endpointDescriptor: "GET /pets/{petId}",
                parameterDescriptor: {
                    name: "version",
                    in: "query"
                }
            },
        }
    ]
}
```

**После применения правила**, файл `openapi.yaml` выглядит так:

```yaml
paths:
  /pets/{petId}:
    get:
      summary: Get pet by ID
      parameters:
        - name: petId
          in: path
          required: true
          schema:
            type: string
```

<a name="custom_anchor_motivation_2"></a>
### 2. Необходимо удалить общий параметр, мешающий при генарации TypeScript типов

Практический пример:

**В файле `openapi.yaml`** есть компонент с параметром:

```yaml
components:
  parameters:
    ApiKeyHeader:
      name: X-API-Key
      in: header
      required: true
      schema:
        type: string
```

**Нужно удалить компонент параметра `ApiKeyHeader`.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `remove-parameter`:

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-parameter",
            config: {
                parameterDescriptor: {
                    name: "X-API-Key",
                    in: "header"
                }
            },
        }
    ]
}
```

**После применения правила**, файл `openapi.yaml` выглядит так:

```yaml
components:
  parameters: {}
``` 