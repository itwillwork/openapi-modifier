<a name="custom_anchor_motivation_1"></a>
### 1. Необходимо удалить ограничение `maxItems` из схем для генерации TypeScript типов

В некоторых случаях ограничение `maxItems` может мешать генерации кода или создавать ненужные проверки. Удаление этого свойства позволяет сделать схему более гибкой и универсальной.

Практический пример:

**В файле `openapi.yaml`** схема выглядит так:

```yaml
components:
  schemas:
    Pet:
      type: object
      properties:
        tags:
          type: array
          maxItems: 10
          items:
            type: string
```

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `remove-max-items`:

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-max-items",
            config: {
                showUnusedWarning: true
            },
        }
    ]
}
```

**После применения правила**, файл `openapi.yaml` выглядит так:

```yaml
components:
  schemas:
    Pet:
      type: object
      properties:
        tags:
          type: array
          items:
            type: string
```
