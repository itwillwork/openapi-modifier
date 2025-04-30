# Правило patch-endpoint-schema

## Описание
Правило позволяет модифицировать схему эндпоинта целиком в OpenAPI спецификации. В отличие от других правил патчинга, которые работают с отдельными частями эндпоинта (параметры, тело запроса, ответы), это правило может изменять всю структуру эндпоинта, включая все его компоненты.

## Конфигурация
Правило принимает объект конфигурации со следующей структурой:

```json
{
  "endpointDescriptor": {
    "path": "/api/users",
    "method": "GET"
  },
  "endpointDescriptorCorrection": "security",
  "patchMethod": "merge",
  "schemaDiff": {
    "tags": ["users"],
    "summary": "List users",
    "description": "Returns a paginated list of users",
    "security": [
      {
        "bearerAuth": []
      }
    ]
  }
}
```

где:
- `endpointDescriptor` - объект, описывающий эндпоинт:
  - `path` - путь эндпоинта
  - `method` - HTTP метод
- `endpointDescriptorCorrection` (опционально) - путь к свойству внутри схемы эндпоинта
- `patchMethod` - метод применения изменений ('merge' или 'replace')
- `schemaDiff` - схема изменений, которые нужно применить

## Мотивация создания правила
Правило было создано для случаев, когда необходимо:
1. Обновить метаданные эндпоинта (теги, описание, безопасность)
2. Изменить общую структуру эндпоинта
3. Стандартизировать конфигурацию эндпоинтов
4. Применить глобальные изменения к эндпоинту

## Случаи использования в других проектах
Правило может быть полезно в следующих сценариях:

1. Добавление аутентификации к группе эндпоинтов
2. Обновление документации и описаний эндпоинтов
3. Стандартизация конфигурации безопасности
4. Добавление новых метаданных к эндпоинтам

## Примеры использования

### Пример 1: Добавление аутентификации
```json
{
  "endpointDescriptor": {
    "path": "/api/admin/*",
    "method": "*"
  },
  "patchMethod": "merge",
  "schemaDiff": {
    "security": [
      {
        "bearerAuth": [],
        "adminRole": []
      }
    ]
  }
}
```

### Пример 2: Обновление метаданных
```json
{
  "endpointDescriptor": {
    "path": "/api/products",
    "method": "POST"
  },
  "patchMethod": "merge",
  "schemaDiff": {
    "tags": ["products", "admin"],
    "summary": "Create new product",
    "description": "Creates a new product in the catalog. Requires admin privileges.",
    "deprecated": false,
    "externalDocs": {
      "description": "Product creation guide",
      "url": "https://docs.example.com/products/creation"
    }
  }
}
```

### Пример 3: Изменение конкретного свойства
```json
{
  "endpointDescriptor": {
    "path": "/api/orders/{id}",
    "method": "PUT"
  },
  "endpointDescriptorCorrection": "operationId",
  "patchMethod": "replace",
  "schemaDiff": "updateOrderById"
}
```

### Важные замечания
1. Правило изменяет всю структуру эндпоинта, поэтому его следует использовать осторожно
2. При использовании `endpointDescriptorCorrection` можно изменять конкретные свойства без затрагивания остальной структуры
3. Метод `merge` сохраняет существующие поля, если они не перезаписаны явно
4. Метод `replace` полностью заменяет структуру эндпоинта или указанного свойства
5. При отсутствии указанного эндпоинта правило выводит предупреждение
6. Правило нормализует HTTP методы, поэтому 'GET' и 'get' обрабатываются одинаково
7. Изменения применяются атомарно - либо все изменения успешны, либо спецификация остается без изменений
8. Рекомендуется использовать более специфичные правила (patch-endpoint-parameter-schema, patch-endpoint-response-schema и т.д.) для изменения конкретных частей эндпоинта 