[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# change-endpoints-basepath

Изменяет базовые пути (basepath) эндпоинтов в соответствии со словарем замен



## Конфигурация

| Параметр                    | Описание                                                              | Пример               | Типизация                | Дефолтное |
|-----------------------------|-----------------------------------------------------------------------|----------------------|--------------------------|-----------|
| `map`                       | [**обязательный**] Словарь замены путей                                     | `{"/api/v1": "/v1"}` | `Record<string, string>` | `{}`      |
| `ignoreOperationCollisions` | Игнорировать возникающие коллизии endpoint'ов после применения замены | `true`               | `boolean`                | `false`        |


Пример конфигурации:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "change-endpoints-basepath",
            config: {
               map: { 
                   '/public/api': '', // удаляем префикс /public/api из всех путей
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
                   '/public/v1/service/api': '/api', // заменяем префикс /public/v1/service/api на /api
               }, 
               ignoreOperationCollisions: false, // не игнорируем конфликты операций при замене путей
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

## Важные замечания

### Про обработка конфликтов операций и параметр ignoreOperationCollisions

Правило проверяет наличие конфликтов операций при изменении путей. Если после замены пути возникает конфликт (например, два разных эндпоинта становятся одинаковыми), правило выдаст ошибку.

Пример конфликта:

```yaml
paths:
  /api/v1/pets:
    get:
      summary: List all pets
  /v1/pets:
    get:
      summary: Get pet by id
```

При попытке заменить `/api/v1` на `/v1` возникнет конфликт, так как оба эндпоинта станут `/v1/pets`.

В этом случае можно:
1. Использовать `ignoreOperationCollisions: true` для игнорирования конфликтов
2. Изменить конфигурацию замены путей, чтобы избежать конфликтов
3. Предварительно изменить конфликтующие эндпоинты

## Полезные ссылки

- [Примеры применения правила в тестах](https://github.com/itwillwork/openapi-modifier/blob/main/src/rules/change-endpoints-basepath/index.test.ts)

- [DeepWiki документация](https://deepwiki.com/itwillwork/openapi-modifier)
- [Context7 документация для LLM моделей и AI редакторов кода](https://context7.com/itwillwork/openapi-modifier)