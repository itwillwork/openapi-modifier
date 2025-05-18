| Parameter                      | Description                                            | Example | Typing     | Default       |
|--------------------------------|--------------------------------------------------------|---------|------------|---------------|
| `endpointDescriptor`           | [**required**] Endpoint description for patching       | `{ path: "/pets", method: "get" }` | `{ path: string, method: string }` | -             |
| `endpointDescriptorCorrection` | Path to a specific field in the endpoint schema for patching | `"responses.200.content.application/json.schema"` | `string` | -             |
| `schemaDiff`                   | [**required**] Required changes in OpenAPI format. [Detailed OpenAPI specification examples]({{{rootPath}}}docs/schema-diff{{{langPostfix}}}.md)              | `{ type: "object", properties: { ... } }` | `OpenAPISchema` | -             |
| `patchMethod`                  | Method for applying changes [Learn more about differences between merge and deepmerge methods]({{{rootPath}}}docs/merge-vs-deepmerge{{{langPostfix}}}.md)                                                                        | `"merge"` | `"merge" \ "deepmerge"` | `"merge"` |

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