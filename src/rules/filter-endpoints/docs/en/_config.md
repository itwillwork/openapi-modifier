> [!IMPORTANT]  
> The rule works either in enabled mode - filtering endpoints from the specification (when either `enabled` or `enabledPathRegExp` is specified in the configuration), or in disabled mode - excluding endpoints from the specification (when either `disabled` or `disabledPathRegExp` is specified in the configuration)

| Parameter             | Description                                                                                                                                                                               | Example                | Typing          | Default         |
|----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------|-----------------|-----------------|
| `enabled`            | List of endpoints to keep | `[{"method": "GET", "path": "/pets"}]` | `Array<EndpointDescriptorConfig>` | - |
| `enabledPathRegExp`  | List of regular expressions for paths to keep | `[/^\/api\/v1/]` | `Array<RegExp>` | - |
| `disabled`           | List of endpoints to exclude | `[{"method": "POST", "path": "/pets"}]` | `Array<EndpointDescriptorConfig>` | - |
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