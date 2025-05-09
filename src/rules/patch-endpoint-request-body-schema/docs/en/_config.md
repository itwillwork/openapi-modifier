| Parameter                    | Description                                                                                                                                                | Example                                                                                                                                                                | Type      | Default |
|-----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|-----------|
| `endpointDescriptor`        | [**required**] Specifies which endpoint's request parameter schema should be modified.                                                                    | `'GET /api/list'`                                                                                                                                                     | `string`       |           |
| `contentType`               | Specifies which request type (content-type) of the endpoint should be modified. If not specified, all request types will be modified. | `'application/json'`                                                                                                                                                  | `string`       |  |
| `correction`                | Path to the field in the schema for modification                                                                                                                     | `"name"` | `string` | - |
| `schemaDiff`                | [**required**] Changes to apply to the schema. [Detailed examples of OpenAPI specifications]({{{rootPath}}}docs/schema-diff{{{langPostfix}}}.md)                                                                                                                          | `{type: "number"}` or see more OpenAPISchema examples TODO link                                                                                                  | `OpenAPISchema` |           |
| `patchMethod`               | Method for applying changes [Learn more about differences between merge and deepmerge methods]({{{rootPath}}}docs/merge-vs-deepmerge{{{langPostfix}}}.md) | `'merge' / 'deepmerge'` | `enum`                                                                              |  `merge` |

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