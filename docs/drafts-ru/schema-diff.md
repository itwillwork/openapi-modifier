### Примеры спецификаций для OpenAPI

#### Простая строка
```json
{
  "type": "string",
  "description": "Описание поля",
  "minLength": 1,
  "maxLength": 100,
  "pattern": "^[A-Za-z0-9]+$",
  "format": "email" // Поддерживаемые форматы: email, date, date-time, uri, uuid и др.
}
```

#### Простая строка enum:
```json
{
  "type": "string",
  "enum": ["a", "b", "c"],
  "description": "Выберите одно из допустимых значений",
  "default": "a"
}
```

#### Число:
```json
{
  "type": "number",
  "description": "Числовое значение",
  "minimum": 0,
  "maximum": 100,
  "exclusiveMinimum": true,
  "exclusiveMaximum": true,
  "multipleOf": 0.5,
  "format": "float" // Поддерживаемые форматы: float, double, int32, int64
}
```

#### Массив:
```json
{
  "type": "array",
  "description": "Массив элементов",
  "items": {
    "type": "string",
    "description": "Элемент массива"
  },
  "minItems": 1,
  "maxItems": 10,
  "uniqueItems": true
}
```

#### Объект:
```json
{
  "type": "object",
  "description": "Сложный объект",
  "properties": {
    "name": {
      "type": "string",
      "description": "Имя объекта"
    },
    "value": {
      "type": "number",
      "description": "Значение объекта"
    }
  },
  "required": ["name"],
  "additionalProperties": false,
  "minProperties": 1,
  "maxProperties": 5
}
```

#### Ссылка на определение:
```json
{
  "$ref": "#/components/schemas/User"
}
```

#### Комбинированные типы:
```json
{
  "oneOf": [
    { "type": "string" },
    { "type": "number" }
  ],
  "description": "Значение может быть строкой или числом"
}
```

#### Условные поля:
```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "enum": ["user", "admin"]
    },
    "permissions": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "if": {
    "properties": {
      "type": { "const": "admin" }
    }
  },
  "then": {
    "required": ["permissions"]
  }
}
```
