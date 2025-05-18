[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# remove-min-items

Removes the `minItems` property from all schemas in the OpenAPI specification.



## Configuration

| Parameter | Description | Example | Type | Default |
| --------- | ----------- | ------- | ---- | ------- |
| `showUnusedWarning` | [**optional**] Show a warning if no schemas with `minItems` are found | `true` | `boolean` | `false` |

Configuration example:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "remove-min-items",
            config: {} // remove minItems property from all schemas, don't show warnings
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
            rule: "remove-min-items",
            config: {
                showUnusedWarning: true // show warning if no schemas with minItems are found in the specification
            }
        }
        // ... other rules
    ]
}
```

**If you need to modify multiple specifications**, you can use this rule multiple times in the overall configuration pipeline.

## Motivation

<a name="custom_anchor_motivation_1"></a>

### 1. Need to remove `minItems` constraint from schemas for TypeScript type generation

In some cases, the `minItems` constraint can interfere with code generation or create unnecessary checks. Removing this property makes the schema more flexible and universal.

Practical example:

**In the `openapi.yaml` file**, the schema looks like this:

```yaml
components:
  schemas:
    PetList:
      type: array
      items:
        $ref: '#/components/schemas/Pet'
      minItems: 1
```

**We need to remove the `minItems: 1` constraint.**

**In the configuration file** `openapi-modifier-config.js`, we add the `remove-min-items` rule:

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-min-items",
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
    PetList:
      type: array
      items:
        $ref: '#/components/schemas/Pet'
```

<a name="custom_anchor_motivation_2"></a>

## Important Notes

- The rule does not affect schemas defined via references ($ref)
- If `showUnusedWarning` is enabled, the rule will display a warning if no schemas with `minItems` are found, to help keep the openapi-modifier configuration up to date

## Useful Links

- [Rule usage examples in tests](./index.test.ts)  
 