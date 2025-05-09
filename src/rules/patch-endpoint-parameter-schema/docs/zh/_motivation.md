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