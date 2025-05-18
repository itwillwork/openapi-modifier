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
                    "*/*": "application/json" // 将所有内容类型替换为 application/json
                }
            }
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
            rule: "change-content-type",
            config: {
                map: {
                    "application/xml": "application/json", // 将 XML 内容类型替换为 JSON
                    "text/plain": "application/json", // 将纯文本内容类型替换为 JSON
                    "*/*": "application/json" // 将所有其他内容类型替换为 JSON
                }
            }
        },
        // ... 其他规则
    ]
}
``` 