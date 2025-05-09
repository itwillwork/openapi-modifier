{{{langSwitcher}}}

# Differences Between merge and deepmerge Methods

In openapi-modifier, there are two methods for modifying OpenAPI schemas: `merge` and `deepmerge`. They have fundamental differences in how they combine data.

## merge Method

The `merge` method performs a shallow merge of objects. In this case:

1. Simple overwriting of top-level properties occurs
2. Nested objects are completely replaced, not merged
3. Arrays are completely replaced with new values

Example:
```javascript
// Original object
{
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'number' }
  }
}

// Applying merge with:
{
  properties: {
    name: { type: 'string', format: 'email' }
  }
}

// Result:
{
  type: 'object',
  properties: {
    name: { type: 'string', format: 'email' }
  }
}
```

## deepmerge Method

The `deepmerge` method performs a deep merge of objects. In this case:

1. All nested objects are recursively merged
2. Arrays are merged (concatenated)
3. All properties from both objects are preserved

Example:
```javascript
// Original object
{
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'number' }
  }
}

// Applying deepmerge with:
{
  properties: {
    name: { type: 'string', format: 'email' }
  }
}

// Result:
{
  type: 'object',
  properties: {
    name: { type: 'string', format: 'email' },
    age: { type: 'number' }
  }
}
```

## When to Use Which Method

- Use `merge` when you need to completely replace certain parts of the schema
- Use `deepmerge` when you need to add or modify individual properties while preserving the existing structure

## Usage Examples in Configuration

```javascript
// Using merge
{
  patchMethod: 'merge',
  schemaDiff: {
    type: 'string',
    format: 'email'
  }
}

// Using deepmerge
{
  patchMethod: 'deepmerge',
  schemaDiff: {
    properties: {
      email: {
        type: 'string',
        format: 'email'
      }
    }
  }
}
``` 