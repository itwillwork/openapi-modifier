#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

class GithubUrlFactory {
  constructor(
    private readonly lang: string,
    private readonly baseUrl: string
  ) {}

  private getLangSuffix(lang: string = "en"): string {
    return lang === "en" ? "" : `-${lang}`;
  }

  getRulesDocUrl(): string {
    const langSuffix = this.getLangSuffix(this.lang);
    return `${this.baseUrl}/mcp/docs/rules${langSuffix}.md`;
  }

  getRuleConfigUrl(ruleName: string): string {
    const langSuffix = this.getLangSuffix(this.lang);
    return `${this.baseUrl}/src/rules/${ruleName}/README${langSuffix}.md`;
  }

  getSimpleTextFileModifierDocUrl(lang: string = "en"): string {
    const langSuffix = this.getLangSuffix(lang);
    return `${this.baseUrl}/docs/simple-text-file-modifier${langSuffix}.md`;
  }

  getRulesJsonUrl(): string {
    return `${this.baseUrl}/mcp/resources/rules.json`;
  }
}

const MAIN_BRANCH_BASE_URL = "https://raw.githubusercontent.com/itwillwork/openapi-modifier/main";

const githubUrlFactory = new GithubUrlFactory("en", MAIN_BRANCH_BASE_URL);

async function fetchGitHubFileRawContent(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return response.text();
}

async function fetchGitHubFileJSON<T>(url: string): Promise<T> {
  const text = await fetchGitHubFileRawContent(url);
  return JSON.parse(text) as T;
}

class OpenAPIModifierMCPServer {
  private server: McpServer;
  private rules: string[] = [];

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

    this.setupErrorHandling();
  }

  async initialize() {
    try {
      this.rules = await fetchGitHubFileJSON<string[]>(
        githubUrlFactory.getRulesJsonUrl()
      );
    } catch (error) {
      console.error("Ошибка при загрузке списка правил из GitHub:", error);
      // Используем пустой массив, если не удалось загрузить
      this.rules = [];
    }
    // Регистрируем инструменты после загрузки правил
    this.setupToolHandlers();
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
          const text = await fetchGitHubFileRawContent(githubUrlFactory.getRulesDocUrl());
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
          rule_name: (() => {
            if (this.rules.length > 0) {
              return z.enum(this.rules as [string, ...string[]]).describe(
                `Имя правила. Доступные правила: ${this.rules.join(", ")}`
              );
            }
            return z.string().describe(
              "Имя правила (например, 'change-content-type', 'filter-endpoints')"
            );
          })(),
        },
      },
      async (args) => {
        try {
          const ruleName = args.rule_name;
          if (!ruleName) {
            throw new Error("Имя правила не указано");
          }

          const content = await fetchGitHubFileRawContent(
            githubUrlFactory.getRuleConfigUrl(ruleName)
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

    this.server.registerTool(
      "get_simple_text_file_modifier_doc",
      {
        description:
          "Получает документацию Simple Text File Modifier cli (добавление текста в начало/конец файла, замена по регулярным выражениям)",
        inputSchema: {
          lang: z
            .string()
            .optional()
            .describe(
              "Язык документации: 'en' (по умолчанию), 'ru', 'zh'"
            ),
        },
      },
      async (args) => {
        try {
          const lang = args.lang ?? "en";
          const content = await fetchGitHubFileRawContent(
            githubUrlFactory.getSimpleTextFileModifierDocUrl(lang)
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
                text: `Ошибка при получении документации Simple Text File Modifier: ${
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

server.initialize().then(() => {
  server.run().catch(console.error);
}).catch(console.error);
