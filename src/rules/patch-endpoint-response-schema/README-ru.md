# Правило patch-endpoint-response-schema

## Описание
Правило позволяет модифицировать схему ответа (response schema) для эндпоинтов в OpenAPI спецификации. Оно может изменять существующие схемы ответов, их свойства и структуру для определенных эндпоинтов, кодов ответа и типов содержимого.

## Конфигурация
Правило принимает объект конфигурации со следующей структурой:

```json
{
  "endpointDescriptor": {
    "path": "/api/users",
    "method": "GET"
  },
  "code": "200",
  "contentType": "application/json",
  "correction": "properties.data",
  "patchMethod": "merge",
  "schemaDiff": {
    "type": "object",
    "properties": {
      "metadata": {
        "type": "object",
        "properties": {
          "totalCount": {
            "type": "integer",
            "minimum": 0
          }
        }
      }
    }
  }
}
```

где:
- `endpointDescriptor` - объект, описывающий эндпоинт:
  - `path` - путь эндпоинта
  - `method` - HTTP метод
- `code` (опционально) - код HTTP ответа (по умолчанию - первый найденный код 2xx)
- `contentType` (опционально) - тип содержимого, для которого применяются изменения
- `correction` (опционально) - путь к свойству внутри схемы ответа
- `patchMethod` - метод применения изменений ('merge' или 'replace')
- `schemaDiff` - схема изменений, которые нужно применить

## Мотивация создания правила
Правило было создано для случаев, когда необходимо:
1. Обновить структуру данных ответа для определенных эндпоинтов
2. Добавить метаданные или дополнительные поля в ответы
3. Стандартизировать форматы ответов across API
4. Изменить схему ответа для конкретных кодов состояния

## Случаи использования в других проектах
Правило может быть полезно в следующих сценариях:

1. Добавление пагинации в ответы списков
2. Стандартизация форматов ошибок
3. Расширение схем ответов новыми полями
4. Обновление форматов данных при версионировании API

## Примеры использования

### Пример 1: Добавление пагинации
```json
{
  "endpointDescriptor": {
    "path": "/api/products",
    "method": "GET"
  },
  "code": "200",
  "patchMethod": "merge",
  "schemaDiff": {
    "type": "object",
    "required": ["data", "pagination"],
    "properties": {
      "pagination": {
        "type": "object",
        "required": ["total", "page", "perPage"],
        "properties": {
          "total": { "type": "integer", "minimum": 0 },
          "page": { "type": "integer", "minimum": 1 },
          "perPage": { "type": "integer", "minimum": 1 }
        }
      }
    }
  }
}
```

### Пример 2: Стандартизация ошибок
```json
{
  "endpointDescriptor": {
    "path": "/api/orders/*",
    "method": "*"
  },
  "code": "400",
  "patchMethod": "replace",
  "schemaDiff": {
    "type": "object",
    "required": ["error"],
    "properties": {
      "error": {
        "type": "object",
        "required": ["code", "message"],
        "properties": {
          "code": { "type": "string" },
          "message": { "type": "string" },
          "details": { "type": "object" }
        }
      }
    }
  }
}
```

### Пример 3: Обновление вложенной схемы
```json
{
  "endpointDescriptor": {
    "path": "/api/users/{id}",
    "method": "GET"
  },
  "correction": "properties.user.properties.settings",
  "patchMethod": "merge",
  "schemaDiff": {
    "type": "object",
    "properties": {
      "notifications": {
        "type": "object",
        "properties": {
          "email": { "type": "boolean" },
          "push": { "type": "boolean" }
        }
      }
    }
  }
}
```

### Важные замечания
1. Если `code` не указан, правило пытается найти первый код ответа 2xx
2. Если `contentType` не указан, изменения применяются ко всем типам содержимого
3. При указании несуществующего кода или типа содержимого правило выводит предупреждение
4. Параметр `correction` позволяет точечно изменять вложенные свойства схемы
5. Правило не работает со схемами, определенными через ссылки ($ref)
6. При отсутствии указанного эндпоинта правило выводит предупреждение
7. Изменения применяются атомарно - либо все изменения успешны, либо спецификация остается без изменений
8. При использовании метода `merge` существующие поля сохраняются, если они не перезаписаны явно 