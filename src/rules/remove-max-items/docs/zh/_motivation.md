<a name="custom_anchor_motivation_1"></a>
### 1. 需要从模式中删除 `maxItems` 约束以生成 TypeScript 类型

在某些情况下，`maxItems` 约束可能会干扰代码生成或创建不必要的检查。删除此属性可以使模式更加灵活和通用。

实际示例：

**在 `openapi.yaml` 文件中**，模式如下所示：

```yaml
components:
  schemas:
    Pet:
      type: object
      properties:
        tags:
          type: array
          maxItems: 10
          items:
            type: string
```

**在配置文件** `openapi-modifier-config.js` 中，添加 `remove-max-items` 规则：

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-max-items",
            config: {
                showUnusedWarning: true
            },
        }
    ]
}
```

**应用规则后**，`openapi.yaml` 文件如下所示：

```yaml
components:
  schemas:
    Pet:
      type: object
      properties:
        tags:
          type: array
          items:
            type: string
``` 