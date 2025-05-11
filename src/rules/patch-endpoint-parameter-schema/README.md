[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# patch-endpoint-parameter-schema

The rule allows modifying the schema of endpoint parameters in the OpenAPI specification.



## Configuration

| Parameter             | Description                                                                                                               | Example                                                                                                                                                                | Typing                                                                              | Default      |
|-----------------------|------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|--------------|
| `endpointDescriptor`  | [**required**] Specifies which endpoint's request parameter schema needs to be changed.                                   | `'GET /api/list'`                                                                                                                                                      | `EndpointDescriptorConfig`                                                                            |              |
| `parameterDescriptor` | [**required**] Specifies which request parameter, referenced by `endpointDescriptor`, needs to be changed.         | `'TestSchemaDTO'`, `'TestSchemaDTO.test'`, `'TestSchemaDTO[].testField'`,  `'TestObjectDTO.oneOf[1]'`, `'TestObjectDTO.allOf[1]'` or  `'TestObjectDTO.anyOf[1].testField'` | `string`                                                                            |              |
| `schemaDiff`          | Changes for the parameter schema [Detailed OpenAPI Specification Examples](../../../docs/schema-diff.md)                                                              | `{type: "number"}`                                                                                                                                                     | `OpenAPISchema`                                                                     |              |
| `objectDiff`          | Changes for the parameter itself                                                                                         | `{ required: true }`                                                                                                                                                   | `{name?: string; in?: 'query' / 'header' / 'path' / 'cookie'; required?: boolean;}` |              |
| `patchMethod`         | Method for applying changes specified in `objectDiff` and `schemaDiff`. [More about differences between merge and deepmerge methods](../../../docs/merge-vs-deepmerge.md) | `"merge"` | `"merge" \ "deepmerge"` | `"merge"` |

Configuration example:

```js
module.exports = {
    pipeline: [
        // ... other rules
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
        // ... other rules
    ]
}

**If you need to modify multiple specifications**, you can use this rule multiple times in the overall configuration pipeline.

## Motivation

<a name="custom_anchor_motivation_1"></a>
### 1. Modifying Endpoint Parameter Schema

Practical example:

**In the `openapi.yaml` file**, the endpoint parameter looks like this:

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

**We need to modify the parameter schema by adding UUID format and making it required.**

**In the configuration file** `openapi-modifier-config.js`, we add the `patch-endpoint-parameter-schema` rule:

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

**After applying the rule**, the `openapi.yaml` file looks like this:

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
### 2. Modifying Parameter Component Schema

Practical example:

**In the `openapi.yaml` file**, the parameter component looks like this:

```yaml
components:
  parameters:
    PetIdParam:
      name: petId
      in: path
      schema:
        type: string
```

**We need to modify the parameter component schema by adding UUID format.**

**In the configuration file** `openapi-modifier-config.js`, we add the `patch-endpoint-parameter-schema` rule:

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

**After applying the rule**, the `openapi.yaml` file looks like this:

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

## Important Notes

- The rule skips parameters defined via references ($ref)
- If the specified parameter or endpoint is not found, the rule outputs a warning for timely updating of the openapi-modifier configuration
- Changes are applied atomically - either all changes are successful, or the specification remains unchanged

## Useful Links

- [Rule usage examples in tests](./index.test.ts)  
- [Differences between merge and deepmerge methods](../../../docs/merge-vs-deepmerge.md)
- [OpenAPI Specification Examples](../../../docs/schema-diff.md) 