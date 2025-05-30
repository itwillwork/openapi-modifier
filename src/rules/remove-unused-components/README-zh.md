[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# remove-unused-components

从 OpenAPI 规范中删除未使用的组件。该规则分析文档中的所有组件引用，并删除那些在任何地方都未使用的组件。



## 配置

| 参数    | 描述                          | 示例            | 类型              | 默认值 |
| -------- |-----------------------------------|-------------------|------------------------|-----------|
| `ignore`  | [**可选**] 删除时要忽略的组件或正则表达式列表 | `["NotFoundDTO", "/^Error.*/"]` | `Array<string \| RegExp>` | `[]` |
| `printDeletedComponents` | [**可选**] 如果为true，则在控制台打印已删除组件的列表 | `true` | `boolean` | `false` |

配置示例：

```js
module.exports = {
    pipeline: [
        // ... 其他规则
        {
            rule: "remove-unused-components",
            config: {},
        }
        // ... 其他规则
    ]
}
```

更详细的配置示例：

```js
module.exports = {
    pipeline: [
        // ... 其他规则
        {
            rule: "remove-unused-components",
            config: {
                ignore: [
                    "NotFoundDTO",
                    /^Error.*/, // 忽略所有以Error开头的组件
                    /.*Response$/ // 忽略所有以Response结尾的组件
                ],
                printDeletedComponents: true // 在控制台打印已删除组件的列表
            },
        }
        // ... 其他规则
    ]
}
```

**如果需要修改多个规范**，您可以在整体配置管道中多次使用此规则。

## 动机

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

## 重要说明



## 有用的链接

- [测试中的规则使用示例](./index.test.ts)  
 
- DeepWiki 文档](https://deepwiki.com/itwillwork/openapi-modifier)
- 用于 LLM 和 AI 代码编辑器的 Context7 文档](https://context7.com/itwillwork/openapi-modifier)
