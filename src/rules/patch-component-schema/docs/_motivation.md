<a name="custom_anchor_motivation_1"></a>
### 1. Необходимо обновить описание конкретного свойства в схеме компонента

Практический пример:

**В файле `openapi.yaml`** схема компонента выглядит так:

```yaml
components:
  schemas:
    Pet:
      type: object
      properties:
        name:
          type: string
          description: Old description
```

**Нужно обновить описание свойства `name`.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `patch-component-schema`:

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-component-schema",
            config: {
                descriptor: {
                    componentName: "Pet",
                    correction: "properties.name"
                },
                patchMethod: "merge",
                schemaDiff: {
                    description: "New description"
                }
            },
        }
    ]
}
```

**После применения правила**, файл `openapi.yaml` выглядит так:

```yaml
components:
  schemas:
    Pet:
      type: object
      properties:
        name:
          type: string
          description: New description
```

<a name="custom_anchor_motivation_2"></a>
### 2. Необходимо полностью заменить схему компонента

Практический пример:

**В файле `openapi.yaml`** схема компонента выглядит так:

```yaml
components:
  schemas:
    Pet:
      type: object
      properties:
        name:
          type: string
```

**Нужно полностью заменить схему компонента.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `patch-component-schema`:

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-component-schema",
            config: {
                descriptor: {
                    componentName: "Pet"
                },
                patchMethod: "replace",
                schemaDiff: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            description: "Pet name"
                        },
                        age: {
                            type: "integer",
                            description: "Pet age"
                        }
                    }
                }
            },
        }
    ]
}
```

**После применения правила**, файл `openapi.yaml` выглядит так:

```yaml
components:
  schemas:
    Pet:
      type: object
      properties:
        name:
          type: string
          description: Pet name
        age:
          type: integer
          description: Pet age
``` 