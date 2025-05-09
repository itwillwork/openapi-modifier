<a name="custom_anchor_motivation_1"></a>
### 1. Need to update endpoint response schema

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
                  items:
                    type: 'array'
                    items:
                      type: 'object'
                      properties:
                        id: { type: 'string' }
                        name: { type: 'string' }
```

**Need to add a new `description` field to the schema of each array element.**

**In the configuration file** `openapi-modifier-config.js`, add the `patch-endpoint-response-schema` rule:

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-response-schema",
            config: {
                endpointDescriptor: 'GET /pets',
                code: "200",
                contentType: "application/json",
                correction: "items[]",
                patchMethod: "merge",
                schemaDiff: {
                    description: { type: "string" }
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
                  items:
                    type: 'array'
                    items:
                      type: 'object'
                      properties:
                        id: { type: 'string' }
                        name: { type: 'string' }
                        description: { type: 'string' }
```

<a name="custom_anchor_motivation_2"></a>
### 2. Need to completely replace the response schema

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
                  items:
                    type: 'array'
                    items:
                      type: 'object'
                      properties:
                        id: { type: 'string' }
                        name: { type: 'string' }
```

**Need to completely replace the response schema with a new one.**

**In the configuration file** `openapi-modifier-config.js`, add the `patch-endpoint-response-schema` rule:

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-response-schema",
            config: {
                endpointDescriptor: "get /pets",
                code: "200",
                contentType: "application/json",
                patchMethod: "replace",
                schemaDiff: {
                    type: "object",
                    properties: {
                        data: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "string" },
                                    name: { type: "string" },
                                    description: { type: "string" }
                                }
                            }
                        }
                    }
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
                  data:
                    type: 'array'
                    items:
                      type: 'object'
                      properties:
                        id: { type: 'string' }
                        name: { type: 'string' }
                        description: { type: 'string' }
``` 