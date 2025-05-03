# Различия между методами merge и deepmerge

В openapi-modifier существуют два метода для модификации схем OpenAPI: `merge` и `deepmerge`. Они имеют принципиальные различия в способе объединения данных.

## Метод merge

Метод `merge` выполняет поверхностное (shallow) объединение объектов. При этом:

1. Происходит простое перезаписывание свойств верхнего уровня
2. Вложенные объекты полностью заменяются, а не объединяются
3. Массивы полностью заменяются новыми значениями

Пример:
```javascript
// Исходный объект
{
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'number' }
  }
}

// Применяем merge с:
{
  properties: {
    name: { type: 'string', format: 'email' }
  }
}

// Результат:
{
  type: 'object',
  properties: {
    name: { type: 'string', format: 'email' }
  }
}
```

## Метод deepmerge

Метод `deepmerge` выполняет глубокое (deep) объединение объектов. При этом:

1. Рекурсивно объединяются все вложенные объекты
2. Массивы объединяются (конкатенируются)
3. Сохраняются все свойства из обоих объектов

Пример:
```javascript
// Исходный объект
{
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'number' }
  }
}

// Применяем deepmerge с:
{
  properties: {
    name: { type: 'string', format: 'email' }
  }
}

// Результат:
{
  type: 'object',
  properties: {
    name: { type: 'string', format: 'email' },
    age: { type: 'number' }
  }
}
```

## Когда использовать какой метод

- Используйте `merge`, когда нужно полностью заменить определенные части схемы
- Используйте `deepmerge`, когда нужно добавить или модифицировать отдельные свойства, сохраняя существующую структуру

## Примеры использования в конфигурации

```javascript
// Использование merge
{
  patchMethod: 'merge',
  schemaDiff: {
    type: 'string',
    format: 'email'
  }
}

// Использование deepmerge
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