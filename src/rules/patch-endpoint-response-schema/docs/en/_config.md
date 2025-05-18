| Parameter             | Description                                                                                                                                         | Example                                                                                                                                                                  | Type            | Default   |
|----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------|-----------|
| `endpointDescriptor` | [**required**] Specifies which endpoint's response schema should be modified.                                                                       | `'GET /api/list'`                                                                                                                                                        | `EndpointDescriptorConfig`        |           |
| `correction`         | Path to the schema property for modification                                                                                                        | `"status"`                                                                                                                                                               | `string`        | -         |
| `code`               | Specifies which response status code to apply the change to. If not specified, will be applied to the first 2xx response.                          | `200`                                                                                                                                                                    | `number`        |           |
| `contentType`        | Specifies which response type (content-type) of the endpoint to apply the change to. If not specified, all response types will be modified.        | `'application/json'`                                                                                                                                                     | `string`        |           |
| `schemaDiff`         | [**required**] Required changes in OpenAPI format. [Detailed OpenAPI specification examples]({{{rootPath}}}docs/schema-diff{{{langPostfix}}}.md)    | `{type: "number"}`                                                                                         | `OpenAPISchema` |           |
| `patchMethod`        | Method for applying changes [Learn more about differences between merge and deepmerge methods]({{{rootPath}}}docs/merge-vs-deepmerge{{{langPostfix}}}.md) | `"merge"` | `"merge" \ "deepmerge"` | `"merge"` |

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