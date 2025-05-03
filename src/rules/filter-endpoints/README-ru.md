[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# filter-endpoints

Правило позволяет фильтровать эндпоинты в OpenAPI спецификации на основе их путей и методов. С его помощью можно явно указать, какие эндпоинты должны быть сохранены или удалены из спецификации. Правило поддерживает как точное соответствие, так и фильтрацию по регулярным выражениям.

## Конфигурация

> [!IMPORTANT]  
> Правило работает либо в режиме enabled - фильтрации endpoint'ов из спецификации (когда указан в конфигурации либо `enabled`, либо `enabledPathRegExp`), либо в disabled - исключения endpoint'ов из спецификации (когда указан в конфигурации либо `disabled`, либо `disabledPathRegExp`)

| Параметр                | Описание                                                                                                                                                                               | Пример                | Типизация       | Дефолтное       |
|-------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------|-----------------|-----------------|
| `enabled`               | Список эндпоинтов, которые нужно оставить | `[{"method": "GET", "path": "/pets"}]` | `Array<EndpointDescriptor>` | - |
| `enabledPathRegExp`     | Список регулярных выражений для путей, которые нужно оставить | `[/^\/api\/v1/]` | `Array<RegExp>` | - |
| `disabled`              | Список эндпоинтов, которые нужно исключить | `[{"method": "POST", "path": "/pets"}]` | `Array<EndpointDescriptor>` | - |
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
                    'GET /foo/ping'
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
                    /\/public/
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
                    'GET /foo/ping'
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
                    /\/internal/
                ],
                printIgnoredEndpoints: true,
            },
        }
        // ... other rules
    ]
}
```



**Если необходимо изменить несколько спецификаций**, вы можете использовать несколько раз данное правило в общем пайлайне конфигурации.

## Мотивация

<a name="custom_anchor_motivation_1"></a>
### 1. Необходимо оставить только эндпоинты для публичного API

Практический пример:

**В файле `openapi.yaml`** есть множество эндпоинтов, включая внутренние:

```yaml
paths:
  /api/v1/pets:
    get:
      summary: List all pets
    post:
      summary: Create a pet
  /internal/health:
    get:
      summary: Health check
  /internal/metrics:
    get:
      summary: Metrics endpoint
```

**Нужно оставить только публичные эндпоинты и исключить внутренние.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `filter-endpoints`:

```js
module.exports = {
    pipeline: [
        {
            rule: "filter-endpoints",
            config: {
                disabledPathRegExp: [/^\/internal/]
            }
        }
    ]
}
```

**После применения правила**, файл `openapi.yaml` будет содержать только публичные эндпоинты:

```yaml
paths:
  /api/v1/pets:
    get:
      summary: List all pets
    post:
      summary: Create a pet
```


## Полезные ссылки

{{{links}}}
- [Примеры применения правила в тестах](./index.test.ts)  