[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# patch-endpoint-response-schema

The rule allows modifying the response schema for endpoints in the OpenAPI specification.



## Configuration

| Parameter             | Description                                                                                                                                         | Example                                                                                                                                                                  | Type            | Default   |
|----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------|-----------|
| `endpointDescriptor` | [**required**] Specifies which endpoint's response schema should be modified.                                                                       | `'GET /api/list'`                                                                                                                                                        | `string \ { path: string; method: string }`        |           |
| `correction`         | Path to the schema property for modification                                                                                                        | `"status"`                                                                                                                                                               | `string`        | -         |
| `code`               | Specifies which response status code to apply the change to. If not specified, will be applied to the first 2xx response.                          | `200`                                                                                                                                                                    | `number`        |           |
| `contentType`        | Specifies which response type (content-type) of the endpoint to apply the change to. If not specified, all response types will be modified.        | `'application/json'`                                                                                                                                                     | `string`        |           |
| `schemaDiff`         | [**required**] Required changes in OpenAPI format. [Detailed OpenAPI specification examples](../../../docs/schema-diff.md)    | `{type: "number"}`                                                                                         | `OpenAPISchema` |           |
| `patchMethod`        | Method for applying changes [Learn more about differences between merge and deepmerge methods](../../../docs/merge-vs-deepmerge.md) | `"merge"` | `"merge" \ "deepmerge"` | `"merge"` |

Configuration example:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "patch-endpoint-response-schema",
            config: {
                endpointDescriptor: 'GET /api/list', // specify the endpoint to modify
                correction: '[].status', // specify path to status field in response array
                schemaDiff: {
                    enum: ['foo', 'bar'], // add enum to status field
                },
            },
        }
        // ... other rules
    ]
}
```

More detailed configuration example:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "patch-endpoint-response-schema",
            config: {
                endpointDescriptor: 'GET /api/list', // specify the endpoint to modify
                correction: '[].status', // specify path to status field in response array
                code: 200, // specify response code to apply changes to
                contentType: 'application/json', // specify content type to apply changes to
                schemaDiff: {
                    enum: ['foo', 'bar'], // add enum to status field
                },
                patchMethod: 'deepmerge' // use deepmerge method for deep merging changes
            },
        }
        // ... other rules
    ]
} 
```

**If you need to modify multiple specifications**, you can use this rule multiple times in the overall configuration pipeline.

## Motivation

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

## Important Notes

- If `code` is not specified, the rule attempts to find the first 2xx response code
- If `contentType` is not specified, changes are applied to all content types
- When specifying a non-existent code or content type, the rule outputs a warning for timely updating of the openapi-modifier configuration
- The `correction` parameter allows precise modification of nested schema properties
- The rule does not work with schemas defined via references ($ref)
- When the specified endpoint is not found, the rule outputs a warning for timely updating of the openapi-modifier configuration
- Changes are applied atomically - either all changes are successful, or the specification remains unchanged

## Useful Links

- [Rule usage examples in tests](./index.test.ts)  
- [Differences between merge and deepmerge methods](../../../docs/merge-vs-deepmerge.md)
- [OpenAPI Specification Examples](../../../docs/schema-diff.md) 