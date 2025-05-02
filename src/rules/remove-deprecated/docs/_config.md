| Параметр | Описание                                                                                                                | Пример | Типизация | Дефолтное |
|----------|-------------------------------------------------------------------------------------------------------------------------|---------|-----------|-----------|
| `ignoreComponents` | Список компонентов, которые не должны быть удалены, даже если они помечены как устаревшие                               | `[{"componentName": "Pet"}]` | `Array<ComponentDescriptorConfig>` | `[]` |
| `ignoreEndpoints` | Список эндпоинтов, которые не должны быть удалены, даже если они помечены как устаревшие                                | `[{"path": "/pets", "method": "get"}]` | `Array<EndpointDescriptorConfig>` | `[]` |
| `ignoreEndpointParameters` | Список параметров эндпоинтов, которые не должны быть удалены, даже если они помечены как устаревшие                     | `[{"path": "/pets", "method": "get", "name": "limit", "in": "query"}]` | `Array<ParameterDescriptorConfig>` | `[]` |
| `showDeprecatedDescriptions` | Показывать ли описания удаляемых устаревших элементов в логах, полезно для пояснения, что нужно использовать вместо них | `true` | `boolean` | `false` |

Пример конфигурации:

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

или более детальный

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