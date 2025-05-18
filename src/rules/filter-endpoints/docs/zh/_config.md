> [!IMPORTANT]  
> 该规则可以在启用模式下工作 - 从规范中过滤端点（当配置中指定了 `enabled` 或 `enabledPathRegExp`），或在禁用模式下工作 - 从规范中排除端点（当配置中指定了 `disabled` 或 `disabledPathRegExp`）

| 参数                  | 描述                                                                                                                                                                               | 示例                | 类型            | 默认值          |
|----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------|-----------------|-----------------|
| `enabled`            | 要保留的端点列表 | `[{"method": "GET", "path": "/pets"}]` | `Array<EndpointDescriptorConfig>` | - |
| `enabledPathRegExp`  | 要保留的路径的正则表达式列表 | `[/^\/api\/v1/]` | `Array<RegExp>` | - |
| `disabled`           | 要排除的端点列表 | `[{"method": "POST", "path": "/pets"}]` | `Array<EndpointDescriptorConfig>` | - |
| `disabledPathRegExp` | 要排除的路径的正则表达式列表 | `[/^\/internal/]` | `Array<RegExp>` | - |
| `printIgnoredEndpoints` | 是否在日志中输出有关已排除端点的信息 | `true` | `boolean` | `false` |

配置示例：

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "filter-endpoints",
            config: {
                enabled: [
                    'GET /foo/ping' // 只保留 GET /foo/ping 端点，其他所有端点将被删除
                ],
            },
        }
        // ... other rules
    ]
}
```

或

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "filter-endpoints",
            config: {
                enabledPathRegExp: [
                    /\/public/ // 保留所有路径包含 /public 的端点
                ],
            },
        }
        // ... other rules
    ]
}
```

或

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "filter-endpoints",
            config: {
                disabled: [
                    'GET /foo/ping' // 删除 GET /foo/ping 端点，其他端点保持不变
                ],
            },
        }
        // ... other rules
    ]
}
```

或

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "filter-endpoints",
            config: {
                disabledPathRegExp: [
                    /\/internal/ // 删除所有路径包含 /internal 的端点
                ],
                printIgnoredEndpoints: true, // 在控制台打印已删除端点的信息
            },
        }
        // ... other rules
    ]
} 
```