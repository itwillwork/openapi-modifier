| 参数 | 描述 | 示例 | 类型 | 默认值 |
| ---- | ---- | ---- | ---- | ------ |
| `showUnusedWarning` | [**可选**] 如果未找到带有 `minItems` 的模式，显示警告 | `true` | `boolean` | `false` |

配置示例：

```js
module.exports = {
    pipeline: [
        // ... 其他规则
        {
            rule: "remove-min-items",
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
            rule: "remove-min-items",
            config: {
                showUnusedWarning: true
            },
        }
        // ... 其他规则
    ]
}
``` 