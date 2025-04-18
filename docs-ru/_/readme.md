# OpenAPI Modifier

Инструмент для модификации OpenAPI спецификаций с помощью настраиваемых правил. Этот пакет позволяет автоматизировать процесс изменения OpenAPI спецификаций, применяя к ним набор предопределенных правил.

## Основные возможности

- Модификация OpenAPI спецификаций в форматах YAML и JSON
- Гибкая система правил для изменения спецификаций
- Поддержка как CLI, так и программного использования c поддержкой TypeScript

> [!IMPORTANT]  
> Поддерживает OpenAPI 3.1, 3.0. Мы не проверяли поддержку OpenAPI 2, так как формат является устаревшим и рекомендуем мигрировать вашу документацию на OpenAPI 3.0.

## Установка

```bash
npm install --save-dev openapi-modifier
```

## Использование

<a name="custom_anchor_cli_usage"></a>

### Как CLI

```shell
npm i --save-dev openapi-modifier

openapi-modifier --input=input/openapi.yml --output=output/openapi.yml --config=openapi-modifier.config.js
```

[Пример использования как CLI](./examples/example-cli-openapi-yaml/package.json#L7)

{{{cliParams}}}

{{{cliConfigWarning}}}

<a name="custom_anchor_cli_npx_usage"></a>

### Как CLI через NPX

```shell
npx openapi-modifier --input=input/openapi.yml --output=output/openapi.yml --config=openapi-modifier.config.js
```

[Пример использования как CLI через NPX](./examples/example-cli-simple-npx/package.json#L6)

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

## Дополнительные полезные ссылки

- [Подробная документация по разработке и добавлению новых правил](./docs/debug.md)
- [Разница между merge и deepmerge стратегиями](./docs/merge-strategy.md)
- [Примеры спецификаций OpenAPI формата](./docs/schema-diff.md)
- [Подробная документация по cli simple-text-file-modifier](./docs/simple-text-file-modifier.md)
