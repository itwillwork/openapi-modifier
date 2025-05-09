| 参数 | 描述                                                                                                                | 示例 | 类型 | 默认值 |
|----------|-------------------------------------------------------------------------------------------------------------------------|---------|-----------|-----------|
| `ignoreComponents` | [**可选**] 即使标记为已弃用也不应删除的组件列表            | `[{"componentName": "Pet"}]` | `Array<ComponentDescriptorConfig>` | `[]` |
| `ignoreEndpoints` | [**可选**] 即使标记为已弃用也不应删除的端点列表             | `[{"path": "/pets", "method": "get"}]` | `Array<EndpointDescriptorConfig>` | `[]` |
| `ignoreEndpointParameters` | [**可选**] 即使标记为已弃用也不应删除的端点参数列表  | `[{"path": "/pets", "method": "get", "name": "limit", "in": "query"}]` | `Array<ParameterDescriptorConfig>` | `[]` |
| `showDeprecatedDescriptions` | [**可选**] 是否在日志中显示已删除的已弃用元素的描述，对于解释应该使用什么替代很有用 | `true` | `boolean` | `false` |

> [!IMPORTANT]  
> 仅考虑文件的本地 $ref，格式为：`#/...`

配置示例：

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-deprecated",
            config: {},
        }
    ]
}
```

更详细的配置示例：

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-deprecated",
            config: {
                ignoreComponents: [
                    { componentName: "Pet" }
                ],
                ignoreEndpoints: [
                    { path: "/pets", method: "get" }
                ],
                ignoreEndpointParameters: [
                    { path: "/pets", method: "get", name: "limit", in: "query" }
                ],
                showDeprecatedDescriptions: true
            },
        }
    ]
}
``` 