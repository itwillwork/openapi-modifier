# Правило patch-endpoint-parameter-schema

## Описание
Правило позволяет модифицировать схему параметров эндпоинтов в OpenAPI спецификации. Оно может изменять существующие параметры, их схемы и метаданные как для конкретных эндпоинтов, так и для общих параметров в компонентах.

## Конфигурация
Правило принимает объект конфигурации со следующей структурой:

```json
{
  "endpointDescriptor": {
    "path": "/api/users",
    "method": "GET"
  },
  "parameterDescriptor": {
    "name": "limit",
    "in": "query",
    "correction": "properties.value"
  },
  "patchMethod": "merge",
  "schemaDiff": {
    "type": "integer",
    "minimum": 1,
    "maximum": 100
  },
  "objectDiff": {
    "required": true,
    "name": "pageSize"
  }
}
```

где:
- `endpointDescriptor` (опционально) - объект, описывающий эндпоинт:
  - `path` - путь эндпоинта
  - `method` - HTTP метод
- `parameterDescriptor` - объект, описывающий параметр:
  - `name` - имя параметра
  - `in` - местоположение параметра (query, path, header, cookie)
  - `correction` (опционально) - путь к свойству внутри схемы параметра
- `patchMethod` - метод применения изменений ('merge' или 'replace')
- `schemaDiff` (опционально) - изменения схемы параметра
- `objectDiff` (опционально) - изменения метаданных параметра:
  - `name` - новое имя параметра
  - `in` - новое местоположение параметра
  - `required` - обязательность параметра

## Мотивация создания правила
Правило было создано для случаев, когда необходимо:
1. Изменить ограничения параметров API
2. Обновить метаданные параметров
3. Стандартизировать параметры across multiple endpoints
4. Применить изменения к общим параметрам компонентов

## Случаи использования в других проектах
Правило может быть полезно в следующих сценариях:

1. Стандартизация параметров пагинации
2. Добавление валидации к параметрам запросов
3. Переименование параметров при рефакторинге API
4. Обновление обязательности параметров

## Примеры использования

### Пример 1: Обновление параметров пагинации
```json
{
  "parameterDescriptor": {
    "name": "page",
    "in": "query"
  },
  "patchMethod": "merge",
  "schemaDiff": {
    "type": "integer",
    "minimum": 1,
    "default": 1
  },
  "objectDiff": {
    "required": true
  }
}
```

### Пример 2: Изменение параметра для конкретного эндпоинта
```json
{
  "endpointDescriptor": {
    "path": "/api/products",
    "method": "GET"
  },
  "parameterDescriptor": {
    "name": "category",
    "in": "query"
  },
  "patchMethod": "replace",
  "schemaDiff": {
    "type": "string",
    "enum": ["electronics", "books", "clothing"]
  }
}
```

### Пример 3: Обновление вложенной схемы параметра
```json
{
  "endpointDescriptor": {
    "path": "/api/orders/search",
    "method": "POST"
  },
  "parameterDescriptor": {
    "name": "filter",
    "in": "query",
    "correction": "properties.dateRange"
  },
  "patchMethod": "merge",
  "schemaDiff": {
    "type": "object",
    "properties": {
      "from": {
        "type": "string",
        "format": "date-time"
      },
      "to": {
        "type": "string",
        "format": "date-time"
      }
    },
    "required": ["from", "to"]
  }
}
```

### Важные замечания
1. Если `endpointDescriptor` не указан, правило применяется к общим параметрам в компонентах
2. При указании `endpointDescriptor` правило ищет параметр только в указанном эндпоинте
3. Параметр `correction` позволяет изменять вложенные свойства схемы параметра
4. Изменения через `objectDiff` применяются после изменений схемы
5. Правило пропускает параметры, определенные через ссылки ($ref)
6. При отсутствии указанного параметра или эндпоинта правило выводит предупреждение
7. Изменения применяются атомарно - либо все изменения успешны, либо спецификация остается без изменений 