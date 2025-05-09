<a name="custom_anchor_motivation_1"></a>
### 1. 需要替换响应中特定字段的模式

实际示例：

**在 `openapi.yaml` 文件中**，端点文档如下所示：

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
                properties:
                  status:
                    type: 'string'
                    enum: ['active', 'inactive']
```

**我们需要更改 `status` 字段的模式。**

**在配置文件** `openapi-modifier-config.js` 中，我们添加 `patch-endpoint-schema` 规则：

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-schema",
            config: {
                endpointDescriptor: "GET /pets",
                endpointDescriptorCorrection: "responses.200.content.application/json.schema.properties.status",
                patchMethod: "replace",
                schemaDiff: {
                    enum: ["active", "inactive", "pending"]
                }
            }
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
                properties:
                  status:
                    type: 'string'
                    enum: ['active', 'inactive', 'pending']
``` 