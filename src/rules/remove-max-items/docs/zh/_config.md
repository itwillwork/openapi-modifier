| 参数 | 描述 | 示例 | 类型 | 默认值 |
| ---- | ---- | ---- | ---- | ------ |
| `showUnusedWarning` | [**可选**] 如果未找到带有 maxItems 的模式，显示警告 | `true` | `boolean` | `false` |

配置示例：

```js
module.exports = {
    pipeline: [
        // ... 其他规则
        {
            rule: "remove-max-items",
            config: {} // 删除所有模式中的 maxItems 属性，不显示警告
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
            rule: "remove-max-items",
            config: {
                showUnusedWarning: true // 如果在规范中未找到带有 maxItems 的模式，则显示警告
            }
        }
        // ... 其他规则
    ]
}
``` 