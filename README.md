# openapi-modifier

### Текущие правила

remove-operation-id
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

# Debug

Verbose logs:

```bash
openapi-modifier --verbose
```

For all:

```bash
DEBUG=openapi-modifier openapi-modifier
```

For rule:

```bash
DEBUG=openapi-modifier:... openapi-modifier
```
