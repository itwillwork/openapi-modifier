# simple-text-file-modifier

Простой инструмент для постобработки файлов как с текстовым документом.

Возможное применение:
- заменить текст, например, переименовать сущность. [Применение в коде примера](./examples/example-cli-generate-api-types/simple-text-file-modifier-config.ts#L3-L15)
- написать что-то в начало файла. [Применение в коде примера](./examples/example-cli-generate-api-types/simple-text-file-modifier-config.ts#L2)
- написать что-то в конец файла.

<a name="cli"></a>
### Использование как CLI

При помощи `npx`

```shell
npx simple-text-file-modifier --input=input/openapi.yml --output=output/openapi.yml --config=openapi-modifier.config.js
```
[на примере использования](./examples/example-cli-simple-npx/package.json#L6)

или при помощи `npm`

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


<a name="config_description"></a>
### Параметры конфигурации

| Опция   | Описание                                                                                                                                         | Дефолтное                                                         |
|---------|--------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------|
| `logger.minLevel` | [**обязательный**] входной файл, специфиакция/документация в формате openapi                                                                     |                                                                   |
| `input` | [**обязательный**] выходной файл, специфиакция/документация в формате opeanpi                                                                    |                                                                   |
| `output` | [**обязательный**] выходной файл, специфиакция/документация в формате opeanpi                                                                    |                                                                   |
| `pipeline` | последовательность применяемых правил модификации к входному файлу. Детальное описание конфигурации [см. ниже](#custom_anchor_config_parameters) | `./openapi-modifier.config.js` или `./openapi-modifier.config.ts` |

