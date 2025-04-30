# Remove X Internal Properties

## Описание
Правило для удаления свойств с расширением `x-internal` из схем компонентов OpenAPI.

## Конфигурация
```yaml
rules:
  remove-x-internal-properties:
    enabled: true
    # Опционально: список путей к компонентам, из которых нужно удалить свойства с x-internal
    # Если не указано, правило применяется ко всем компонентам
    paths:
      - components/schemas/User
      - components/schemas/Order
```

## Мотивация
Свойства с расширением `x-internal` могут содержать внутреннюю информацию, которая не должна быть доступна клиентам API. Удаление этих свойств делает спецификацию более чистой и безопасной.

## Примеры использования
1. Удаление свойств с `x-internal` из всех компонентов:
```yaml
rules:
  remove-x-internal-properties:
    enabled: true
```

2. Удаление свойств с `x-internal` из конкретных компонентов:
```yaml
rules:
  remove-x-internal-properties:
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
      properties:
        name:
          type: string
        internalId:
          type: string
          x-internal: true
    Order:
      type: object
      properties:
        id:
          type: string
        internalStatus:
          type: string
          x-internal: true
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