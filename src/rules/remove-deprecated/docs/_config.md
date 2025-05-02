| Параметр | Описание                                                                                                                | Пример | Типизация | Дефолтное |
|----------|-------------------------------------------------------------------------------------------------------------------------|---------|-----------|-----------|
| `ignoreComponents` | [**опциональный**] Список компонентов, которые не должны быть удалены, даже если они помечены как устаревшие            | `[{"componentName": "Pet"}]` | `Array<ComponentDescriptorConfig>` | `[]` |
| `ignoreEndpoints` | [**опциональный**] Список эндпоинтов, которые не должны быть удалены, даже если они помечены как устаревшие             | `[{"path": "/pets", "method": "get"}]` | `Array<EndpointDescriptorConfig>` | `[]` |
| `ignoreEndpointParameters` | [**опциональный**] Список параметров эндпоинтов, которые не должны быть удалены, даже если они помечены как устаревшие  | `[{"path": "/pets", "method": "get", "name": "limit", "in": "query"}]` | `Array<ParameterDescriptorConfig>` | `[]` |
| `showDeprecatedDescriptions` | [**опциональный**] Показывать ли описания удаляемых устаревших элементов в логах, полезно для пояснения, что нужно использовать вместо них | `true` | `boolean` | `false` |

> [!IMPORTANT]  
> Учитываются только локальные $ref'ы файла, вида: `#/...`

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

Пример более детальной конфигурации:

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