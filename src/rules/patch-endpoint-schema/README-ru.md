[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# patch-endpoint-schema

Правило позволяет модифицировать схему эндпоинта целиком в OpenAPI спецификации. В отличие от других правил патчинга, которые работают с отдельными частями эндпоинта (параметры, тело запроса, ответы), это правило может изменять всю структуру эндпоинта, включая все его компоненты.

> [!IMPORTANT]  
> Используйте данное правило только в крайних случаях, когда не хватает специальных правил для изменений параметров, тело запроса и ответов



## Конфигурация

| Параметр                       | Описание                                               | Пример | Типизация | Дефолтное     |
|--------------------------------|--------------------------------------------------------|---------|------------|---------------|
| `endpointDescriptor`           | [**обязательный**] Описание эндпоинта для патчинга     | `{ path: "/pets", method: "get" }` | `{ path: string, method: string }` | -             |
| `endpointDescriptorCorrection` | Путь к конкретному полю в схеме эндпоинта для патчинга | `"responses.200.content.application/json.schema"` | `string` | -             |
| `schemaDiff`                   | [**обязательный**] Необходимое изменение в формате OpenAPI. [Примеры патчей схем](TODO)              | `{ type: "object", properties: { ... } }` | `OpenAPISchema` | -             |
| `patchMethod`                    | Метод применения изменений [Различия между методами merge и deepmerge](TODO)                                                                        | `'merge' /                                                                                                                                                  'deepmerge'` | `enum`                                                                              |  `merge` |

Пример конфигурации:

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-schema",
            config: {
                endpointDescriptor: "GET /pets",
                patchMethod: "merge",
                schemaDiff: {
                    "security": [
                        {
                            "bearerAuth": []
                        }
                    ]
                }
            }
        }
    ]
}
```

Пример более детальной конфигурации:

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-schema",
            config: {
                patchMethod: 'merge',
                endpointDescriptor: "GET /pets",
                endpointDescriptorCorrection: 'responses.200.content.*/*.schema',
                schemaDiff: {
                    enum: ['3', '4'],
                },
            }
        }
    ]
}
```


**Если необходимо изменить несколько спецификаций**, вы можете использовать несколько раз данное правило в общем пайлайне конфигурации.

## Мотивация

<a name="custom_anchor_motivation_1"></a>
### 1. Необходимо заменить схему конкретного поля в ответе

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
                properties:
                  status:
                    type: 'string'
                    enum: ['active', 'inactive']
```

**Нужно изменить схему поля `status`.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `patch-endpoint-schema`:

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-schema",
            config: {
                endpointDescriptor: "GET /pets",
                endpointDescriptorCorrection: "responses.200.content.application/json.schema.properties.status",
                patchMethod: "replace",
                schemaDiff: {
                    enum: ["active", "inactive", "pending"]
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
    get:
      summary: List all pets
      responses:
        200:
          content:
            'application/json':
              schema:
                type: 'object'
                properties:
                  status:
                    type: 'string'
                    enum: ['active', 'inactive', 'pending']
``` 

## Полезные ссылки

{{{links}}}
- [Примеры применения правила в тестах](./index.test.ts)  