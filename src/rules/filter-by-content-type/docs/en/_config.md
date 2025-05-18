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