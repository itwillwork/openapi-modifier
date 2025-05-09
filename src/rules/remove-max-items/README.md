[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# remove-max-items

Removes the `maxItems` property from all schemas in the OpenAPI specification.



## Configuration

| Parameter | Description | Example | Type | Default |
| --------- | ----------- | ------- | ---- | ------- |
| `showUnusedWarning` | [**optional**] Show a warning if no schemas with maxItems are found | `true` | `boolean` | `false` |

Configuration example:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "remove-max-items",
            config: {},
        }
        // ... other rules
    ]
}
```

Example of more detailed configuration:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "remove-max-items",
            config: {
                showUnusedWarning: true
            },
        }
        // ... other rules
    ]
}
```

**If you need to modify multiple specifications**, you can use this rule multiple times in the overall configuration pipeline.

## Motivation

<a name="custom_anchor_motivation_1"></a>
### 1. Need to remove `maxItems` constraint from schemas for TypeScript type generation

In some cases, the `maxItems` constraint can interfere with code generation or create unnecessary checks. Removing this property makes the schema more flexible and universal.

Practical example:

**In the `openapi.yaml` file**, the schema looks like this:

```yaml
components:
  schemas:
    Pet:
      type: object
      properties:
        tags:
          type: array
          maxItems: 10
          items:
            type: string
```

**In the configuration file** `openapi-modifier-config.js`, add the `remove-max-items` rule:

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-max-items",
            config: {
                showUnusedWarning: true
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
        tags:
          type: array
          items:
            type: string
```

## Important Notes

- The rule does not affect schemas defined via references ($ref)
- If `showUnusedWarning` is enabled, the rule will show a warning if no schemas with `maxItems` are found, to help keep the openapi-modifier configuration up to date

## Useful Links

- [Rule usage examples in tests](./index.test.ts)  
 