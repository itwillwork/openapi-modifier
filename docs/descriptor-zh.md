[🇺🇸 English](./descriptor.md) | [🇷🇺 Русский](./descriptor-ru.md)  | [🇨🇳 中文](./descriptor-zh.md)

# 简单和对象组件描述符与修正的区别

## 主要区别

### 1. 格式

**简单描述符**使用字符串格式，其中组件和修正路径用点分隔：
```
"ComponentName.path.to.property"
```

**对象描述符**使用结构化 JSON 对象：
```json
{
    "componentName": "ComponentName",
    "correction": "path.to.property"
}
```

### 2. 使用示例

#### 简单描述符：
```typescript
// 有效值示例：
"TestDto"                    // 仅组件名称
"TestDto.foo.bar"           // 带属性路径的组件
"TestDto.foo.bar[].test"    // 带数组元素路径的组件
"TestDto.allOf[2].foo"      // 带 allOf 元素路径的组件
"TestDto.oneOf[2].foo"      // 带 oneOf 元素路径的组件
"TestDto.anyOf[2].foo"      // 带 anyOf 元素路径的组件
```

#### 对象描述符：
```typescript
// 有效值示例：
{
    "componentName": "TestDto"
}
{
    "componentName": "TestDto",
    "correction": "properties.foo.properties.bar"
}
{
    "componentName": "TestDto",
    "correction": "items.properties.foo"
}
```

### 3. 路径转换

使用简单描述符时，会发生自动路径转换：
- `foo.bar` → `properties.foo.properties.bar`
- `foo[]` → `items.properties.foo`
- `foo[].bar` → `items.properties.foo.properties.bar`

在对象描述符中，路径以其最终形式指定，无需转换。

### 4. 实际应用

#### 示例 1：修改简单属性
```typescript
// 简单描述符
"User.address"

// 对象描述符
{
    "componentName": "User",
    "correction": "properties.address"
}
```

#### 示例 2：修改数组元素
```typescript
// 简单描述符
"Order.items[].quantity"

// 对象描述符
{
    "componentName": "Order",
    "correction": "items.properties.items.items.properties.quantity"
}
```

#### 示例 3：修改 allOf/oneOf/anyOf 元素
```typescript
// 简单描述符
"Product.allOf[2].price"

// 对象描述符
{
    "componentName": "Product",
    "correction": "allOf[2].properties.price"
}
```

## 使用建议

1. **使用简单描述符**当：
    - 需要更紧凑和可读的格式
    - 属性路径不太复杂
    - 想要使用自动路径转换

2. **使用对象描述符**当：
    - 需要对路径进行更严格的控制
    - 需要明确的结构规范
    - 处理复杂的嵌套结构
    - 需要避免自动路径转换

## 错误处理

两种描述符类型都有内置验证：
- 简单描述符检查字符串格式的正确性
- 对象描述符检查必需字段及其类型

当格式不正确时，系统将输出清晰的错误消息，并提供正确使用的示例。 