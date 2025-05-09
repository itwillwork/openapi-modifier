| 参数 | 描述                          | 示例                     | 类型              | 默认值 |
|----------|-----------------------------------|----------------------------|------------------------|-----------|
| `map`    | [**必填**] 内容类型替换字典 | `{"*/*": "application/json"}` | `Record<string, string>` | `{}`        |

配置示例：

```js
module.exports = {
    pipeline: [
        // ... 其他规则
        {
            rule: "change-content-type",
            config: {
                map: {
                    "*/*": "application/json"
                }
            },
        }
        // ... 其他规则
    ]
}
``` 