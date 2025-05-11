[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# OpenAPI Modifier

Инструмент для модификации OpenAPI спецификаций с помощью настраиваемых правил. 

Этот пакет позволяет автоматизировать процесс изменения OpenAPI спецификаций, применяя к ним набор предопределенных правил.

## Основные возможности

- Модификация OpenAPI спецификаций в форматах YAML и JSON
- Гибкая система правил для изменения спецификаций
- Поддержка как CLI, так и программного использования c поддержкой TypeScript

> [!IMPORTANT]  
> Поддерживает OpenAPI 3.1, 3.0. Мы не проверяли поддержку OpenAPI 2, так как формат является устаревшим и рекомендуем мигрировать вашу документацию на OpenAPI 3.0.

## Мотивация и примеры использования

OpenAPI описывающий бекендное API далеко не всегда идеальное: содержит ошибки, неточности или какие-то особенности ломают другие инструменты, например, кодогенерацию или генерацию типов.

Хранить информацию об изменения в декларативном формате, чтобы был понятент контекст и актуальность каждого изменения, особенно полезно в крупных коммандах.

<details>
  <summary><b>Другие случаи применения</b></summary>

### Другие случаи применения:

- Бекендер просит проверить используется ли поле в какой-то сущности;
- Бекендер просит проверить используется ли параметр в какой-то ручке; 
- Бекендер создает задачу перестать пользоваться endpoint'ом;
- Бекендер написал новое API в разработке, но его нет в документации;
- Бекендер просит больше не использовать какой-то параметр в endpoint'е;
- Не валидное OpenAPI (например, использовали не существующий тип int);
- Нужно оставить знания по модификации (коллеге важно знать почему какое-то поле заблокировано);
- Нужно наблюдать за изменениями API и вовремя корректировать конфиг (убрали использование ручки);
- Убирать deprecated поля из openapi (чтобы вовремя замечать возможности api которые будут удалены);

</details>

<details>
  <summary><b>Демонстрация использования</b></summary>

<a name="custom_anchor_demo"></a>

### Демонстрация использования

Например имеем [входной файл спецификации/документации api](./examples/example-cli-generate-api-types/input/openapi.yaml) от бекенд разработчиков. Например, [скачен через curl cli из github](./examples/example-cli-generate-api-types/package.json#L11).

Пишем [файл конфигурации](./examples/example-cli-generate-api-types/openapi-modifier.config.ts), описывающий все что нужно поменять в исходной спецификации/документации с пояснительными комментариями:

```ts
const config: ConfigT = {
    pipeline: [
        // JIRA-10207 - new feature API for epic JIRA-232
        {
            rule: 'merge-openapi-spec',
            config: {
                path: 'input/feature-openapi-JIRA-232.yaml',
            },
        },

        // ...

        // JIRA-10212 - wrong docs, waiting JIRABACKEND-8752
        {
            rule: 'patch-schemas',
            config: [
                {
                    descriptor: {
                        type: 'component-schema',
                        componentName: 'Pet',
                    },
                    patchMethod: 'merge',
                    schemaDiff: {
                        properties: {
                            id: {
                                type: 'string',
                                format: 'uuid',
                            },
                        },
                    },
                },
            ],
        },

        // ...

        // JIRA-11236 - removed deprecated endpoint, waiting JIRABACKEND-3641
        {
            rule: 'filter-endpoints',
            config: {
                disabled: [
                    {
                        path: '/v1/pets/{petId}',
                        method: 'delete',
                    },
                ],
            },
        },

        // ...
}
```

Далее [при помощи этого файла конфигурации и cli openapi-modifier](./examples/example-cli-generate-api-types/package.json#L7), изменяем исходный файл спецификации/документации и получается [модифицированная спецификация/документация](./examples/example-cli-generate-api-types/output/openapi.yaml).

Далее при помощи, к примеру cli [dtsgenerator](https://github.com/horiuchi/dtsgenerator), генерируем из модифицированной спецификации/документаци [файл типизации для api](./examples/example-cli-generate-api-types/output/generated-api-types.d.ts), которую уже используем в коде проекта.

[Полный код примера](./examples/example-cli-generate-api-types)

</details>

## Установка

```bash
npm install --save-dev openapi-modifier
```

## Использование

<a name="custom_anchor_cli_npx_usage"></a>

### CLI через NPX

```shell
npx openapi-modifier --input=input/openapi.yml --output=output/openapi.yml --config=openapi-modifier.config.js
```

[Пример использования как CLI через NPX](./examples/example-cli-simple-npx/package.json#L6)

CLI параметры:

| Опция    | Описание                                                                                                 | Пример                       | Дефолтное                                    |
| -------- | -------------------------------------------------------------------------------------------------------- | ---------------------------- |----------------------------------------------|
| `input`  | [**обязательный**] входной файл, специфиакция/документация в формате openapi                             | `input/openapi.yml`          |                                              |
| `output` | [**обязательный**] выходной файл, специфиакция/документация в формате opeanpi                            | `output/openapi.yml`         |                                              |
| `config` | путь до файла конфигурации. Детальное описание конфигурации [см. ниже](#custom_anchor_config_parameters) | `openapi-modifier.config.js` | `openapi-modifier.config.(js\ts\json\yaml\yml)` |


Подробнее про файл конфигурации [см. ниже](#custom_anchor_config_parameters)

Если путь до конфигурации не указан, конфигурации по-умолчанию берется из файла `openapi-modifier.config.js` относительно директории запуска.

Можно использовать конфиги в след. расширениях: `.ts`, `.js`, `.yaml`, `.yml`, `.json`.

<a name="custom_anchor_cli_usage"></a>

### CLI

```shell
npm i --save-dev openapi-modifier

openapi-modifier --input=input/openapi.yml --output=output/openapi.yml --config=openapi-modifier.config.js
```

[Пример использования как CLI](./examples/example-cli-openapi-yaml/package.json#L7)

CLI параметры:

| Опция    | Описание                                                                                                 | Пример                       | Дефолтное                                    |
| -------- | -------------------------------------------------------------------------------------------------------- | ---------------------------- |----------------------------------------------|
| `input`  | [**обязательный**] входной файл, специфиакция/документация в формате openapi                             | `input/openapi.yml`          |                                              |
| `output` | [**обязательный**] выходной файл, специфиакция/документация в формате opeanpi                            | `output/openapi.yml`         |                                              |
| `config` | путь до файла конфигурации. Детальное описание конфигурации [см. ниже](#custom_anchor_config_parameters) | `openapi-modifier.config.js` | `openapi-modifier.config.(js\ts\json\yaml\yml)` |


Подробнее про файл конфигурации [см. ниже](#custom_anchor_config_parameters)

Если путь до конфигурации не указан, конфигурации по-умолчанию берется из файла `openapi-modifier.config.js` относительно директории запуска.

Можно использовать конфиги в след. расширениях: `.ts`, `.js`, `.yaml`, `.yml`, `.json`.

<a name="custom_anchor_package_usage"></a>

### Программное использование

```typescript
import { openapiModifier } from 'openapi-modifier';

(async () => {
    try {
        await openapiModifier({
            input: 'input/openapi.yml',
            output: 'output/openapi.yml',
            pipeline: [
                {
                    rule: 'remove-operation-id',
                    config: {
                        ignore: [],
                    },
                },
            ],
        });

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();
```

[Пример программного использования](./examples/example-package-openapi-yaml/generate.ts)

<a name="custom_anchor_config_parameters"></a>

## Конфигурация

Создайте файл конфигурации (например, `openapi-modifier.config.js` или `openapi-modifier.config.ts`) со следующей структурой:

```javascript
module.exports = {
    // (опционально) Настройки логгера
    logger: {
        verbose: true, // Включить подробное логирование
        minLevel: 0    // Минимальный уровень логирования: 0 - trace, 1 - debug, 2 - info, 3 - warn, 4 - error
    },
    // Путь к входному файлу OpenAPI спецификации
    input: './openapi.yaml',
    // Путь к выходному файлу
    output: './modified-openapi.yaml',
    // Конвейер правил для применения (см. далее все доступные правила с примерами конфигураций)
    pipeline: [
        {
            rule: "change-content-type",
            disabled: false, // (опционально) Отключить правило
            config: {
                map: {
                    "*/*": "application/json"
                }
            }
        }
        // Другие правила...
    ]
}
```

> [!IMPORTANT]  
> Благодаря тому что правила выстраиваются в конвейер, вы можете:
> - редактировать следующим этапом результат предыдущего этапа, таким образом выстраивая последовательность необходимых изменений;
> - использовать правила необходимое число раз и в нужной последовательности;

<a name="custom_anchor_rule_table"></a>

## Доступные правила

| Правило | Краткое описание |
|------------------------------------------------------------------| ---- |
| [change-content-type](./src/rules/change-content-type/README-ru.md) | Изменяет типы контента (content-type) в OpenAPI спецификации в соответствии со словарем замен |
| [change-endpoints-basepath](./src/rules/change-endpoints-basepath/README-ru.md) | Изменяет базовые пути (basepath) эндпоинтов в соответствии со словарем замен |
| [filter-by-content-type](./src/rules/filter-by-content-type/README-ru.md) | Правило позволяет фильтровать типы содержимого (content-type) в OpenAPI спецификации. С его помощью можно явно указать, какие типы содержимого должны быть сохранены или удалены из спецификации. Правило применяется ко всем компонентам API, включая запросы, ответы и общие компоненты. |
| [filter-endpoints](./src/rules/filter-endpoints/README-ru.md) | Правило позволяет фильтровать эндпоинты в OpenAPI спецификации на основе их путей и методов. С его помощью можно явно указать, какие эндпоинты должны быть сохранены или удалены из спецификации. Правило поддерживает как точное соответствие, так и фильтрацию по регулярным выражениям. |
| [merge-openapi-spec](./src/rules/merge-openapi-spec/README-ru.md) | Объединяет два OpenAPI спецификации в одну. Позволяет объединить текущую спецификацию с дополнительной спецификацией из указанного файла. Поддерживает работу с файлами в форматах JSON и YAML. |
| [patch-component-schema](./src/rules/patch-component-schema/README-ru.md) | Правило позволяет модифицировать схему компонента в OpenAPI спецификации. |
| [patch-endpoint-parameter-schema](./src/rules/patch-endpoint-parameter-schema/README-ru.md) | Правило позволяет модифицировать схему параметров эндпоинтов в OpenAPI спецификации. |
| [patch-endpoint-request-body-schema](./src/rules/patch-endpoint-request-body-schema/README-ru.md) | Правило для изменения схемы request body в OpenAPI спецификации. Позволяет модифицировать схему запроса для указанного эндпоинта. |
| [patch-endpoint-response-schema](./src/rules/patch-endpoint-response-schema/README-ru.md) | Правило позволяет модифицировать схему ответа (response schema) для эндпоинтов в OpenAPI спецификации. |
| [patch-endpoint-schema](./src/rules/patch-endpoint-schema/README-ru.md) | Правило позволяет модифицировать схему эндпоинта целиком в OpenAPI спецификации. В отличие от других правил патчинга, которые работают с отдельными частями эндпоинта (параметры, тело запроса, ответы), это правило может изменять всю структуру эндпоинта, включая все его компоненты. |
| [remove-deprecated](./src/rules/remove-deprecated/README-ru.md) | Правило позволяет удалить устаревшие (deprecated) элементы из OpenAPI спецификации. Оно может удалять устаревшие компоненты, эндпоинты, параметры и свойства, при этом предоставляя возможность игнорировать определенные элементы и показывать описания удаляемых элементов. |
| [remove-max-items](./src/rules/remove-max-items/README-ru.md) | Удаляет свойство `maxItems` из всех схем в OpenAPI спецификации. |
| [remove-min-items](./src/rules/remove-min-items/README-ru.md) | Удаляет свойство `minItems` из всех схем в OpenAPI спецификации. |
| [remove-operation-id](./src/rules/remove-operation-id/README-ru.md) | Удаляет operationId из всех операций в OpenAPI спецификации, кроме тех, что указаны в списке игнорирования |
| [remove-parameter](./src/rules/remove-parameter/README-ru.md) | Удаляет параметр из эндпоинта в OpenAPI спецификации |
| [remove-unused-components](./src/rules/remove-unused-components/README-ru.md) | Удаляет неиспользуемые компоненты из OpenAPI спецификации. Правило анализирует все ссылки на компоненты в документе и удаляет те, которые нигде не используются. |


<a name="custom_anchor_rules_description"></a>

## Краткие описания правил

<a name="custom_anchor_rule_change-content-type"></a>

### change-content-type

Изменяет типы контента (content-type) в OpenAPI спецификации в соответствии со словарем замен

#### Config

| Параметр | Описание                          | Пример                     | Типизация              | Дефолтное |
|----------|-----------------------------------|----------------------------|------------------------|-----------|
| `map`    | [**обязательный**] Словарь замены типов контента | `{"*/*": "application/json"}` | `Record<string, string>` | `{}`        |

Пример конфигурации:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "change-content-type",
            config: {
                map: {
                    "*/*": "application/json"
                }
            },
        }
        // ... other rules
    ]
}
```

[Подрбонее про правило change-content-type](./src/rules/change-content-type/README-ru.md)

----------------------

<a name="custom_anchor_rule_change-endpoints-basepath"></a>

### change-endpoints-basepath

Изменяет базовые пути (basepath) эндпоинтов в соответствии со словарем замен

#### Config

| Параметр                    | Описание                                                              | Пример               | Типизация                | Дефолтное |
|-----------------------------|-----------------------------------------------------------------------|----------------------|--------------------------|-----------|
| `map`                       | [**обязательный**] Словарь замены путей                                     | `{"/api/v1": "/v1"}` | `Record<string, string>` | `{}`      |
| `ignoreOperarionCollisions` | Игнорировать возникающие коллизии endpoint'ов после применения замены | `true`               | `boolean`                | `false`        |


Пример конфигурации:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "change-endpoints-basepath",
            config: {
               map: { 
                   '/public/api': '',
               },
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
            rule: "change-endpoints-basepath",
            config: {
               map: { 
                   '/public/v1/service/api': '/api',
               }, 
               ignoreOperarionCollisions: false,
            },
        }
        // ... other rules
    ]
}
```

[Подрбонее про правило change-endpoints-basepath](./src/rules/change-endpoints-basepath/README-ru.md)

----------------------

<a name="custom_anchor_rule_filter-by-content-type"></a>

### filter-by-content-type

Правило позволяет фильтровать типы содержимого (content-type) в OpenAPI спецификации. С его помощью можно явно указать, какие типы содержимого должны быть сохранены или удалены из спецификации. Правило применяется ко всем компонентам API, включая запросы, ответы и общие компоненты.

#### Config

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
                enabled: ['application/json'],
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
            rule: "filter-by-content-type",
            config: {
                disabled: ['multipart/form-data'],
            },
        }
        // ... other rules
    ]
}
```

[Подрбонее про правило filter-by-content-type](./src/rules/filter-by-content-type/README-ru.md)

----------------------

<a name="custom_anchor_rule_filter-endpoints"></a>

### filter-endpoints

Правило позволяет фильтровать эндпоинты в OpenAPI спецификации на основе их путей и методов. С его помощью можно явно указать, какие эндпоинты должны быть сохранены или удалены из спецификации. Правило поддерживает как точное соответствие, так и фильтрацию по регулярным выражениям.

#### Config

> [!IMPORTANT]  
> Правило работает либо в режиме enabled - фильтрации endpoint'ов из спецификации (когда указан в конфигурации либо `enabled`, либо `enabledPathRegExp`), либо в disabled - исключения endpoint'ов из спецификации (когда указан в конфигурации либо `disabled`, либо `disabledPathRegExp`)

| Параметр                | Описание                                                                                                                                                                               | Пример                | Типизация       | Дефолтное       |
|-------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------|-----------------|-----------------|
| `enabled`               | Список эндпоинтов, которые нужно оставить | `[{"method": "GET", "path": "/pets"}]` | `Array<EndpointDescriptor>` | - |
| `enabledPathRegExp`     | Список регулярных выражений для путей, которые нужно оставить | `[/^\/api\/v1/]` | `Array<RegExp>` | - |
| `disabled`              | Список эндпоинтов, которые нужно исключить | `[{"method": "POST", "path": "/pets"}]` | `Array<EndpointDescriptor>` | - |
| `disabledPathRegExp`    | Список регулярных выражений для путей, которые нужно исключить | `[/^\/internal/]` | `Array<RegExp>` | - |
| `printIgnoredEndpoints` | Выводить ли в лог информацию об исключенных эндпоинтах | `true` | `boolean` | `false` |

Примеры конфигураций:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "filter-endpoints",
            config: {
                enabled: [
                    'GET /foo/ping'
                ],
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
            rule: "filter-endpoints",
            config: {
                enabledPathRegExp: [
                    /\/public/
                ],
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
            rule: "filter-endpoints",
            config: {
                disabled: [
                    'GET /foo/ping'
                ],
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
            rule: "filter-endpoints",
            config: {
                disabledPathRegExp: [
                    /\/internal/
                ],
                printIgnoredEndpoints: true,
            },
        }
        // ... other rules
    ]
}
```

[Подрбонее про правило filter-endpoints](./src/rules/filter-endpoints/README-ru.md)

----------------------

<a name="custom_anchor_rule_merge-openapi-spec"></a>

### merge-openapi-spec

Объединяет два OpenAPI спецификации в одну. Позволяет объединить текущую спецификацию с дополнительной спецификацией из указанного файла. Поддерживает работу с файлами в форматах JSON и YAML.

#### Config

| Параметр                    | Описание                                                                                                                                                                                                                                                                                                                                          | Пример                                       | Типизация | Дефолтное |
|-----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------|----------|-----------|
| `path`                      | [**обязательный**] Путь до OpenAPI конфигурации, которую необходимо подлить в текущую спецификацию. Путь может быть относительный (относительно расположения package.json), либо абсолютный (например полученный через `__dirname` относительно нахождения конфига). Применимы форматы: `*.json`, `*.yml`, `*.yaml`.                              | `temp-openapi-specs/new-list-endpoints.yaml` | `string` |           |
| `ignoreOperarionCollisions` | При слиянии нескольких спецификаций могут происходить конфликты, когда есть индентичные endpoint'ы. По умолчанию, инструмент запрещает влитие если находятся коллизии, для предотвращения не предвиденных изменений в исходной спецификации. Данной настройкой можно проигнорировать конфликты и все равно слить спецификации.                    | `true`                                       | `boolean` | `false`   |
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
                path: 'temp-openapi-specs/new-list-endpoints.yaml',
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
                path: __dirname + '../temp-openapi-specs/new-list-endpoints.json',
                ignoreOperarionCollisions: true,
                ignoreComponentCollisions: true,
            },
        }
        // ... other rules
    ]
}
```

[Подрбонее про правило merge-openapi-spec](./src/rules/merge-openapi-spec/README-ru.md)

----------------------

<a name="custom_anchor_rule_patch-component-schema"></a>

### patch-component-schema

Правило позволяет модифицировать схему компонента в OpenAPI спецификации.

#### Config

| Параметр    | Описание                                                                                 | Пример                                                                       | Типизация                                        | Дефолтное                                |
| -------- |------------------------------------------------------------------------------------------|------------------------------------------------------------------------------|--------------------------------------------------|------------------------------------------|
| `descriptor`  | [**обязательный**] Описание компонента для модификации. [Подробнее про различия между простым и объектным дескриптором компонента с коррекцией](./docs/descriptor-ru.md) | `"Pet.name"` или `{"componentName": "Pet", "correction": "properties.name"}` | `string` | `ComponentWithCorrectionDescriptorConfig` | - |
| `patchMethod`  | Метод применения патча. [Подробнее про различия между методами merge и deepmerge](./docs/merge-vs-deepmerge-ru.md)  | `"merge"`                                                                    | `"merge" \ "deepmerge"`                            | `"merge"` |
| `schemaDiff`  | [**обязательный**] Схема для патча. [Подробные примеры спецификаций для OpenAPI](./docs/schema-diff-ru.md)                          | `{"type": "string", "description": "New description"}`                       | `OpenAPISchema`                            | -                                        |

> [!IMPORTANT]
> Тонкости задачния параметра `descriptor`:
> - не предусмотрен переход по $ref'ам. Потому что может вызвать не преднамеренное изменение в общих компонентах, и тем самым создать не ожиданное изменение в другом месте спецификации. В таком случае лучше модифицировать напрямую ту сущность на которую ссылается $ref;
> - если необходим переход по элементам массива - нужно доуточнение в `descriptor` (соотвтественно `[]`), например, `TestSchemaDTO[].test`
> - если необходим переход по oneOf, allOf, anyOf нужно доуточнение в `descriptor` (соотвтественно `oneOf[{number}]`, `allOf[{number}]` или `anyOf[{number}]`), например, `TestObjectDTO.oneOf[1].TestSchemaDTO`, `TestObjectDTO.allOf[1].TestSchemaDTO` или  `TestObjectDTO.anyOf[1].TestSchemaDTO`;

Пример конфигурации:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "patch-component-schema",
            config: {
                descriptor: 'TestDTO',
                schemaDiff: {
                    type: 'string',
                },
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
            rule: "patch-component-schema",
            config: {
                descriptor: 'TestObjectDTO.oneOf[0].TestArraySchemaDTO[]',
                schemaDiff: {
                    type: 'string',
                    enum: ['foo', 'bar'],
                },
                patchMethod: 'deepmerge',
            },
        }
        // ... other rules
    ]
}
```

[Подрбонее про правило patch-component-schema](./src/rules/patch-component-schema/README-ru.md)

----------------------

<a name="custom_anchor_rule_patch-endpoint-parameter-schema"></a>

### patch-endpoint-parameter-schema

Правило позволяет модифицировать схему параметров эндпоинтов в OpenAPI спецификации.

#### Config

| Параметр              | Описание                                                                                                               | Пример                                                                                                                                                                 | Типизация                                                                           | Дефолтное    |
|-----------------------|------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|--------------|
| `endpointDescriptor`  | [**обязательный**] Указание в каком endpoint нужно поменять схему параметра запроса.                                   | `'GET /api/list'`                                                                                                                                                     | `string`                                                                            |              |
| `parameterDescriptor` | [**обязательный**] Указание какой параметр запроса, на который ссылается `endpointDescriptor`, нужно поменять.         | `TestSchemaDTO`, `TestSchemaDTO.test`, `TestSchemaDTO[].testField`,  `TestObjectDTO.oneOf[1]`, `TestObjectDTO.allOf[1]` или  `TestObjectDTO.anyOf[1].testField`        | `string`                                                                            |              |
| `schemaDiff`          | Изменения для схемы параметра [Подробные примеры спецификаций для OpenAPI](./docs/schema-diff-ru.md)                                                              | `{type: "number"}`                                                                                                   | `OpenAPISchema`                                                                     |              |
| `objectDiff`          | Изменения для самого параметра                                                                                         | `{ required: true }`                                                                                                    | `{name?: string; in?: 'query' / 'header' / 'path' / 'cookie'; required?: boolean;}` |              |
| `patchMethod`         | Метод применения изменений, указанных в `objectDiff` и `schemaDiff`. [Подробнее про различия между методами merge и deepmerge](./docs/merge-vs-deepmerge-ru.md) | `'merge' /                                                                                                                                                  'deepmerge'` | `enum`                                                                              |  `merge` |

Пример конфигурации:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "patch-endpoint-parameter-schema",
            config: {
                endpointDescriptor: 'GET /api/list',
                parameterDescriptor: {
                    name: 'test',
                    in: 'query',
                },
                schemaDiff: {
                    enum: ['foo', 'bar'],
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
                endpointDescriptor: 'GET /api/list',
                parameterDescriptor: {
                    name: 'test',
                    in: 'path',
                },
                schemaDiff: {
                    type: 'string',
                    enum: ['foo', 'bar'],
                },
                objectDiff: {
                    name: 'newTest',
                    in: 'query',
                    required: true,
                },
                patchMethod: 'deepmerge',
            },
        }
        // ... other rules
    ]
}
```

[Подрбонее про правило patch-endpoint-parameter-schema](./src/rules/patch-endpoint-parameter-schema/README-ru.md)

----------------------

<a name="custom_anchor_rule_patch-endpoint-request-body-schema"></a>

### patch-endpoint-request-body-schema

Правило для изменения схемы request body в OpenAPI спецификации. Позволяет модифицировать схему запроса для указанного эндпоинта.

#### Config

| Параметр                    | Описание                                                                                                                                                | Пример                                                                                                                                                                | Типизация      | Дефолтное |
|-----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|-----------|
| `endpointDescriptor`        | [**обязательный**] Указание в каком endpoint нужно поменять схему параметра запроса.                                                                    | `'GET /api/list'`                                                                                                                                                     | `string`       |           |
| `contentType`               | Указание к какому типу запросов (content-type) endpoint'а нужно применить изменение. При отсутствии значения, будут изменены все варианты типов запросов. | `'application/json'`                                                                                                                                                  | `string`       |  |
| `correction`                | Путь к полю в схеме для модификации                                                                                                                     | `"name"` | `string` | - |
| `schemaDiff`                | [**обязательный**] Изменения для применения к схеме. [Подробные примеры спецификаций для OpenAPI](./docs/schema-diff-ru.md)                                                                                                                          | `{type: "number"}` или см. больше примеров OpenAPISchema TODO ссылка                                                                                                  | `OpenAPISchema` |           |
| `patchMethod`               | Метод применения изменений [Подробнее про различия между методами merge и deepmerge](./docs/merge-vs-deepmerge-ru.md) | `'merge' /                                                                                                                                                  'deepmerge'` | `enum`                                                                              |  `merge` |

Примеры конфигурации:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "patch-endpoint-request-body-schema",
            config: {
                endpointDescriptor: 'POST /api/order',
                correction: "status",
                schemaDiff: {
                    enum: ['foo', 'bar'],
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
                endpointDescriptor: 'POST /api/order',
                contentType: "application/json",
                schemaDiff: {
                    properties: {
                        testField: {
                            type: 'number',
                        },
                    },
                },
                patchMethod: "deepmerge"
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

[Подрбонее про правило patch-endpoint-request-body-schema](./src/rules/patch-endpoint-request-body-schema/README-ru.md)

----------------------

<a name="custom_anchor_rule_patch-endpoint-response-schema"></a>

### patch-endpoint-response-schema

Правило позволяет модифицировать схему ответа (response schema) для эндпоинтов в OpenAPI спецификации.

#### Config

| Параметр                | Описание                                                                                                                                            | Пример                                                                                                                                                                   | Типизация       | Дефолтное |
|-------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------|-----------|
| `endpointDescriptor`    | [**обязательный**] Указание в каком endpoint нужно поменять схему параметра запроса.                                                                | `'GET /api/list'`                                                                                                                                                        | `string`        |           |
| `correction`            | Путь к свойству схемы для модификации                                                                                                               | `"status"`                                                                                                                                                               | `string` | - |
| `code`                  | Указание к какому статус коду ответа нужно применить изменение. При отсутствии значения, будет применен к первому 2xx ответу.                       | `200`                                                                                                                                                                    | `number`        |  |
| `contentType`           | Указание к какому типу ответа (content-type) endpoint нужно применить изменение. При отсутствии значения, будут изменены все варианты типов ответов. | `'application/json'`                                                                                                                                                     | `string`        |  |
| `schemaDiff`            | [**обязательный**] Необходимое изменение в формате OpenAPI. [Подробные примеры спецификаций для OpenAPI](./docs/schema-diff-ru.md)                                                             | `{type: "number"}`                                                                                                  | `OpenAPISchema` |           |
| `patchMethod`           | Метод применения изменений [Подробнее про различия между методами merge и deepmerge](./docs/merge-vs-deepmerge-ru.md)                                                                        | `'merge' /                                                                                                                                                  'deepmerge'` | `enum`                                                                              |  `merge` |

Пример конфигурации:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "patch-endpoint-response-schema",
            config: {
                endpointDescriptor: 'GET /api/list',
                correction: '[].status',
                schemaDiff: {
                    enum: ['foo', 'bar'],
                },
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
            rule: "patch-endpoint-response-schema",
            config: {
                endpointDescriptor: 'GET /api/list',
                correction: '[].status',
                code: 200,
                contentType: 'application/json',
                schemaDiff: {
                    enum: ['foo', 'bar'],
                },
                patchMethod: 'deepmerge'
            },
        }
        // ... other rules
    ]
}
```

[Подрбонее про правило patch-endpoint-response-schema](./src/rules/patch-endpoint-response-schema/README-ru.md)

----------------------

<a name="custom_anchor_rule_patch-endpoint-schema"></a>

### patch-endpoint-schema

Правило позволяет модифицировать схему эндпоинта целиком в OpenAPI спецификации. В отличие от других правил патчинга, которые работают с отдельными частями эндпоинта (параметры, тело запроса, ответы), это правило может изменять всю структуру эндпоинта, включая все его компоненты.

#### Config

| Параметр                       | Описание                                               | Пример | Типизация | Дефолтное     |
|--------------------------------|--------------------------------------------------------|---------|------------|---------------|
| `endpointDescriptor`           | [**обязательный**] Описание эндпоинта для патчинга     | `{ path: "/pets", method: "get" }` | `{ path: string, method: string }` | -             |
| `endpointDescriptorCorrection` | Путь к конкретному полю в схеме эндпоинта для патчинга | `"responses.200.content.application/json.schema"` | `string` | -             |
| `schemaDiff`                   | [**обязательный**] Необходимое изменение в формате OpenAPI. [Подробные примеры спецификаций для OpenAPI](./docs/schema-diff-ru.md)              | `{ type: "object", properties: { ... } }` | `OpenAPISchema` | -             |
| `patchMethod`                    | Метод применения изменений [Подробнее про различия между методами merge и deepmerge](./docs/merge-vs-deepmerge-ru.md)                                                                        | `'merge' /                                                                                                                                                  'deepmerge'` | `enum`                                                                              |  `merge` |

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

[Подрбонее про правило patch-endpoint-schema](./src/rules/patch-endpoint-schema/README-ru.md)

----------------------

<a name="custom_anchor_rule_remove-deprecated"></a>

### remove-deprecated

Правило позволяет удалить устаревшие (deprecated) элементы из OpenAPI спецификации. Оно может удалять устаревшие компоненты, эндпоинты, параметры и свойства, при этом предоставляя возможность игнорировать определенные элементы и показывать описания удаляемых элементов.

#### Config

| Параметр | Описание                                                                                                                | Пример | Типизация | Дефолтное |
|----------|-------------------------------------------------------------------------------------------------------------------------|---------|-----------|-----------|
| `ignoreComponents` | [**опциональный**] Список компонентов, которые не должны быть удалены, даже если они помечены как устаревшие            | `[{"componentName": "Pet"}]` | `Array<ComponentDescriptorConfig>` | `[]` |
| `ignoreEndpoints` | [**опциональный**] Список эндпоинтов, которые не должны быть удалены, даже если они помечены как устаревшие             | `[{"path": "/pets", "method": "get"}]` | `Array<EndpointDescriptorConfig>` | `[]` |
| `ignoreEndpointParameters` | [**опциональный**] Список параметров эндпоинтов, которые не должны быть удалены, даже если они помечены как устаревшие  | `[{"path": "/pets", "method": "get", "name": "limit", "in": "query"}]` | `Array<ParameterDescriptorConfig>` | `[]` |
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
                    { componentName: "Pet" }
                ],
                ignoreEndpoints: [
                    { path: "/pets", method: "get" }
                ],
                ignoreEndpointParameters: [
                    { path: "/pets", method: "get", name: "limit", in: "query" }
                ],
                showDeprecatedDescriptions: true
            },
        }
    ]
}
```

[Подрбонее про правило remove-deprecated](./src/rules/remove-deprecated/README-ru.md)

----------------------

<a name="custom_anchor_rule_remove-max-items"></a>

### remove-max-items

Удаляет свойство `maxItems` из всех схем в OpenAPI спецификации.

#### Config

| Параметр    | Описание                          | Пример                     | Типизация              | Дефолтное |
| -------- |-----------------------------------|----------------------------|------------------------|-----------|
| `showUnusedWarning`  | [**опциональный**] Показывать предупреждение, если не найдено схем с maxItems | `true` | `boolean` | `false`        |

Пример конфигурации:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "remove-max-items",
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
            rule: "remove-max-items",
            config: {
                showUnusedWarning: true
            },
        }
        // ... other rules
    ]
}
```

[Подрбонее про правило remove-max-items](./src/rules/remove-max-items/README-ru.md)

----------------------

<a name="custom_anchor_rule_remove-min-items"></a>

### remove-min-items

Удаляет свойство `minItems` из всех схем в OpenAPI спецификации.

#### Config

| Параметр    | Описание                          | Пример                     | Типизация              | Дефолтное |
| -------- |-----------------------------------|----------------------------|------------------------|-----------|
| `showUnusedWarning`  | [**опциональный**] Показывать предупреждение, если не найдено схем с `minItems` | `true` | `boolean` | `false`        |

Пример конфигурации:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "remove-min-items",
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
            rule: "remove-min-items",
            config: {
                showUnusedWarning: true
            },
        }
        // ... other rules
    ]
}
```

[Подрбонее про правило remove-min-items](./src/rules/remove-min-items/README-ru.md)

----------------------

<a name="custom_anchor_rule_remove-operation-id"></a>

### remove-operation-id

Удаляет operationId из всех операций в OpenAPI спецификации, кроме тех, что указаны в списке игнорирования

#### Config

| Параметр    | Описание                          | Пример                     | Типизация              | Дефолтное |
| -------- |-----------------------------------|----------------------------|------------------------|-----------|
| `ignore`  | [**опциональный**] Список operationId для игнорирования | `["getPets", "createPet"]` | `string[]` | `[]` |

Пример конфигурации:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "remove-operation-id",
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
            rule: "remove-operation-id",
            config: {
                ignore: ["getPets", "createPet"]
            },
        }
        // ... other rules
    ]
}
```

[Подрбонее про правило remove-operation-id](./src/rules/remove-operation-id/README-ru.md)

----------------------

<a name="custom_anchor_rule_remove-parameter"></a>

### remove-parameter

Удаляет параметр из эндпоинта в OpenAPI спецификации

#### Config

| Параметр    | Описание                                                                                                                                  | Пример                     | Типизация              | Дефолтное |
| -------- |-------------------------------------------------------------------------------------------------------------------------------------------|----------------------------|------------------------|-----------|
| `endpointDescriptor`  | [**обязательный**] Описание эндпоинта, из которого нужно удалить параметр                                                                 | `{"path": "/pets", "method": "get"}` | `EndpointDescriptorConfig` | -         |
| `parameterDescriptor`  | [**обязательный**] Описание параметра, который нужно удалить. В параметр `in` можно указать: `"query"`, `"path"`, `"header"`, `"cookie"`. | `{"name": "petId", "in": "path"}` | `EndpointParameterDescriptorConfig` | -         |

Пример конфигурации:

```js
module.exports = {
    pipeline: [
        // ... other rules
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
        // ... other rules
    ]
}
```

[Подрбонее про правило remove-parameter](./src/rules/remove-parameter/README-ru.md)

----------------------

<a name="custom_anchor_rule_remove-unused-components"></a>

### remove-unused-components

Удаляет неиспользуемые компоненты из OpenAPI спецификации. Правило анализирует все ссылки на компоненты в документе и удаляет те, которые нигде не используются.

#### Config

| Параметр    | Описание                          | Пример            | Типизация              | Дефолтное |
| -------- |-----------------------------------|-------------------|------------------------|-----------|
| `ignore`  | [**опциональный**] Список компонентов, которые нужно игнорировать при удалении | `["NotFoundDTO"]` | `Array<string>` | `[]` |

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
                    "NotFoundDTO"
                ]
            },
        }
        // ... other rules
    ]
}
```

[Подрбонее про правило remove-unused-components](./src/rules/remove-unused-components/README-ru.md)

## FAQ

- **Чем опасны модификации по ссылкам $ref?** Потому что значит что $ref ссылается на общую часть схемы, и ее модификация, возможно, приведет к неявному изменению в другом месте спецификации, где переиспользуется $ref, и такую багу будет крайне сложно отловить.

## Примеры использования

В директории `examples` вы можете найти различные примеры использования пакета:

- [example-cli-generate-api-types](./examples/example-cli-generate-api-types) - Пример генерации типов API с использованием CLI
- [example-cli-openapi-json](./examples/example-cli-openapi-json) - Пример работы с JSON форматом OpenAPI через CLI
- [example-cli-openapi-yaml](./examples/example-cli-openapi-yaml) - Пример работы с YAML форматом OpenAPI через CLI
- [example-cli-openapi-yaml-to-json](./examples/example-cli-openapi-yaml-to-json) - Пример конвертации YAML в JSON формат
- [example-cli-simple-generate-api-types](./examples/example-cli-simple-generate-api-types) - Простой пример генерации типов API
- [example-cli-simple-json-config](./examples/example-cli-simple-json-config) - Пример использования JSON конфигурации
- [example-cli-simple-npx](./examples/example-cli-simple-npx) - Пример использования через npx
- [example-package-openapi-yaml](./examples/example-package-openapi-yaml) - Пример программного использования пакета

Каждый пример содержит:
- Входные файлы OpenAPI спецификации
- Конфигурационные файлы
- Скрипты для запуска
- Результирующие файлы

## Дополнительные полезные ссылки

- [Добавление нового правила](./docs/contributing-ru.md)
- [Различия между простым и объектным дескриптором компонента с коррекцией](./docs/descriptor-ru.md)
- [Различия между методами merge и deepmerge](./docs/merge-vs-deepmerge-ru.md)
- [Примеры спецификаций для OpenAPI](./docs/schema-diff-ru.md)
- [Simple Text File Modifier](./docs/simple-text-file-modifier-ru.md)
