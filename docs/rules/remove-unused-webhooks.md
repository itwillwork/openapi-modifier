# Remove Unused Webhooks

## Описание
Правило для удаления неиспользуемых вебхуков из OpenAPI спецификации.

## Конфигурация
```yaml
rules:
  remove-unused-webhooks:
    enabled: true
    # Опционально: список путей к вебхукам, которые нужно сохранить
    # Если не указано, правило удаляет все неиспользуемые вебхуки
    keep:
      - components/webhooks/User
      - components/webhooks/Order
```

## Мотивация
Неиспользуемые вебхуки могут загромождать спецификацию и затруднять её понимание. Удаление неиспользуемых вебхуков делает спецификацию более чистой и понятной.

## Примеры использования
1. Удаление всех неиспользуемых вебхуков:
```yaml
rules:
  remove-unused-webhooks:
    enabled: true
```

2. Сохранение определенных вебхуков:
```yaml
rules:
  remove-unused-webhooks:
    enabled: true
    keep:
      - components/webhooks/User
      - components/webhooks/Order
```

## Пример
До:
```yaml
components:
  webhooks:
    User:
      post:
        description: User webhook
        requestBody:
          content:
            application/json:
              schema:
                type: object
    Order:
      post:
        description: Order webhook
        requestBody:
          content:
            application/json:
              schema:
                type: object
    UnusedWebhook:
      post:
        description: Unused webhook
        requestBody:
          content:
            application/json:
              schema:
                type: object
```

После:
```yaml
components:
  webhooks:
    User:
      post:
        description: User webhook
        requestBody:
          content:
            application/json:
              schema:
                type: object
    Order:
      post:
        description: Order webhook
        requestBody:
          content:
            application/json:
              schema:
                type: object
``` 