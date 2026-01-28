# OpenAPI Modifier MCP Server

MCP (Model Context Protocol) сервер для работы с правилами и конфигурациями openapi-modifier.

## Установка

```bash
cd mcp
npm install
npm run build
```

## Настройка в Cursor

Добавьте в `.cursor/mcp.json` (или настройки MCP):

```json
{
  "mcpServers": {
    "openapi-modifier": {
      "command": "node",
      "args": ["/путь/к/openapi-modifier/mcp/dist/index.js"]
    }
  }
}
```

Или из корня репозитория через npm:

```json
{
  "mcpServers": {
    "openapi-modifier": {
      "command": "npm",
      "args": ["start"],
      "cwd": "/путь/к/openapi-modifier/mcp"
    }
  }
}
```

## Инструменты

- **list_rules** — возвращает список всех доступных правил openapi-modifier с их краткими описаниями. Поддерживает параметр `lang` для выбора языка документации (en, ru, zh).
- **get_rule_config** — получает описание конфигурации конкретного правила. Поддерживает параметр `lang` для выбора языка документации (en, ru, zh).
- **get_simple_text_file_modifier_doc** — получает документацию Simple Text File Modifier cli (добавление текста в начало/конец файла, замена по регулярным выражениям). Поддерживает параметр `lang` для выбора языка документации (en, ru, zh).

## Разработка

```bash
npm run build   # сборка TypeScript в JavaScript
```

После сборки сервер готов к использованию. Для запуска используйте путь к `dist/index.js` в конфигурации MCP.

## Структура

```
mcp/
├── docs/
│   ├── rules.md    # список правил (источник для list_rules)
│   ├── rules-ru.md
│   └── rules-zh.md
├── resources/
│   └── rules.json  # список доступных правил
├── src/
│   └── index.ts
├── dist/           # после npm run build
├── package.json
├── tsconfig.json
└── README.md
```

## Языки

Сервер поддерживает три языка документации: `en` (по умолчанию), `ru`, `zh`. Язык по умолчанию определяется из переменной окружения `LANG` или устанавливается в `en`, если переменная не задана или содержит неподдерживаемое значение.
