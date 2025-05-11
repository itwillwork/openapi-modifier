| 参数 | 描述 | 示例 | 类型 | 默认值 |
| -------- |-------------------------------------------------------------------------------------------------------------------------------------------|----------------------------|------------------------|-----------|
| `endpointDescriptor`  | [**必填**] 要从中删除参数的端点描述 | `"GET /pets"` | `EndpointDescriptorConfig` | - |
| `parameterDescriptor`  | [**必填**] 要删除的参数描述。在 `in` 参数中，可以指定：`"query"`、`"path"`、`"header"`、`"cookie"`。 | `{"name": "petId", "in": "path"}` | `EndpointParameterDescriptorConfig` | - |

配置示例：

```js
module.exports = {
    pipeline: [
        // ... 其他规则
        {
            rule: "remove-parameter",
            config: {
                endpointDescriptor: "GET /pets/{petId}",
                parameterDescriptor: {
                    name: "version",
                    in: "query"
                }
            },
        }
        // ... 其他规则
    ]
}
``` 