<a name="custom_anchor_motivation_1"></a>
### 1. Need to keep only public API endpoints

Practical example:

**In the `openapi.yaml` file** there are many endpoints, including internal ones:

```yaml
paths:
  /api/v1/pets:
    get:
      summary: List all pets
    post:
      summary: Create a pet
  /internal/health:
    get:
      summary: Health check
  /internal/metrics:
    get:
      summary: Metrics endpoint
```

**We need to keep only public endpoints and exclude internal ones.**

**In the configuration file** `openapi-modifier-config.js` we add the `filter-endpoints` rule:

```js
module.exports = {
    pipeline: [
        {
            rule: "filter-endpoints",
            config: {
                disabledPathRegExp: [/^\/internal/]
            }
        }
    ]
}
```

**After applying the rule**, the `openapi.yaml` file will contain only public endpoints:

```yaml
paths:
  /api/v1/pets:
    get:
      summary: List all pets
    post:
      summary: Create a pet
``` 