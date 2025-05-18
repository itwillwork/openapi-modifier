| 参数       | 描述                                                 | 示例                   | 类型           | 默认值 |
|------------|------------------------------------------------------|------------------------|----------------|--------|
| `enabled`  | [**可选**] 允许的内容类型列表。如果未指定，则保留所有未在 `disabled` 中列出的类型 | `['application/json']` | `Array<string>` |        |
| `disabled` | [**可选**] 禁止的内容类型列表                        | `['multipart/form-data']` | `Array<string>` |        |

配置示例：

```js
module.exports = {
    pipeline: [
        // ... 其他规则
        {
            rule: "filter-by-content-type",
            config: {
                enabled: ['application/json'], // 只保留 application/json 内容类型，删除其他所有类型
            }
        }
        // ... 其他规则
    ]
}
```

或

```js
module.exports = {
    pipeline: [
        // ... 其他规则
        {
            rule: "filter-by-content-type",
            config: {
                disabled: ['multipart/form-data'], // 删除 multipart/form-data 内容类型，保留其他所有类型
            }
        }
        // ... 其他规则
    ]
}
``` 

> [!IMPORTANT]
> 1. 如果同时指定了 `enabled` 和 `disabled` 参数，则先应用 `enabled` 过滤器，然后再应用 `disabled`
> 2. 规则会为配置中指定但在规范中未找到的内容类型输出警告 