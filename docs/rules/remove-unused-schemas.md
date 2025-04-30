# Remove Unused Schemas

## Описание
Правило для удаления неиспользуемых схем из OpenAPI спецификации.

## Конфигурация
```yaml
rules:
  remove-unused-schemas:
    enabled: true
    # Опционально: список путей к схемам, которые нужно сохранить
    # Если не указано, правило удаляет все неиспользуемые схемы
    keep:
      - components/schemas/User
      - components/schemas/Order
```

## Мотивация
Неиспользуемые схемы могут загромождать спецификацию и затруднять её понимание. Удаление неиспользуемых схем делает спецификацию более чистой и понятной.

## Примеры использования
1. Удаление всех неиспользуемых схем:
```yaml
rules:
  remove-unused-schemas:
    enabled: true
```

2. Сохранение определенных схем:
```yaml
rules:
  remove-unused-schemas:
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