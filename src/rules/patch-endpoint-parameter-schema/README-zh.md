[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# patch-endpoint-parameter-schema

该规则允许修改 OpenAPI 规范中端点参数的架构。



## 配置

| 参数                  | 描述                                                                                                               | 示例                                                                                                                                                                 | 类型                                                                                | 默认值        |
|-----------------------|------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|--------------|
| `endpointDescriptor`  | [**必填**] 指定需要更改请求参数架构的端点。                                   | `'GET /api/list'`                                                                                                                                                     | `string \ { path: string; method: string }`                                                                            |              |
| `parameterDescriptor` | [**必填**] 指定由 `endpointDescriptor` 引用的需要更改的请求参数。         | `'TestSchemaDTO'`, `'TestSchemaDTO.test'`, `'TestSchemaDTO[].testField'`,  `'TestObjectDTO.oneOf[1]'`, `'TestObjectDTO.allOf[1]'` 或  `'TestObjectDTO.anyOf[1].testField'`        | `string`                                                                            |              |
| `schemaDiff`          | 参数架构的更改 [OpenAPI 规范详细示例](../../../docs/schema-diff-zh.md)                                                              | `{type: "number"}`                                                                                                   | `OpenAPISchema`                                                                     |              |
| `objectDiff`          | 参数本身的更改                                                                                         | `{ required: true }`                                                                                                    | `{name?: string; in?: 'query' / 'header' / 'path' / 'cookie'; required?: boolean;}` |              |
| `patchMethod`         | 应用 `objectDiff` 和 `schemaDiff` 中指定更改的方法。 [更多关于 merge 和 deepmerge 方法的区别](../../../docs/merge-vs-deepmerge-zh.md) | `"merge"` | `"merge" \ "deepmerge"` | `"merge"` |

配置示例：

```js
module.exports = {
    pipeline: [
        // ... 其他规则
        {
            rule: "patch-endpoint-parameter-schema",
            config: {
                endpointDescriptor: 'GET /api/list',
                parameterDescriptor: {
                    name: 'test',
                    in: 'query',
                },
                schemaDiff: {
                    enum: ['foo', 'bar'],
                }
            },
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
            rule: "patch-endpoint-parameter-schema",
            config: {
                endpointDescriptor: 'GET /api/list',
                parameterDescriptor: {
                    name: 'test',
                    in: 'path',
                },
                schemaDiff: {
                    type: 'string',
                    enum: ['foo', 'bar'],
                },
                objectDiff: {
                    name: 'newTest',
                    in: 'query',
                    required: true,
                },
                patchMethod: 'deepmerge',
            },
        }
        // ... 其他规则
    ]
}
```

**如果需要修改多个规范**，您可以在整体配置管道中多次使用此规则。

## 动机

<a name="custom_anchor_motivation_1"></a>
### 1. 修改端点参数架构

实际示例：

**在 `openapi.yaml` 文件中**，端点参数如下所示：

```yaml
paths:
  /pets/{petId}:
    get:
      parameters:
        - name: petId
          in: path
          schema:
            type: string
```

**我们需要通过添加 UUID 格式并使参数成为必需项来修改参数架构。**

**在配置文件** `openapi-modifier-config.js` 中，我们添加 `patch-endpoint-parameter-schema` 规则：

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-parameter-schema",
            config: {
                endpointDescriptor: "GET /pets/{petId}",
                parameterDescriptor: {
                    name: "petId",
                    in: "path"
                },
                schemaDiff: {
                    format: "uuid"
                },
                objectDiff: {
                    required: true
                }
            }
        }
    ]
}
```

**应用规则后**，`openapi.yaml` 文件如下所示：

```yaml
paths:
  /pets/{petId}:
    get:
      parameters:
        - name: petId
          in: path
          required: true
          schema:
            type: string
            format: uuid
```

<a name="custom_anchor_motivation_2"></a>
### 2. 修改参数组件架构

实际示例：

**在 `openapi.yaml` 文件中**，参数组件如下所示：

```yaml
components:
  parameters:
    PetIdParam:
      name: petId
      in: path
      schema:
        type: string
```

**我们需要通过添加 UUID 格式来修改参数组件架构。**

**在配置文件** `openapi-modifier-config.js` 中，我们添加 `patch-endpoint-parameter-schema` 规则：

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-parameter-schema",
            config: {
                parameterDescriptor: {
                    name: "petId",
                    in: "path"
                },
                schemaDiff: {
                    format: "uuid"
                }
            }
        }
    ]
}
```

**应用规则后**，`openapi.yaml` 文件如下所示：

```yaml
components:
  parameters:
    PetIdParam:
      name: petId
      in: path
      schema:
        type: string
        format: uuid
```

## 重要说明

- 该规则跳过通过引用（$ref）定义的参数
- 如果未找到指定的参数或端点，规则会输出警告，以便及时更新 openapi-modifier 配置
- 更改以原子方式应用 - 要么所有更改都成功，要么规范保持不变

## 有用的链接

- [测试中的规则使用示例](./index.test.ts)  
- [merge 和 deepmerge 方法的区别](../../../docs/merge-vs-deepmerge-zh.md)
- [OpenAPI 规范示例](../../../docs/schema-diff-zh.md) 