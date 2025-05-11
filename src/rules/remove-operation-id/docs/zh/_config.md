| 参数 | 描述                          | 示例                     | 类型              | 默认值 |
| -------- |-----------------------------------|----------------------------|------------------------|-----------|
| `ignore`  | [**可选**] 要忽略的 operationId 列表 | `["getPets", "createPet"]` | `string[]` | `[]` |

配置示例：

```js
module.exports = {
    pipeline: [
        // ... 其他规则
        {
            rule: "remove-operation-id",
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
            rule: "remove-operation-id",
            config: {
                ignore: ["getPets", "createPet"]
            },
        }
        // ... 其他规则
    ]
} 
```