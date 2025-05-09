<a name="custom_anchor_motivation_1"></a>
### 1. 需要将多个 OpenAPI 规范合并为一个

通常需要将尚未在微服务中实现的未来 API 设计添加到 OpenAPI 中，但 API 格式已经达成一致，可以开始开发接口。

实际示例：

**在文件 `openapi.yaml` 中** 主规范：

```yaml
openapi: 3.0.0
info:
  title: Main API
paths:
  /pets:
    get:
      summary: List all pets
      responses:
        200:
          content:
            'application/json':
              schema:
                type: 'object'
```

**在文件 `additional-spec.yaml` 中** 附加规范：

```yaml
openapi: 3.0.0
info:
  title: Additional API
paths:
  /users:
    get:
      summary: List all users
      responses:
        200:
          content:
            'application/json':
              schema:
                type: 'object'
```

**在配置文件** `openapi-modifier-config.js` 中添加 `merge-openapi-spec` 规则：

```js
module.exports = {
    pipeline: [
        {
            rule: "merge-openapi-spec",
            config: {
                path: "./additional-spec.yaml"
            },
        }
    ]
}
```

**应用规则后**，文件 `openapi.yaml` 将包含合并后的规范：

```yaml
openapi: 3.0.0
info:
  title: Main API
paths:
  /pets:
    get:
      summary: List all pets
      responses:
        200:
          content:
            'application/json':
              schema:
                type: 'object'
  /users:
    get:
      summary: List all users
      responses:
        200:
          content:
            'application/json':
              schema:
                type: 'object'
``` 