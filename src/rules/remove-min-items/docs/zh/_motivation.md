<a name="custom_anchor_motivation_1"></a>

### 1. 需要从模式中删除 `minItems` 约束以生成 TypeScript 类型

在某些情况下，`minItems` 约束可能会干扰代码生成或创建不必要的检查。删除此属性可以使模式更加灵活和通用。

实际示例：

**在 `openapi.yaml` 文件中**，模式如下所示：

```yaml
components:
  schemas:
    PetList:
      type: array
      items:
        $ref: '#/components/schemas/Pet'
      minItems: 1
```

**我们需要删除 `minItems: 1` 约束。**

**在配置文件** `openapi-modifier-config.js` 中，我们添加 `remove-min-items` 规则：

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-min-items",
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
    PetList:
      type: array
      items:
        $ref: '#/components/schemas/Pet'
```

<a name="custom_anchor_motivation_2"></a> 