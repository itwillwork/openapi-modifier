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
                enabled: ['application/json'],
            },
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
                disabled: ['multipart/form-data'],
            },
        }
        // ... 其他规则
    ]
}
``` 