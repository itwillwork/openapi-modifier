# simple-text-file-modifier

Простой инструмент для постобработки файлов как с текстовым документом.

Возможное применение:
- заменить текст, например, переименовать сущность. [Применение в коде примера](./examples/example-cli-generate-api-types/simple-text-file-modifier-config.ts#L3-L15)
- написать что-то в начало файла, например, для сгенерированной типизации добавить предостережение, что не надо редактировать вручную. [Применение в коде примера](./examples/example-cli-generate-api-types/simple-text-file-modifier-config.ts#L2)
- написать что-то в конец файла.

### Демонстрация использования

Например мы сгенерировали [типизацию для API](./examples/example-cli-generate-api-types/output/generated-api-types.d.ts).
И хотим явно пометить для других разработчиков: что файл не нужно менять вручную и переименовать некоторые сущности на более декларативные названия.
Пишем [файл конфигурации](./examples/example-cli-generate-api-types/simple-text-file-modifier.config.ts), описывающий все что нужно поменять с пояснительными комментариями.
Далее [при помощи этого файла конфигурации и cli simple-text-file-modifier](./examples/example-cli-generate-api-types/package.json#L9), и получается [модифицированный файл типиазации API](./examples/example-cli-generate-api-types/output/generated-api-types.d.ts).

<a name="cli"></a>
### Использование как CLI

При помощи `npm`

```shell
npm i --save-dev openapi-modifier

simple-text-file-modifier --input=input/openapi.yml --output=output/openapi.yml --config=simple-text-file-modifier.config.js
```
[на примере использования](./examples/example-cli-generate-api-types/package.json#L9)

Параметры:

| Опция      | Описание                                                                                                 | Пример                       | Дефолтное                                       |
|------------|----------------------------------------------------------------------------------------------------------|------------------------------|-------------------------------------------------|
| **input**  | [**обязательный**] входной файл, специфиакция/документация в формате openapi                             | `input/openapi.yml`          |                                                 |
| **output** | [**обязательный**] выходной файл, специфиакция/документация в формате opeanpi                            | `output/openapi.yml`         |                                                 |
| **config** | путь до файла конфигурации. Детальное описание конфигурации [см. ниже](#custom_anchor_config_parameters) | `simple-text-file-modifier.config.js` | `simple-text-file-modifier.config.(json\js\ts)` |


<a name="config_description"></a>
### Параметры конфигурации

| Опция         | Тип                                                             | Пример                                                                      | Описание                                                                                 | Дефолтное |
|---------------|-----------------------------------------------------------------|-----------------------------------------------------------------------------|------------------------------------------------------------------------------------------|---------|
| **addAfter**  | `string`                                                        | `"WARNING! This file was auto-generated"`                                   | Строчка которую необходимо вписать в начало файла                                        |         |
| **addBefore** | `string`                                                        | `"/// <reference types="../../a" />"`                                       | Строчка которую необходимо вписать в начало файла                                        |         |
| **replace**   | `Array<{ searchValue: string \ RegExp; replaceValue: string }>` | `{ searchValue: /\ Components\./g, replaceValue: ' ApiComponents.', }`     | Массив необходимых изменений. Искать можно как по строке так и по регулярному выражениею |           |