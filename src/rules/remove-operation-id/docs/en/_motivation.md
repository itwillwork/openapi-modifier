<a name="custom_anchor_motivation_1"></a>
### 1. Need to remove operationId from all operations for TypeScript type generation

Practical example:

**In the `openapi.yaml` file**, the endpoint documentation looks like this:

```yaml
paths:
  /pets:
    get:
      operationId: getPets
      summary: List all pets
      responses:
        200:
          content:
            'application/json':
              schema:
                type: 'object'
```

**We need to remove operationId from all operations.**

**In the configuration file** `openapi-modifier-config.js`, we add the `remove-operation-id` rule:

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-operation-id",
            config: {
                ignore: []
            },
        }
    ]
}
```

**After applying the rule**, the `openapi.yaml` file looks like this:

```yaml
paths:
  /pets:
    get:
      summary: List all pets
      responses:
        200:
          content:
            'application/json':
              schema:
                type: 'object'
``` 