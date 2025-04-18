# openapi-modifier

OpenAPI описывающий бекендное API далеко не всегда идеальное: содержит ошибки, неточности или какие-то особенности ломают другие инструменты, например, кодогенерацию или генерацию типов.

**Данный инструмент предназначен для облегчения работы с OpenAPI** - для легкой модификации OpenAPI спецификации и удобного описания/документации изменений для истории/пояснений.

Частые кейсы применения:

<details>
  <summary>-Бекендер просит проверить используется ли поле в какой-то сущности</summary>

При помощи правила можно убрать из сущности поле, и сгенерировать типизацию без нее, и если запустить проверку типизации в проекте TS поможет найти все места использования.

```js
{
    "rule": "patch-schemas"
}
```

</details>

- Бекендер просит проверить используется ли параметр в какой-то ручке
- Бекендер создает задачу перестать пользоваться endpoint'ом
- Бекендер написал новое API в разработке но его нет в документации
- Бекендер просит больше не использовать какой-то параметр в endpoint'е
- Не валидное OpenAPI (Например, бекендеры использовали не существующий тип int)
- Нужно оставить знания по модификации (коллеге важно знать почему какое-то поле заблокировано)
- Нужно наблюдать за изменениями API и вовремя корректировать конфиг (убрали использование ручки)
- Убирать deprecated поля

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

### Примеры использования

Наиболее приближенный к реальному использованию [пример](./examples/example-cli-generate-api-types) в нем отражено:

- модификация openapi.yaml с комментариями для комманды разработчиков (см. [файл конфигурации](./examples/example-cli-generate-api-types/openapi-modifier-config.ts) и [полученный файл](./examples/example-cli-generate-api-types/output/openapi.yaml)). В нем помечены в каких задачах (JIRA-\*) будут исправлены правки, пример ???
- способ генерации типизации из API по openapi (см. [комманду генерирующую типизацию API](./examples/example-cli-generate-api-types/package.json#L8))
- пост-обработка сгенерированной типизации (см. [файл конфигурации](./examples/example-cli-generate-api-types/simple-text-file-modifier-config.ts) и [полученный файл типизации API](./examples/example-cli-generate-api-types/output/generated-api-types.d.ts)). Проставляется warning для комманды разработки, переименовываются сущности (для удобства использования).

