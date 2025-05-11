[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# merge-openapi-spec

Merges two OpenAPI specifications into one. Allows merging the current specification with an additional specification from a specified file. Supports working with files in JSON and YAML formats.



## Configuration

| Parameter                   | Description                                                                                                                                                                                                                                                                                                                                       | Example                                      | Type     | Default   |
|----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------|----------|-----------|
| `path`                     | [**required**] Path to the OpenAPI configuration that needs to be merged into the current specification. The path can be relative (relative to package.json location) or absolute (e.g., obtained via `__dirname` relative to config location). Supported formats: `*.json`, `*.yml`, `*.yaml`.                                                    | `temp-openapi-specs/new-list-endpoints.yaml` | `string` |           |
| `ignoreOperarionCollisions`| When merging multiple specifications, conflicts may occur when there are identical endpoints. By default, the tool prohibits merging if collisions are found to prevent unexpected changes in the source specification. This setting allows you to ignore conflicts and merge specifications anyway.                                                | `true`                                       | `boolean` | `false`   |
| `ignoreComponentCollisions`| When merging multiple specifications, conflicts may occur when there are identical common components. By default, the tool prohibits merging if collisions are found to prevent unexpected changes in the source specification. This setting allows you to ignore conflicts and merge specifications anyway.                                         | `true`                                       | `boolean` | `false`   |

> [!IMPORTANT]
> **If you need to merge multiple specifications**, you can use this rule multiple times in the general pipeline configuration.

Configuration examples:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "merge-openapi-spec",
            config: {
                path: 'temp-openapi-specs/new-list-endpoints.yaml',
            },
        }
        // ... other rules
    ]
}
```

or

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "merge-openapi-spec",
            config: {
                path: __dirname + '../temp-openapi-specs/new-list-endpoints.json',
                ignoreOperarionCollisions: true,
                ignoreComponentCollisions: true,
            },
        }
        // ... other rules
    ]
}

**If you need to modify multiple specifications**, you can use this rule multiple times in the overall configuration pipeline.

## Motivation

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

## Important Notes



## Useful Links

- [Rule usage examples in tests](./index.test.ts)  
 