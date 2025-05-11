| 参数                  | 描述                                                                                                                                                 | 示例                                                                                                                                                                     | 类型            | 默认值    |
|----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------|-----------|
| `endpointDescriptor` | [**必填**] 指定需要修改响应模式的端点。                                                                                                              | `'GET /api/list'`                                                                                                                                                        | `EndpointDescriptorConfig`        |           |
| `correction`         | 要修改的模式属性的路径                                                                                                                               | `"status"`                                                                                                                                                               | `string`        | -         |
| `code`               | 指定要应用更改的响应状态码。如果未指定，将应用于第一个 2xx 响应。                                                                                     | `200`                                                                                                                                                                    | `number`        |           |
| `contentType`        | 指定要应用更改的端点响应类型（content-type）。如果未指定，将修改所有响应类型。                                                                        | `'application/json'`                                                                                                                                                     | `string`        |           |
| `schemaDiff`         | [**必填**] OpenAPI 格式所需的更改。[详细的 OpenAPI 规范示例]({{{rootPath}}}docs/schema-diff{{{langPostfix}}}.md)                                    | `{type: "number"}`                                                                                         | `OpenAPISchema` |           |
| `patchMethod`        | 应用更改的方法 [了解更多关于 merge 和 deepmerge 方法的区别]({{{rootPath}}}docs/merge-vs-deepmerge{{{langPostfix}}}.md)                             | `"merge"` | `"merge" \ "deepmerge"` | `"merge"` |

配置示例：

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

更详细的配置示例：

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