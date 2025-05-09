<a name="custom_anchor_motivation_1"></a>
### 1. 需要将内容类型 `*/*` 替换/明确为更具体的类型以用于代码生成

实际示例：

**在 `openapi.yaml` 文件**中，端点文档如下所示：

```yaml
paths:
  /pets:
    get:
      summary: List all pets
      responses:
        200:
          content:
            '*/*':
              schema:
                type: 'object'
```
**需要将 `*/*` 替换为 `application/json`。**

**在配置文件** `openapi-modifier-config.js` 中添加 `change-content-type` 规则：

```js
module.exports = {
    pipeline: [
        {
            rule: "change-content-type",
            config: {
                map: {
                    "*/*": "application/json"
                }
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

<a name="custom_anchor_motivation_2"></a>
### 2. 内容类型中存在拼写错误

实际示例：

**在 `openapi.yaml` 文件**中，端点文档如下所示：

```yaml
paths:
  /pets:
    get:
      summary: List all pets
      responses:
        200:
          content:
            'json':
              schema:
                type: 'object'
```
**需要将 `json` 替换为 `application/json`。**

**在配置文件** `openapi-modifier-config.js` 中添加 `change-content-type` 规则：

```js
module.exports = {
    pipeline: [
        {
            rule: "change-content-type",
            config: {
                map: {
                    "json": "application/json"
                }
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