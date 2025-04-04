# remove-deprecated

Удаляет устаревшие (deprecated) компоненты, эндпоинты и параметры из OpenAPI спецификации

## Config

| Параметр | Описание | Пример | Типизация | Дефолтное |
|----------|----------|---------|-----------|-----------|
| `ignoreComponents` | Список компонентов, которые нужно сохранить даже если они помечены как deprecated | `[{"componentName": "Pet"}]` | `Array<ComponentDescriptorConfig>` | `[]` |
| `ignoreEndpoints` | Список эндпоинтов, которые нужно сохранить даже если они помечены как deprecated | `[{"path": "/pets", "method": "get"}]` | `Array<EndpointDescriptorConfig>` | `[]` |
| `ignoreEndpointParameters` | Список параметров эндпоинтов, которые нужно сохранить даже если они помечены как deprecated | `[{"path": "/pets", "method": "get", "name": "limit", "in": "query"}]` | `Array<ParameterDescriptorConfig>` | `[]` |
| `showDeprecatedDescriptions` | Показывать ли описания удаленных deprecated элементов в логах | `true` | `boolean` | `false` |

Пример конфигурации:

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

## Motivation

<a name="custom_anchor_motivation_1"></a>
### 1. Необходимо удалить устаревшие компоненты из спецификации

Практический пример:

**В файле `openapi.yaml`** есть устаревший компонент:

```yaml
components:
  schemas:
    OldPet:
      deprecated: true
      description: "This schema is deprecated, use Pet instead"
      type: object
      properties:
        name:
          type: string
```

**Нужно удалить этот компонент.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `remove-deprecated`:

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-deprecated",
            config: {
                showDeprecatedDescriptions: true
            },
        }
    ]
}
```

**После применения правила**, компонент `OldPet` будет удален из спецификации.

<a name="custom_anchor_motivation_2"></a>
### 2. Необходимо удалить устаревшие эндпоинты из спецификации

Практический пример:

**В файле `openapi.yaml`** есть устаревший эндпоинт:

```yaml
paths:
  /old-pets:
    get:
      deprecated: true
      description: "This endpoint is deprecated, use /pets instead"
      summary: List all old pets
      responses:
        200:
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/OldPet'
```

**Нужно удалить этот эндпоинт.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `remove-deprecated`:

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-deprecated",
            config: {
                showDeprecatedDescriptions: true
            },
        }
    ]
}
```

**После применения правила**, эндпоинт `/old-pets` будет удален из спецификации.

<a name="custom_anchor_motivation_3"></a>
### 3. Необходимо удалить устаревшие параметры из спецификации

Практический пример:

**В файле `openapi.yaml`** есть эндпоинт с устаревшим параметром:

```yaml
paths:
  /pets:
    get:
      summary: List all pets
      parameters:
        - name: oldLimit
          in: query
          deprecated: true
          description: "This parameter is deprecated, use limit instead"
          schema:
            type: integer
        - name: limit
          in: query
          schema:
            type: integer
```

**Нужно удалить устаревший параметр `oldLimit`.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `remove-deprecated`:

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-deprecated",
            config: {
                showDeprecatedDescriptions: true
            },
        }
    ]
}
```

**После применения правила**, параметр `oldLimit` будет удален из спецификации. 