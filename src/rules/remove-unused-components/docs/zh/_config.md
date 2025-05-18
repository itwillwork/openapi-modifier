| 参数    | 描述                          | 示例            | 类型              | 默认值 |
| -------- |-----------------------------------|-------------------|------------------------|-----------|
| `ignore`  | [**可选**] 删除时要忽略的组件或正则表达式列表 | `["NotFoundDTO", "/^Error.*/"]` | `Array<string \| RegExp>` | `[]` |
| `printDeletedComponents` | [**可选**] 如果为true，则在控制台打印已删除组件的列表 | `true` | `boolean` | `false` |

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
                    "NotFoundDTO",
                    /^Error.*/, // 忽略所有以Error开头的组件
                    /.*Response$/ // 忽略所有以Response结尾的组件
                ],
                printDeletedComponents: true // 在控制台打印已删除组件的列表
            },
        }
        // ... 其他规则
    ]
}
``` 