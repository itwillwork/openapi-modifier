# openapi-modifier

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
