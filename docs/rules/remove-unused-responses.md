# Remove Unused Responses

## Описание
Правило для удаления неиспользуемых ответов из OpenAPI спецификации.

## Конфигурация
```yaml
rules:
  remove-unused-responses:
    enabled: true
    # Опционально: список путей к ответам, которые нужно сохранить
    # Если не указано, правило удаляет все неиспользуемые ответы
    keep:
      - components/responses/User
      - components/responses/Order
```

## Мотивация
Неиспользуемые ответы могут загромождать спецификацию и затруднять её понимание. Удаление неиспользуемых ответов делает спецификацию более чистой и понятной.

## Примеры использования
1. Удаление всех неиспользуемых ответов:
```yaml
rules:
  remove-unused-responses:
    enabled: true
```

2. Сохранение определенных ответов:
```yaml
rules:
  remove-unused-responses:
    enabled: true
    keep:
      - components/responses/User
      - components/responses/Order
```

## Пример
До:
```yaml
components:
  responses:
    User:
      description: User response
      content:
        application/json:
          schema:
            type: object
    Order:
      description: Order response
      content:
        application/json:
          schema:
            type: object
    UnusedResponse:
      description: Unused response
      content:
        application/json:
          schema:
            type: object
```

После:
```yaml
components:
  responses:
    User:
      description: User response
      content:
        application/json:
          schema:
            type: object
    Order:
      description: Order response
      content:
        application/json:
          schema:
            type: object
``` 