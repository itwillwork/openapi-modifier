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
        status:
          type: string
          enum:
            - status1
            - status2
```

**Нужно обновить описание свойства `type`, расширив enum дополнительными значениями.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `patch-component-schema`:

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-component-schema",
            config: {
                descriptor: "Pet.status",
                patchMethod: "deepmerge",
                schemaDiff: {
                    enum: ['status3', 'status4'],
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
        status:
          type: string
          enum:
            - status1
            - status2
            - status3
            - status4
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
                patchMethod: "merge",
                schemaDiff: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            description: "Pet id"
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
        id:
          type: string
          description: Pet id
        age:
          type: integer
          description: Pet age
``` 