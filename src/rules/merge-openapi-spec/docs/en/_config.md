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
```