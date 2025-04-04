# filter-endpoints

Фильтрует эндпоинты в OpenAPI спецификации на основе заданных правил включения и исключения.

## Config

| Параметр | Описание | Пример | Типизация | Дефолтное |
|----------|-----------|---------|------------|-----------|
| `enabled` | Список эндпоинтов, которые нужно оставить | `[{"method": "GET", "path": "/pets"}]` | `Array<EndpointDescriptor>` | `undefined` |
| `enabledPathRegExp` | Список регулярных выражений для путей, которые нужно оставить | `[/^\/api\/v1/]` | `Array<RegExp>` | `undefined` |
| `disabled` | Список эндпоинтов, которые нужно исключить | `[{"method": "POST", "path": "/pets"}]` | `Array<EndpointDescriptor>` | `undefined` |
| `disabledPathRegExp` | Список регулярных выражений для путей, которые нужно исключить | `[/^\/internal/]` | `Array<RegExp>` | `undefined` |
| `printIgnoredEndpoints` | Выводить ли в лог информацию об исключенных эндпоинтах | `true` | `boolean` | `undefined` |

Пример конфигурации:

```js
module.exports = {
    pipeline: [
        {
            rule: "filter-endpoints",
            config: {
                enabled: [
                    { method: "GET", path: "/pets" },
                    { method: "POST", path: "/pets" }
                ],
                enabledPathRegExp: [/^\/api\/v1/],
                disabled: [
                    { method: "DELETE", path: "/pets" }
                ],
                disabledPathRegExp: [/^\/internal/],
                printIgnoredEndpoints: true
            }
        }
    ]
}
```

## Motivation

<a name="custom_anchor_motivation_1"></a>
### 1. Необходимо оставить только определенные эндпоинты для публичного API

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
                enabledPathRegExp: [/^\/api\/v1/],
                disabledPathRegExp: [/^\/internal/],
                printIgnoredEndpoints: true
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

<a name="custom_anchor_motivation_2"></a>
### 2. Необходимо исключить определенные методы для конкретных путей

Практический пример:

**В файле `openapi.yaml`** есть эндпоинты с разными методами:

```yaml
paths:
  /pets:
    get:
      summary: List all pets
    post:
      summary: Create a pet
    put:
      summary: Update a pet
    delete:
      summary: Delete a pet
```

**Нужно исключить метод DELETE для всех путей.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `filter-endpoints`:

```js
module.exports = {
    pipeline: [
        {
            rule: "filter-endpoints",
            config: {
                disabled: [
                    { method: "DELETE", path: "*" }
                ]
            }
        }
    ]
}
```

**После применения правила**, файл `openapi.yaml` не будет содержать DELETE методы:

```yaml
paths:
  /pets:
    get:
      summary: List all pets
    post:
      summary: Create a pet
    put:
      summary: Update a pet
``` 