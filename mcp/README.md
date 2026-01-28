[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md) | [🇨🇳 中文](./README-zh.md)

# OpenAPI Modifier MCP Server

MCP (Model Context Protocol) server for working with openapi-modifier rules and configurations.

## Installation

```bash
cd mcp
npm install
npm run build
```

## Configuration in Cursor

Add to `.cursor/mcp.json` (or MCP settings):

```json
{
  "mcpServers": {
    "openapi-modifier": {
      "command": "node",
      "args": ["/path/to/openapi-modifier/mcp/dist/index.js"],
      "env": {
        "LANG": "en"
      }
    }
  }
}
```

Or from the repository root via npm:

```json
{
  "mcpServers": {
    "openapi-modifier": {
      "command": "npm",
      "args": ["start"],
      "cwd": "/path/to/openapi-modifier/mcp",
      "env": {
        "LANG": "en"
      }
    }
  }
}
```

> **Note:** The `LANG` environment variable determines the default documentation language (`en`, `ru`, `zh`). If not specified, `en` is used.

## Configuration in Claude Desktop

Add to the Claude Desktop configuration file:

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

Configuration:

```json
{
  "mcpServers": {
    "openapi-modifier": {
      "command": "node",
      "args": ["/path/to/openapi-modifier/mcp/dist/index.js"],
      "env": {
        "LANG": "en"
      }
    }
  }
}
```

Or from the repository root via npm:

```json
{
  "mcpServers": {
    "openapi-modifier": {
      "command": "npm",
      "args": ["start"],
      "cwd": "/path/to/openapi-modifier/mcp",
      "env": {
        "LANG": "en"
      }
    }
  }
}
```

After adding the configuration, restart Claude Desktop.

> **Note:** The `LANG` environment variable determines the default documentation language (`en`, `ru`, `zh`). If not specified, `en` is used.

## Configuration in Roo

Add to the Roo configuration file:

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

Configuration:

```json
{
  "mcpServers": {
    "openapi-modifier": {
      "command": "node",
      "args": ["/path/to/openapi-modifier/mcp/dist/index.js"],
      "env": {
        "LANG": "en"
      }
    }
  }
}
```

Or from the repository root via npm:

```json
{
  "mcpServers": {
    "openapi-modifier": {
      "command": "npm",
      "args": ["start"],
      "cwd": "/path/to/openapi-modifier/mcp",
      "env": {
        "LANG": "en"
      }
    }
  }
}
```

After adding the configuration, restart Roo.

> **Note:** The `LANG` environment variable determines the default documentation language (`en`, `ru`, `zh`). If not specified, `en` is used.

## Tools

- **list_rules** — returns a list of all available openapi-modifier rules with their brief descriptions. Supports the `lang` parameter for selecting documentation language (en, ru, zh).
- **get_rule_config** — gets the configuration description for a specific rule. Supports the `lang` parameter for selecting documentation language (en, ru, zh).
- **get_simple_text_file_modifier_doc** — gets the Simple Text File Modifier cli documentation (adding text to the beginning/end of a file, replacement by regular expressions). Supports the `lang` parameter for selecting documentation language (en, ru, zh).

## Development

```bash
npm run build   # build TypeScript to JavaScript
```

After building, the server is ready to use. Use the path to `dist/index.js` in the MCP configuration to run it.

## Structure

```
mcp/
├── docs/
│   ├── rules.md    # list of rules (source for list_rules)
│   ├── rules-ru.md
│   └── rules-zh.md
├── resources/
│   └── rules.json  # list of available rules
├── src/
│   └── index.ts
├── dist/           # after npm run build
├── package.json
├── tsconfig.json
└── README.md
```

## Languages

The server supports three documentation languages: `en` (default), `ru`, `zh`. The default language is determined from the `LANG` environment variable or set to `en` if the variable is not set or contains an unsupported value.
