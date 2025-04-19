{{{langSwitcher}}}

# OpenAPI Modifier

Инструмент для модификации OpenAPI спецификаций с помощью настраиваемых правил. Этот пакет позволяет автоматизировать процесс изменения OpenAPI спецификаций, применяя к ним набор предопределенных правил.

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

{{{cliParams}}}

{{{cliConfigWarning}}}

<a name="custom_anchor_cli_usage"></a>

### CLI

```shell
npm i --save-dev openapi-modifier

openapi-modifier --input=input/openapi.yml --output=output/openapi.yml --config=openapi-modifier.config.js
```

[Пример использования как CLI](./examples/example-cli-openapi-yaml/package.json#L7)

{{{cliParams}}}

{{{cliConfigWarning}}}

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
> - редактировать следующим этапом результат предыдущего этапа, таким образом выстраивая последовательность необходимых изменений.
> - использовать правила необходимое число раз и в нужной последовательности

<a name="custom_anchor_rule_table"></a>

## Доступные правила

{{{ruleTable}}}

<a name="custom_anchor_rules_description"></a>

## Краткие описания правил

{{{rulesDescription}}}

## FAQ

- **Чем опасны модификации по ссылкам $ref?** Потому что значит что $ref ссылается на общую часть схемы, и ее модификация, возможно, приведет к неявному изменению в другом месте спецификации, где переиспользуется $ref, и такую багу будет крайне сложно отловить.

## Ссылки на примеры использования

- [Проект с простым использованием пакета #1](./examples/example-cli-generate-api-types)
- [Проект с простым использованием пакета #2](./examples/example-cli-openapi-yaml-to-json)
- [Проект с простым использованием пакета #3](./examples/example-cli-simple-npx)
- [Проект с простым использованием пакета #4](./examples/example-cli-openapi-json)
- [Проект с простым использованием пакета #5](./examples/example-cli-openapi-json)
- [Проект с простым использованием пакета #6](./examples/example-cli-simple-generate-api-types)
- [Проект с простым использованием пакета #7](./examples/example-package-openapi-yaml)
- [Проект с простым использованием пакета #8](./examples/example-cli-simple-json-config)

## Дополнительные полезные ссылки

- [Подробная документация по разработке и добавлению новых правил](./docs/debug.md)
- [Разница между merge и deepmerge стратегиями](./docs/merge-strategy.md)
- [Примеры спецификаций OpenAPI формата](./docs/schema-diff.md)
- [Подробная документация по cli simple-text-file-modifier](./docs/simple-text-file-modifier.md)
