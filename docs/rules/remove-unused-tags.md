# Remove Unused Tags

## Описание
Правило для удаления неиспользуемых тегов из OpenAPI спецификации.

## Конфигурация
```yaml
rules:
  remove-unused-tags:
    enabled: true
    # Опционально: список тегов, которые нужно сохранить
    # Если не указано, правило удаляет все неиспользуемые теги
    keep:
      - users
      - orders
```

## Мотивация
Неиспользуемые теги могут загромождать спецификацию и затруднять её понимание. Удаление неиспользуемых тегов делает спецификацию более чистой и понятной.

## Примеры использования
1. Удаление всех неиспользуемых тегов:
```yaml
rules:
  remove-unused-tags:
    enabled: true
```

2. Сохранение определенных тегов:
```yaml
rules:
  remove-unused-tags:
    enabled: true
    keep:
      - users
      - orders
```

## Пример
До:
```yaml
tags:
  - name: users
    description: User operations
  - name: orders
    description: Order operations
  - name: unused
    description: Unused operations
```

После:
```yaml
tags:
  - name: users
    description: User operations
  - name: orders
    description: Order operations
``` 