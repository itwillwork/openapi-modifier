| 参数 | 描述 | 示例 | 类型 | 默认值 |
| -------- |------------------------------------------------------------------------------------------|------------------------------------------------------------------------------|--------------------------------------------------|------------------------------------------|
| `descriptor` | [**必填**] 要修改的组件的描述。 [了解简单组件描述符和带校正的对象组件描述符之间的区别]({{{rootPath}}}docs/descriptor{{{langPostfix}}}.md) | `"Pet.name"` 或 `{"componentName": "Pet", "correction": "properties.name"}` | `string` | `ComponentWithCorrectionDescriptorConfig` | - |
| `patchMethod` | 补丁应用方法。 [了解 merge 和 deepmerge 方法之间的区别]({{{rootPath}}}docs/merge-vs-deepmerge{{{langPostfix}}}.md) | `"merge"` | `"merge" \ "deepmerge"` | `"merge"` |
| `schemaDiff` | [**必填**] 用于补丁的模式。 [OpenAPI 规范的详细示例]({{{rootPath}}}docs/schema-diff{{{langPostfix}}}.md) | `{"type": "string", "description": "New description"}` | `OpenAPISchema` | - |

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