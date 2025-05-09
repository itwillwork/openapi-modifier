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