[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# patch-endpoint-request-body-schema

Rule for modifying the request body schema in OpenAPI specification. Allows to modify the request schema for a specified endpoint.



## Configuration

| Parameter                    | Description                                                                                                                                                | Example                                                                                                                                                                | Type      | Default |
|-----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|-----------|
| `endpointDescriptor`        | [**required**] Specifies which endpoint's request parameter schema should be modified.                                                                    | `'GET /api/list'`                                                                                                                                                     | `string \ { path: string; method: string }`       |           |
| `contentType`               | Specifies which request type (content-type) of the endpoint should be modified. If not specified, all request types will be modified. | `'application/json'`                                                                                                                                                  | `string`       |  |
| `correction`                | Path to the field in the schema for modification                                                                                                                     | `"name"` | `string` | - |
| `schemaDiff`                | [**required**] Changes to apply to the schema. [Detailed examples of OpenAPI specifications](../../../docs/schema-diff.md)                                                                                                                          | `{type: "number"}` or see more OpenAPISchema examples TODO link                                                                                                  | `OpenAPISchema` |           |
| `patchMethod`               | Method for applying changes [Learn more about differences between merge and deepmerge methods](../../../docs/merge-vs-deepmerge.md) | `"merge"` | `"merge" \ "deepmerge"` | `"merge"` |

Configuration examples:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "patch-endpoint-request-body-schema",
            config: {
                endpointDescriptor: 'POST /api/order',
                correction: "status",
                schemaDiff: {
                    enum: ['foo', 'bar'],
                },
            },
        }
        // ... other rules
    ]
}
```

or

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "patch-endpoint-request-body-schema",
            config: {
                endpointDescriptor: 'POST /api/order',
                contentType: "application/json",
                schemaDiff: {
                    properties: {
                        testField: {
                            type: 'number',
                        },
                    },
                },
                patchMethod: "deepmerge"
            },
        }
        // ... other rules
    ]
}
```

or

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "patch-endpoint-request-body-schema",
            config: {
                endpointDescriptor: 'POST /api/orders',
                correction: '[].status',
                schemaDiff: {
                    enum: ['foo', 'bar'],
                },
                patchMethod: "deepmerge"
            },
        }
        // ... other rules
    ]
}
```

**If you need to modify multiple specifications**, you can use this rule multiple times in the overall configuration pipeline.

## Motivation

<a name="custom_anchor_motivation_1"></a>
### 1. Need to update request body schema for a specific endpoint

Practical example:

**In the `openapi.yaml` file**, the endpoint documentation looks like this:

```yaml
paths:
  /pets:
    post:
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
```

**We need to update the schema by adding a new field `age`.**

**In the configuration file** `openapi-modifier-config.js`, we add the `patch-endpoint-request-body-schema` rule:

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-request-body-schema",
            config: {
                endpointDescriptor: "POST /pets",
                contentType: "application/json",
                patchMethod: "merge",
                schemaDiff: {
                    properties: {
                        age: {
                            type: "number"
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
    post:
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                age:
                  type: number
```

<a name="custom_anchor_motivation_2"></a>
### 2. Need to modify a specific field in the schema

Practical example:

**In the `openapi.yaml` file**, the endpoint documentation looks like this:

```yaml
paths:
  /pets:
    post:
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                  description: Pet name
```

**We need to change the description of the `name` field.**

**In the configuration file** `openapi-modifier-config.js`, we add the `patch-endpoint-request-body-schema` rule:

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-request-body-schema",
            config: {
                endpointDescriptor: "POST /pets",
                contentType: "application/json",
                correction: "name",
                patchMethod: "merge",
                schemaDiff: {
                    description: "Name of the pet"
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
    post:
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                  description: Name of the pet
```

## Important Notes

- If `contentType` is not specified, changes are applied to all content types of the endpoint
- When specifying a non-existent `contentType`, the rule outputs a warning for timely updating of the openapi-modifier configuration
- The rule does not work with schemas defined via references ($ref)
- When the specified endpoint is not found, the rule outputs a warning for timely updating of the openapi-modifier configuration
- Changes are applied atomically - either all changes are successful, or the specification remains unchanged

## Useful Links

- [Rule usage examples in tests](./index.test.ts)  
- [Differences between merge and deepmerge methods](../../../docs/merge-vs-deepmerge.md)
- [OpenAPI Specification Examples](../../../docs/schema-diff.md) 