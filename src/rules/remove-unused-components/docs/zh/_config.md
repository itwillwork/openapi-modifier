| 参数 | 描述                          | 示例            | 类型              | 默认值 |
| -------- |-----------------------------------|-------------------|------------------------|-----------|
| `ignore`  | [**可选**] 删除时要忽略的组件列表 | `["NotFoundDTO"]` | `Array<string>` | `[]` |

配置示例：

```js
module.exports = {
    pipeline: [
        // ... 其他规则
        {
            rule: "remove-unused-components",
            config: {},
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
            rule: "remove-unused-components",
            config: {
                ignore: [
                    "NotFoundDTO"
                ]
            },
        }
        // ... 其他规则
    ]
}
``` 