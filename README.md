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
- [remove-min-items][2]
- [remove-max-items][3]
- [change-endpoints-basepath][4]
- [change-content-type][5]
- [filter-by-content-type][6]
- [filter-endpoints][7]
- [patch-schemas][8]

[1]: ./src/rules/remove-operation-id/README.md
[2]: ./src/rules/remove-min-items/README.md
[3]: ./src/rules/remove-max-items/README.md
[4]: ./src/rules/change-endpoints-basepath/README.md
[5]: ./src/rules/change-content-type/README.md
[6]: ./src/rules/filter-by-content-type/README.md
[7]: ./src/rules/filter-endpoints/README.md
[8]: ./src/rules/patch-schemas/README.md

make-required-parameter
remove-parameter
merge-openapi-spec
remove-unused-component-schemas

Все названия функций должны начинаться с обозначения действия

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

Для последовательного преобразования вывод