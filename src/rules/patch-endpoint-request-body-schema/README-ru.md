# Правило patch-endpoint-request-body-schema

## Описание
Правило позволяет модифицировать схему тела запроса (request body) для эндпоинтов в OpenAPI спецификации. Оно может изменять существующие схемы тела запроса, их свойства и структуру для определенных эндпоинтов и типов содержимого.

## Конфигурация
Правило принимает объект конфигурации со следующей структурой:

```json
{
  "endpointDescriptor": {
    "path": "/api/users",
    "method": "POST"
  },
  "contentType": "application/json",
  "correction": "properties.data",
  "patchMethod": "merge",
  "schemaDiff": {
    "type": "object",
    "required": ["email"],
    "properties": {
      "email": {
        "type": "string",
        "format": "email"
      }
    }
  }
}
```

где:
- `endpointDescriptor` - объект, описывающий эндпоинт:
  - `path` - путь эндпоинта
  - `method` - HTTP метод
- `contentType` (опционально) - тип содержимого, для которого применяются изменения
- `correction` (опционально) - путь к свойству внутри схемы тела запроса
- `patchMethod` - метод применения изменений ('merge' или 'replace')
- `schemaDiff` - схема изменений, которые нужно применить

## Мотивация создания правила
Правило было создано для случаев, когда необходимо:
1. Обновить структуру данных запроса для определенных эндпоинтов
2. Добавить новые поля или валидацию в существующие схемы запросов
3. Изменить требования к данным для конкретных типов содержимого
4. Стандартизировать форматы запросов across API

## Случаи использования в других проектах
Правило может быть полезно в следующих сценариях:

1. Добавление новых полей в существующие API эндпоинты
2. Усиление валидации входящих данных
3. Обновление форматов данных при версионировании API
4. Стандартизация структуры запросов

## Примеры использования

### Пример 1: Добавление нового обязательного поля
```json
{
  "endpointDescriptor": {
    "path": "/api/orders",
    "method": "POST"
  },
  "patchMethod": "merge",
  "schemaDiff": {
    "required": ["shippingAddress"],
    "properties": {
      "shippingAddress": {
        "type": "object",
        "required": ["country", "city", "street"],
        "properties": {
          "country": { "type": "string" },
          "city": { "type": "string" },
          "street": { "type": "string" }
        }
      }
    }
  }
}
```

### Пример 2: Обновление вложенной схемы
```json
{
  "endpointDescriptor": {
    "path": "/api/products",
    "method": "PUT"
  },
  "contentType": "application/json",
  "correction": "properties.metadata",
  "patchMethod": "merge",
  "schemaDiff": {
    "type": "object",
    "properties": {
      "tags": {
        "type": "array",
        "items": {
          "type": "string"
        },
        "minItems": 1
      }
    }
  }
}
```

### Пример 3: Полная замена схемы
```json
{
  "endpointDescriptor": {
    "path": "/api/users/profile",
    "method": "PATCH"
  },
  "patchMethod": "replace",
  "schemaDiff": {
    "type": "object",
    "required": ["updates"],
    "properties": {
      "updates": {
        "type": "object",
        "minProperties": 1,
        "additionalProperties": false,
        "properties": {
          "name": { "type": "string" },
          "email": { "type": "string", "format": "email" },
          "phone": { "type": "string", "pattern": "^\\+[0-9]{11}$" }
        }
      }
    }
  }
}
```

### Важные замечания
1. Если `contentType` не указан, изменения применяются ко всем типам содержимого эндпоинта
2. При указании несуществующего `contentType` правило выводит предупреждение
3. Параметр `correction` позволяет точечно изменять вложенные свойства схемы
4. Правило не работает со схемами, определенными через ссылки ($ref)
5. При отсутствии указанного эндпоинта правило выводит предупреждение
6. Изменения применяются атомарно - либо все изменения успешны, либо спецификация остается без изменений
7. При использовании метода `merge` существующие поля сохраняются, если они не перезаписаны явно 