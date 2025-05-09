<a name="custom_anchor_motivation_1"></a>
### 1. Modifying Endpoint Parameter Schema

Practical example:

**In the `openapi.yaml` file**, the endpoint parameter looks like this:

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

**We need to modify the parameter schema by adding UUID format and making it required.**

**In the configuration file** `openapi-modifier-config.js`, we add the `patch-endpoint-parameter-schema` rule:

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

**After applying the rule**, the `openapi.yaml` file looks like this:

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

<a name="custom_anchor_motivation_2"></a>
### 2. Modifying Parameter Component Schema

Practical example:

**In the `openapi.yaml` file**, the parameter component looks like this:

```yaml
components:
  parameters:
    PetIdParam:
      name: petId
      in: path
      schema:
        type: string
```

**We need to modify the parameter component schema by adding UUID format.**

**In the configuration file** `openapi-modifier-config.js`, we add the `patch-endpoint-parameter-schema` rule:

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

**After applying the rule**, the `openapi.yaml` file looks like this:

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