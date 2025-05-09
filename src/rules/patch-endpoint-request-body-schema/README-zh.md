[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# patch-endpoint-request-body-schema

用于修改 OpenAPI 规范中请求体模式的规则。允许修改指定端点的请求模式。



## 配置

| 参数                    | 描述                                                                                                                                                | 示例                                                                                                                                                                | 类型      | 默认值 |
|-----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|-----------|
| `endpointDescriptor`        | [**必填**] 指定需要修改请求参数模式的端点。                                                                    | `'GET /api/list'`                                                                                                                                                     | `string`       |           |
| `contentType`               | 指定需要修改的端点请求类型（content-type）。如果未指定，将修改所有请求类型。 | `'application/json'`                                                                                                                                                  | `string`       |  |
| `correction`                | 模式中需要修改的字段路径                                                                                                                     | `"name"` | `string` | - |
| `schemaDiff`                | [**必填**] 要应用于模式的更改。 [OpenAPI 规范详细示例](../../../docs/schema-diff-zh.md)                                                                                                                          | `{type: "number"}` 或查看更多 OpenAPISchema 示例 TODO 链接                                                                                                  | `OpenAPISchema` |           |
| `patchMethod`               | 应用更改的方法 [了解更多关于 merge 和 deepmerge 方法的区别](../../../docs/merge-vs-deepmerge-zh.md) | `'merge' / 'deepmerge'` | `enum`                                                                              |  `merge` |

配置示例：

```js
module.exports = {
    pipeline: [
        // ... 其他规则
        {
            rule: "patch-endpoint-request-body-schema",
            config: {
                endpointDescriptor: 'POST /api/order',
                correction: "status",
                schemaDiff: {
                    enum: ['foo', 'bar'],
                },
            },
        }
        // ... 其他规则
    ]
}
```

或

```js
module.exports = {
    pipeline: [
        // ... 其他规则
        {
            rule: "patch-endpoint-request-body-schema",
            config: {
                endpointDescriptor: 'POST /api/order',
                contentType: "application/json",
                schemaDiff: {
                    properties: {
                        testField: {
                            type: 'number',
                        },
                    },
                },
                patchMethod: "deepmerge"
            },
        }
        // ... 其他规则
    ]
}
```

或

```js
module.exports = {
    pipeline: [
        // ... 其他规则
        {
            rule: "patch-endpoint-request-body-schema",
            config: {
                endpointDescriptor: 'POST /api/orders',
                correction: '[].status',
                schemaDiff: {
                    enum: ['foo', 'bar'],
                },
                patchMethod: "deepmerge"
            },
        }
        // ... 其他规则
    ]
}
```

**如果需要修改多个规范**，您可以在整体配置管道中多次使用此规则。

## 动机

<a name="custom_anchor_motivation_1"></a>
### 1. 需要更新特定端点的请求体模式

实际示例：

**在 `openapi.yaml` 文件中**，端点文档如下所示：

```yaml
paths:
  /pets:
    post:
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
```

**我们需要通过添加新字段 `age` 来更新模式。**

**在配置文件** `openapi-modifier-config.js` 中，我们添加 `patch-endpoint-request-body-schema` 规则：

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-request-body-schema",
            config: {
                endpointDescriptor: "POST /pets",
                contentType: "application/json",
                patchMethod: "merge",
                schemaDiff: {
                    properties: {
                        age: {
                            type: "number"
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
    post:
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                age:
                  type: number
```

<a name="custom_anchor_motivation_2"></a>
### 2. 需要修改模式中的特定字段

实际示例：

**在 `openapi.yaml` 文件中**，端点文档如下所示：

```yaml
paths:
  /pets:
    post:
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                  description: Pet name
```

**我们需要更改 `name` 字段的描述。**

**在配置文件** `openapi-modifier-config.js` 中，我们添加 `patch-endpoint-request-body-schema` 规则：

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-request-body-schema",
            config: {
                endpointDescriptor: "POST /pets",
                contentType: "application/json",
                correction: "name",
                patchMethod: "merge",
                schemaDiff: {
                    description: "Name of the pet"
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
    post:
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                  description: Name of the pet
```

## 重要说明

- 如果未指定 `contentType`，更改将应用于端点的所有内容类型
- 当指定不存在的 `contentType` 时，规则会输出警告，以便及时更新 openapi-modifier 配置
- 该规则不适用于通过引用（$ref）定义的架构
- 当找不到指定的端点时，规则会输出警告，以便及时更新 openapi-modifier 配置
- 更改以原子方式应用 - 要么所有更改都成功，要么规范保持不变

## 有用的链接

- [测试中的规则使用示例](./index.test.ts)  
- [merge 和 deepmerge 方法的区别](../../../docs/merge-vs-deepmerge-zh.md)
- [OpenAPI 规范示例](../../../docs/schema-diff-zh.md) 