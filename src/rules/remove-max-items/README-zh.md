[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# remove-max-items

从 OpenAPI 规范的所有模式中删除 `maxItems` 属性。



## 配置

| 参数 | 描述 | 示例 | 类型 | 默认值 |
| ---- | ---- | ---- | ---- | ------ |
| `showUnusedWarning` | [**可选**] 如果未找到带有 maxItems 的模式，显示警告 | `true` | `boolean` | `false` |

配置示例：

```js
module.exports = {
    pipeline: [
        // ... 其他规则
        {
            rule: "remove-max-items",
            config: {} // 删除所有模式中的 maxItems 属性，不显示警告
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
            rule: "remove-max-items",
            config: {
                showUnusedWarning: true // 如果在规范中未找到带有 maxItems 的模式，则显示警告
            }
        }
        // ... 其他规则
    ]
}
```

**如果需要修改多个规范**，您可以在整体配置管道中多次使用此规则。

## 动机

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

## 重要说明

- 该规则不影响通过引用（$ref）定义的模式
- 如果启用了 `showUnusedWarning`，当未找到带有 `maxItems` 的模式时，规则将显示警告，以帮助保持 openapi-modifier 配置的及时更新

## 有用的链接

- [测试中的规则使用示例](https://github.com/itwillwork/openapi-modifier/blob/main/src/rules/remove-max-items/index.test.ts)
 
- DeepWiki 文档](https://deepwiki.com/itwillwork/openapi-modifier)
- 用于 LLM 和 AI 代码编辑器的 Context7 文档](https://context7.com/itwillwork/openapi-modifier)
