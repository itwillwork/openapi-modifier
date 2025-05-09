| 参数                           | 描述                                                   | 示例    | 类型       | 默认值         |
|--------------------------------|--------------------------------------------------------|---------|------------|---------------|
| `endpointDescriptor`           | [**必填**] 需要修补的端点描述                          | `{ path: "/pets", method: "get" }` | `{ path: string, method: string }` | -             |
| `endpointDescriptorCorrection` | 端点模式中需要修补的特定字段路径                       | `"responses.200.content.application/json.schema"` | `string` | -             |
| `schemaDiff`                   | [**必填**] OpenAPI 格式所需的更改。[OpenAPI 规范详细示例]({{{rootPath}}}docs/schema-diff{{{langPostfix}}}.md)              | `{ type: "object", properties: { ... } }` | `OpenAPISchema` | -             |
| `patchMethod`                  | 应用更改的方法 [了解 merge 和 deepmerge 方法的区别]({{{rootPath}}}docs/merge-vs-deepmerge{{{langPostfix}}}.md)                                                                        | `'merge' / 'deepmerge'` | `enum`                                                                              |  `merge` |

配置示例：

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-schema",
            config: {
                endpointDescriptor: "GET /pets",
                patchMethod: "merge",
                schemaDiff: {
                    "security": [
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

更详细的配置示例：

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