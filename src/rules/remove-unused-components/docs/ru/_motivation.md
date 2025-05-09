<a name="custom_anchor_motivation_1"></a>
### 1. Очистка спецификации от неиспользуемых компонентов

После применений других правил могут появится неиспользуемые компоненты в спецификации и их лучше удалить, чтобы вовремя убрать из генерируемой типизации TypeScript и перейти на акутальные типы.

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
                    "User",
                    "NotFound"
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
