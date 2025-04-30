# Remove X Internal

## Описание
Правило для удаления расширения `x-internal` из OpenAPI спецификации.

## Конфигурация
```yaml
rules:
  remove-x-internal:
    enabled: true
    # Опционально: список путей к элементам, из которых нужно удалить x-internal
    # Если не указано, правило применяется ко всем элементам
    paths:
      - components/schemas/User
      - components/schemas/Order
```

## Мотивация
Расширение `x-internal` может содержать внутреннюю информацию, которая не должна быть доступна клиентам API. Удаление этого расширения делает спецификацию более чистой и безопасной.

## Примеры использования
1. Удаление расширения `x-internal` из всех элементов:
```yaml
rules:
  remove-x-internal:
    enabled: true
```

2. Удаление расширения `x-internal` из конкретных элементов:
```yaml
rules:
  remove-x-internal:
    enabled: true
    paths:
      - components/schemas/User
      - components/schemas/Order
```

## Пример
До:
```yaml
components:
  schemas:
    User:
      type: object
      x-internal: true
      properties:
        name:
          type: string
    Order:
      type: object
      x-internal: true
      properties:
        id:
          type: string
```

После:
```yaml
components:
  schemas:
    User:
      type: object
      properties:
        name:
          type: string
    Order:
      type: object
      properties:
        id:
          type: string
``` 