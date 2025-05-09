<a name="custom_anchor_motivation_1"></a>
### 1. 需要从端点中删除未使用的参数，以停止使用它并在以后删除

实际示例：

**在 `openapi.yaml` 文件中**，端点文档如下所示：

```yaml
paths:
  /pets/{petId}:
    get:
      summary: Get pet by ID
      parameters:
        - name: petId
          in: path
          required: true
          schema:
            type: string
        - name: version
          in: query
          required: false
          schema:
            type: string
```

**需要删除未使用的参数 `version`。**

**在配置文件** `openapi-modifier-config.js` 中，添加 `remove-parameter` 规则：

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-parameter",
            config: {
                endpointDescriptor: "GET /pets/{petId}",
                parameterDescriptor: {
                    name: "version",
                    in: "query"
                }
            },
        }
    ]
}
```

**应用规则后**，`openapi.yaml` 文件如下所示：

```yaml
paths:
  /pets/{petId}:
    get:
      summary: Get pet by ID
      parameters:
        - name: petId
          in: path
          required: true
          schema:
            type: string
```

<a name="custom_anchor_motivation_2"></a>
### 2. 需要删除干扰 TypeScript 类型生成的公共参数

实际示例：

**在 `openapi.yaml` 文件中**，有一个带参数的组件：

```yaml
components:
  parameters:
    ApiKeyHeader:
      name: X-API-Key
      in: header
      required: true
      schema:
        type: string
```

**需要删除 `ApiKeyHeader` 参数组件。**

**在配置文件** `openapi-modifier-config.js` 中，添加 `remove-parameter` 规则：

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-parameter",
            config: {
                parameterDescriptor: {
                    name: "X-API-Key",
                    in: "header"
                }
            },
        }
    ]
}
```

**应用规则后**，`openapi.yaml` 文件如下所示：

```yaml
components:
  parameters: {}
``` 