| Parameter | Description | Example | Typing | Default |
| -------- |-------------------------------------------------------------------------------------------------------------------------------------------|----------------------------|------------------------|-----------|
| `endpointDescriptor`  | [**required**] Description of the endpoint from which to remove the parameter | `{"path": "/pets", "method": "get"}` | `EndpointDescriptorConfig` | - |
| `parameterDescriptor`  | [**required**] Description of the parameter to remove. In the `in` parameter, you can specify: `"query"`, `"path"`, `"header"`, `"cookie"`. | `{"name": "petId", "in": "path"}` | `EndpointParameterDescriptorConfig` | - |

Configuration example:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "remove-parameter",
            config: {
                endpointDescriptor: "GET /pets/{petId}",
                parameterDescriptor: {
                    name: "version",
                    in: "query"
                }
            },
        }
        // ... other rules
    ]
}
``` 