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

// Translations for tool descriptions
const toolTranslations = {
  en: {
    list_rules: {
      description: "Returns a list of all available openapi-modifier rules with their brief descriptions",
      lang: `Documentation language. Supported languages: ${SUPPORTED_LANGS.join(", ")}. Defaults to the value from LANG environment variable or "en"`,
    },
    get_rule_config: {
      description: "Gets the configuration description of a specific rule",
      rule_name: (rules: string[]) => rules.length > 0 
        ? `Rule name. Available rules: ${rules.join(", ")}`
        : "Rule name (e.g., 'change-content-type', 'filter-endpoints')",
      lang: `Documentation language. Supported languages: ${SUPPORTED_LANGS.join(", ")}. Defaults to the value from LANG environment variable or "en"`,
    },
    get_simple_text_file_modifier_doc: {
      description: "Gets Simple Text File Modifier cli documentation (adding text to the beginning/end of a file, replacement by regular expressions)",
      lang: `Documentation language. Supported languages: ${SUPPORTED_LANGS.join(", ")}. Defaults to the value from LANG environment variable or "en"`,
    },
  },
  ru: {
    list_rules: {
      description: "Возвращает список всех доступных правил openapi-modifier с их краткими описаниями",
      lang: `Язык документации. Поддерживаемые языки: ${SUPPORTED_LANGS.join(", ")}. По умолчанию используется значение из переменной окружения LANG или "en"`,
    },
    get_rule_config: {
      description: "Получает описание конфигурации конкретного правила",
      rule_name: (rules: string[]) => rules.length > 0
        ? `Имя правила. Доступные правила: ${rules.join(", ")}`
        : "Имя правила (например, 'change-content-type', 'filter-endpoints')",
      lang: `Язык документации. Поддерживаемые языки: ${SUPPORTED_LANGS.join(", ")}. По умолчанию используется значение из переменной окружения LANG или "en"`,
    },
    get_simple_text_file_modifier_doc: {
      description: "Получает документацию Simple Text File Modifier cli (добавление текста в начало/конец файла, замена по регулярным выражениям)",
      lang: `Язык документации. Поддерживаемые языки: ${SUPPORTED_LANGS.join(", ")}. По умолчанию используется значение из переменной окружения LANG или "en"`,
    },
  },
  zh: {
    list_rules: {
      description: "返回所有可用的 openapi-modifier 规则及其简要说明的列表",
      lang: `文档语言。支持的语言：${SUPPORTED_LANGS.join(", ")}。默认为 LANG 环境变量的值或 "en"`,
    },
    get_rule_config: {
      description: "获取特定规则的配置描述",
      rule_name: (rules: string[]) => rules.length > 0
        ? `规则名称。可用规则：${rules.join(", ")}`
        : "规则名称（例如，'change-content-type'、'filter-endpoints'）",
      lang: `文档语言。支持的语言：${SUPPORTED_LANGS.join(", ")}。默认为 LANG 环境变量的值或 "en"`,
    },
    get_simple_text_file_modifier_doc: {
      description: "获取 Simple Text File Modifier cli 文档（在文件开头/结尾添加文本，通过正则表达式替换）",
      lang: `文档语言。支持的语言：${SUPPORTED_LANGS.join(", ")}。默认为 LANG 环境变量的值或 "en"`,
    },
  },
} as const;

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
    const t = toolTranslations[this.defaultLang];
    
    this.server.registerTool(
      "list_rules",
      {
        description: t.list_rules.description,
        inputSchema: {
          lang: langSchema
            .optional()
            .describe(t.list_rules.lang),
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
        description: t.get_rule_config.description,
        inputSchema: {
          rule_name: (() => {
            if (this.rules.length > 0) {
              return z.enum(this.rules as [string, ...string[]]).describe(
                t.get_rule_config.rule_name(this.rules)
              );
            }
            return z.string().describe(
              t.get_rule_config.rule_name(this.rules)
            );
          })(),
          lang: langSchema
            .optional()
            .describe(t.get_rule_config.lang),
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
        description: t.get_simple_text_file_modifier_doc.description,
        inputSchema: {
          lang: langSchema
            .optional()
            .describe(t.get_simple_text_file_modifier_doc.lang),
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
