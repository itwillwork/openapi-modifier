<a name="custom_anchor_motivation_1"></a>
### 1. Необходимо у некоторых (или у всех) endpoint'ов сокртатить путь pathname

Практический пример:

**В файле `openapi.yaml`** документация на endpoint выглядит так:

```yaml
paths:
  /public/api/v1/pets:
    get:
      summary: List all pets
```
**Нужно удалить `/public/api`, чтобы сократить `/public/api/v1/pets` до `/v1/pets`.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `change-endpoints-basepath`:

```js
module.exports = {
    pipeline: [
        {
            rule: "change-endpoints-basepath",
            config: {
                map: { '/public/api': '' },
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
```