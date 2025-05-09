{{{langSwitcher}}}

# merge 和 deepmerge 方法的区别

在 openapi-modifier 中，有两种修改 OpenAPI 模式的方法：`merge` 和 `deepmerge`。它们在数据组合方式上有根本性的区别。

## merge 方法

`merge` 方法执行对象的浅层合并。在这种情况下：

1. 顶层属性被简单覆盖
2. 嵌套对象被完全替换，而不是合并
3. 数组被新值完全替换

示例：
```javascript
// 原始对象
{
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'number' }
  }
}

// 使用 merge 应用：
{
  properties: {
    name: { type: 'string', format: 'email' }
  }
}

// 结果：
{
  type: 'object',
  properties: {
    name: { type: 'string', format: 'email' }
  }
}
```

## deepmerge 方法

`deepmerge` 方法执行对象的深度合并。在这种情况下：

1. 所有嵌套对象都被递归合并
2. 数组被合并（连接）
3. 保留两个对象的所有属性

示例：
```javascript
// 原始对象
{
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'number' }
  }
}

// 使用 deepmerge 应用：
{
  properties: {
    name: { type: 'string', format: 'email' }
  }
}

// 结果：
{
  type: 'object',
  properties: {
    name: { type: 'string', format: 'email' },
    age: { type: 'number' }
  }
}
```

## 何时使用哪种方法

- 当需要完全替换模式的某些部分时，使用 `merge`
- 当需要添加或修改单个属性同时保留现有结构时，使用 `deepmerge`

## 配置中的使用示例

```javascript
// 使用 merge
{
  patchMethod: 'merge',
  schemaDiff: {
    type: 'string',
    format: 'email'
  }
}

// 使用 deepmerge
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