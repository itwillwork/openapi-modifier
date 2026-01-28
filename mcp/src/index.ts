#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const SUPPORTED_LANGS = ["en", "ru", "zh"] as const;
const langSchema = z.enum(SUPPORTED_LANGS);

type Lang = typeof SUPPORTED_LANGS[number];

// Get default language from LANG environment variable or use "en"
const getDefaultLang = (): Lang => {
  const envLang = process.env.LANG;
  if (envLang && SUPPORTED_LANGS.includes(envLang as any)) {
    return envLang as Lang;
  }
  return "en";
};

const defaultLang = getDefaultLang();

class GithubUrlFactory {
  constructor(
    private readonly lang: string,
    private readonly baseUrl: string
  ) {}

  private getLangSuffix(lang: string = "en"): string {
    return lang === "en" ? "" : `-${lang}`;
  }

  getRulesDocUrl(lang?: string): string {
    const langToUse = lang ?? this.lang;
    const langSuffix = this.getLangSuffix(langToUse);
    return `${this.baseUrl}/mcp/docs/rules${langSuffix}.md`;
  }

  getRuleConfigUrl(ruleName: string, lang?: string): string {
    const langToUse = lang ?? this.lang;
    const langSuffix = this.getLangSuffix(langToUse);
    return `${this.baseUrl}/src/rules/${ruleName}/README${langSuffix}.md`;
  }

  getSimpleTextFileModifierDocUrl(lang?: string): string {
    const langToUse = lang ?? this.lang;
    const langSuffix = this.getLangSuffix(langToUse);
    return `${this.baseUrl}/docs/simple-text-file-modifier${langSuffix}.md`;
  }

  getRulesJsonUrl(): string {
    return `${this.baseUrl}/mcp/resources/rules.json`;
  }
}

const MAIN_BRANCH_BASE_URL = "https://raw.githubusercontent.com/itwillwork/openapi-modifier/main";

const githubUrlFactory = new GithubUrlFactory(defaultLang, MAIN_BRANCH_BASE_URL);

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
  private defaultLang: Lang;

  constructor() {
    this.defaultLang = defaultLang;
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
      console.error("Error loading rules list from GitHub:", error);
      // Use empty array if failed to load
      this.rules = [];
    }
    // Register tools after loading rules
    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    this.server.registerTool(
      "list_rules",
      {
        description:
          "Возвращает список всех доступных правил openapi-modifier с их краткими описаниями",
        inputSchema: {
          lang: langSchema
            .optional()
            .describe(
              `Язык документации. Поддерживаемые языки: ${SUPPORTED_LANGS.join(", ")}. По умолчанию используется значение из переменной окружения LANG или "en"`
            ),
        },
      },
      async (args) => {
        try {
          const lang = args.lang ?? this.defaultLang;
          const text = await fetchGitHubFileRawContent(githubUrlFactory.getRulesDocUrl(lang));
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
                text: `Error getting rules list: ${
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
          lang: langSchema
            .optional()
            .describe(
              `Язык документации. Поддерживаемые языки: ${SUPPORTED_LANGS.join(", ")}. По умолчанию используется значение из переменной окружения LANG или "en"`
            ),
        },
      },
      async (args) => {
        try {
          const ruleName = args.rule_name;
          if (!ruleName) {
            throw new Error("Rule name not specified");
          }

          const lang = args.lang ?? this.defaultLang;
          const content = await fetchGitHubFileRawContent(
            githubUrlFactory.getRuleConfigUrl(ruleName, lang)
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
                text: `Error getting rule configuration: ${
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
          lang: langSchema
            .optional()
            .describe(
              `Язык документации. Поддерживаемые языки: ${SUPPORTED_LANGS.join(", ")}. По умолчанию используется значение из переменной окружения LANG или "en"`
            ),
        },
      },
      async (args) => {
        try {
          const lang = args.lang ?? this.defaultLang;
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
                text: `Error getting Simple Text File Modifier documentation: ${
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
