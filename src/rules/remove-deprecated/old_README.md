## remove-deprecated

Удаляет deprecated сущности:

- API методы;
- параметры API методов;
- поля в компонентах (с учетом $ref: если поле ссылается на deprecated сущность);
- компоненты;

> Учитываются только локальные $ref'ы файла, вида: `#/...`

TODO если нужно пропатчить что-то далеко, отменить deprecated можно использовать другие правила patch-*

### Конфигурация

| Параметр    | Описание                          | Пример                              | Типизация                                                                                          | Дефолтное |
| -------- |-----------------------------------|-------------------------------------|----------------------------------------------------------------------------------------------------|-----------|
| `ignoreComponents`  | Игнорирование deprecated флагов для сущностей  | `[{componentName: "TestDTO"}]`      | `Array<{componentName: string}>`                                                                   | `[]`      |
| `ignoreEndpoints`  | Игнорирование deprecated endpoint'ов  | `[{path: '/ping', method: 'get' }]` | `Array<{path: string; method: string;}>`                                                           | `[]`      |
| `ignoreEndpointParameters`  | Игнорирование deprecated параметров endpoint'ов  | `[{path: '/ping', method: 'get' }]`       | `Array<{path: string; method: string; name: string; in: 'query' \ 'header' \ 'path' \ 'cookie' }>` | `[]`      |
| `showDeprecatedDescriptions`  | Включает вывод description удаляемых полей, обычно разработчики туда указывают, что нужно использовать взамен  | `true`                              | `boolean`                                                                                          | `false`   |

Пример конфигурации:

TODO

### Пример использования

TODO
