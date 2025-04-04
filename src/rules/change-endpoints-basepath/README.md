# change-endpoints-basepath

Изменяет базовые пути (basepath) эндпоинтов в соответствии со словарем замен

## Config

| Параметр    | Описание                          | Пример                     | Типизация              | Дефолтное |
| -------- |-----------------------------------|----------------------------|------------------------|-----------|
| `map`  | [**обязательный**] Словарь замены путей | `{"/api/v1": "/v1"}` | `Record<string, string>` | `{}`        |
| `ignoreOperarionCollisions` | [**опциональный**] Игнорировать конфликты операций | `true` | `boolean` | `false` |

Пример конфигурации:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "change-endpoints-basepath",
            config: {
                map: {
                    "/api/v1": "/v1"
                },
                ignoreOperarionCollisions: false
            },
        }
        // ... other rules
    ]
}
```

## Motivation

<a name="custom_anchor_motivation_1"></a>
### 1. Необходимо изменить базовый путь API для соответствия новой структуре

Практический пример:

**В файле `openapi.yaml`** документация на endpoint выглядит так:

```yaml
paths:
  /api/v1/pets:
    get:
      summary: List all pets
      responses:
        200:
          content:
            'application/json':
              schema:
                type: 'object'
```
**Нужно заменить `/api/v1` на `/v1`.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `change-endpoints-basepath`:

```js
module.exports = {
    pipeline: [
        {
            rule: "change-endpoints-basepath",
            config: {
                map: {
                    "/api/v1": "/v1"
                }
            },
        }
    ]
}
```

**После применения правила**, файл `openapi.yaml` выглядит так:

```yaml
paths:
  /v1/pets:
    get:
      summary: List all pets
      responses:
        200:
          content:
            'application/json':
              schema:
                type: 'object'
```

<a name="custom_anchor_motivation_2"></a>
### 2. Обработка конфликтов операций

Правило проверяет наличие конфликтов операций при изменении путей. Если после замены пути возникает конфликт (например, два разных эндпоинта становятся одинаковыми), правило выдаст ошибку.

Пример конфликта:

```yaml
paths:
  /api/v1/pets:
    get:
      summary: List all pets
  /v1/pets:
    get:
      summary: Get pet by id
```

При попытке заменить `/api/v1` на `/v1` возникнет конфликт, так как оба эндпоинта станут `/v1/pets`.

В этом случае можно:
1. Использовать `ignoreOperarionCollisions: true` для игнорирования конфликтов
2. Изменить конфигурацию замены путей, чтобы избежать конфликтов
3. Предварительно изменить конфликтующие эндпоинты 