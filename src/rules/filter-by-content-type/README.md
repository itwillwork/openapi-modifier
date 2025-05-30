[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# filter-by-content-type

The rule allows filtering content types in the OpenAPI specification. It enables explicit specification of which content types should be kept or removed from the specification. The rule applies to all API components, including requests, responses, and common components.



## Configuration

| Parameter  | Description                                          | Example                | Type           | Default |
|------------|------------------------------------------------------|------------------------|----------------|---------|
| `enabled`  | [**optional**] List of allowed content types. If not specified, all types not listed in `disabled` are kept | `['application/json']` | `Array<string>` |         |
| `disabled` | [**optional**] List of forbidden content types       | `['multipart/form-data']` | `Array<string>` |         |

Configuration examples:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "filter-by-content-type",
            config: {
                enabled: ['application/json'], // keep only application/json content type, remove all others
            }
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
            rule: "filter-by-content-type",
            config: {
                disabled: ['multipart/form-data'], // remove multipart/form-data content type, keep all others
            }
        }
        // ... other rules
    ]
}
``` 

> [!IMPORTANT]
> 1. If both `enabled` and `disabled` parameters are specified, the `enabled` filter is applied first, followed by `disabled`
> 2. The rule outputs warnings for content types specified in the configuration but not found in the specification

**If you need to modify multiple specifications**, you can use this rule multiple times in the overall configuration pipeline.

## Motivation

<a name="custom_anchor_motivation_1"></a>
### 1. Need to keep only specific content types for code generation

Practical example:

**In the `openapi.yaml` file**, the endpoint documentation looks like this:

```yaml
paths:
  /pets:
    get:
      summary: List all pets
      responses:
        403:
          content:
            'application/xml':
              schema:
                type: 'number'
            'application/json':
              schema:
                type: 'object'
```
**We need to remove responses/requests in `application/xml` format that are not used by the application.**

**In the configuration file** `openapi-modifier-config.js`, we add the `filter-by-content-type` rule:

```js
module.exports = {
    pipeline: [
        {
            rule: "filter-by-content-type",
            config: {
                enabled: ["application/json"],
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
        403:
          content:
            'application/json':
              schema:
                type: 'object'
```

<a name="custom_anchor_motivation_2"></a>
### 2. Need to exclude specific content types

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
            'application/json':
              schema:
                type: 'object'
            'text/plain':
              schema:
                type: 'string'
```

**We need to exclude `text/plain`.**

**In the configuration file** `openapi-modifier-config.js`, we add the `filter-by-content-type` rule:

```js
module.exports = {
    pipeline: [
        {
            rule: "filter-by-content-type",
            config: {
                disabled: ["text/plain"]
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

1. If both `enabled` and `disabled` parameters are specified, the `enabled` filter is applied first, followed by `disabled`
2. The rule outputs warnings for content types specified in the configuration but not found in the specification

## Useful Links

- [Rule usage examples in tests](./index.test.ts)  

- [DeepWiki Documentation](https://deepwiki.com/itwillwork/openapi-modifier)
- [Context7 documentation for LLMs and AI code editors](https://context7.com/itwillwork/openapi-modifier)