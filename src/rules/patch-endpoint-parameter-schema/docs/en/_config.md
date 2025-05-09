| Parameter             | Description                                                                                                               | Example                                                                                                                                                                 | Typing                                                                              | Default      |
|-----------------------|------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|--------------|
| `endpointDescriptor`  | [**required**] Specifies which endpoint's request parameter schema needs to be changed.                                   | `'GET /api/list'`                                                                                                                                                     | `string`                                                                            |              |
| `parameterDescriptor` | [**required**] Specifies which request parameter, referenced by `endpointDescriptor`, needs to be changed.         | `TestSchemaDTO`, `TestSchemaDTO.test`, `TestSchemaDTO[].testField`,  `TestObjectDTO.oneOf[1]`, `TestObjectDTO.allOf[1]` or  `TestObjectDTO.anyOf[1].testField`        | `string`                                                                            |              |
| `schemaDiff`          | Changes for the parameter schema [Detailed OpenAPI Specification Examples]({{{rootPath}}}docs/schema-diff{{{langPostfix}}}.md)                                                              | `{type: "number"}`                                                                                                   | `OpenAPISchema`                                                                     |              |
| `objectDiff`          | Changes for the parameter itself                                                                                         | `{ required: true }`                                                                                                    | `{name?: string; in?: 'query' / 'header' / 'path' / 'cookie'; required?: boolean;}` |              |
| `patchMethod`         | Method for applying changes specified in `objectDiff` and `schemaDiff`. [More about differences between merge and deepmerge methods]({{{rootPath}}}docs/merge-vs-deepmerge{{{langPostfix}}}.md) | `'merge' /                                                                                                                                                  'deepmerge'` | `enum`                                                                              |  `merge` |

Configuration example:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "patch-endpoint-parameter-schema",
            config: {
                endpointDescriptor: 'GET /api/list',
                parameterDescriptor: {
                    name: 'test',
                    in: 'query',
                },
                schemaDiff: {
                    enum: ['foo', 'bar'],
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
                endpointDescriptor: 'GET /api/list',
                parameterDescriptor: {
                    name: 'test',
                    in: 'path',
                },
                schemaDiff: {
                    type: 'string',
                    enum: ['foo', 'bar'],
                },
                objectDiff: {
                    name: 'newTest',
                    in: 'query',
                    required: true,
                },
                patchMethod: 'deepmerge',
            },
        }
        // ... other rules
    ]
} 