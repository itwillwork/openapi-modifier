[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md) | [🇨🇳 中文](./README-zh.md)

# OpenAPI Modifier MCP Server

用于处理 openapi-modifier 规则和配置的 MCP（模型上下文协议）服务器。

## 安装

```bash
cd mcp
npm install
npm run build
```

## 在 Cursor 中配置

添加到 `.cursor/mcp.json`（或 MCP 设置）：

```json
{
  "mcpServers": {
    "openapi-modifier": {
      "command": "npx",
      "args": [
        "openapi-modifier-mcp"
      ],
      "env": {
        "LANG": "zh"
      }
    }
  }
}
```

> **注意：** `LANG` 环境变量确定默认文档语言（`en`、`ru`、`zh`）。如果未指定，则使用 `en`。

## 在 Claude Desktop 中配置

添加到 Claude Desktop 配置文件：

**macOS:**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

**Linux:**
```
~/.config/Claude/claude_desktop_config.json
```

配置：

```json
{
  "mcpServers": {
    "openapi-modifier": {
      "command": "npx",
      "args": [
        "openapi-modifier-mcp"
      ],
      "env": {
        "LANG": "zh"
      }
    }
  }
}
```

添加配置后，请重启 Claude Desktop。

> **注意：** `LANG` 环境变量确定默认文档语言（`en`、`ru`、`zh`）。如果未指定，则使用 `en`。

## 在 Roo 中配置

添加到 Roo 配置文件：

**macOS:**
```
~/Library/Application Support/Roo/roo_config.json
```

**Windows:**
```
%APPDATA%\Roo\roo_config.json
```

**Linux:**
```
~/.config/Roo/roo_config.json
```

配置：

```json
{
  "mcpServers": {
    "openapi-modifier": {
      "command": "npx",
      "args": [
        "openapi-modifier-mcp"
      ],
      "env": {
        "LANG": "zh"
      }
    }
  }
}
```

添加配置后，请重启 Roo。

> **注意：** `LANG` 环境变量确定默认文档语言（`en`、`ru`、`zh`）。如果未指定，则使用 `en`。

## 工具

- **list_rules** — 返回所有可用的 openapi-modifier 规则列表及其简要描述。支持 `lang` 参数用于选择文档语言（en、ru、zh）。
- **get_rule_config** — 获取特定规则的配置描述。支持 `lang` 参数用于选择文档语言（en、ru、zh）。
- **get_simple_text_file_modifier_doc** — 获取 Simple Text File Modifier cli 文档（在文件开头/结尾添加文本，通过正则表达式替换）。支持 `lang` 参数用于选择文档语言（en、ru、zh）。

## 开发

```bash
npm run build   # 将 TypeScript 构建为 JavaScript
```

构建后，服务器即可使用。在 MCP 配置中使用 `dist/index.js` 的路径来运行它。

### 开发设置

对于开发，您可以使用本地构建：

```json
{
  "mcpServers": {
    "openapi-modifier": {
      "command": "node",
      "args": ["/path/to/openapi-modifier/mcp/dist/index.js"],
      "env": {
        "LANG": "zh"
      }
    }
  }
}
```

## 结构

```
mcp/
├── docs/
│   ├── rules.md    # 规则列表（list_rules 的源）
│   ├── rules-ru.md
│   └── rules-zh.md
├── resources/
│   └── rules.json  # 可用规则列表
├── src/
│   └── index.ts
├── dist/           # npm run build 之后
├── package.json
├── tsconfig.json
└── README.md
```

## 语言

服务器支持三种文档语言：`en`（默认）、`ru`、`zh`。默认语言从 `LANG` 环境变量确定，如果变量未设置或包含不支持的值，则设置为 `en`。
