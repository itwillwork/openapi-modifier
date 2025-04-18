Внутри используется для детального логирования npm-пакет - [debug](https://www.npmjs.com/package/debug)

Для вывода всех debug логов:

```bash
DEBUG=openapi-modifier:* openapi-modifier
```

Для вывода debug логов по правилу, например по правилу `remove-operation-id`:

```bash
DEBUG=openapi-modifier:rule:remove-operation-id openapi-modifier
```