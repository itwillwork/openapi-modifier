<a name="custom_anchor_motivation_1"></a>
### 1. 需要从规范中删除已弃用的组件

实际示例：

**在 `openapi.yaml` 文件**中有一个已弃用的组件：

```yaml
components:
  schemas:
    OldPet:
      deprecated: true
      description: "此模式已弃用，请使用 Pet 代替"
      type: object
      properties:
        name:
          type: string
```

**我们需要删除这个组件。**

**在配置文件** `openapi-modifier-config.js` 中添加 `remove-deprecated` 规则：

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-deprecated",
            config: {
                showDeprecatedDescriptions: true
            },
        }
    ]
}
```

**应用规则后**，`OldPet` 组件将从规范中删除。

<a name="custom_anchor_motivation_2"></a>
### 2. 需要从规范中删除已弃用的端点

实际示例：

**在 `openapi.yaml` 文件**中有一个已弃用的端点：

```yaml
paths:
  /old-pets:
    get:
      deprecated: true
      description: "此端点已弃用，请使用 /pets 代替"
      summary: 列出所有旧宠物
      responses:
        200:
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/OldPet'
```

**我们需要删除这个端点。**

**在配置文件** `openapi-modifier-config.js` 中添加 `remove-deprecated` 规则：

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-deprecated",
            config: {
                showDeprecatedDescriptions: true
            },
        }
    ]
}
```

**应用规则后**，`/old-pets` 端点将从规范中删除。 