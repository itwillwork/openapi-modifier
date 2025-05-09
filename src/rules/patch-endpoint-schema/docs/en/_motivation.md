<a name="custom_anchor_motivation_1"></a>
### 1. Need to replace the schema of a specific field in the response

Practical example:

**In the `openapi.yaml` file**, the endpoint documentation looks like this:

```yaml
paths:
  /pets:
    get:
      summary: List all pets
      responses:
        200:
          content:
            'application/json':
              schema:
                type: 'object'
                properties:
                  status:
                    type: 'string'
                    enum: ['active', 'inactive']
```

**We need to change the schema of the `status` field.**

**In the configuration file** `openapi-modifier-config.js`, we add the `patch-endpoint-schema` rule:

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-schema",
            config: {
                endpointDescriptor: "GET /pets",
                endpointDescriptorCorrection: "responses.200.content.application/json.schema.properties.status",
                patchMethod: "replace",
                schemaDiff: {
                    enum: ["active", "inactive", "pending"]
                }
            }
        }
    ]
}
```

**After applying the rule**, the `openapi.yaml` file looks like this:

```yaml
paths:
  /pets:
    get:
      summary: List all pets
      responses:
        200:
          content:
            'application/json':
              schema:
                type: 'object'
                properties:
                  status:
                    type: 'string'
                    enum: ['active', 'inactive', 'pending']
``` 