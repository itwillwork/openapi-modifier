<a name="custom_anchor_motivation_1"></a>
### 1. Need to update a specific property description in the component schema

Practical example:

**In the `openapi.yaml` file**, the component schema looks like this:

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

**We need to update the `type` property description by extending the enum with additional values.**

**In the configuration file** `openapi-modifier-config.js`, we add the `patch-component-schema` rule:

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

**After applying the rule**, the `openapi.yaml` file looks like this:

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
### 2. Need to completely replace the component schema

Practical example:

**In the `openapi.yaml` file**, the component schema looks like this:

```yaml
components:
  schemas:
    Pet:
      type: object
      properties:
        name:
          type: string
```

**We need to completely replace the component schema.**

**In the configuration file** `openapi-modifier-config.js`, we add the `patch-component-schema` rule:

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

**After applying the rule**, the `openapi.yaml` file looks like this:

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