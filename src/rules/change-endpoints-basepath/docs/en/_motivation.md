<a name="custom_anchor_motivation_1"></a>
### 1. Need to shorten the pathname for some (or all) endpoints

Practical example:

**In the `openapi.yaml` file**, the endpoint documentation looks like this:

```yaml
paths:
  /public/api/v1/pets:
    get:
      summary: List all pets
```
**We need to remove `/public/api` to shorten `/public/api/v1/pets` to `/v1/pets`.**

**In the configuration file** `openapi-modifier-config.js`, we add the `change-endpoints-basepath` rule:

```js
module.exports = {
    pipeline: [
        {
            rule: "change-endpoints-basepath",
            config: {
                map: { '/public/api': '' },
            },
        }
    ]
}
```

**After applying the rule**, the `openapi.yaml` file looks like this:

```yaml
paths:
  /v1/pets:
    get:
      summary: List all pets
``` 