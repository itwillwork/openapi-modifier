[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# remove-parameter

从 OpenAPI 规范中删除端点的参数



## 配置

| 参数 | 描述 | 示例 | 类型 | 默认值 |
| -------- |-------------------------------------------------------------------------------------------------------------------------------------------|----------------------------|------------------------|-----------|
| `endpointDescriptor`  | [**必填**] 要从中删除参数的端点描述 | `"GET /pets"` | `string \ { path: string; method: string }` | - |
| `parameterDescriptor`  | [**必填**] 要删除的参数描述。在 `in` 参数中，可以指定：`"query"`、`"path"`、`"header"`、`"cookie"`。 | `{"name": "petId", "in": "path"}` | `{ name: string; in: "query" \ "path" \ "header" \ "cookie" }` | - |

配置示例：

```js
module.exports = {
    pipeline: [
        // ... 其他规则
        {
            rule: "remove-parameter",
            config: {
                endpointDescriptor: "GET /pets/{petId}", // 指定要从中删除参数的端点
                parameterDescriptor: {
                    name: "version", // 指定要删除的参数名称
                    in: "query" // 指定参数位置（查询参数）
                }
            },
        }
        // ... 其他规则
    ]
}
```

**如果需要修改多个规范**，您可以在整体配置管道中多次使用此规则。

## 动机

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

## 重要说明

- 如果未找到端点或参数，规则将输出警告并保持规范不变，以便及时更新 openapi-modifier 配置
- 该规则可应用于任何类型的参数（query、path、header、cookie）

## 有用的链接

- [测试中的规则使用示例](./index.test.ts)  
 
- DeepWiki 文档](https://deepwiki.com/itwillwork/openapi-modifier)
- 用于 LLM 和 AI 代码编辑器的 Context7 文档](https://context7.com/itwillwork/openapi-modifier)
