# Remove Unused Security Schemes

## Описание
Правило для удаления неиспользуемых схем безопасности из OpenAPI спецификации.

## Конфигурация
```yaml
rules:
  remove-unused-security-schemes:
    enabled: true
    # Опционально: список путей к схемам безопасности, которые нужно сохранить
    # Если не указано, правило удаляет все неиспользуемые схемы безопасности
    keep:
      - components/securitySchemes/BasicAuth
      - components/securitySchemes/BearerAuth
```

## Мотивация
Неиспользуемые схемы безопасности могут загромождать спецификацию и затруднять её понимание. Удаление неиспользуемых схем безопасности делает спецификацию более чистой и понятной.

## Примеры использования
1. Удаление всех неиспользуемых схем безопасности:
```yaml
rules:
  remove-unused-security-schemes:
    enabled: true
```

2. Сохранение определенных схем безопасности:
```yaml
rules:
  remove-unused-security-schemes:
    enabled: true
    keep:
      - components/securitySchemes/BasicAuth
      - components/securitySchemes/BearerAuth
```

## Пример
До:
```yaml
components:
  securitySchemes:
    BasicAuth:
      type: http
      scheme: basic
    BearerAuth:
      type: http
      scheme: bearer
    UnusedAuth:
      type: http
      scheme: digest
```

После:
```yaml
components:
  securitySchemes:
    BasicAuth:
      type: http
      scheme: basic
    BearerAuth:
      type: http
      scheme: bearer
``` 