| 参数                        | 描述                                                                                                                                                                                                                                                                                                                                              | 示例                                         | 类型     | 默认值    |
|----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------|----------|-----------|
| `path`                     | [**必填**] 需要合并到当前规范的 OpenAPI 配置文件的路径。路径可以是相对路径（相对于 package.json 的位置）或绝对路径（例如，通过 `__dirname` 相对于配置文件位置获取）。支持的格式：`*.json`、`*.yml`、`*.yaml`。                                                                                                                                    | `temp-openapi-specs/new-list-endpoints.yaml` | `string` |           |
| `ignoreOperarionCollisions`| 合并多个规范时，当存在相同的端点时可能会发生冲突。默认情况下，工具会禁止合并以防止源规范发生意外更改。此设置允许您忽略冲突并仍然合并规范。                                                                                                                                                                                                        | `true`                                       | `boolean` | `false`   |
| `ignoreComponentCollisions`| 合并多个规范时，当存在相同的公共组件时可能会发生冲突。默认情况下，工具会禁止合并以防止源规范发生意外更改。此设置允许您忽略冲突并仍然合并规范。                                                                                                                                                                                                        | `true`                                       | `boolean` | `false`   |

> [!IMPORTANT]
> **如果需要合并多个规范**，您可以在通用管道配置中多次使用此规则。

配置示例：

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "merge-openapi-spec",
            config: {
                path: 'temp-openapi-specs/new-list-endpoints.yaml',
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
            rule: "merge-openapi-spec",
            config: {
                path: __dirname + '../temp-openapi-specs/new-list-endpoints.json',
                ignoreOperarionCollisions: true,
                ignoreComponentCollisions: true,
            },
        }
        // ... other rules
    ]
} 