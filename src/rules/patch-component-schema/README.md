[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# patch-component-schema

This rule allows modifying the component schema in the OpenAPI specification.



## Configuration

| Parameter | Description | Example | Typing | Default |
| -------- |------------------------------------------------------------------------------------------|------------------------------------------------------------------------------|-------------------------------------------|-----------------------------------------|
| `descriptor` | [**required**] Description of the component to modify. [Learn more about the differences between simple and object component descriptors with correction](../../../docs/descriptor.md) | `"Pet.name"` or `{"componentName": "Pet", "correction": "properties.name"}` | `string \ { componentName: string; correction: string }` | - |
| `patchMethod` | Patch application method. [Learn more about the differences between merge and deepmerge methods](../../../docs/merge-vs-deepmerge.md) | `"merge"` | `"merge" \ "deepmerge"` | `"merge"` |
| `schemaDiff` | [**required**] Schema for patching. [Detailed examples of OpenAPI specifications](../../../docs/schema-diff.md) | `{"type": "string", "description": "New description"}` | `OpenAPISchema` | - |

> [!IMPORTANT]
> Nuances of setting the `descriptor` parameter:
> - Following $refs is not supported. Because it may cause unintended changes in shared components, and thus create unexpected changes elsewhere in the specification. In this case, it's better to modify the entity referenced by $ref directly;
> - If you need to traverse array elements - you need to specify `[]` in the `descriptor`, for example, `TestSchemaDTO[].test`
> - If you need to traverse oneOf, allOf, anyOf, you need to specify `oneOf[{number}]`, `allOf[{number}]` or `anyOf[{number}]` in the `descriptor`, for example, `TestObjectDTO.oneOf[1].TestSchemaDTO`, `TestObjectDTO.allOf[1].TestSchemaDTO` or `TestObjectDTO.anyOf[1].TestSchemaDTO`;

Configuration example:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "patch-component-schema",
            config: {
                descriptor: 'TestDTO', // specify the component to modify
                schemaDiff: {
                    type: 'string', // change component type to string
                },
            },
        }
        // ... other rules
    ]
}
```

More detailed configuration example:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "patch-component-schema",
            config: {
                descriptor: 'TestObjectDTO.oneOf[0].TestArraySchemaDTO[]', // specify path to component in complex structure
                schemaDiff: {
                    type: 'string', // change component type to string
                    enum: ['foo', 'bar'], // add enum to component
                },
                patchMethod: 'deepmerge', // use deepmerge method for deep merging changes
            },
        }
        // ... other rules
    ]
} 
```

**If you need to modify multiple specifications**, you can use this rule multiple times in the overall configuration pipeline.

## Motivation

<a name="custom_anchor_motivation_1"></a>
### 1. Need to update a specific property description in the component schema

Practical example:

**In the `openapi.yaml` file**, the component schema looks like this:

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

**We need to update the `type` property description by extending the enum with additional values.**

**In the configuration file** `openapi-modifier-config.js`, we add the `patch-component-schema` rule:

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

**After applying the rule**, the `openapi.yaml` file looks like this:

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
### 2. Need to completely replace the component schema

Practical example:

**In the `openapi.yaml` file**, the component schema looks like this:

```yaml
components:
  schemas:
    Pet:
      type: object
      properties:
        name:
          type: string
```

**We need to completely replace the component schema.**

**In the configuration file** `openapi-modifier-config.js`, we add the `patch-component-schema` rule:

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

**After applying the rule**, the `openapi.yaml` file looks like this:

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

## Important Notes



## Useful Links

- [Rule usage examples in tests](./index.test.ts)  
- [Differences between simple and object component descriptors with correction](../../../docs/descriptor.md)
- [Differences between merge and deepmerge methods](../../../docs/merge-vs-deepmerge.md)
- [OpenAPI specification examples](../../../docs/schema-diff.md)
- [DeepWiki Documentation](https://deepwiki.com/itwillwork/openapi-modifier)
- [Context7 documentation for LLMs and AI code editors](https://context7.com/itwillwork/openapi-modifier)