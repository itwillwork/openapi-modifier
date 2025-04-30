# Remove Unused Variables

## Описание
Правило для удаления неиспользуемых переменных из OpenAPI спецификации.

## Конфигурация
```yaml
rules:
  remove-unused-variables:
    enabled: true
    # Опционально: список путей к переменным, которые нужно сохранить
    # Если не указано, правило удаляет все неиспользуемые переменные
    keep:
      - components/variables/User
      - components/variables/Order
```

## Мотивация
Неиспользуемые переменные могут загромождать спецификацию и затруднять её понимание. Удаление неиспользуемых переменных делает спецификацию более чистой и понятной.

## Примеры использования
1. Удаление всех неиспользуемых переменных:
```yaml
rules:
  remove-unused-variables:
    enabled: true
```

2. Сохранение определенных переменных:
```yaml
rules:
  remove-unused-variables:
    enabled: true
    keep:
      - components/variables/User
      - components/variables/Order
```

## Пример
До:
```yaml
components:
  variables:
    User:
      default: user
      description: User variable
    Order:
      default: order
      description: Order variable
    UnusedVariable:
      default: unused
      description: Unused variable
```

После:
```yaml
components:
  variables:
    User:
      default: user
      description: User variable
    Order:
      default: order
      description: Order variable
``` 