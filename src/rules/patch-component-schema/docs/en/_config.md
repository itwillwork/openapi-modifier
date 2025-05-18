| Parameter | Description | Example | Typing | Default |
| -------- |------------------------------------------------------------------------------------------|------------------------------------------------------------------------------|-------------------------------------------|-----------------------------------------|
| `descriptor` | [**required**] Description of the component to modify. [Learn more about the differences between simple and object component descriptors with correction]({{{rootPath}}}docs/descriptor{{{langPostfix}}}.md) | `"Pet.name"` or `{"componentName": "Pet", "correction": "properties.name"}` | `ComponentWithCorrectionDescriptorConfig` | - |
| `patchMethod` | Patch application method. [Learn more about the differences between merge and deepmerge methods]({{{rootPath}}}docs/merge-vs-deepmerge{{{langPostfix}}}.md) | `"merge"` | `"merge" \ "deepmerge"` | `"merge"` |
| `schemaDiff` | [**required**] Schema for patching. [Detailed examples of OpenAPI specifications]({{{rootPath}}}docs/schema-diff{{{langPostfix}}}.md) | `{"type": "string", "description": "New description"}` | `OpenAPISchema` | - |

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