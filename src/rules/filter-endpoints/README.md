[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# filter-endpoints

The rule allows filtering endpoints in the OpenAPI specification based on their paths and methods. It enables explicit specification of which endpoints should be kept or removed from the specification. The rule supports both exact matching and regular expression-based filtering.



## Configuration

> [!IMPORTANT]  
> The rule works either in enabled mode - filtering endpoints from the specification (when either `enabled` or `enabledPathRegExp` is specified in the configuration), or in disabled mode - excluding endpoints from the specification (when either `disabled` or `disabledPathRegExp` is specified in the configuration)

| Parameter             | Description                                                                                                                                                                               | Example                | Typing          | Default         |
|----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------|-----------------|-----------------|
| `enabled`            | List of endpoints to keep | `[{"method": "GET", "path": "/pets"}]` | `Array<string \ { path: string; method: string }>` | - |
| `enabledPathRegExp`  | List of regular expressions for paths to keep | `[/^\/api\/v1/]` | `Array<RegExp>` | - |
| `disabled`           | List of endpoints to exclude | `[{"method": "POST", "path": "/pets"}]` | `Array<string \ { path: string; method: string }>` | - |
| `disabledPathRegExp` | List of regular expressions for paths to exclude | `[/^\/internal/]` | `Array<RegExp>` | - |
| `printIgnoredEndpoints` | Whether to output information about excluded endpoints to the log | `true` | `boolean` | `false` |

Configuration examples:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "filter-endpoints",
            config: {
                enabled: [
                    'GET /foo/ping' // keep only GET /foo/ping endpoint, all others will be removed
                ],
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
            rule: "filter-endpoints",
            config: {
                enabledPathRegExp: [
                    /\/public/ // keep all endpoints whose path contains /public
                ],
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
            rule: "filter-endpoints",
            config: {
                disabled: [
                    'GET /foo/ping' // remove GET /foo/ping endpoint, all others will remain
                ],
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
            rule: "filter-endpoints",
            config: {
                disabledPathRegExp: [
                    /\/internal/ // remove all endpoints whose path contains /internal
                ],
                printIgnoredEndpoints: true, // print information about removed endpoints to console
            },
        }
        // ... other rules
    ]
} 
```

**If you need to modify multiple specifications**, you can use this rule multiple times in the overall configuration pipeline.

## Motivation

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

## Important Notes

- The rule outputs warnings for endpoints specified in the configuration but not found in the specification

## Useful Links

- [Rule usage examples in tests](./index.test.ts)  

- [DeepWiki Documentation](https://deepwiki.com/itwillwork/openapi-modifier)
- [Context7 documentation for LLMs and AI code editors](https://context7.com/itwillwork/openapi-modifier)