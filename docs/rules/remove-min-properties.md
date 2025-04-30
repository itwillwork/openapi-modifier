# Remove Min Properties

## Описание
Правило для удаления ограничения `minProperties` из схем компонентов OpenAPI.

## Конфигурация
```yaml
rules:
  remove-min-properties:
    enabled: true
    # Опционально: список путей к компонентам, из которых нужно удалить minProperties
    # Если не указано, правило применяется ко всем компонентам
    paths:
      - components/schemas/User
      - components/schemas/Order
```

## Мотивация
Ограничение `minProperties` может быть слишком строгим для некоторых сценариев использования API. Удаление этого ограничения позволяет сделать API более гибким и удобным для клиентов.

## Примеры использования
1. Удаление ограничения `minProperties` из всех компонентов:
```yaml
rules:
  remove-min-properties:
    enabled: true
```

2. Удаление ограничения `minProperties` из конкретных компонентов:
```yaml
rules:
  remove-min-properties:
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
      minProperties: 2
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