<a name="custom_anchor_motivation_1"></a>
### 1. 需要只保留公共 API 端点

实际示例：

**在 `openapi.yaml` 文件**中有许多端点，包括内部端点：

```yaml
paths:
  /api/v1/pets:
    get:
      summary: List all pets
    post:
      summary: Create a pet
  /internal/health:
    get:
      summary: Health check
  /internal/metrics:
    get:
      summary: Metrics endpoint
```

**我们需要只保留公共端点并排除内部端点。**

**在配置文件** `openapi-modifier-config.js` 中添加 `filter-endpoints` 规则：

```js
module.exports = {
    pipeline: [
        {
            rule: "filter-endpoints",
            config: {
                disabledPathRegExp: [/^\/internal/]
            }
        }
    ]
}
```

**应用规则后**，`openapi.yaml` 文件将只包含公共端点：

```yaml
paths:
  /api/v1/pets:
    get:
      summary: List all pets
    post:
      summary: Create a pet
``` 