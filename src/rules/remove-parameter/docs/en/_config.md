| Parameter | Description | Example                           | Typing | Default |
| -------- |-------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------|------------------------|-----------|
| `endpointDescriptor`  | [**required**] Description of the endpoint from which to remove the parameter | `"GET /pets"`   | `EndpointDescriptorConfig` | - |
| `parameterDescriptor`  | [**required**] Description of the parameter to remove. In the `in` parameter, you can specify: `"query"`, `"path"`, `"header"`, `"cookie"`. | `{"name": "petId", "in": "path"}` | `EndpointParameterDescriptorConfig` | - |

Configuration example:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "remove-parameter",
            config: {
                endpointDescriptor: "GET /pets/{petId}", // specify the endpoint from which to remove the parameter
                parameterDescriptor: {
                    name: "version", // specify the name of the parameter to be deleted
                    in: "query" // specify the parameter location (query parameter)
                }
            },
        }
        // ... other rules
    ]
}
``` 