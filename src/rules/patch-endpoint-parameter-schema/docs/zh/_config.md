| 参数                  | 描述                                                                                                               | 示例                                                                                                                                                                 | 类型                                                                                | 默认值        |
|-----------------------|------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|--------------|
| `endpointDescriptor`  | [**必填**] 指定需要更改请求参数架构的端点。                                   | `'GET /api/list'`                                                                                                                                                     | `string`                                                                            |              |
| `parameterDescriptor` | [**必填**] 指定由 `endpointDescriptor` 引用的需要更改的请求参数。         | `TestSchemaDTO`, `TestSchemaDTO.test`, `TestSchemaDTO[].testField`,  `TestObjectDTO.oneOf[1]`, `TestObjectDTO.allOf[1]` 或  `TestObjectDTO.anyOf[1].testField`        | `string`                                                                            |              |
| `schemaDiff`          | 参数架构的更改 [OpenAPI 规范详细示例]({{{rootPath}}}docs/schema-diff{{{langPostfix}}}.md)                                                              | `{type: "number"}`                                                                                                   | `OpenAPISchema`                                                                     |              |
| `objectDiff`          | 参数本身的更改                                                                                         | `{ required: true }`                                                                                                    | `{name?: string; in?: 'query' / 'header' / 'path' / 'cookie'; required?: boolean;}` |              |
| `patchMethod`         | 应用 `objectDiff` 和 `schemaDiff` 中指定更改的方法。 [更多关于 merge 和 deepmerge 方法的区别]({{{rootPath}}}docs/merge-vs-deepmerge{{{langPostfix}}}.md) | `'merge' /                                                                                                                                                  'deepmerge'` | `enum`                                                                              |  `merge` |

配置示例：

```js
module.exports = {
    pipeline: [
        // ... 其他规则
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
        // ... 其他规则
    ]
}
```

更详细的配置示例：

```js
module.exports = {
    pipeline: [
        // ... 其他规则
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
        // ... 其他规则
    ]
}
``` 