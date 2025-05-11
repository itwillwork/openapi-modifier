| Parameter | Description                                                                                                                | Example                                                                | Type | Default |
|----------|-------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------|-----------|-----------|
| `ignoreComponents` | [**optional**] List of components that should not be removed, even if they are marked as deprecated            | `[{"componentName": "Pet"}]`                                           | `Array<ComponentDescriptorConfig>` | `[]` |
| `ignoreEndpoints` | [**optional**] List of endpoints that should not be removed, even if they are marked as deprecated             | `["GET /pets"]`                                                        | `Array<EndpointDescriptorConfig>` | `[]` |
| `ignoreEndpointParameters` | [**optional**] List of endpoint parameters that should not be removed, even if they are marked as deprecated  | `[{"path": "/pets", "method": "get", "name": "limit", "in": "query"}]` | `Array<ParameterDescriptorConfig>` | `[]` |
| `showDeprecatedDescriptions` | [**optional**] Whether to show descriptions of removed deprecated elements in logs, useful for explaining what should be used instead | `true`                                                                 | `boolean` | `false` |

> [!IMPORTANT]  
> Only local $refs of the file are considered, in the format: `#/...`

Configuration example:

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-deprecated",
            config: {},
        }
    ]
}
```

Example of a more detailed configuration:

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-deprecated",
            config: {
                ignoreComponents: [
                    { componentName: "Pet" }
                ],
                ignoreEndpoints: [
                    { path: "/pets", method: "get" }
                ],
                ignoreEndpointParameters: [
                    { path: "/pets", method: "get", name: "limit", in: "query" }
                ],
                showDeprecatedDescriptions: true
            },
        }
    ]
} 
```