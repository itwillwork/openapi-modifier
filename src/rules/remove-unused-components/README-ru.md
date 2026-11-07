[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# remove-unused-components

Удаляет неиспользуемые компоненты из OpenAPI спецификации. Правило анализирует все ссылки на компоненты в документе и удаляет те, которые нигде не используются.



## Конфигурация

| Параметр    | Описание                          | Пример            | Типизация              | Дефолтное |
| -------- |-----------------------------------|-------------------|------------------------|-----------|
| `ignore`  | [**опциональный**] Список компонентов или регулярных выражений, которые нужно игнорировать при удалении | `["NotFoundDTO", "/^Error.*/"]` | `Array<string \| RegExp>` | `[]` |
| `printDeletedComponents` | [**опциональный**] Если true, то в консоль будет выведен список удаленных компонентов | `true` | `boolean` | `false` |

Пример конфигурации:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "remove-unused-components",
            config: {},
        }
        // ... other rules
    ]
}
```

Пример более детальной конфигурации:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "remove-unused-components",
            config: {
                ignore: [
                    "NotFoundDTO",
                    /^Error.*/, // игнорировать все компоненты, начинающиеся с Error
                    /.*Response$/ // игнорировать все компоненты, заканчивающиеся на Response
                ],
                printDeletedComponents: true // выводить список удаленных компонентов в консоль
            },
        }
        // ... other rules
    ]
}
```

**Если необходимо изменить несколько спецификаций**, вы можете использовать несколько раз данное правило в общем пайлайне конфигурации.

## Мотивация

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

## Важные замечания



## Полезные ссылки

- [Примеры применения правила в тестах](https://github.com/itwillwork/openapi-modifier/blob/main/src/rules/remove-unused-components/index.test.ts)

- [DeepWiki документация](https://deepwiki.com/itwillwork/openapi-modifier)
- [Context7 документация для LLM моделей и AI редакторов кода](https://context7.com/itwillwork/openapi-modifier)