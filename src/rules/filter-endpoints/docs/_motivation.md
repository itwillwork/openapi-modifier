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
