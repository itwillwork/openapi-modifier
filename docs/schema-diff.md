[🇺🇸 English](./schema-diff.md) | [🇷🇺 Русский](./schema-diff-ru.md)  | [🇨🇳 中文](./schema-diff-zh.md)

# OpenAPI Specification Examples

#### Simple String
```json
{
  "type": "string",
  "description": "Field description",
  "minLength": 1,
  "maxLength": 100,
  "pattern": "^[A-Za-z0-9]+$",
  "format": "email" // Supported formats: email, date, date-time, uri, uuid, etc.
}
```

#### Simple String Enum:
```json
{
  "type": "string",
  "enum": ["a", "b", "c"],
  "description": "Choose one of the allowed values",
  "default": "a"
}
```

#### Number:
```json
{
  "type": "number",
  "description": "Numeric value",
  "minimum": 0,
  "maximum": 100,
  "exclusiveMinimum": true,
  "exclusiveMaximum": true,
  "multipleOf": 0.5,
  "format": "float" // Supported formats: float, double, int32, int64
}
```

#### Array:
```json
{
  "type": "array",
  "description": "Array of elements",
  "items": {
    "type": "string",
    "description": "Array element"
  },
  "minItems": 1,
  "maxItems": 10,
  "uniqueItems": true
}
```

#### Object:
```json
{
  "type": "object",
  "description": "Complex object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Object name"
    },
    "value": {
      "type": "number",
      "description": "Object value"
    }
  },
  "required": ["name"],
  "additionalProperties": false,
  "minProperties": 1,
  "maxProperties": 5
}
```

#### Reference to Definition:
```json
{
  "$ref": "#/components/schemas/User"
}
```

#### Combined Types:
```json
{
  "oneOf": [
    { "type": "string" },
    { "type": "number" }
  ],
  "description": "Value can be either a string or a number"
}
```

#### Conditional Fields:
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