#!/usr/bin/env node

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const RAW_GITHUB_MAIN_BRANCH_BASE_URL =
  "https://raw.githubusercontent.com/itwillwork/openapi-modifier/main/src/rules";

interface Rule {
  name: string;
  description: string;
}

function getRulesFilePath(): string {
  // When built: mcp/dist/index.js -> mcp/docs/rules.md
  return join(__dirname, "..", "docs", "rules.md");
}

function parseRulesTable(content: string): Rule[] {
  const lines = content.trim().split("\n").filter(Boolean);
  if (lines.length < 3) return [];
  const rules: Rule[] = [];
  for (let i = 2; i < lines.length; i++) {
    const cells = lines[i].split("|").map((c) => c.trim());
    if (cells.length < 3) continue;
    const linkCell = cells[1];
    const match = linkCell.match(/\[([^\]]+)\]/);
    const name = match ? match[1] : linkCell;
    const description = cells[2] ?? "";
    if (name && /[a-z]/.test(name)) rules.push({ name, description });
  }
  return rules;
}

function loadRules(): Rule[] {
  const filePath = getRulesFilePath();
  if (!existsSync(filePath)) {
    throw new Error(`Файл списка правил не найден: ${filePath}`);
  }
  const content = readFileSync(filePath, "utf-8");
  return parseRulesTable(content);
}

function getLocalConfigPath(ruleName: string): string {
  // mcp/dist/index.js -> ../../src/rules/<rule>/docs/en/_config.md
  return join(__dirname, "..", "..", "src", "rules", ruleName, "docs", "en", "_config.md");
}

class OpenAPIModifierMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "openapi-modifier-mcp",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "list_rules",
            description:
              "Возвращает список всех доступных правил openapi-modifier с их краткими описаниями (из mcp/docs/rules.md)",
            inputSchema: {
              type: "object",
              properties: {},
              required: [],
            },
          } as Tool,
          {
            name: "get_rule_config",
            description:
              "Получает описание конфигурации конкретного правила (локально или из репозитория openapi-modifier на GitHub)",
            inputSchema: {
              type: "object",
              properties: {
                rule_name: {
                  type: "string",
                  description:
                    "Имя правила (например, 'change-content-type', 'filter-endpoints')",
                },
              },
              required: ["rule_name"],
            },
          } as Tool,
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request: { params: { name: string; arguments?: { rule_name?: string } } }) => {
      const { name, arguments: args } = request.params;

      if (name === "list_rules") {
        try {
          const rules = loadRules();
          const header = "| Rule | Short Description |\n|------|-------------------|\n";
          const rows = rules.map(
            (rule) =>
              `| [${rule.name}](./src/rules/${rule.name}/README.md) | ${rule.description} |`
          );
          return {
            content: [
              {
                type: "text",
                text: header + rows.join("\n"),
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Ошибка при получении списка правил: ${
                  error instanceof Error ? error.message : String(error)
                }`,
              },
            ],
            isError: true,
          };
        }
      }

      if (name === "get_rule_config") {
        try {
          const ruleName = args?.rule_name as string;
          if (!ruleName) {
            throw new Error("Имя правила не указано");
          }

          const rules = loadRules();
          const rule = rules.find((r) => r.name === ruleName);
          if (!rule) {
            throw new Error(
              `Правило '${ruleName}' не найдено. Используйте list_rules для просмотра доступных правил.`
            );
          }

          const localPath = getLocalConfigPath(ruleName);
          if (existsSync(localPath)) {
            const content = readFileSync(localPath, "utf-8");
            return {
              content: [
                {
                  type: "text",
                  text: content,
                },
              ],
            };
          }

          const configUrl = `${RAW_GITHUB_MAIN_BRANCH_BASE_URL}/${ruleName}/docs/en/_config.md`;
          const response = await fetch(configUrl);
          if (!response.ok) {
            throw new Error(
              `Не удалось получить конфигурацию правила: ${response.status} ${response.statusText}`
            );
          }
          const content = await response.text();
          return {
            content: [
              {
                type: "text",
                text: content,
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: `Ошибка при получении конфигурации правила: ${
                  error instanceof Error ? error.message : String(error)
                }`,
              },
            ],
            isError: true,
          };
        }
      }

      throw new Error(`Unknown tool: ${name}`);
    });
  }

  private setupErrorHandling() {
    this.server.onerror = (error: unknown) => {
      console.error("[MCP Error]", error);
    };

    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("OpenAPI Modifier MCP server running on stdio");
  }
}

const server = new OpenAPIModifierMCPServer();
server.run().catch(console.error);
