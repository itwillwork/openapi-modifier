# Remove Required

## Описание
Правило для удаления обязательных полей из схем компонентов OpenAPI.

## Конфигурация
```yaml
rules:
  remove-required:
    enabled: true
    # Опционально: список путей к компонентам, из которых нужно удалить required
    # Если не указано, правило применяется ко всем компонентам
    paths:
      - components/schemas/User
      - components/schemas/Order
```

## Мотивация
Обязательные поля могут быть слишком строгими для некоторых сценариев использования API. Удаление этого ограничения позволяет сделать API более гибким и удобным для клиентов.

## Примеры использования
1. Удаление обязательных полей из всех компонентов:
```yaml
rules:
  remove-required:
    enabled: true
```

2. Удаление обязательных полей из конкретных компонентов:
```yaml
rules:
  remove-required:
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
      required:
        - name
        - email
      properties:
        name:
          type: string
        email:
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
        email:
          type: string
``` 