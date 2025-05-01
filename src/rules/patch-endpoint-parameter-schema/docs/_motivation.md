### 1. Изменение схемы параметра эндпоинта

Практический пример:

**В файле `openapi.yaml`** параметр эндпоинта выглядит так:

```yaml
paths:
  /pets/{petId}:
    get:
      parameters:
        - name: petId
          in: path
          schema:
            type: string
```

**Нужно изменить схему параметра, добавив формат UUID и сделать его обязательным.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `patch-endpoint-parameter-schema`:

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-parameter-schema",
            config: {
                endpointDescriptor: "GET /pets/{petId}",
                parameterDescriptor: {
                    name: "petId",
                    in: "path"
                },
                schemaDiff: {
                    format: "uuid"
                },
                objectDiff: {
                    required: true
                }
            }
        }
    ]
}
```

**После применения правила**, файл `openapi.yaml` выглядит так:

```yaml
paths:
  /pets/{petId}:
    get:
      parameters:
        - name: petId
          in: path
          required: true
          schema:
            type: string
            format: uuid
```

### 2. Изменение схемы компонента параметра

Практический пример:

**В файле `openapi.yaml`** компонент параметра выглядит так:

```yaml
components:
  parameters:
    PetIdParam:
      name: petId
      in: path
      schema:
        type: string
```

**Нужно изменить схему компонента параметра, добавив формат UUID.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `patch-endpoint-parameter-schema`:

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-parameter-schema",
            config: {
                parameterDescriptor: {
                    name: "petId",
                    in: "path"
                },
                schemaDiff: {
                    format: "uuid"
                }
            }
        }
    ]
}
```

**После применения правила**, файл `openapi.yaml` выглядит так:

```yaml
components:
  parameters:
    PetIdParam:
      name: petId
      in: path
      schema:
        type: string
        format: uuid
``` 