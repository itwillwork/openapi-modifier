| Parameter                    | Description                                                                                                                                                | Example                                                                                                                                                               | Type      | Default |
|-----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|-----------|
| `endpointDescriptor`        | [**required**] Specifies which endpoint's request parameter schema should be modified.                                                                    | `'GET /api/list'`                                                                                                                                                    | `EndpointDescriptorConfig`       |           |
| `contentType`               | Specifies which request type (content-type) of the endpoint should be modified. If not specified, all request types will be modified. | `'application/json'`                                                                                                                                                 | `string`       |  |
| `correction`                | Path to the field in the schema for modification                                                                                                                     | `"name"` | `string` | - |
| `schemaDiff`                | [**required**] Changes to apply to the schema. [Detailed examples of OpenAPI specifications]({{{rootPath}}}docs/schema-diff{{{langPostfix}}}.md)                                                                                                                          | `{type: "number"}`                                                                                                 | `OpenAPISchema` |           |
| `patchMethod`               | Method for applying changes [Learn more about differences between merge and deepmerge methods]({{{rootPath}}}docs/merge-vs-deepmerge{{{langPostfix}}}.md) | `"merge"` | `"merge" \ "deepmerge"` | `"merge"` |

Configuration examples:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "patch-endpoint-request-body-schema",
            config: {
                endpointDescriptor: 'POST /api/order', // specify the endpoint to modify
                correction: "status", // specify path to status field in request body
                schemaDiff: {
                    enum: ['foo', 'bar'], // add enum to status field
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
                endpointDescriptor: 'POST /api/order', // specify the endpoint to modify
                contentType: "application/json", // specify content type to apply changes to
                schemaDiff: {
                    properties: {
                        testField: {
                            type: 'number', // change testField type to number
                        },
                    },
                },
                patchMethod: "deepmerge" // use deepmerge method for deep merging changes
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