[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# patch-endpoint-schema

该规则允许修改 OpenAPI 规范中的整个端点模式。与其他仅处理端点各个部分（参数、请求体、响应）的修补规则不同，此规则可以修改整个端点结构，包括其所有组件。

> [!IMPORTANT]  
> 仅在特殊规则不足以修改参数、请求体和响应的情况下使用此规则

## 配置

| 参数                           | 描述                                                   | 示例    | 类型       | 默认值         |
|--------------------------------|--------------------------------------------------------|---------|------------|---------------|
| `endpointDescriptor`           | [**必填**] 需要修补的端点描述                          | `{ path: "/pets", method: "get" }` | `{ path: string, method: string }` | -             |
| `endpointDescriptorCorrection` | 端点模式中需要修补的特定字段路径                       | `"responses.200.content.application/json.schema"` | `string` | -             |
| `schemaDiff`                   | [**必填**] OpenAPI 格式所需的更改。[OpenAPI 规范详细示例](../../../docs/schema-diff-zh.md)              | `{ type: "object", properties: { ... } }` | `OpenAPISchema` | -             |
| `patchMethod`                  | 应用更改的方法 [了解 merge 和 deepmerge 方法的区别](../../../docs/merge-vs-deepmerge-zh.md)                                                                        | `"merge"` | `"merge" \ "deepmerge"` | `"merge"` |

配置示例：

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-schema",
            config: {
                endpointDescriptor: "GET /pets", // 指定要修改的端点
                patchMethod: "merge", // 使用 merge 方法应用更改
                schemaDiff: {
                    "security": [ // 向模式添加 security 部分
                        {
                            "bearerAuth": []
                        }
                    ]
                }
            }
        }
    ]
}
```

更详细的配置示例：

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-schema",
            config: {
                patchMethod: 'merge',
                endpointDescriptor: "GET /pets",
                endpointDescriptorCorrection: 'responses.200.content.*/*.schema',
                schemaDiff: {
                    enum: ['3', '4'],
                },
            }
        }
    ]
} 
```

**如果需要修改多个规范**，您可以在整体配置管道中多次使用此规则。

## 动机

<a name="custom_anchor_motivation_1"></a>
### 1. 需要替换响应中特定字段的模式

实际示例：

**在 `openapi.yaml` 文件中**，端点文档如下所示：

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
                properties:
                  status:
                    type: 'string'
                    enum: ['active', 'inactive']
```

**我们需要更改 `status` 字段的模式。**

**在配置文件** `openapi-modifier-config.js` 中，我们添加 `patch-endpoint-schema` 规则：

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-schema",
            config: {
                endpointDescriptor: "GET /pets",
                endpointDescriptorCorrection: "responses.200.content.application/json.schema.properties.status",
                patchMethod: "replace",
                schemaDiff: {
                    enum: ["active", "inactive", "pending"]
                }
            }
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
                properties:
                  status:
                    type: 'string'
                    enum: ['active', 'inactive', 'pending']
```

## 重要说明

- 该规则会修改整个端点结构，因此应谨慎使用
- 使用 `endpointDescriptorCorrection` 时，可以修改特定属性而不影响其余结构
- 如果未找到指定的端点，规则会输出警告，以便及时更新 openapi-modifier 配置

## 有用的链接

- [测试中的规则使用示例](https://github.com/itwillwork/openapi-modifier/blob/main/src/rules/patch-endpoint-schema/index.test.ts)
- [merge 和 deepmerge 方法的区别](../../../docs/merge-vs-deepmerge-zh.md)
- [OpenAPI 规范示例](../../../docs/schema-diff-zh.md) 
- DeepWiki 文档](https://deepwiki.com/itwillwork/openapi-modifier)
- 用于 LLM 和 AI 代码编辑器的 Context7 文档](https://context7.com/itwillwork/openapi-modifier)
