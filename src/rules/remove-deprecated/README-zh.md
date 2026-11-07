[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# remove-deprecated

该规则允许从 OpenAPI 规范中删除已弃用（deprecated）的元素。它可以删除已弃用的组件、端点、参数和属性，同时提供忽略特定元素和显示已删除元素描述的功能。

> [!IMPORTANT]  
> 有助于后端交互过程：后端将字段标记为已弃用，规则将其从 openapi 中删除，由于字段在代码生成过程中消失，迫使前端逐渐放弃使用已弃用的字段和端点。
> 因此，建议默认启用此规则

## 配置

| 参数 | 描述                                                                                                                | 示例 | 类型 | 默认值 |
|----------|-------------------------------------------------------------------------------------------------------------------------|---------|-----------|-----------|
| `ignoreComponents` | [**可选**] 即使标记为已弃用也不应删除的组件列表            | `[{"componentName": "Pet"}]` | `Array<{ componentName: string }>` | `[]` |
| `ignoreEndpoints` | [**可选**] 即使标记为已弃用也不应删除的端点列表             | `["GET /pets"]` | `Array<string \ { path: string; method: string }>` | `[]` |
| `ignoreEndpointParameters` | [**可选**] 即使标记为已弃用也不应删除的端点参数列表  | `[{"path": "/pets", "method": "get", "name": "limit", "in": "query"}]` | `Array<{ path: string; method: string; name: string; in: "query" \ "path" \ "header" \ "cookie" }>` | `[]` |
| `showDeprecatedDescriptions` | [**可选**] 是否在日志中显示已删除的已弃用元素的描述，对于解释应该使用什么替代很有用 | `true` | `boolean` | `false` |

> [!IMPORTANT]  
> 仅考虑文件的本地 $ref，格式为：`#/...`

配置示例：

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-deprecated",
            config: {},
        }
    ]
}
```

更详细的配置示例：

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-deprecated",
            config: {
                ignoreComponents: [
                    { componentName: "Pet" } // 即使标记为已弃用也保留 Pet 组件
                ],
                ignoreEndpoints: [
                    { path: "/pets", method: "get" } // 即使标记为已弃用也保留 GET /pets 端点
                ],
                ignoreEndpointParameters: [
                    { path: "/pets", method: "get", name: "limit", in: "query" } // 即使标记为已弃用也保留 GET /pets 中的 limit 参数
                ],
                showDeprecatedDescriptions: true // 在控制台打印已删除的已弃用元素的描述
            },
        }
    ]
}
```

**如果需要修改多个规范**，您可以在整体配置管道中多次使用此规则。

## 动机

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

## 重要说明

- 规则删除标记为 `deprecated: true` 的元素
- 删除是递归的 - 如果组件标记为已弃用，则删除其所有引用
- 删除端点时，删除其所有方法
- 规则在决定删除之前检查并解析引用（$ref）
- 如果启用 `showDeprecatedDescriptions`，所有已删除元素的描述将输出到日志中
- 规则对未找到的忽略组件输出警告

## 有用的链接

- [测试中的规则使用示例](https://github.com/itwillwork/openapi-modifier/blob/main/src/rules/remove-deprecated/index.test.ts)
 
- DeepWiki 文档](https://deepwiki.com/itwillwork/openapi-modifier)
- 用于 LLM 和 AI 代码编辑器的 Context7 文档](https://context7.com/itwillwork/openapi-modifier)
