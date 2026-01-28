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

- **list_rules** — возвращает список правил из `mcp/docs/rules.md` с краткими описаниями.
- **get_rule_config** — возвращает описание конфигурации правила (сначала из локального `src/rules/<rule>/docs/en/_config.md`, при отсутствии — с GitHub).

## Разработка

```bash
npm run build   # сборка
npm run dev     # сборка с watch
npm start       # запуск сервера
```

## Структура

```
mcp/
├── docs/
│   ├── rules.md    # список правил (источник для list_rules)
│   ├── rules-ru.md
│   └── rules-zh.md
├── src/
│   └── index.ts
├── dist/           # после npm run build
├── package.json
├── tsconfig.json
└── README.md
```
