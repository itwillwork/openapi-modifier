[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# change-endpoints-basepath

Изменяет базовые пути (basepath) эндпоинтов в соответствии со словарем замен

## Конфигурация

| Параметр                    | Описание                                                              | Пример               | Типизация                | Дефолтное |
|-----------------------------|-----------------------------------------------------------------------|----------------------|--------------------------|-----------|
| `map`                       | [**обязательный**] Словарь замены путей                                     | `{"/api/v1": "/v1"}` | `Record<string, string>` | `{}`      |
| `ignoreOperarionCollisions` | Игнорировать возникающие коллизии endpoint'ов после применения замены | `true`               | `boolean`                | `false`        |


Пример конфигурации:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "change-endpoints-basepath",
            config: {
               map: { 
                   '/public/api': '',
               },
            },
        }
        // ... other rules
    ]
}
```

Пример более детальной конфигурации:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "change-endpoints-basepath",
            config: {
               map: { 
                   '/public/v1/service/api': '/api',
               }, 
               ignoreOperarionCollisions: false,
            },
        }
        // ... other rules
    ]
}
```
               



**Если необходимо изменить несколько спецификаций**, вы можете использовать несколько раз данное правило в общем пайлайне конфигурации.

## Мотивация

<a name="custom_anchor_motivation_1"></a>
### 1. Необходимо у некоторых (или у всех) endpoint'ов сокртатить путь pathname

Практический пример:

**В файле `openapi.yaml`** документация на endpoint выглядит так:

```yaml
paths:
  /public/api/v1/pets:
    get:
      summary: List all pets
```
**Нужно удалить `/public/api`, чтобы сократить `/public/api/v1/pets` до `/v1/pets`.**

**В файле конфигурации** `openapi-modifier-config.js` добавляем правило `change-endpoints-basepath`:

```js
module.exports = {
    pipeline: [
        {
            rule: "change-endpoints-basepath",
            config: {
                map: { '/public/api': '' },
            },
        }
    ]
}
```

**После применения правила**, файл `openapi.yaml` выглядит так:

```yaml
paths:
  /v1/pets:
    get:
      summary: List all pets
```

## Полезные ссылки

{{{links}}}
- [Примеры применения правила в тестах](./index.test.ts)  