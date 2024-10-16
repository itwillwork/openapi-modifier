> [!IMPORTANT]  
> Правило работает либо в режиме enabled - фильтрации endpoint'ов из спецификации (когда указан в конфигурации либо `enabled`, либо `enabledPathRegExp`), либо в disabled - исключения endpoint'ов из спецификации (когда указан в конфигурации либо `disabled`, либо `disabledPathRegExp`)

| Параметр    | Описание                                                                                                                                                                               | Пример                | Типизация       | Дефолтное       |
| -------- |----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------|-----------------|-----------------|
| `enabled`  | Фильтрует endpoint'ы из спецификации по совпадению path и method, в итоговой спецификации останутся лишь указанные endpoint'ы. **Path должен быть таким же как в самой спецификации.** | `['GET /foo/ping']` | `Array<string>` | |
| `enabledPathRegExp`  | Фильтрует endpoint'ы из спецификации по RegExp, в итоговой спецификации останутся лишь подходящие под RegExp endpoint'ы.                                                                           | `['GET /foo/ping']` | `Array<string>` | |
| `disabled`  | Исключает endpoint'ы из спецификации по совпадению path и method, в итоговой спецификации исчезнут указанные endpoint'ы. **Path должен быть таким же как в самой спецификации.**       | `['GET /foo/ping']` | `Array<string>` | |
| `disabledPathRegExp`  | Исключает endpoint'ы из спецификации по RegExp, в итоговой спецификации исчезнут подходящие под RegExp endpoint'ы.                                                                     | `['GET /foo/ping']` | `Array<string>` | |

Примеры конфигурации:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "filter-endpoints",
            config: {
                enabled: [
                    'GET /foo/ping'
                ],
                printIgnoredEndpoints: false,
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
                    /\/public/
                ],
                printIgnoredEndpoints: false,
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
                    'GET /foo/ping'
                ],
                printIgnoredEndpoints: false,
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
                    /\/internal/
                ],
                printIgnoredEndpoints: false,
            },
        }
        // ... other rules
    ]
}
```

