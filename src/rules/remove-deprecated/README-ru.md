[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# remove-deprecated

Правило позволяет удалить устаревшие (deprecated) элементы из OpenAPI спецификации. Оно может удалять устаревшие компоненты, эндпоинты, параметры и свойства, при этом предоставляя возможность игнорировать определенные элементы и показывать описания удаляемых элементов.

> [!IMPORTANT]  
> Помогает в процессах взаимодействия с бекендом: бекенд помечает поле deprecated, привило убирает его из openapi, и из-за того что поле пропадает при кодегерации, вынуждает фронтенд постепенно уходить от использования устаревших полей и ручек.
> Поэтому правило рекомендуется включать по-умолчанию

## Конфигурация

| Параметр | Описание                                                                                                                | Пример | Типизация | Дефолтное |
|----------|-------------------------------------------------------------------------------------------------------------------------|---------|-----------|-----------|
| `ignoreComponents` | [**опциональный**] Список компонентов, которые не должны быть удалены, даже если они помечены как устаревшие            | `[{"componentName": "Pet"}]` | `Array<{ componentName: string }>` | `[]` |
| `ignoreEndpoints` | [**опциональный**] Список эндпоинтов, которые не должны быть удалены, даже если они помечены как устаревшие             | `["GET /pets"]` | `Array<string \ { path: string; method: string }>` | `[]` |
| `ignoreEndpointParameters` | [**опциональный**] Список параметров эндпоинтов, которые не должны быть удалены, даже если они помечены как устаревшие  | `[{"path": "/pets", "method": "get", "name": "limit", "in": "query"}]` | `Array<{ path: string; method: string; name: string; in: "query" \ "path" \ "header" \ "cookie" }>` | `[]` |
| `showDeprecatedDescriptions` | [**опциональный**] Показывать ли описания удаляемых устаревших элементов в логах, полезно для пояснения, что нужно использовать вместо них | `true` | `boolean` | `false` |

> [!IMPORTANT]  
> Учитываются только локальные $ref'ы файла, вида: `#/...`

Пример конфигурации:

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-deprecated",
            config: {},
        }
    ]
}
```

Пример более детальной конфигурации:

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-deprecated",
            config: {
                ignoreComponents: [
                    { componentName: "Pet" } // сохраняем компонент Pet даже если он помечен как устаревший
                ],
                ignoreEndpoints: [
                    { path: "/pets", method: "get" } // сохраняем GET /pets даже если он помечен как устаревший
                ],
                ignoreEndpointParameters: [
                    { path: "/pets", method: "get", name: "limit", in: "query" } // сохраняем параметр limit в GET /pets даже если он помечен как устаревший
                ],
                showDeprecatedDescriptions: true // выводим в консоль описания удаленных устаревших элементов
            },
        }
    ]
}
```

**Если необходимо изменить несколько спецификаций**, вы можете использовать несколько раз данное правило в общем пайлайне конфигурации.

## Мотивация

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

## Важные замечания

- Правило удаляет элементы, помеченные как `deprecated: true`
- Удаление происходит рекурсивно - если компонент помечен как устаревший, удаляются все его ссылки
- При удалении эндпоинта удаляются все его методы
- Правило проверяет и разрешает ссылки ($ref) перед принятием решения об удалении
- Если включен `showDeprecatedDescriptions`, в лог выводятся описания всех удаляемых элементов
- Правило выводит предупреждения для игнорируемых компонентов, которые не были найдены

## Полезные ссылки

- [Примеры применения правила в тестах](https://github.com/itwillwork/openapi-modifier/blob/main/src/rules/remove-deprecated/index.test.ts)

- [DeepWiki документация](https://deepwiki.com/itwillwork/openapi-modifier)
- [Context7 документация для LLM моделей и AI редакторов кода](https://context7.com/itwillwork/openapi-modifier)