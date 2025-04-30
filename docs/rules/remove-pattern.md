# Remove Pattern

## Описание
Правило для удаления ограничения `pattern` из схем компонентов OpenAPI.

## Конфигурация
```yaml
rules:
  remove-pattern:
    enabled: true
    # Опционально: список путей к компонентам, из которых нужно удалить pattern
    # Если не указано, правило применяется ко всем компонентам
    paths:
      - components/schemas/User
      - components/schemas/Order
```

## Мотивация
Ограничение `pattern` может быть слишком строгим для некоторых сценариев использования API. Удаление этого ограничения позволяет сделать API более гибким и удобным для клиентов.

## Примеры использования
1. Удаление ограничения `pattern` из всех компонентов:
```yaml
rules:
  remove-pattern:
    enabled: true
```

2. Удаление ограничения `pattern` из конкретных компонентов:
```yaml
rules:
  remove-pattern:
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
        email:
          type: string
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
```

После:
```yaml
components:
  schemas:
    User:
      type: object
      properties:
        email:
          type: string
``` 