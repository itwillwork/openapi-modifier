创建一个配置文件（例如，`openapi-modifier.config.js` 或 `openapi-modifier.config.ts`），结构如下：

```javascript
module.exports = {
    // （可选）日志设置
    logger: {
        verbose: true, // 显示每条规则及其差异；将完整日志写入临时文件
        minLevel: 0    // 最低控制台日志级别：0 - trace，1 - info，2 - not-important-warning，3 - warning，4 - error，5 - success
    },
    // 输入 OpenAPI 规范文件路径
    input: './openapi.yaml',
    // 输出文件路径
    output: './modified-openapi.yaml',
    // 要应用的规则管道（见下文所有可用规则及其配置示例）
    pipeline: [
        {
            rule: "change-content-type",
            disabled: false, // （可选）禁用规则
            config: {
                map: {
                    "*/*": "application/json"
                }
            }
        }
        // 其他规则...
    ]
}
```

> [!IMPORTANT]  
> 由于规则的管道结构，您可以：
> - 使用下一阶段编辑前一阶段的结果，从而构建必要的更改序列；
> - 根据需要多次使用规则并按所需顺序使用；
