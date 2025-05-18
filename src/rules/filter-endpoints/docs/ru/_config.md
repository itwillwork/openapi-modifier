> [!IMPORTANT]  
> Правило работает либо в режиме enabled - фильтрации endpoint'ов из спецификации (когда указан в конфигурации либо `enabled`, либо `enabledPathRegExp`), либо в disabled - исключения endpoint'ов из спецификации (когда указан в конфигурации либо `disabled`, либо `disabledPathRegExp`)

| Параметр                | Описание                                                                                                                                                                               | Пример                | Типизация       | Дефолтное       |
|-------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------|-----------------|-----------------|
| `enabled`               | Список эндпоинтов, которые нужно оставить | `[{"method": "GET", "path": "/pets"}]` | `Array<EndpointDescriptorConfig>` | - |
| `enabledPathRegExp`     | Список регулярных выражений для путей, которые нужно оставить | `[/^\/api\/v1/]` | `Array<RegExp>` | - |
| `disabled`              | Список эндпоинтов, которые нужно исключить | `[{"method": "POST", "path": "/pets"}]` | `Array<EndpointDescriptorConfig>` | - |
| `disabledPathRegExp`    | Список регулярных выражений для путей, которые нужно исключить | `[/^\/internal/]` | `Array<RegExp>` | - |
| `printIgnoredEndpoints` | Выводить ли в лог информацию об исключенных эндпоинтах | `true` | `boolean` | `false` |

Примеры конфигураций:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "filter-endpoints",
            config: {
                enabled: [
                    'GET /foo/ping' // оставляем только эндпоинт GET /foo/ping, все остальные будут удалены
                ],
            },
        }
        // ... other rules
    ]
}
```

или

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "filter-endpoints",
            config: {
                enabledPathRegExp: [
                    /\/public/ // оставляем все эндпоинты, путь которых содержит /public
                ],
            },
        }
        // ... other rules
    ]
}
```

или

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "filter-endpoints",
            config: {
                disabled: [
                    'GET /foo/ping' // удаляем эндпоинт GET /foo/ping, все остальные остаются
                ],
            },
        }
        // ... other rules
    ]
}
```

или

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "filter-endpoints",
            config: {
                disabledPathRegExp: [
                    /\/internal/ // удаляем все эндпоинты, путь которых содержит /internal
                ],
                printIgnoredEndpoints: true, // выводим в консоль информацию об удаленных эндпоинтах
            },
        }
        // ... other rules
    ]
}
```

