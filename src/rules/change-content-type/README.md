[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# change-content-type

Changes content types in the OpenAPI specification according to the replacement dictionary



## Configuration

| Parameter | Description                          | Example                     | Typing              | Default |
|----------|-----------------------------------|----------------------------|------------------------|-----------|
| `map`    | [**required**] Dictionary for content type replacements | `{"*/*": "application/json"}` | `Record<string, string>` | `{}`        |

Configuration example:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "change-content-type",
            config: {
                map: {
                    "*/*": "application/json"
                }
            },
        }
        // ... other rules
    ]
}
```

**If you need to modify multiple specifications**, you can use this rule multiple times in the overall configuration pipeline.

## Motivation

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

## Important Notes

-

## Useful Links

- [Rule usage examples in tests](./index.test.ts)  
 