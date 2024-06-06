# openapi-modifier

TODO что это и мотивация создания

- Бекендер просит проверить используется ли поле в какой-то сущности
- Бекендер просит проверить используется ли параметр в какой-то ручке
- Бекендер создает задачу перестать пользоваться endpoint'ом
- Бекендер написал новое API в разработке но его нет в документации
- Бекендер просит больше не использовать какой-то параметр в endpoint'е
- Не валидное OpenAPI (Например, бекендеры использовали не существующий тип int)
- Нужно оставить знания по модификации (коллеге важно знать почему какое-то поле заблокировано)
- Нужно наблюдать за изменениями API и вовремя корректировать конфиг (убрали использование ручки)

> [!IMPORTANT]  
> Поддерживает OpenAPI 3.1, 3.0. Мы не проверяли поддержку OpenAPI 2, так как формат является устаревшим и рекомендуем мигрировать вашу документацию на OpenAPI 3.0.


### Демонстрация использования

Имеем входной файл спецификации/документации от бекенд разработчиков. Например, скачен через curl cli из github.

Пишем файл конфигурации, описывающий все что нужно поменять в исходной спецификации/документации с пояснительными комментариями:
```ts

```

Далее при помощи этого файла конфигурации и cli openapi-modifier, изменяем исходный файл спецификации/документации и получается модифицированная спецификация/документация.

Далее при помощи, к примеру cli `dtsgenerator`, генерируем из модифицированной спецификации/документаци - типизацию для api, которую уже используем в коде проекта.

[Полный код примера](./examples/example-cli-generate-api-types)

### Использование как CLI

При помощи npx

```shell
npx openapi-modifier --input=input/openapi.yml --output=output/openapi.yml --config=openapi-modifier.config.js
```
[на примере использования](./examples/example-cli-simple-npx/package.json#L6)

или при помощи npm

```shell
npm i --save-dev openapi-modifier

openapi-modifier --input=input/openapi.yml --output=output/openapi.yml --config=openapi-modifier.config.js
```
[на примере использования](./examples/example-cli-openapi-yaml/package.json#L7)

Параметры:

| Опция    | Описание                                                                                                 | Пример                       | Дефолтное                                                                                                                                                  |
|----------|----------------------------------------------------------------------------------------------------------|------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `input`  | [**обязательный**] входной файл, специфиакция/документация в формате openapi                             | `input/openapi.yml`          |                                                                                                                                                            |
| `output` | [**обязательный**] выходной файл, специфиакция/документация в формате opeanpi                            | `output/openapi.yml`         |                                                                                                                                                            |
| `config` | путь до файла конфигурации. Детальное описание конфигурации [см. ниже](#custom_anchor_config_parameters) | `openapi-modifier.config.js` | `openapi-modifier.config.json`, но если не нашлось ищем `openapi-modifier.config.js` и если не все равное не получилось найти `openapi-modifier.config.ts` |

[Демонстрация на примере использования](./examples/example-cli-openapi-yaml/package.json#L7)

### Пример файлов конфигурации

Можно использовать конфиги в след. расширениях: `.ts`, `.js`, `.yaml`, `.yml`, `.json`.

Если путь до конфигурации не указан, конфигурации по-умолчанию берется из файла `openapi-modifier.config.js` относительно директории запуска.

Пример конфигурации в `.ts`. Наример, назовем файл `openapi-modifier.config.ts`.

```ts
import type { ConfigT } from 'openapi-modifier';

const config: ConfigT = {
  input: './input/openapi.yaml',
  output: './output/openapi.yaml',
  rules: [
    // ... more rules
    {
      name: 'remove-operation-id',
      disabled: true,
    },
    // ... more rules
  ],
};

export default config;
```

Пример конфигурации в `.js`

```js
module.exports = {
    input: './input/openapi.yaml',
    output: './output/openapi.yaml',
  rules: [
    {
      name: 'remove-operation-id',
      disabled: true,
    },
    // ...
  ],
};
```

<a name="custom_anchor_config_parameters"></a>
### Параметры конфигурации

Параметры:

| Опция   | Описание                                                                                                                                         | Дефолтное                                                         |
|---------|--------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------|
| `logger.minLevel` | [**обязательный**] входной файл, специфиакция/документация в формате openapi                                                                     |                                                                   |
| `input` | [**обязательный**] выходной файл, специфиакция/документация в формате opeanpi                                                                    |                                                                   |
| `output` | [**обязательный**] выходной файл, специфиакция/документация в формате opeanpi                                                                    |                                                                   |
| `pipeline` | последовательность применяемых правил модификации к входному файлу. Детальное описание конфигурации [см. ниже](#custom_anchor_config_parameters) | `./openapi-modifier.config.js` или `./openapi-modifier.config.ts` |

Простой пример конфигурации, например файл `openapi-modifier.config.json`:
```json
{
  "pipeline": [
    {
      "rule": "remove-operation-id"
    }
  ]
}
```

[Пример использования](./examples/example-cli-simple-npx/openapi-modifier.config.json)

### Использование как npm пакет/модуль

```js
import { openapiModifier } from 'openapi-modifier';

// ...

await openapiModifier({
    input: 'input/openapi.yml',
    output: 'output/openapi.yml',
    pipeline: [
        // ... more rules
        {
            rule: 'remove-operation-id',
            config: {
                ignore: [],
            },
        },
        // ... more rules
    ],
});
```
[Демонстрация на примере использования](./examples/example-package-openapi-yaml/generate.ts)

или используя отдельный файл конфигурации

```js
import { openapiModifier } from 'openapi-modifier';

// ...

await openapiModifier({
    input: 'input/openapi.yml',
    output: 'output/openapi.yml',
    config: 'openapi-modifier.config.ts',
});
```

### Существующие правила

- [remove-operation-id][1]
- [remove-min-items][2]
- [remove-max-items][3]
- [change-endpoints-basepath][4]
- [change-content-type][5]
- [filter-by-content-type][6]
- [filter-endpoints][7]
- [patch-schemas][8]
- [patch-parameter][9]
- [remove-parameter][10]
- [merge-openapi-spec][11]
- [remove-unused-components][12]

[1]: ./src/rules/remove-operation-id/README.md
[2]: ./src/rules/remove-min-items/README.md
[3]: ./src/rules/remove-max-items/README.md
[4]: ./src/rules/change-endpoints-basepath/README.md
[5]: ./src/rules/change-content-type/README.md
[6]: ./src/rules/filter-by-content-type/README.md
[7]: ./src/rules/filter-endpoints/README.md
[8]: ./src/rules/patch-schemas/README.md
[9]: ./src/rules/patch-parameter/README.md
[10]: ./src/rules/remove-parameter/README.md
[11]: ./src/rules/merge-openapi-spec/README.md
[12]: ./src/rules/remove-unused-components/README.md

### Добавление нового правила

Необходимо в папку `rules` добавить папку с именем вновь созданного правила с 2 файлами:

- `index.ts` сама логика правила
- `README.md` файл с описанием работы правила

Про отладку конкретного правила, см. пункт "Отладка" ниже.

Все названия функций должны начинаться с обозначения действия.

### Отладка

Внутри используется для детального логирования npm-пакет - [debug](https://www.npmjs.com/package/debug)

Для вывода всех debug логов:

```bash
DEBUG=openapi-modifier:* openapi-modifier
```

Для вывода debug логов по правилу, например по правилу `remove-operation-id`:

```bash
DEBUG=openapi-modifier:rule:remove-operation-id openapi-modifier
```

### Примеры использования

Наиболее приближенный к реальному использованию [пример](./examples/example-cli-generate-api-types) в нем отражено:
- модификация openapi.yaml с комментариями для комманды разработчиков (см. [файл конфигурации](./examples/example-cli-generate-api-types/openapi-modifier-config.ts) и [полученный файл](./examples/example-cli-generate-api-types/output/openapi.yaml)). В нем помечены в каких задачах (JIRA-*) будут исправлены правки, пример ???
- способ генерации типизации из API по openapi (см. [комманду генерирующую типизацию API](./examples/example-cli-generate-api-types/package.json#L8))
- пост-обработка сгенерированной типизации (см. [файл конфигурации](./examples/example-cli-generate-api-types/simple-text-file-modifier-config.ts) и [полученный файл типизации API](./examples/example-cli-generate-api-types/output/generated-api-types.d.ts)). Проставляется warning для комманды разработки, переименовываются сущности (для удобства использования). 

Его конфиг:

[Полный код примера](./examples/example-cli-generate-api-types)

Другие примеры:
- Использование как npm пакет в скриптах 

### Полезные ссылки

Больше примеров как можно использовать openapi:
- для ...
- для ...
Подробная [статья на habr](./examples/example-cli-generate-api-types)

### simple-text-file-modifier

### TODO

- дефолтный путь до конфигов (./openapi-modifier.config.js or ./openapi-modifier.config.ts)
- скрипт генерации README.md для всех правил
- причесать README.md правил
- причесать README.md примеров
- причесать главный README.md