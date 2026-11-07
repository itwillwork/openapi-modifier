[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# filter-by-content-type

Правило позволяет фильтровать типы содержимого (content-type) в OpenAPI спецификации. С его помощью можно явно указать, какие типы содержимого должны быть сохранены или удалены из спецификации. Правило применяется ко всем компонентам API, включая запросы, ответы и общие компоненты.



## Конфигурация

| Параметр   | Описание                                             | Пример                 | Типизация       | Дефолтное |
|------------|------------------------------------------------------|------------------------|-----------------|--------|
| `enabled`  | [**опциональный**] Список разрешенных content-type. Если не указан, сохраняются все типы, не указанные в `disabled` | `['application/json']` | `Array<string>` |        |
| `disabled` | [**опциональный**] Список запрещенных content-type   | `['multipart/form-data']` | `Array<string>` |        |

Примеры конфигураций:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "filter-by-content-type",
            config: {
                enabled: ['application/json'], // оставить только content-type application/json, удалить все остальные
            }
        }
        // ... other rules
    ]
}
```

или

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "filter-by-content-type",
            config: {
                disabled: ['multipart/form-data'], // удалить content-type multipart/form-data, оставить все остальные
            }
        }
        // ... other rules
    ]
}
```

> [!IMPORTANT]
> 1. Если указаны оба параметра `enabled` и `disabled`, сначала применяется фильтр `enabled`, затем `disabled`
> 2. Правило выводит предупреждения для content-type, указанных в конфигурации, но не найденных в спецификации

**Если необходимо изменить несколько спецификаций**, вы можете использовать несколько раз данное правило в общем пайлайне конфигурации.

## Мотивация

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
        403:
          content:
            'application/xml':
              schema:
                type: 'number'
            'application/json':
              schema:
                type: 'object'
```
**Нужно удалить ответы/запросы в формате `application/xml`, который не используется приложением.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `filter-by-content-type`:

```js
module.exports = {
    pipeline: [
        {
            rule: "filter-by-content-type",
            config: {
                enabled: ["application/json"],
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
        403:
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

## Важные замечания

1. Если указаны оба параметра `enabled` и `disabled`, сначала применяется фильтр `enabled`, а затем `disabled`
2. Правило выводит предупреждения для типов содержимого, указанных в конфигурации, но не найденных в спецификации

## Полезные ссылки

- [Примеры применения правила в тестах](https://github.com/itwillwork/openapi-modifier/blob/main/src/rules/filter-by-content-type/index.test.ts)

- [DeepWiki документация](https://deepwiki.com/itwillwork/openapi-modifier)
- [Context7 документация для LLM моделей и AI редакторов кода](https://context7.com/itwillwork/openapi-modifier)