<a name="custom_anchor_motivation_1"></a>
### 1. 需要从所有操作中删除 operationId 以生成 TypeScript 类型

实际示例：

**在 `openapi.yaml` 文件**中，端点文档如下所示：

```yaml
paths:
  /pets:
    get:
      operationId: getPets
      summary: List all pets
      responses:
        200:
          content:
            'application/json':
              schema:
                type: 'object'
```

**我们需要从所有操作中删除 operationId。**

**在配置文件** `openapi-modifier-config.js` 中，我们添加 `remove-operation-id` 规则：

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-operation-id",
            config: {
                ignore: []
            },
        }
    ]
}
```

**应用规则后**，`openapi.yaml` 文件如下所示：

```yaml
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