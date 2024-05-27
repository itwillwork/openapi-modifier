# openapi-modifier

> [!IMPORTANT]  
> Поддерживает OpenAPI 3.1, 3.0

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
openapi-modifier --input=example-1/input.yml --output=example-1/output.yml --config=example-1/openapi-modifier.config.js
```

Параметры:
- input - [обязательный] входной файл для редакирования
- ouput - [обязательный] вызодной файл
- config - путь до конфига, по-умолчанию ссылается на `openapi-modifier.config.js`. Детальное описание конфигурации [см. ниже](#TODO)

### Пример конфигурации

Можно использовать конфиги в след. расширениях: `.js`, `.yaml`, `.yml`, `.json`, `.ts`

Пример конфигурации в `.js`

```js
module.exports = {
  logger: {
    minLevel: 1,
  },
  input: './openapi.yaml',
  output: './openapi.yaml',
  rules: [
    {
      name: 'remove-operation-id',
      disabled: true,
    },
    // ...
  ],
};
```

Пример конфигурации в `.ts`

```js
import type { ConfigT } from 'openapi-modifier';

const config: ConfigT = {
  logger: {
    minLevel: 1,
  },
  input: './openapi.yaml',
  output: './openapi.yaml',
  rules: [
    {
      name: 'remove-operation-id',
      disabled: true,
    },
    // ...
  ],
};

export default config;
```

Параметры:
TODO

### Использование как npm пакет/модуль

```js
await openapiModifier({
  input: '',
  output: '',
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

### simple-text-file-modifier

### TODO

- сделать главный пример со всеми правилами и комментариями в openapi-modifier-config.ts
- починить багу с которой столкнулся
- причесать документацию TODO