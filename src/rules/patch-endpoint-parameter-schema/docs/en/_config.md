| Parameter             | Description                                                                                                               | Example                                                                                                                                                                | Typing                                                                              | Default      |
|-----------------------|------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|--------------|
| `endpointDescriptor`  | [**required**] Specifies which endpoint's request parameter schema needs to be changed.                                   | `'GET /api/list'`                                                                                                                                                      | `EndpointDescriptorConfig`                                                                            |              |
| `parameterDescriptor` | [**required**] Specifies which request parameter, referenced by `endpointDescriptor`, needs to be changed.         | `'TestSchemaDTO'`, `'TestSchemaDTO.test'`, `'TestSchemaDTO[].testField'`,  `'TestObjectDTO.oneOf[1]'`, `'TestObjectDTO.allOf[1]'` or  `'TestObjectDTO.anyOf[1].testField'` | `string`                                                                            |              |
| `schemaDiff`          | Changes for the parameter schema [Detailed OpenAPI Specification Examples]({{{rootPath}}}docs/schema-diff{{{langPostfix}}}.md)                                                              | `{type: "number"}`                                                                                                                                                     | `OpenAPISchema`                                                                     |              |
| `objectDiff`          | Changes for the parameter itself                                                                                         | `{ required: true }`                                                                                                                                                   | `{name?: string; in?: 'query' / 'header' / 'path' / 'cookie'; required?: boolean;}` |              |
| `patchMethod`         | Method for applying changes specified in `objectDiff` and `schemaDiff`. [More about differences between merge and deepmerge methods]({{{rootPath}}}docs/merge-vs-deepmerge{{{langPostfix}}}.md) | `"merge"` | `"merge" \ "deepmerge"` | `"merge"` |

Configuration example:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "patch-endpoint-parameter-schema",
            config: {
                endpointDescriptor: 'GET /api/list', // specify the endpoint to modify
                parameterDescriptor: {
                    name: 'test', // specify parameter name
                    in: 'query', // specify that parameter is in query
                },
                schemaDiff: {
                    enum: ['foo', 'bar'], // add enum to parameter
                }
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
            rule: "patch-endpoint-parameter-schema",
            config: {
                endpointDescriptor: 'GET /api/list', // specify the endpoint to modify
                parameterDescriptor: {
                    name: 'test', // specify parameter name
                    in: 'query', // specify that parameter is in query
                },
                schemaDiff: {
                    type: 'string', // change parameter type to string
                    enum: ['foo', 'bar'], // add enum to parameter
                },
                objectDiff: {
                    name: 'newTest',
                    in: 'query',
                    required: true, // make parameter required
                },
                patchMethod: 'deepmerge' // use deepmerge method for deep merging changes
            },
        }
        // ... other rules
    ]
} 
```