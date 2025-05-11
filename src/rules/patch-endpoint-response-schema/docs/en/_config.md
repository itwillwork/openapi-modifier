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
                endpointDescriptor: 'GET /api/list',
                correction: '[].status',
                schemaDiff: {
                    enum: ['foo', 'bar'],
                },
            },
        }
        // ... other rules
    ]
}
```

Example of a more detailed configuration:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "patch-endpoint-response-schema",
            config: {
                endpointDescriptor: 'GET /api/list',
                correction: '[].status',
                code: 200,
                contentType: 'application/json',
                schemaDiff: {
                    enum: ['foo', 'bar'],
                },
                patchMethod: 'deepmerge'
            },
        }
        // ... other rules
    ]
} 
```