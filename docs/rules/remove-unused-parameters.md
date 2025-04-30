# Remove Unused Parameters

## Описание
Правило для удаления неиспользуемых параметров из OpenAPI спецификации.

## Конфигурация
```yaml
rules:
  remove-unused-parameters:
    enabled: true
    # Опционально: список путей к параметрам, которые нужно сохранить
    # Если не указано, правило удаляет все неиспользуемые параметры
    keep:
      - components/parameters/User
      - components/parameters/Order
```

## Мотивация
Неиспользуемые параметры могут загромождать спецификацию и затруднять её понимание. Удаление неиспользуемых параметров делает спецификацию более чистой и понятной.

## Примеры использования
1. Удаление всех неиспользуемых параметров:
```yaml
rules:
  remove-unused-parameters:
    enabled: true
```

2. Сохранение определенных параметров:
```yaml
rules:
  remove-unused-parameters:
    enabled: true
    keep:
      - components/parameters/User
      - components/parameters/Order
```

## Пример
До:
```yaml
components:
  parameters:
    User:
      name: user
      in: query
      schema:
        type: string
    Order:
      name: order
      in: query
      schema:
        type: string
    UnusedParameter:
      name: unused
      in: query
      schema:
        type: string
```

После:
```yaml
components:
  parameters:
    User:
      name: user
      in: query
      schema:
        type: string
    Order:
      name: order
      in: query
      schema:
        type: string
``` 