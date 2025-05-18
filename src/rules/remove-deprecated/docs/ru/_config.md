| Параметр | Описание                                                                                                                | Пример | Типизация | Дефолтное |
|----------|-------------------------------------------------------------------------------------------------------------------------|---------|-----------|-----------|
| `ignoreComponents` | [**опциональный**] Список компонентов, которые не должны быть удалены, даже если они помечены как устаревшие            | `[{"componentName": "Pet"}]` | `Array<ComponentDescriptorConfig>` | `[]` |
| `ignoreEndpoints` | [**опциональный**] Список эндпоинтов, которые не должны быть удалены, даже если они помечены как устаревшие             | `["GET /pets"]` | `Array<EndpointDescriptorConfig>` | `[]` |
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
                    { componentName: "Pet" } // сохраняем компонент Pet даже если он помечен как устаревший
                ],
                ignoreEndpoints: [
                    { path: "/pets", method: "get" } // сохраняем GET /pets даже если он помечен как устаревший
                ],
                ignoreEndpointParameters: [
                    { path: "/pets", method: "get", name: "limit", in: "query" } // сохраняем параметр limit в GET /pets даже если он помечен как устаревший
                ],
                showDeprecatedDescriptions: true // выводим в консоль описания удаленных устаревших элементов
            },
        }
    ]
}
```