| Параметр    | Описание                          | Пример            | Типизация              | Дефолтное |
| -------- |-----------------------------------|-------------------|------------------------|-----------|
| `ignore`  | [**опциональный**] Список компонентов или регулярных выражений, которые нужно игнорировать при удалении | `["NotFoundDTO", "/^Error.*/"]` | `Array<string \| RegExp>` | `[]` |
| `printDeletedComponents` | [**опциональный**] Если true, то в консоль будет выведен список удаленных компонентов | `true` | `boolean` | `false` |

Пример конфигурации:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "remove-unused-components",
            config: {},
        }
        // ... other rules
    ]
}
```

Пример более детальной конфигурации:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "remove-unused-components",
            config: {
                ignore: [
                    "NotFoundDTO",
                    /^Error.*/, // игнорировать все компоненты, начинающиеся с Error
                    /.*Response$/ // игнорировать все компоненты, заканчивающиеся на Response
                ],
                printDeletedComponents: true // выводить список удаленных компонентов в консоль
            },
        }
        // ... other rules
    ]
}
```
