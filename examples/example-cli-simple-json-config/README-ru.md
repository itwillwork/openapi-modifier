# Пример использования openapi-modifier с простой JSON конфигурацией

Этот пример демонстрирует базовое использование openapi-modifier с конфигурацией в формате JSON для модификации OpenAPI спецификации.

## Структура проекта

```
example-cli-simple-json-config/
├── input/
│   └── openapi.yml         # Входной OpenAPI файл
├── output/
│   └── openapi.yml         # Модифицированный OpenAPI файл
├── openapi-modifier.config.json  # Конфигурационный файл
└── package.json            # Файл зависимостей npm
```

## Конфигурация

В файле `openapi-modifier.config.json` определена простая конфигурация, которая удаляет все `operationId` из API спецификации:

```json
{
  "pipeline": [
    {
      "rule": "remove-operation-id"
    }
  ]
}
```

## Запуск примера

1. Установите зависимости:
```bash
npm install
```

2. Запустите модификатор:
```bash
npm start
```

или напрямую:
```bash
openapi-modifier --input=input/openapi.yml --output=output/openapi.yml --config=openapi-modifier.config.json
```

## Результат

После выполнения команды, в директории `output` будет создан модифицированный файл `openapi.yml`, в котором все `operationId` будут удалены из API спецификации.

## Ожидаемый результат

В выходном файле `output/openapi.yml` все `operationId` будут удалены, при этом остальная структура API спецификации останется без изменений. 