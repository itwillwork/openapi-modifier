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