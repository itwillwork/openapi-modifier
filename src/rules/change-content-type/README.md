# change-content-type

Изменяет типы контента (content-type) в OpenAPI спецификации в соответствии со словарем замен

## Config

| Параметр    | Описание                          | Пример                     | Типизация              | Дефолтное |
| -------- |-----------------------------------|----------------------------|------------------------|-----------|
| `map`  | [**обязательный**] Словарь замены типов контента | `{"application/xml": "application/json"}` | `Record<string, string>` | `{}`        |

Пример конфигурации:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "change-content-type",
            config: {
                map: {
                    "application/xml": "application/json"
                }
            },
        }
        // ... other rules
    ]
}
```

## Motivation

<a name="custom_anchor_motivation_1"></a>
### 1. Необходимо изменить тип контента API для соответствия новым требованиям

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
            'application/xml':
              schema:
                type: 'object'
```

**Нужно заменить `application/xml` на `application/json`.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `change-content-type`:

```js
module.exports = {
    pipeline: [
        {
            rule: "change-content-type",
            config: {
                map: {
                    "application/xml": "application/json"
                }
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
### 2. Обработка всех мест использования content-type

Правило обрабатывает все места в OpenAPI спецификации, где используется content-type:

1. В компонентах requestBodies
2. В компонентах responses
3. В операциях (paths) в:
   - requestBody
   - responses

Пример обработки компонента requestBody:

```yaml
components:
  requestBodies:
    PetRequestBody:
      content:
        'application/xml':
          schema:
            type: 'object'
```

После применения правила с конфигурацией `{"application/xml": "application/json"}`:

```yaml
components:
  requestBodies:
    PetRequestBody:
      content:
        'application/json':
          schema:
            type: 'object'
```

Правило также ведет учет использования типов контента и предупреждает, если какой-то тип из конфигурации не был использован в спецификации. 