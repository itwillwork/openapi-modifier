<a name="custom_anchor_motivation_1"></a>
### 1. Need to merge multiple OpenAPI specifications into one

Often there is a need to add future API designs to OpenAPI that don't exist in the microservice yet, but the API format is agreed upon and interface development can begin.

Practical example:

**In file `openapi.yaml`** main specification:

```yaml
openapi: 3.0.0
info:
  title: Main API
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

**In file `additional-spec.yaml`** additional specification:

```yaml
openapi: 3.0.0
info:
  title: Additional API
paths:
  /users:
    get:
      summary: List all users
      responses:
        200:
          content:
            'application/json':
              schema:
                type: 'object'
```

**In configuration file** `openapi-modifier-config.js` add the `merge-openapi-spec` rule:

```js
module.exports = {
    pipeline: [
        {
            rule: "merge-openapi-spec",
            config: {
                path: "./additional-spec.yaml"
            },
        }
    ]
}
```

**After applying the rule**, file `openapi.yaml` will contain the merged specification:

```yaml
openapi: 3.0.0
info:
  title: Main API
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
  /users:
    get:
      summary: List all users
      responses:
        200:
          content:
            'application/json':
              schema:
                type: 'object'
``` 