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
                enabled: ['application/json'],
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
            rule: "filter-by-content-type",
            config: {
                disabled: ['multipart/form-data'],
            },
        }
        // ... other rules
    ]
}
``` 