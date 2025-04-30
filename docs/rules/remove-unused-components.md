# Remove Unused Components

## Описание
Правило для удаления неиспользуемых компонентов из OpenAPI спецификации.

## Конфигурация
```yaml
rules:
  remove-unused-components:
    enabled: true
    # Опционально: список путей к компонентам, которые нужно сохранить
    # Если не указано, правило удаляет все неиспользуемые компоненты
    keep:
      - components/schemas/User
      - components/schemas/Order
```

## Мотивация
Неиспользуемые компоненты могут загромождать спецификацию и затруднять её понимание. Удаление неиспользуемых компонентов делает спецификацию более чистой и понятной.

## Примеры использования
1. Удаление всех неиспользуемых компонентов:
```yaml
rules:
  remove-unused-components:
    enabled: true
```

2. Сохранение определенных компонентов:
```yaml
rules:
  remove-unused-components:
    enabled: true
    keep:
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
    Order:
      type: object
      properties:
        id:
          type: string
    UnusedSchema:
      type: object
      properties:
        field:
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