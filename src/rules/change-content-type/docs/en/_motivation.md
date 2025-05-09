<a name="custom_anchor_motivation_1"></a>
### 1. Need to replace/clarify content-type `*/*` with something more specific for code generation

Practical example:

**In the `openapi.yaml` file**, the endpoint documentation looks like this:

```yaml
paths:
  /pets:
    get:
      summary: List all pets
      responses:
        200:
          content:
            '*/*':
              schema:
                type: 'object'
```
**Need to replace `*/*` with `application/json`.**

**In the configuration file** `openapi-modifier-config.js`, add the `change-content-type` rule:

```js
module.exports = {
    pipeline: [
        {
            rule: "change-content-type",
            config: {
                map: {
                    "*/*": "application/json"
                }
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

<a name="custom_anchor_motivation_2"></a>
### 2. Typo in content-type

Practical example:

**In the `openapi.yaml` file**, the endpoint documentation looks like this:

```yaml
paths:
  /pets:
    get:
      summary: List all pets
      responses:
        200:
          content:
            'json':
              schema:
                type: 'object'
```
**Need to replace `json` with `application/json`.**

**In the configuration file** `openapi-modifier-config.js`, add the `change-content-type` rule:

```js
module.exports = {
    pipeline: [
        {
            rule: "change-content-type",
            config: {
                map: {
                    "json": "application/json"
                }
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