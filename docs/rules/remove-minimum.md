# Remove Minimum

## Описание
Правило для удаления ограничения `minimum` из схем компонентов OpenAPI.

## Конфигурация
```yaml
rules:
  remove-minimum:
    enabled: true
    # Опционально: список путей к компонентам, из которых нужно удалить minimum
    # Если не указано, правило применяется ко всем компонентам
    paths:
      - components/schemas/User
      - components/schemas/Order
```

## Мотивация
Ограничение `minimum` может быть слишком строгим для некоторых сценариев использования API. Удаление этого ограничения позволяет сделать API более гибким и удобным для клиентов.

## Примеры использования
1. Удаление ограничения `minimum` из всех компонентов:
```yaml
rules:
  remove-minimum:
    enabled: true
```

2. Удаление ограничения `minimum` из конкретных компонентов:
```yaml
rules:
  remove-minimum:
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
        age:
          type: integer
          minimum: 18
```

После:
```yaml
components:
  schemas:
    User:
      type: object
      properties:
        age:
          type: integer
``` 