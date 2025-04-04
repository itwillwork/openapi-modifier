# filter-by-content-type

Фильтрует content-type для request и response в соответствии с указанными списками разрешенных и запрещенных типов

## Config

| Параметр    | Описание                          | Пример                     | Типизация              | Дефолтное |
| -------- |-----------------------------------|----------------------------|------------------------|-----------|
| `enabled`  | [**опциональный**] Список разрешенных content-type | `["application/json"]` | `string[]` | `[]`        |
| `disabled` | [**опциональный**] Список запрещенных content-type | `["text/plain"]` | `string[]` | `[]`        |

Пример конфигурации:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "filter-by-content-type",
            config: {
                enabled: ["application/json"],
                disabled: ["text/plain"]
            },
        }
        // ... other rules
    ]
}
```

## Motivation

<a name="custom_anchor_motivation_1"></a>
### 1. Необходимо оставить только определенные content-type для кодегерации типизации

Практический пример:

**В файле `openapi.yaml`** документация на endpoint выглядит так:

```yaml
paths:
  /pets:
    get:
      summary: List all pets
      responses:
        200:
          content:
            'application/json':
              schema:
                type: 'object'
            'text/plain':
              schema:
                type: 'string'
```

**Нужно оставить только `application/json`.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `filter-by-content-type`:

```js
module.exports = {
    pipeline: [
        {
            rule: "filter-by-content-type",
            config: {
                enabled: ["application/json"]
            },
        }
    ]
}
```

**После применения правила**, файл `openapi.yaml` выглядит так:

```yaml
paths:
  /pets:
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
### 2. Необходимо исключить определенные content-type

Практический пример:

**В файле `openapi.yaml`** документация на endpoint выглядит так:

```yaml
paths:
  /pets:
    get:
      summary: List all pets
      responses:
        200:
          content:
            'application/json':
              schema:
                type: 'object'
            'text/plain':
              schema:
                type: 'string'
```

**Нужно исключить `text/plain`.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `filter-by-content-type`:

```js
module.exports = {
    pipeline: [
        {
            rule: "filter-by-content-type",
            config: {
                disabled: ["text/plain"]
            },
        }
    ]
}
```

**После применения правила**, файл `openapi.yaml` выглядит так:

```yaml
paths:
  /pets:
    get:
      summary: List all pets
      responses:
        200:
          content:
            'application/json':
              schema:
                type: 'object'
```

## Особенности работы

1. Если указан список `enabled`, то будут оставлены только указанные content-type
2. Если указан список `disabled`, то указанные content-type будут удалены
3. Если оба списка пустые или не указаны, то все content-type останутся без изменений
4. Правило применяется ко всем content-type в:
   - requestBody операций
   - responses операций
   - components.requestBodies
   - components.responses
5. При применении правила логируются:
   - Удаленные content-type
   - Предупреждения о неиспользуемых content-type из списков enabled/disabled 