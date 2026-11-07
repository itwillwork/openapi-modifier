[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# patch-endpoint-request-body-schema

Правило для изменения схемы request body в OpenAPI спецификации. Позволяет модифицировать схему запроса для указанного эндпоинта.



## Конфигурация

| Параметр                    | Описание                                                                                                                                                | Пример                                                                                                                                                                | Типизация      | Дефолтное |
|-----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|-----------|
| `endpointDescriptor`        | [**обязательный**] Указание в каком endpoint нужно поменять схему параметра запроса.                                                                    | `'GET /api/list'`                                                                                                                                                     | `string \ { path: string; method: string }`       |           |
| `contentType`               | Указание к какому типу запросов (content-type) endpoint'а нужно применить изменение. При отсутствии значения, будут изменены все варианты типов запросов. | `'application/json'`                                                                                                                                                  | `string`       |  |
| `correction`                | Путь к полю в схеме для модификации                                                                                                                     | `"name"` | `string` | - |
| `schemaDiff`                | [**обязательный**] Изменения для применения к схеме. [Подробные примеры спецификаций для OpenAPI](../../../docs/schema-diff-ru.md)                                                                                                                          | `{type: "number"}`                                                                                                 | `OpenAPISchema` |           |
| `patchMethod`               | Метод применения изменений [Подробнее про различия между методами merge и deepmerge](../../../docs/merge-vs-deepmerge-ru.md) | `"merge"` | `"merge" \ "deepmerge"` | `"merge"` |

Примеры конфигураций:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "patch-endpoint-request-body-schema",
            config: {
                endpointDescriptor: 'POST /api/order', // указываем эндпоинт, который нужно изменить
                correction: "status", // указываем путь к полю status в теле запроса
                schemaDiff: {
                    enum: ['foo', 'bar'], // добавляем enum к полю status
                },
            },
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
            rule: "patch-endpoint-request-body-schema",
            config: {
                endpointDescriptor: 'POST /api/order', // указываем эндпоинт, который нужно изменить
                contentType: "application/json", // указываем тип контента, для которого применяем изменения
                schemaDiff: {
                    properties: {
                        testField: {
                            type: 'number', // меняем тип поля testField на number
                        },
                    },
                },
                patchMethod: "deepmerge" // используем метод deepmerge для глубокого слияния изменений
            },
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
            rule: "patch-endpoint-request-body-schema",
            config: {
                endpointDescriptor: 'POST /api/orders',
                correction: '[].status',
                schemaDiff: {
                    enum: ['foo', 'bar'],
                },
                patchMethod: "deepmerge"
            },
        }
        // ... other rules
    ]
}
```

**Если необходимо изменить несколько спецификаций**, вы можете использовать несколько раз данное правило в общем пайлайне конфигурации.

## Мотивация

<a name="custom_anchor_motivation_1"></a>
### 1. Необходимость обновления схемы request body для конкретного эндпоинта

Практический пример:

**В файле `openapi.yaml`** документация на endpoint выглядит так:

```yaml
paths:
  /pets:
    post:
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
```

**Нужно обновить схему, добавив новое поле `age`.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `patch-endpoint-request-body-schema`:

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-request-body-schema",
            config: {
                endpointDescriptor: "POST /pets",
                contentType: "application/json",
                patchMethod: "merge",
                schemaDiff: {
                    properties: {
                        age: {
                            type: "number"
                        }
                    }
                }
            }
        }
    ]
}
```

**После применения правила**, файл `openapi.yaml` выглядит так:

```yaml
paths:
  /pets:
    post:
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                age:
                  type: number
```

<a name="custom_anchor_motivation_2"></a>
### 2. Необходимость изменения конкретного поля в схеме

Практический пример:

**В файле `openapi.yaml`** документация на endpoint выглядит так:

```yaml
paths:
  /pets:
    post:
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                  description: Pet name
```

**Нужно изменить описание поля `name`.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `patch-endpoint-request-body-schema`:

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-request-body-schema",
            config: {
                endpointDescriptor: "POST /pets",
                contentType: "application/json",
                correction: "name",
                patchMethod: "merge",
                schemaDiff: {
                    description: "Name of the pet"
                }
            }
        }
    ]
}
```

**После применения правила**, файл `openapi.yaml` выглядит так:

```yaml
paths:
  /pets:
    post:
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                  description: Name of the pet
```

## Важные замечания

- Если `contentType` не указан, изменения применяются ко всем типам содержимого эндпоинта
- При указании несуществующего `contentType` правило выводит предупреждение, для своевременной актуализации конфигурации openapi-modifier'а
- Правило не работает со схемами, определенными через ссылки ($ref)
- При отсутствии указанного эндпоинта правило выводит предупреждение, для своевременной актуализации конфигурации openapi-modifier'а
- Изменения применяются атомарно - либо все изменения успешны, либо спецификация остается без изменений

## Полезные ссылки

- [Примеры применения правила в тестах](https://github.com/itwillwork/openapi-modifier/blob/main/src/rules/patch-endpoint-request-body-schema/index.test.ts)
- [Различия между методами merge и deepmerge](../../../docs/merge-vs-deepmerge-ru.md)
- [Примеры спецификаций для OpenAPI](../../../docs/schema-diff-ru.md)
- [DeepWiki документация](https://deepwiki.com/itwillwork/openapi-modifier)
- [Context7 документация для LLM моделей и AI редакторов кода](https://context7.com/itwillwork/openapi-modifier)