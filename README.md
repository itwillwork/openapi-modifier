# openapi-modifier

TODO что это и мотивация создания

### Использование как CLI

```bash
openapi-modifier --input=example-1/input.yml --output=example-1/output.yml --config=example-1/openapi-modifier-config.js
```

### Пример конфигурации

Можно использовать конфиги в след. расширениях: `.js`, `.yaml`, `.yml`, `.json`

Пример конфигурации в `.js`
```js
module.exports = {
    "logger": {
        "minLevel": 1,
    },
    "input": "./openapi.yaml",
    "output": "./openapi.yaml",
    "rules": [
        {
            "name": "remove-operation-id",
            "disabled": true,
        },
        // ...
    ]
}
```

### Использование как npm пакет/модуль

```js
await openapiModifier({
    input: '',
    output: '',
})
```

### Существующие правила

- [remove-operation-id][1]

[1]: ./src/rules/remove-operation-id/README.md

remove-min-items
patch-response-content-type
patch-request-content-type
remove-unused-component-schemas
patch-endpoints-basepath
endpoints-filter
patch-component-schemas
patch-endpoints

### Добавление нового правила

Необходимо в папку `rules` добавить папку с именем вновь созданного правила с 2 файлами:
- `index.ts` сама логика правила
- `README.md` файл с описанием работы правила

Про отладку конкретного правила, см. пункт "Отладка" ниже.

### Отладка

Внутри используется для детального логирования [debug](https://www.npmjs.com/package/debug)

Для вывода всех debug логов:

```bash
DEBUG=openapi-modifier:* openapi-modifier
```

Для вывода debug логов по правилу, например по правилу `remove-operation-id`: 

```bash
DEBUG=openapi-modifier:rule:remove-operation-id openapi-modifier
```
