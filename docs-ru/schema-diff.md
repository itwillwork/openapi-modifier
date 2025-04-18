### Примеры спецификаций

Простая строка
```json
{
  type: 'string',
}
```

Простая строка enum

```json
{
  type: 'string',
  "enum": ["a", "b"]
}
```

Число

```json
{
  type: 'number',
}
```

Массив

```json
{
  type: 'array',
  "item": {
    
  },
}
```

Объект
```json
{
  type: 'object',
  "properties": {
    
  },
}
```

Сложный пример
```ts
{
    foo: Array<{
        bar: {
            test: 'a' | 'b'
        }
    }>
}
```
в diff это будет выглядеть
```

```