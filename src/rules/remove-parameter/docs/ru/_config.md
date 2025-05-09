| Параметр    | Описание                                                                                                                                  | Пример                     | Типизация              | Дефолтное |
| -------- |-------------------------------------------------------------------------------------------------------------------------------------------|----------------------------|------------------------|-----------|
| `endpointDescriptor`  | [**обязательный**] Описание эндпоинта, из которого нужно удалить параметр                                                                 | `{"path": "/pets", "method": "get"}` | `EndpointDescriptorConfig` | -         |
| `parameterDescriptor`  | [**обязательный**] Описание параметра, который нужно удалить. В параметр `in` можно указать: `"query"`, `"path"`, `"header"`, `"cookie"`. | `{"name": "petId", "in": "path"}` | `EndpointParameterDescriptorConfig` | -         |

Пример конфигурации:

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