| 参数                    | 描述                                                              | 示例               | 类型                | 默认值 |
|-----------------------------|-----------------------------------------------------------------------|----------------------|--------------------------|-----------|
| `map`                       | [**必填**] 路径替换字典                                     | `{"/api/v1": "/v1"}` | `Record<string, string>` | `{}`      |
| `ignoreOperationCollisions` | 忽略应用替换后发生的端点冲突 | `true`               | `boolean`                | `false`        |


配置示例：

```js
module.exports = {
    pipeline: [
        // ... 其他规则
        {
            rule: "change-endpoints-basepath",
            config: {
                map: {
                    "/public/api": "" // 从所有路径中删除 '/public/api' 前缀
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
            rule: "change-endpoints-basepath",
            config: {
                map: {
                    "/public/v1/service/api": "/api" // 将 '/public/v1/service/api' 前缀替换为 '/api'
                },
                ignoreOperationCollisions: false // 在路径替换时不允许操作冲突
            }
        }
        // ... 其他规则
    ]
}
``` 