<a name="custom_anchor_motivation_1"></a>
### 1. Need to remove an unused parameter from an endpoint to stop using it and remove it later

Practical example:

**In the `openapi.yaml` file**, the endpoint documentation looks like this:

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

**Need to remove the unused parameter `version`.**

**In the configuration file** `openapi-modifier-config.js`, add the `remove-parameter` rule:

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

**After applying the rule**, the `openapi.yaml` file looks like this:

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
### 2. Need to remove a common parameter that interferes with TypeScript type generation

Practical example:

**In the `openapi.yaml` file**, there is a component with a parameter:

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

**Need to remove the `ApiKeyHeader` parameter component.**

**In the configuration file** `openapi-modifier-config.js`, add the `remove-parameter` rule:

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

**After applying the rule**, the `openapi.yaml` file looks like this:

```yaml
components:
  parameters: {}
``` 