# merge-openapi-spec

Объединяет два OpenAPI спецификации в одну. Позволяет объединить текущую спецификацию с дополнительной спецификацией из указанного файла.

## Config

| Параметр    | Описание                          | Пример                     | Типизация              | Дефолтное |
| -------- |-----------------------------------|----------------------------|------------------------|-----------|
| `path`  | [**обязательный**] Путь к файлу спецификации для объединения | `"./additional-spec.yaml"` | `string` | - |
| `ignoreOperarionCollisions` | Игнорировать конфликты операций | `true` | `boolean` | `false` |
| `ignoreComponentCollisions` | Игнорировать конфликты компонентов | `true` | `boolean` | `false` |

Пример конфигурации:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "merge-openapi-spec",
            config: {
                path: "./additional-spec.yaml",
                ignoreOperarionCollisions: true,
                ignoreComponentCollisions: true
            },
        }
        // ... other rules
    ]
}
```

## Motivation

<a name="custom_anchor_motivation_1"></a>
### 1. Необходимо объединить несколько OpenAPI спецификаций в одну

Практический пример:

**В файле `openapi.yaml`** основная спецификация:

```yaml
openapi: 3.0.0
info:
  title: Main API
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

**В файле `additional-spec.yaml`** дополнительная спецификация:

```yaml
openapi: 3.0.0
info:
  title: Additional API
paths:
  /users:
    get:
      summary: List all users
      responses:
        200:
          content:
            'application/json':
              schema:
                type: 'object'
```

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `merge-openapi-spec`:

```js
module.exports = {
    pipeline: [
        {
            rule: "merge-openapi-spec",
            config: {
                path: "./additional-spec.yaml"
            },
        }
    ]
}
```

**После применения правила**, файл `openapi.yaml` будет содержать объединенную спецификацию:

```yaml
openapi: 3.0.0
info:
  title: Main API
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
  /users:
    get:
      summary: List all users
      responses:
        200:
          content:
            'application/json':
              schema:
                type: 'object'
```

<a name="custom_anchor_motivation_2"></a>
### 2. Обработка конфликтов при объединении

При объединении спецификаций могут возникнуть конфликты:
- Конфликты операций (одинаковые пути и методы)
- Конфликты компонентов (одинаковые имена компонентов)

По умолчанию при обнаружении конфликтов объединение прерывается с ошибкой. Если нужно игнорировать конфликты, можно использовать параметры:
- `ignoreOperarionCollisions: true` - игнорировать конфликты операций
- `ignoreComponentCollisions: true` - игнорировать конфликты компонентов

## Поддерживаемые форматы

Правило поддерживает следующие форматы файлов спецификации:
- YAML (.yml, .yaml)
- JSON (.json) 