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
                    { componentName: "Pet" } // save the Pet component even if it is marked as deprecated
                ],
                ignoreEndpoints: [
                    { path: "/pets", method: "get" } // save GET /pets even if it is marked as deprecated
                ],
                ignoreEndpointParameters: [
                    { path: "/pets", method: "get", name: "limit", in: "query" } // keep the limit parameter in GET /pets even if it is marked as deprecated
                ],
                showDeprecatedDescriptions: true //  output descriptions of deleted deprecated items to the console
            },
        }
    ]
}
```