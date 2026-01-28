#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

class GithubUrlFactory {
  constructor(
    private readonly lang: string,
    private readonly baseUrl: string
  ) {}

  getRulesDocUrl(): string {
    const suffix = this.lang === "en" ? "" : `-${this.lang}`;
    return `${this.baseUrl}/mcp/docs/rules${suffix}.md`;
  }

  getRuleConfigUrl(ruleName: string): string {
    return `${this.baseUrl}/src/rules/${ruleName}/docs/${this.lang}/_config.md`;
  }
}

const MAIN_BRANCH_BASE_URL =
  "https://raw.githubusercontent.com/itwillwork/openapi-modifier/main";

const githubUrls = new GithubUrlFactory("en", MAIN_BRANCH_BASE_URL);

async function fetchGitHubFileRawContent(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return response.text();
}

class OpenAPIModifierMCPServer {
  private server: McpServer;

  constructor() {
    this.server = new McpServer(
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
    this.server.registerTool(
      "list_rules",
      {
        description:
          "Возвращает список всех доступных правил openapi-modifier с их краткими описаниями",
        inputSchema: {},
      },
      async () => {
        try {
          const text = await fetchGitHubFileRawContent(githubUrls.getRulesDocUrl());
          return {
            content: [
              {
                type: "text",
                text,
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
    );

    this.server.registerTool(
      "get_rule_config",
      {
        description:
          "Получает описание конфигурации конкретного правила",
        inputSchema: {
          rule_name: z.string().describe(
            "Имя правила (например, 'change-content-type', 'filter-endpoints')"
          ),
        },
      },
      async (args) => {
        try {
          const ruleName = args.rule_name;
          if (!ruleName) {
            throw new Error("Имя правила не указано");
          }

          const content = await fetchGitHubFileRawContent(
            githubUrls.getRuleConfigUrl(ruleName)
          );
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
    );
  }

  private setupErrorHandling() {
    this.server.server.onerror = (error: unknown) => {
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
