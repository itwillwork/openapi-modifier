[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# remove-deprecated

The rule allows removing deprecated elements from the OpenAPI specification. It can remove deprecated components, endpoints, parameters, and properties, while providing the ability to ignore specific elements and display descriptions of removed elements.

> [!IMPORTANT]  
> Helps in backend interaction processes: backend marks a field as deprecated, the rule removes it from openapi, and because the field disappears during code generation, it forces frontend to gradually move away from using deprecated fields and endpoints.
> Therefore, the rule is recommended to be enabled by default

## Configuration

| Parameter | Description                                                                                                                | Example                                                                | Type | Default |
|----------|-------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------|-----------|-----------|
| `ignoreComponents` | [**optional**] List of components that should not be removed, even if they are marked as deprecated            | `[{"componentName": "Pet"}]`                                           | `Array<{ componentName: string }>` | `[]` |
| `ignoreEndpoints` | [**optional**] List of endpoints that should not be removed, even if they are marked as deprecated             | `["GET /pets"]`                                                        | `Array<string \ { path: string; method: string }>` | `[]` |
| `ignoreEndpointParameters` | [**optional**] List of endpoint parameters that should not be removed, even if they are marked as deprecated  | `[{"path": "/pets", "method": "get", "name": "limit", "in": "query"}]` | `Array<{ path: string; method: string; name: string; in: "query" \ "path" \ "header" \ "cookie" }>` | `[]` |
| `showDeprecatedDescriptions` | [**optional**] Whether to show descriptions of removed deprecated elements in logs, useful for explaining what should be used instead | `true`                                                                 | `boolean` | `false` |

> [!IMPORTANT]  
> Only local $refs of the file are considered, in the format: `#/...`

Configuration example:

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-deprecated",
            config: {},
        }
    ]
}
```

Example of a more detailed configuration:

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-deprecated",
            config: {
                ignoreComponents: [
                    { componentName: "Pet" } // save the Pet component even if it is marked as deprecated
                ],
                ignoreEndpoints: [
                    { path: "/pets", method: "get" } // save GET /pets even if it is marked as deprecated
                ],
                ignoreEndpointParameters: [
                    { path: "/pets", method: "get", name: "limit", in: "query" } // keep the limit parameter in GET /pets even if it is marked as deprecated
                ],
                showDeprecatedDescriptions: true //  output descriptions of deleted deprecated items to the console
            },
        }
    ]
}
```

**If you need to modify multiple specifications**, you can use this rule multiple times in the overall configuration pipeline.

## Motivation

<a name="custom_anchor_motivation_1"></a>
### 1. Need to remove deprecated components from the specification

Practical example:

**In the `openapi.yaml` file** there is a deprecated component:

```yaml
components:
  schemas:
    OldPet:
      deprecated: true
      description: "This schema is deprecated, use Pet instead"
      type: object
      properties:
        name:
          type: string
```

**We need to remove this component.**

**In the configuration file** `openapi-modifier-config.js` we add the `remove-deprecated` rule:

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-deprecated",
            config: {
                showDeprecatedDescriptions: true
            },
        }
    ]
}
```

**After applying the rule**, the `OldPet` component will be removed from the specification.

<a name="custom_anchor_motivation_2"></a>
### 2. Need to remove deprecated endpoints from the specification

Practical example:

**In the `openapi.yaml` file** there is a deprecated endpoint:

```yaml
paths:
  /old-pets:
    get:
      deprecated: true
      description: "This endpoint is deprecated, use /pets instead"
      summary: List all old pets
      responses:
        200:
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/OldPet'
```

**We need to remove this endpoint.**

**In the configuration file** `openapi-modifier-config.js` we add the `remove-deprecated` rule:

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-deprecated",
            config: {
                showDeprecatedDescriptions: true
            },
        }
    ]
}
```

**After applying the rule**, the `/old-pets` endpoint will be removed from the specification.

## Important Notes

- The rule removes elements marked as `deprecated: true`
- Removal is recursive - if a component is marked as deprecated, all its references are removed
- When removing an endpoint, all its methods are removed
- The rule checks and resolves references ($ref) before making a decision to remove
- If `showDeprecatedDescriptions` is enabled, descriptions of all removed elements are output to the log
- The rule outputs warnings for ignored components that were not found

## Useful Links

- [Rule usage examples in tests](./index.test.ts)  
 