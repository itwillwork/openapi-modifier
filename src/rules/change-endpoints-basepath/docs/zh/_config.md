| 参数                    | 描述                                                              | 示例               | 类型                | 默认值 |
|-----------------------------|-----------------------------------------------------------------------|----------------------|--------------------------|-----------|
| `map`                       | [**必填**] 路径替换字典                                     | `{"/api/v1": "/v1"}` | `Record<string, string>` | `{}`      |
| `ignoreOperarionCollisions` | 忽略应用替换后发生的端点冲突 | `true`               | `boolean`                | `false`        |


配置示例：

```js
module.exports = {
    pipeline: [
        // ... 其他规则
        {
            rule: "change-endpoints-basepath",
            config: {
               map: { 
                   '/public/api': '',
               },
            },
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
                   '/public/v1/service/api': '/api',
               }, 
               ignoreOperarionCollisions: false,
            },
        }
        // ... 其他规则
    ]
}
``` 