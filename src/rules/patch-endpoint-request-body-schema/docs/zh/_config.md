| 参数                    | 描述                                                                                                                                                | 示例                                                                                                                                                                | 类型      | 默认值 |
|-----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|-----------|
| `endpointDescriptor`        | [**必填**] 指定需要修改请求参数模式的端点。                                                                    | `'GET /api/list'`                                                                                                                                                     | `EndpointDescriptorConfig`       |           |
| `contentType`               | 指定需要修改的端点请求类型（content-type）。如果未指定，将修改所有请求类型。 | `'application/json'`                                                                                                                                                  | `string`       |  |
| `correction`                | 模式中需要修改的字段路径                                                                                                                     | `"name"` | `string` | - |
| `schemaDiff`                | [**必填**] 要应用于模式的更改。 [OpenAPI 规范详细示例]({{{rootPath}}}docs/schema-diff{{{langPostfix}}}.md)                                                                                                                          | `{type: "number"}` 或查看更多 OpenAPISchema 示例 TODO 链接                                                                                                  | `OpenAPISchema` |           |
| `patchMethod`               | 应用更改的方法 [了解更多关于 merge 和 deepmerge 方法的区别]({{{rootPath}}}docs/merge-vs-deepmerge{{{langPostfix}}}.md) | `"merge"` | `"merge" \ "deepmerge"` | `"merge"` |

配置示例：

```js
module.exports = {
    pipeline: [
        // ... 其他规则
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
        // ... 其他规则
    ]
}
```

或

```js
module.exports = {
    pipeline: [
        // ... 其他规则
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
        // ... 其他规则
    ]
}
```

或

```js
module.exports = {
    pipeline: [
        // ... 其他规则
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
        // ... 其他规则
    ]
}
``` 