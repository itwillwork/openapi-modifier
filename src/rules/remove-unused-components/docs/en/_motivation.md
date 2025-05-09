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