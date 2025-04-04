# remove-unused-components

Удаляет неиспользуемые компоненты из OpenAPI спецификации. Правило анализирует все ссылки на компоненты в документе и удаляет те, которые нигде не используются.

## Config

| Параметр    | Описание                          | Пример                     | Типизация              | Дефолтное |
| -------- |-----------------------------------|----------------------------|------------------------|-----------|
| `ignore`  | [**опциональный**] Список компонентов, которые нужно игнорировать при удалении | `["schemas/User", "responses/NotFound"]` | `Array<string>` | `[]` |

Пример конфигурации:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "remove-unused-components",
            config: {
                ignore: [
                    "schemas/User",
                    "responses/NotFound"
                ]
            },
        }
        // ... other rules
    ]
}
```

## Motivation

<a name="custom_anchor_motivation_1"></a>
### 1. Очистка спецификации от неиспользуемых компонентов

Практический пример:

**В файле `openapi.yaml`** есть неиспользуемые компоненты:

```yaml
components:
  schemas:
    User:
      type: object
      properties:
        name:
          type: string
    UnusedSchema:
      type: object
      properties:
        field:
          type: string
  responses:
    NotFound:
      description: Not found
    UnusedResponse:
      description: Unused response
```

**Нужно удалить неиспользуемые компоненты `UnusedSchema` и `UnusedResponse`, но сохранить `User` и `NotFound`.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `remove-unused-components`:

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-unused-components",
            config: {
                ignore: [
                    "schemas/User",
                    "responses/NotFound"
                ]
            },
        }
    ]
}
```

**После применения правила**, файл `openapi.yaml` выглядит так:

```yaml
components:
  schemas:
    User:
      type: object
      properties:
        name:
          type: string
  responses:
    NotFound:
      description: Not found
```

<a name="custom_anchor_motivation_2"></a>
### 2. Предотвращение ошибок при генерации кода

Практический пример:

**В файле `openapi.yaml`** есть неиспользуемые компоненты, которые могут вызывать ошибки при генерации кода:

```yaml
components:
  schemas:
    User:
      type: object
      properties:
        name:
          type: string
    DeprecatedSchema:
      type: object
      properties:
        oldField:
          type: string
```

**Нужно удалить устаревший компонент `DeprecatedSchema`, который больше не используется.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `remove-unused-components`:

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-unused-components",
            config: {
                ignore: [
                    "schemas/User"
                ]
            },
        }
    ]
}
```

**После применения правила**, файл `openapi.yaml` выглядит так:

```yaml
components:
  schemas:
    User:
      type: object
      properties:
        name:
          type: string
``` 