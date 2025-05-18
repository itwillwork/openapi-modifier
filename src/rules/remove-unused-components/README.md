[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# remove-unused-components

Removes unused components from the OpenAPI specification. The rule analyzes all component references in the document and removes those that are not used anywhere.



## Configuration

| Parameter    | Description                          | Example            | Type              | Default |
| -------- |-----------------------------------|-------------------|------------------------|-----------|
| `ignore`  | [**optional**] List of components or regular expressions to ignore during removal | `["NotFoundDTO", "/^Error.*/"]` | `Array<string \| RegExp>` | `[]` |
| `printDeletedComponents` | [**optional**] If true, prints the list of deleted components to console | `true` | `boolean` | `false` |

Configuration example:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "remove-unused-components",
            config: {},
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
            rule: "remove-unused-components",
            config: {
                ignore: [
                    "NotFoundDTO",
                    /^Error.*/, // ignore all components starting with Error
                    /.*Response$/ // ignore all components ending with Response
                ],
                printDeletedComponents: true // print list of deleted components to console
            },
        }
        // ... other rules
    ]
} 
```

**If you need to modify multiple specifications**, you can use this rule multiple times in the overall configuration pipeline.

## Motivation

<a name="custom_anchor_motivation_1"></a>
### 1. Cleaning up unused components from the specification

After applying other rules, unused components may appear in the specification, and it's better to remove them to promptly eliminate them from the generated TypeScript typings and switch to actual types.

Practical example:

**In the `openapi.yaml` file** there are unused components:

```yaml
components:
  schemas:
    User:
      type: object
      properties:
        name:
          type: string
    UnusedSchema:
      type: object
      properties:
        field:
          type: string
  responses:
    NotFound:
      description: Not found
    UnusedResponse:
      description: Unused response
```

**We need to remove the unused components `UnusedSchema` and `UnusedResponse`, but keep `User` and `NotFound`.**

**In the configuration file** `openapi-modifier-config.js` we add the `remove-unused-components` rule:

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-unused-components",
            config: {
                ignore: [
                    "User",
                    "NotFound"
                ]
            },
        }
    ]
}
```

**After applying the rule**, the `openapi.yaml` file looks like this:

```yaml
components:
  schemas:
    User:
      type: object
      properties:
        name:
          type: string
  responses:
    NotFound:
      description: Not found
```

## Important Notes



## Useful Links

- [Rule usage examples in tests](./index.test.ts)  
 