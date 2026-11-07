[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# patch-endpoint-parameter-schema

Правило позволяет модифицировать схему параметров эндпоинтов в OpenAPI спецификации.



## Конфигурация

| Параметр              | Описание                                                                                                               | Пример                                                                                                                                                                 | Типизация                                                                           | Дефолтное    |
|-----------------------|------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|--------------|
| `endpointDescriptor`  | [**обязательный**] Указание в каком endpoint нужно поменять схему параметра запроса.                                   | `'GET /api/list'`                                                                                                                                                     | `string \ { path: string; method: string }`                                                                            |              |
| `parameterDescriptor` | [**обязательный**] Указание какой параметр запроса, на который ссылается `endpointDescriptor`, нужно поменять.         | `'TestSchemaDTO'`, `'TestSchemaDTO.test'`, `'TestSchemaDTO[].testField'`,  `'TestObjectDTO.oneOf[1]'`, `'TestObjectDTO.allOf[1]'` или  `'TestObjectDTO.anyOf[1].testField'`        | `string`                                                                            |              |
| `schemaDiff`          | Изменения для схемы параметра [Подробные примеры спецификаций для OpenAPI](../../../docs/schema-diff-ru.md)                                                              | `{type: "number"}`                                                                                                   | `OpenAPISchema`                                                                     |              |
| `objectDiff`          | Изменения для самого параметра                                                                                         | `{ required: true }`                                                                                                    | `{name?: string; in?: 'query' / 'header' / 'path' / 'cookie'; required?: boolean;}` |              |
| `patchMethod`         | Метод применения изменений, указанных в `objectDiff` и `schemaDiff`. [Подробнее про различия между методами merge и deepmerge](../../../docs/merge-vs-deepmerge-ru.md) | `"merge"` | `"merge" \ "deepmerge"` | `"merge"` |

Пример конфигурации:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "patch-endpoint-parameter-schema",
            config: {
                endpointDescriptor: 'GET /api/list', // указываем эндпоинт, который нужно изменить
                parameterDescriptor: {
                    name: 'test', // указываем имя параметра
                    in: 'query', // указываем, что параметр находится в query
                },
                schemaDiff: {
                    enum: ['foo', 'bar'], // добавляем enum к параметру
                }
            },
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
            rule: "patch-endpoint-parameter-schema",
            config: {
                endpointDescriptor: 'GET /api/list', // указываем эндпоинт, который нужно изменить
                parameterDescriptor: {
                    name: 'test', // указываем имя параметра
                    in: 'query', // указываем, что параметр находится в query
                },
                schemaDiff: {
                    type: 'string', // меняем тип параметра на string
                    enum: ['foo', 'bar'], // добавляем enum к параметру
                },
                objectDiff: {
                    name: 'newTest',
                    in: 'query',
                    required: true, // делаем параметр обязательным
                },
                patchMethod: 'deepmerge' // используем метод deepmerge для глубокого слияния изменений
            },
        }
        // ... other rules
    ]
}
```

**Если необходимо изменить несколько спецификаций**, вы можете использовать несколько раз данное правило в общем пайлайне конфигурации.

## Мотивация

<a name="custom_anchor_motivation_1"></a>
### 1. Изменение схемы параметра эндпоинта

Практический пример:

**В файле `openapi.yaml`** параметр эндпоинта выглядит так:

```yaml
paths:
  /pets/{petId}:
    get:
      parameters:
        - name: petId
          in: path
          schema:
            type: string
```

**Нужно изменить схему параметра, добавив формат UUID и сделать его обязательным.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `patch-endpoint-parameter-schema`:

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-parameter-schema",
            config: {
                endpointDescriptor: "GET /pets/{petId}",
                parameterDescriptor: {
                    name: "petId",
                    in: "path"
                },
                schemaDiff: {
                    format: "uuid"
                },
                objectDiff: {
                    required: true
                }
            }
        }
    ]
}
```

**После применения правила**, файл `openapi.yaml` выглядит так:

```yaml
paths:
  /pets/{petId}:
    get:
      parameters:
        - name: petId
          in: path
          required: true
          schema:
            type: string
            format: uuid
```

<a name="custom_anchor_motivation_2"></a>
### 2. Изменение схемы компонента параметра

Практический пример:

**В файле `openapi.yaml`** компонент параметра выглядит так:

```yaml
components:
  parameters:
    PetIdParam:
      name: petId
      in: path
      schema:
        type: string
```

**Нужно изменить схему компонента параметра, добавив формат UUID.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `patch-endpoint-parameter-schema`:

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-parameter-schema",
            config: {
                parameterDescriptor: {
                    name: "petId",
                    in: "path"
                },
                schemaDiff: {
                    format: "uuid"
                }
            }
        }
    ]
}
```

**После применения правила**, файл `openapi.yaml` выглядит так:

```yaml
components:
  parameters:
    PetIdParam:
      name: petId
      in: path
      schema:
        type: string
        format: uuid
```

## Важные замечания

- Правило пропускает параметры, определенные через ссылки ($ref)
- При отсутствии указанного параметра или эндпоинта правило выводит предупреждение, для своевременной актуализации конфигурации openapi-modifier'а 
- Изменения применяются атомарно - либо все изменения успешны, либо спецификация остается без изменений

## Полезные ссылки

- [Примеры применения правила в тестах](https://github.com/itwillwork/openapi-modifier/blob/main/src/rules/patch-endpoint-parameter-schema/index.test.ts)
- [Различия между методами merge и deepmerge](../../../docs/merge-vs-deepmerge-ru.md)
- [Примеры спецификаций для OpenAPI](../../../docs/schema-diff-ru.md)
- [DeepWiki документация](https://deepwiki.com/itwillwork/openapi-modifier)
- [Context7 документация для LLM моделей и AI редакторов кода](https://context7.com/itwillwork/openapi-modifier)