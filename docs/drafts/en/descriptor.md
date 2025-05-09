{{{langSwitcher}}}

# Differences Between Simple and Object Component Descriptors with Correction

## Main Differences

### 1. Format

**Simple Descriptor** uses a string format where the component and correction path are separated by a dot:
```
"ComponentName.path.to.property"
```

**Object Descriptor** uses a structured JSON object:
```json
{
    "componentName": "ComponentName",
    "correction": "path.to.property"
}
```

### 2. Usage Examples

#### Simple Descriptor:
```typescript
// Examples of valid values:
"TestDto"                    // Just component name
"TestDto.foo.bar"           // Component with property path
"TestDto.foo.bar[].test"    // Component with array element path
"TestDto.allOf[2].foo"      // Component with allOf element path
"TestDto.oneOf[2].foo"      // Component with oneOf element path
"TestDto.anyOf[2].foo"      // Component with anyOf element path
```

#### Object Descriptor:
```typescript
// Examples of valid values:
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

### 3. Path Transformation

When using a simple descriptor, automatic path transformation occurs:
- `foo.bar` → `properties.foo.properties.bar`
- `foo[]` → `items.properties.foo`
- `foo[].bar` → `items.properties.foo.properties.bar`

In the object descriptor, paths are specified in their final form without transformation.

### 4. Practical Application

#### Example 1: Modifying a Simple Property
```typescript
// Simple descriptor
"User.address"

// Object descriptor
{
    "componentName": "User",
    "correction": "properties.address"
}
```

#### Example 2: Modifying an Array Element
```typescript
// Simple descriptor
"Order.items[].quantity"

// Object descriptor
{
    "componentName": "Order",
    "correction": "items.properties.items.items.properties.quantity"
}
```

#### Example 3: Modifying an allOf/oneOf/anyOf Element
```typescript
// Simple descriptor
"Product.allOf[2].price"

// Object descriptor
{
    "componentName": "Product",
    "correction": "allOf[2].properties.price"
}
```

## Usage Recommendations

1. **Use Simple Descriptor** when:
    - You need a more compact and readable format
    - Property paths are not too complex
    - You want to use automatic path transformation

2. **Use Object Descriptor** when:
    - You need stricter control over paths
    - Explicit structure specification is required
    - Working with complex nested structures
    - You need to avoid automatic path transformation

## Error Handling

Both descriptor types have built-in validation:
- Simple descriptor checks the correctness of the string format
- Object descriptor checks for required fields and their types

When the format is incorrect, the system will output a clear error message with an example of correct usage. 