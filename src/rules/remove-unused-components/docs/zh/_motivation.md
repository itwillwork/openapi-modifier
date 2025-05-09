<a name="custom_anchor_motivation_1"></a>
### 1. 清理规范中未使用的组件

应用其他规则后，规范中可能会出现未使用的组件，最好删除它们，以便及时从生成的 TypeScript 类型中消除它们，并切换到实际类型。

实际示例：

**在 `openapi.yaml` 文件**中有未使用的组件：

```yaml
components:
  schemas:
    User:
      type: object
      properties:
        name:
          type: string
    UnusedSchema:
      type: object
      properties:
        field:
          type: string
  responses:
    NotFound:
      description: Not found
    UnusedResponse:
      description: Unused response
```

**我们需要删除未使用的组件 `UnusedSchema` 和 `UnusedResponse`，但保留 `User` 和 `NotFound`。**

**在配置文件** `openapi-modifier-config.js` 中添加 `remove-unused-components` 规则：

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-unused-components",
            config: {
                ignore: [
                    "User",
                    "NotFound"
                ]
            },
        }
    ]
}
```

**应用规则后**，`openapi.yaml` 文件如下所示：

```yaml
components:
  schemas:
    User:
      type: object
      properties:
        name:
          type: string
  responses:
    NotFound:
      description: Not found
``` 