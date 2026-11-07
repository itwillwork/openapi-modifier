[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# merge-openapi-spec

Объединяет два OpenAPI спецификации в одну. Позволяет объединить текущую спецификацию с дополнительной спецификацией из указанного файла. Поддерживает работу с файлами в форматах JSON и YAML.



## Конфигурация

| Параметр                    | Описание                                                                                                                                                                                                                                                                                                                                          | Пример                                       | Типизация | Дефолтное |
|-----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------|----------|-----------|
| `path`                      | [**обязательный**] Путь до OpenAPI конфигурации, которую необходимо подлить в текущую спецификацию. Путь может быть относительный (относительно расположения package.json), либо абсолютный (например полученный через `__dirname` относительно нахождения конфига). Применимы форматы: `*.json`, `*.yml`, `*.yaml`.                              | `temp-openapi-specs/new-list-endpoints.yaml` | `string` |           |
| `ignoreOperationCollisions` | При слиянии нескольких спецификаций могут происходить конфликты, когда есть индентичные endpoint'ы. По умолчанию, инструмент запрещает влитие если находятся коллизии, для предотвращения не предвиденных изменений в исходной спецификации. Данной настройкой можно проигнорировать конфликты и все равно слить спецификации.                    | `true`                                       | `boolean` | `false`   |
| `ignoreComponentCollisions` | При слиянии нескольких спецификаций могут происходить конфликты, когда есть индентичные общие компоненты спецификаций. По умолчанию, инструмент запрещает влитие если коллизии находятся, для предотвращения не предвиденных изменений в исходной спецификации. Данной настройкой можно проигнорировать конфликты и все равно слить спецификации. | `true`                                       | `boolean` | `false`   |

> [!IMPORTANT]
> **Если необходимо объединить несколько спецификаций**, вы можете использовать несколько раз данное правило в общем пайлайне конфигурации.

Примеры конфигураций:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "merge-openapi-spec",
            config: {
                path: 'temp-openapi-specs/new-list-endpoints.yaml', // указываем путь к файлу спецификации для слияния
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
            rule: "merge-openapi-spec",
            config: {
                path: __dirname + '../temp-openapi-specs/new-list-endpoints.json', // указываем абсолютный путь к файлу спецификации
                ignoreOperationCollisions: true, // игнорируем конфликты операций при слиянии
                ignoreComponentCollisions: true, // игнорируем конфликты компонентов при слиянии
            },
        }
        // ... other rules
    ]
}
```

**Если необходимо изменить несколько спецификаций**, вы можете использовать несколько раз данное правило в общем пайлайне конфигурации.

## Мотивация

<a name="custom_anchor_motivation_1"></a>
### 1. Необходимо объединить несколько OpenAPI спецификаций в одну

Часто нужно добавить в OpenAPI будущие проектируемые API, которых еще нет в микросервисе, но формат API согласован и можно начать разрабатывать интерфейс.

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

## Важные замечания



## Полезные ссылки

- [Примеры применения правила в тестах](https://github.com/itwillwork/openapi-modifier/blob/main/src/rules/merge-openapi-spec/index.test.ts)

- [DeepWiki документация](https://deepwiki.com/itwillwork/openapi-modifier)
- [Context7 документация для LLM моделей и AI редакторов кода](https://context7.com/itwillwork/openapi-modifier)