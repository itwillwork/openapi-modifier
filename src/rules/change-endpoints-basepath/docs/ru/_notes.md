### Про обработка конфликтов операций и параметр ignoreOperationCollisions

Правило проверяет наличие конфликтов операций при изменении путей. Если после замены пути возникает конфликт (например, два разных эндпоинта становятся одинаковыми), правило выдаст ошибку.

Пример конфликта:

```yaml
paths:
  /api/v1/pets:
    get:
      summary: List all pets
  /v1/pets:
    get:
      summary: Get pet by id
```

При попытке заменить `/api/v1` на `/v1` возникнет конфликт, так как оба эндпоинта станут `/v1/pets`.

В этом случае можно:
1. Использовать `ignoreOperationCollisions: true` для игнорирования конфликтов
2. Изменить конфигурацию замены путей, чтобы избежать конфликтов
3. Предварительно изменить конфликтующие эндпоинты 