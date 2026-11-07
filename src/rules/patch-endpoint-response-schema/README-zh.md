[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# patch-endpoint-response-schema

该规则允许修改 OpenAPI 规范中端点的响应模式（response schema）。



## 配置

| 参数                  | 描述                                                                                                                                                 | 示例                                                                                                                                                                     | 类型            | 默认值    |
|----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------|-----------|
| `endpointDescriptor` | [**必填**] 指定需要修改响应模式的端点。                                                                                                              | `'GET /api/list'`                                                                                                                                                        | `string \ { path: string; method: string }`        |           |
| `correction`         | 要修改的模式属性的路径                                                                                                                               | `"status"`                                                                                                                                                               | `string`        | -         |
| `code`               | 指定要应用更改的响应状态码。如果未指定，将应用于第一个 2xx 响应。                                                                                     | `200`                                                                                                                                                                    | `number`        |           |
| `contentType`        | 指定要应用更改的端点响应类型（content-type）。如果未指定，将修改所有响应类型。                                                                        | `'application/json'`                                                                                                                                                     | `string`        |           |
| `schemaDiff`         | [**必填**] OpenAPI 格式所需的更改。[详细的 OpenAPI 规范示例](../../../docs/schema-diff-zh.md)                                    | `{type: "number"}`                                                                                         | `OpenAPISchema` |           |
| `patchMethod`        | 应用更改的方法 [了解更多关于 merge 和 deepmerge 方法的区别](../../../docs/merge-vs-deepmerge-zh.md)                             | `"merge"` | `"merge" \ "deepmerge"` | `"merge"` |

配置示例：

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "patch-endpoint-response-schema",
            config: {
                endpointDescriptor: 'GET /api/list',
                correction: '[].status',
                schemaDiff: {
                    enum: ['foo', 'bar'],
                },
            },
        }
        // ... other rules
    ]
}
```

更详细的配置示例：

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "patch-endpoint-response-schema",
            config: {
                endpointDescriptor: 'GET /api/list',
                correction: '[].status',
                code: 200,
                contentType: 'application/json',
                schemaDiff: {
                    enum: ['foo', 'bar'],
                },
                patchMethod: 'deepmerge'
            },
        }
        // ... other rules
    ]
}
```

**如果需要修改多个规范**，您可以在整体配置管道中多次使用此规则。

## 动机

<a name="custom_anchor_motivation_1"></a>
### 1. 需要更新端点响应模式

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
                  items:
                    type: 'array'
                    items:
                      type: 'object'
                      properties:
                        id: { type: 'string' }
                        name: { type: 'string' }
```

**需要为数组的每个元素模式添加新的 `description` 字段。**

**在配置文件** `openapi-modifier-config.js` 中，添加 `patch-endpoint-response-schema` 规则：

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-response-schema",
            config: {
                endpointDescriptor: 'GET /pets',
                code: "200",
                contentType: "application/json",
                correction: "items[]",
                patchMethod: "merge",
                schemaDiff: {
                    description: { type: "string" }
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
                  items:
                    type: 'array'
                    items:
                      type: 'object'
                      properties:
                        id: { type: 'string' }
                        name: { type: 'string' }
                        description: { type: 'string' }
```

<a name="custom_anchor_motivation_2"></a>
### 2. 需要完全替换响应模式

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
                  items:
                    type: 'array'
                    items:
                      type: 'object'
                      properties:
                        id: { type: 'string' }
                        name: { type: 'string' }
```

**需要用新的模式完全替换响应模式。**

**在配置文件** `openapi-modifier-config.js` 中，添加 `patch-endpoint-response-schema` 规则：

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-response-schema",
            config: {
                endpointDescriptor: "get /pets",
                code: "200",
                contentType: "application/json",
                patchMethod: "replace",
                schemaDiff: {
                    type: "object",
                    properties: {
                        data: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "string" },
                                    name: { type: "string" },
                                    description: { type: "string" }
                                }
                            }
                        }
                    }
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
                  data:
                    type: 'array'
                    items:
                      type: 'object'
                      properties:
                        id: { type: 'string' }
                        name: { type: 'string' }
                        description: { type: 'string' }
```

## 重要说明

- 如果未指定 `code`，规则会尝试查找第一个 2xx 响应代码
- 如果未指定 `contentType`，更改将应用于所有内容类型
- 当指定不存在的代码或内容类型时，规则会输出警告，以便及时更新 openapi-modifier 配置
- `correction` 参数允许精确修改嵌套模式属性
- 该规则不适用于通过引用（$ref）定义的模式
- 当找不到指定的端点时，规则会输出警告，以便及时更新 openapi-modifier 配置
- 更改以原子方式应用 - 要么所有更改都成功，要么规范保持不变

## 有用的链接

- [测试中的规则使用示例](https://github.com/itwillwork/openapi-modifier/blob/main/src/rules/patch-endpoint-response-schema/index.test.ts)
- [merge 和 deepmerge 方法的区别](../../../docs/merge-vs-deepmerge-zh.md)
- [OpenAPI 规范示例](../../../docs/schema-diff-zh.md) 
- DeepWiki 文档](https://deepwiki.com/itwillwork/openapi-modifier)
- 用于 LLM 和 AI 代码编辑器的 Context7 文档](https://context7.com/itwillwork/openapi-modifier)
