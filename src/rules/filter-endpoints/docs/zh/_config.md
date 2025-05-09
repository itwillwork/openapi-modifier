> [!IMPORTANT]  
> 该规则可以在启用模式下工作 - 从规范中过滤端点（当配置中指定了 `enabled` 或 `enabledPathRegExp`），或在禁用模式下工作 - 从规范中排除端点（当配置中指定了 `disabled` 或 `disabledPathRegExp`）

| 参数                  | 描述                                                                                                                                                                               | 示例                | 类型            | 默认值          |
|----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------|-----------------|-----------------|
| `enabled`            | 要保留的端点列表 | `[{"method": "GET", "path": "/pets"}]` | `Array<EndpointDescriptor>` | - |
| `enabledPathRegExp`  | 要保留的路径的正则表达式列表 | `[/^\/api\/v1/]` | `Array<RegExp>` | - |
| `disabled`           | 要排除的端点列表 | `[{"method": "POST", "path": "/pets"}]` | `Array<EndpointDescriptor>` | - |
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
                    'GET /foo/ping'
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
                    /\/public/
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
                    'GET /foo/ping'
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
                    /\/internal/
                ],
                printIgnoredEndpoints: true,
            },
        }
        // ... other rules
    ]
} 