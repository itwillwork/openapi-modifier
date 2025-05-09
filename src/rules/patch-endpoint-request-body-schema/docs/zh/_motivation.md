<a name="custom_anchor_motivation_1"></a>
### 1. 需要更新特定端点的请求体模式

实际示例：

**在 `openapi.yaml` 文件中**，端点文档如下所示：

```yaml
paths:
  /pets:
    post:
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
```

**我们需要通过添加新字段 `age` 来更新模式。**

**在配置文件** `openapi-modifier-config.js` 中，我们添加 `patch-endpoint-request-body-schema` 规则：

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-request-body-schema",
            config: {
                endpointDescriptor: "POST /pets",
                contentType: "application/json",
                patchMethod: "merge",
                schemaDiff: {
                    properties: {
                        age: {
                            type: "number"
                        }
                    }
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
    post:
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                age:
                  type: number
```

<a name="custom_anchor_motivation_2"></a>
### 2. 需要修改模式中的特定字段

实际示例：

**在 `openapi.yaml` 文件中**，端点文档如下所示：

```yaml
paths:
  /pets:
    post:
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                  description: Pet name
```

**我们需要更改 `name` 字段的描述。**

**在配置文件** `openapi-modifier-config.js` 中，我们添加 `patch-endpoint-request-body-schema` 规则：

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-request-body-schema",
            config: {
                endpointDescriptor: "POST /pets",
                contentType: "application/json",
                correction: "name",
                patchMethod: "merge",
                schemaDiff: {
                    description: "Name of the pet"
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
    post:
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                  description: Name of the pet
``` 