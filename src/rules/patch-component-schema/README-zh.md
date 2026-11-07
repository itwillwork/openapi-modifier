[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# patch-component-schema

此规则允许修改 OpenAPI 规范中的组件模式。



## 配置

| 参数 | 描述 | 示例 | 类型 | 默认值 |
| -------- |------------------------------------------------------------------------------------------|------------------------------------------------------------------------------|--------------------------------------------------|------------------------------------------|
| `descriptor` | [**必填**] 要修改的组件的描述。 [了解简单组件描述符和带校正的对象组件描述符之间的区别](../../../docs/descriptor-zh.md) | `"Pet.name"` 或 `{"componentName": "Pet", "correction": "properties.name"}` | `string \ { componentName: string; correction: string }` | - |
| `patchMethod` | 补丁应用方法。 [了解 merge 和 deepmerge 方法之间的区别](../../../docs/merge-vs-deepmerge-zh.md) | `"merge"` | `"merge" \ "deepmerge"` | `"merge"` |
| `schemaDiff` | [**必填**] 用于补丁的模式。 [OpenAPI 规范的详细示例](../../../docs/schema-diff-zh.md) | `{"type": "string", "description": "New description"}` | `OpenAPISchema` | - |

> [!IMPORTANT]
> 设置 `descriptor` 参数的注意事项：
> - 不支持跟随 $refs。因为这可能会导致共享组件中的意外更改，从而在规范的其他地方创建意外的更改。在这种情况下，最好直接修改 $ref 引用的实体；
> - 如果需要遍历数组元素 - 需要在 `descriptor` 中指定 `[]`，例如 `TestSchemaDTO[].test`
> - 如果需要遍历 oneOf、allOf、anyOf，需要在 `descriptor` 中指定 `oneOf[{number}]`、`allOf[{number}]` 或 `anyOf[{number}]`，例如 `TestObjectDTO.oneOf[1].TestSchemaDTO`、`TestObjectDTO.allOf[1].TestSchemaDTO` 或 `TestObjectDTO.anyOf[1].TestSchemaDTO`；

配置示例：

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "patch-component-schema",
            config: {
                descriptor: 'TestDTO',
                schemaDiff: {
                    type: 'string',
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
            rule: "patch-component-schema",
            config: {
                descriptor: 'TestObjectDTO.oneOf[0].TestArraySchemaDTO[]',
                schemaDiff: {
                    type: 'string',
                    enum: ['foo', 'bar'],
                },
                patchMethod: 'deepmerge',
            },
        }
        // ... other rules
    ]
} 
```

**如果需要修改多个规范**，您可以在整体配置管道中多次使用此规则。

## 动机

<a name="custom_anchor_motivation_1"></a>
### 1. 需要更新组件模式中的特定属性描述

实际示例：

**在 `openapi.yaml` 文件中**，组件模式如下所示：

```yaml
components:
  schemas:
    Pet:
      type: object
      properties:
        status:
          type: string
          enum:
            - status1
            - status2
```

**我们需要通过添加额外的枚举值来更新 `type` 属性的描述。**

**在配置文件** `openapi-modifier-config.js` 中，我们添加 `patch-component-schema` 规则：

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-component-schema",
            config: {
                descriptor: "Pet.status",
                patchMethod: "deepmerge",
                schemaDiff: {
                    enum: ['status3', 'status4'],
                }
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
        status:
          type: string
          enum:
            - status1
            - status2
            - status3
            - status4
```

<a name="custom_anchor_motivation_2"></a>
### 2. 需要完全替换组件模式

实际示例：

**在 `openapi.yaml` 文件中**，组件模式如下所示：

```yaml
components:
  schemas:
    Pet:
      type: object
      properties:
        name:
          type: string
```

**我们需要完全替换组件模式。**

**在配置文件** `openapi-modifier-config.js` 中，我们添加 `patch-component-schema` 规则：

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-component-schema",
            config: {
                descriptor: {
                    componentName: "Pet"
                },
                patchMethod: "merge",
                schemaDiff: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            description: "Pet id"
                        },
                        age: {
                            type: "integer",
                            description: "Pet age"
                        }
                    }
                }
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
        id:
          type: string
          description: Pet id
        age:
          type: integer
          description: Pet age
```

## 重要说明



## 有用的链接

- [测试中的规则使用示例](https://github.com/itwillwork/openapi-modifier/blob/main/src/rules/patch-component-schema/index.test.ts)
- [简单组件描述符和带校正的对象组件描述符之间的区别](../../../docs/descriptor-zh.md)
- [merge 和 deepmerge 方法之间的区别](../../../docs/merge-vs-deepmerge-zh.md)
- [OpenAPI 规范示例](../../../docs/schema-diff-zh.md) 
- DeepWiki 文档](https://deepwiki.com/itwillwork/openapi-modifier)
- 用于 LLM 和 AI 代码编辑器的 Context7 文档](https://context7.com/itwillwork/openapi-modifier)
