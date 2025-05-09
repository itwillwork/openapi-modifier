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