[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# remove-operation-id

从 OpenAPI 规范中删除所有操作的 operationId，忽略列表中指定的操作除外



## 配置

| 参数 | 描述                          | 示例                     | 类型              | 默认值 |
| -------- |-----------------------------------|----------------------------|------------------------|-----------|
| `ignore`  | [**可选**] 要忽略的 operationId 列表 | `["getPets", "createPet"]` | `string[]` | `[]` |

配置示例：

```js
module.exports = {
    pipeline: [
        // ... 其他规则
        {
            rule: "remove-operation-id",
            config: {} // 删除所有端点的 operationId，不保留任何例外
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
            rule: "remove-operation-id",
            config: {
                ignore: ["getPets", "createPet"] // 保留指定端点的 operationId，删除其他所有端点的 operationId
            }
        }
        // ... 其他规则
    ]
} 
```

**如果需要修改多个规范**，您可以在整体配置管道中多次使用此规则。

## 动机

<a name="custom_anchor_motivation_1"></a>
### 1. 需要从所有操作中删除 operationId 以生成 TypeScript 类型

实际示例：

**在 `openapi.yaml` 文件**中，端点文档如下所示：

```yaml
paths:
  /pets:
    get:
      operationId: getPets
      summary: List all pets
      responses:
        200:
          content:
            'application/json':
              schema:
                type: 'object'
```

**我们需要从所有操作中删除 operationId。**

**在配置文件** `openapi-modifier-config.js` 中，我们添加 `remove-operation-id` 规则：

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-operation-id",
            config: {
                ignore: []
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

## 重要说明

- 如果未找到端点，规则会输出警告并保持规范不变，以便及时更新 openapi-modifier 配置

## 有用的链接

- [测试中的规则使用示例](https://github.com/itwillwork/openapi-modifier/blob/main/src/rules/remove-operation-id/index.test.ts)
 
- DeepWiki 文档](https://deepwiki.com/itwillwork/openapi-modifier)
- 用于 LLM 和 AI 代码编辑器的 Context7 文档](https://context7.com/itwillwork/openapi-modifier)
