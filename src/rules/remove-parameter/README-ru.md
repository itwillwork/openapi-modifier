[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# remove-parameter

Удаляет параметр из эндпоинта в OpenAPI спецификации



## Конфигурация

| Параметр    | Описание                                                                                                                                  | Пример                     | Типизация              | Дефолтное |
| -------- |-------------------------------------------------------------------------------------------------------------------------------------------|----------------------------|------------------------|-----------|
| `endpointDescriptor`  | [**обязательный**] Описание эндпоинта, из которого нужно удалить параметр                                                                 | `"GET /pets"` | `string \ { path: string; method: string }` | -         |
| `parameterDescriptor`  | [**обязательный**] Описание параметра, который нужно удалить. В параметр `in` можно указать: `"query"`, `"path"`, `"header"`, `"cookie"`. | `{"name": "petId", "in": "path"}` | `{ name: string; in: "query" \ "path" \ "header" \ "cookie" }` | -         |

Пример конфигурации:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "remove-parameter",
            config: {
                endpointDescriptor: "GET /pets/{petId}", // указать конечную точку, из которой нужно удалить параметр
                parameterDescriptor: {
                    name: "version", // указать имя удаляемого параметра
                    in: "query" // указать местоположение параметра (параметр запроса)
                }
            },
        }
        // ... other rules
    ]
}
```

**Если необходимо изменить несколько спецификаций**, вы можете использовать несколько раз данное правило в общем пайлайне конфигурации.

## Мотивация

<a name="custom_anchor_motivation_1"></a>
### 1. Необходимо удалить неиспользуемый параметр из эндпоинта, чтобы перестать его использовать и удалить в дальнейшем

Практический пример:

**В файле `openapi.yaml`** документация на endpoint выглядит так:

```yaml
paths:
  /pets/{petId}:
    get:
      summary: Get pet by ID
      parameters:
        - name: petId
          in: path
          required: true
          schema:
            type: string
        - name: version
          in: query
          required: false
          schema:
            type: string
```

**Нужно удалить неиспользуемый параметр `version`.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `remove-parameter`:

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-parameter",
            config: {
                endpointDescriptor: "GET /pets/{petId}",
                parameterDescriptor: {
                    name: "version",
                    in: "query"
                }
            },
        }
    ]
}
```

**После применения правила**, файл `openapi.yaml` выглядит так:

```yaml
paths:
  /pets/{petId}:
    get:
      summary: Get pet by ID
      parameters:
        - name: petId
          in: path
          required: true
          schema:
            type: string
```

<a name="custom_anchor_motivation_2"></a>
### 2. Необходимо удалить общий параметр, мешающий при генарации TypeScript типов

Практический пример:

**В файле `openapi.yaml`** есть компонент с параметром:

```yaml
components:
  parameters:
    ApiKeyHeader:
      name: X-API-Key
      in: header
      required: true
      schema:
        type: string
```

**Нужно удалить компонент параметра `ApiKeyHeader`.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `remove-parameter`:

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-parameter",
            config: {
                parameterDescriptor: {
                    name: "X-API-Key",
                    in: "header"
                }
            },
        }
    ]
}
```

**После применения правила**, файл `openapi.yaml` выглядит так:

```yaml
components:
  parameters: {}
```

## Важные замечания

- Если эндпоинт или параметр не найден, правило выводит предупреждение и оставляет спецификацию без изменений, для своевременной актуализации конфигурации openapi-modifier'а
- Правило может быть применено к параметрам любого типа (query, path, header, cookie)

## Полезные ссылки

- [Примеры применения правила в тестах](https://github.com/itwillwork/openapi-modifier/blob/main/src/rules/remove-parameter/index.test.ts)

- [DeepWiki документация](https://deepwiki.com/itwillwork/openapi-modifier)
- [Context7 документация для LLM моделей и AI редакторов кода](https://context7.com/itwillwork/openapi-modifier)