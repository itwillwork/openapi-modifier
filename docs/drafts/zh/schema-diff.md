{{{langSwitcher}}}

# OpenAPI 规范示例

#### 简单字符串
```json
{
  "type": "string",
  "description": "字段描述",
  "minLength": 1,
  "maxLength": 100,
  "pattern": "^[A-Za-z0-9]+$",
  "format": "email" // 支持的格式：email、date、date-time、uri、uuid 等
}
```

#### 简单字符串枚举：
```json
{
  "type": "string",
  "enum": ["a", "b", "c"],
  "description": "选择一个允许的值",
  "default": "a"
}
```

#### 数字：
```json
{
  "type": "number",
  "description": "数值",
  "minimum": 0,
  "maximum": 100,
  "exclusiveMinimum": true,
  "exclusiveMaximum": true,
  "multipleOf": 0.5,
  "format": "float" // 支持的格式：float、double、int32、int64
}
```

#### 数组：
```json
{
  "type": "array",
  "description": "元素数组",
  "items": {
    "type": "string",
    "description": "数组元素"
  },
  "minItems": 1,
  "maxItems": 10,
  "uniqueItems": true
}
```

#### 对象：
```json
{
  "type": "object",
  "description": "复杂对象",
  "properties": {
    "name": {
      "type": "string",
      "description": "对象名称"
    },
    "value": {
      "type": "number",
      "description": "对象值"
    }
  },
  "required": ["name"],
  "additionalProperties": false,
  "minProperties": 1,
  "maxProperties": 5
}
```

#### 定义引用：
```json
{
  "$ref": "#/components/schemas/User"
}
```

#### 组合类型：
```json
{
  "oneOf": [
    { "type": "string" },
    { "type": "number" }
  ],
  "description": "值可以是字符串或数字"
}
```

#### 条件字段：
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