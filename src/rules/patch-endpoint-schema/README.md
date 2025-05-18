[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# patch-endpoint-schema

The rule allows modifying the entire endpoint schema in the OpenAPI specification. Unlike other patching rules that work with individual parts of the endpoint (parameters, request body, responses), this rule can modify the entire endpoint structure, including all its components.

> [!IMPORTANT]  
> Use this rule only in extreme cases when specialized rules for modifying parameters, request body, and responses are not sufficient

## Configuration

| Parameter                      | Description                                            | Example | Typing     | Default       |
|--------------------------------|--------------------------------------------------------|---------|------------|---------------|
| `endpointDescriptor`           | [**required**] Endpoint description for patching       | `{ path: "/pets", method: "get" }` | `{ path: string, method: string }` | -             |
| `endpointDescriptorCorrection` | Path to a specific field in the endpoint schema for patching | `"responses.200.content.application/json.schema"` | `string` | -             |
| `schemaDiff`                   | [**required**] Required changes in OpenAPI format. [Detailed OpenAPI specification examples](../../../docs/schema-diff.md)              | `{ type: "object", properties: { ... } }` | `OpenAPISchema` | -             |
| `patchMethod`                  | Method for applying changes [Learn more about differences between merge and deepmerge methods](../../../docs/merge-vs-deepmerge.md)                                                                        | `"merge"` | `"merge" \ "deepmerge"` | `"merge"` |

Configuration example:

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-schema",
            config: {
                endpointDescriptor: "GET /pets", // specify the endpoint to modify
                patchMethod: "merge", // use merge method to apply changes
                schemaDiff: {
                    "security": [ // add security section to the schema
                        {
                            "bearerAuth": []
                        }
                    ]
                }
            }
        }
    ]
}
```

More detailed configuration example:

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-schema",
            config: {
                patchMethod: 'merge',
                endpointDescriptor: "GET /pets",
                endpointDescriptorCorrection: 'responses.200.content.*/*.schema',
                schemaDiff: {
                    enum: ['3', '4'],
                },
            }
        }
    ]
} 
```

**If you need to modify multiple specifications**, you can use this rule multiple times in the overall configuration pipeline.

## Motivation

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

## Important Notes

- The rule modifies the entire endpoint structure, so it should be used with caution
- When using `endpointDescriptorCorrection`, you can modify specific properties without affecting the rest of the structure
- If the specified endpoint is not found, the rule outputs a warning for timely updating of the openapi-modifier configuration

## Useful Links

- [Rule usage examples in tests](./index.test.ts)  
- [Differences between merge and deepmerge methods](../../../docs/merge-vs-deepmerge.md)
- [OpenAPI Specification Examples](../../../docs/schema-diff.md) 