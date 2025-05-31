# example-typed-native-fetch

Пример использования типизированного OpenAPI-клиента с помощью нативного fetch (без react-query).

- Типы генерируются из OpenAPI спецификации
- Для запросов используется только fetch и useEffect/useState
- Минимум зависимостей

## Запуск

```bash
npm install
npm run dev
```

## Генерация типов

```bash
npm run prepare-openapi
npm run generate-types
```

## Мок-сервер

```bash
npm run mock:api
``` 