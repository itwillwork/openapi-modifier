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