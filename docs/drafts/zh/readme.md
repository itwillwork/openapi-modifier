{{{langSwitcher}}}

# OpenAPI Modifier

一个使用可自定义规则修改 OpenAPI 规范的工具。

该包允许您通过应用一组预定义规则来自动化修改 OpenAPI 规范的过程。

## 主要功能

- 支持 YAML 和 JSON 格式的 OpenAPI 规范修改
- 灵活的规范变更规则系统
- 支持 CLI 和 TypeScript 程序化使用

> [!IMPORTANT]  
> 支持 OpenAPI 3.1、3.0。我们尚未测试 OpenAPI 2 的支持，因为该格式已弃用，我们建议将您的文档迁移到 OpenAPI 3.0。

## 动机和使用场景

描述后端 API 的 OpenAPI 并不总是完美的：它可能包含错误、不准确之处，或者某些特性会破坏其他工具，如代码生成或类型生成。

以声明式格式存储变更信息以保持每个变更的上下文和相关性，在大型团队中特别有用。

<details>
  <summary><b>其他使用场景</b></summary>

### 其他使用场景：

- 后端开发人员要求检查某个实体中是否使用了某个字段；
- 后端开发人员要求检查某个端点中是否使用了某个参数；
- 后端开发人员创建任务停止使用某个端点；
- 后端开发人员编写了新的 API 但未在文档中；
- 后端开发人员要求停止在端点中使用某个参数；
- 无效的 OpenAPI（例如，使用了不存在的 int 类型）；
- 需要保留修改知识（同事需要知道为什么某个字段被阻止）；
- 需要监控 API 变更并及时调整配置（移除端点使用）；
- 从 openapi 中移除已弃用字段（及时注意到将被删除的 API 功能）；

</details>

<details>
  <summary><b>使用演示</b></summary>

<a name="custom_anchor_demo"></a>

### 使用演示

例如，我们有来自后端开发人员的[输入规范/文档文件](./examples/example-cli-generate-api-types/input/openapi.yaml)。例如，[通过 github 的 curl cli 下载](./examples/example-cli-generate-api-types/package.json#L11)。

我们编写一个[配置文件](./examples/example-cli-generate-api-types/openapi-modifier.config.ts)，描述原始规范/文档中需要的所有更改，并附带解释性注释：

```ts
const config: ConfigT = {
    pipeline: [
        // JIRA-10207 - new feature API for epic JIRA-232
        {
            rule: 'merge-openapi-spec',
            config: {
                path: 'input/feature-openapi-JIRA-232.yaml',
            },
        },

        // ...

        // JIRA-10212 - wrong docs, waiting JIRABACKEND-8752
        {
            rule: 'patch-schemas',
            config: [
                {
                    descriptor: {
                        type: 'component-schema',
                        componentName: 'Pet',
                    },
                    patchMethod: 'merge',
                    schemaDiff: {
                        properties: {
                            id: {
                                type: 'string',
                                format: 'uuid',
                            },
                        },
                    },
                },
            ],
        },

        // ...

        // JIRA-11236 - removed deprecated endpoint, waiting JIRABACKEND-3641
        {
            rule: 'filter-endpoints',
            config: {
                disabled: [
                    {
                        path: '/v1/pets/{petId}',
                        method: 'delete',
                    },
                ],
            },
        },

        // ...
}
```

然后[使用此配置文件和 openapi-modifier cli](./examples/example-cli-generate-api-types/package.json#L7)，我们修改原始规范/文档文件并获得[修改后的规范/文档](./examples/example-cli-generate-api-types/output/openapi.yaml)。

然后使用，例如 [dtsgenerator](https://github.com/horiuchi/dtsgenerator) cli，我们从修改后的规范/文档生成[API 类型文件](./examples/example-cli-generate-api-types/output/generated-api-types.d.ts)，然后在项目代码中使用它。

[完整示例代码](./examples/example-cli-generate-api-types)

</details>

## 安装

```bash
npm install --save-dev openapi-modifier
```

## 使用方法

<a name="custom_anchor_cli_npx_usage"></a>

### 通过 NPX 使用 CLI

```shell
npx openapi-modifier --input=input/openapi.yml --output=output/openapi.yml --config=openapi-modifier.config.js
```

[通过 NPX 使用 CLI 的示例](./examples/example-cli-simple-npx/package.json#L6)

{{{cliParams}}}

{{{cliConfigWarning}}}

<a name="custom_anchor_cli_usage"></a>

### CLI

```shell
npm i --save-dev openapi-modifier

openapi-modifier --input=input/openapi.yml --output=output/openapi.yml --config=openapi-modifier.config.js
```

[使用 CLI 的示例](./examples/example-cli-openapi-yaml/package.json#L7)

{{{cliParams}}}

{{{cliConfigWarning}}}

<a name="custom_anchor_package_usage"></a>

### 程序化使用

```typescript
import { openapiModifier } from 'openapi-modifier';

(async () => {
    try {
        await openapiModifier({
            input: 'input/openapi.yml',
            output: 'output/openapi.yml',
            pipeline: [
                {
                    rule: 'remove-operation-id',
                    config: {
                        ignore: [],
                    },
                },
            ],
        });

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();
```

[程序化使用的示例](./examples/example-package-openapi-yaml/generate.ts)

<a name="custom_anchor_config_parameters"></a>

## 配置

创建一个配置文件（例如，`openapi-modifier.config.js` 或 `openapi-modifier.config.ts`），结构如下：

```javascript
module.exports = {
    // （可选）日志设置
    logger: {
        verbose: true, // 启用详细日志记录
        minLevel: 0    // 最小日志级别：0 - trace，1 - debug，2 - info，3 - warn，4 - error
    },
    // 输入 OpenAPI 规范文件路径
    input: './openapi.yaml',
    // 输出文件路径
    output: './modified-openapi.yaml',
    // 要应用的规则管道（见下文所有可用规则及其配置示例）
    pipeline: [
        {
            rule: "change-content-type",
            disabled: false, // （可选）禁用规则
            config: {
                map: {
                    "*/*": "application/json"
                }
            }
        }
        // 其他规则...
    ]
}
```

> [!IMPORTANT]  
> 由于规则的管道结构，您可以：
> - 使用下一阶段编辑前一阶段的结果，从而构建必要的更改序列；
> - 根据需要多次使用规则并按所需顺序使用；

<a name="custom_anchor_rule_table"></a>

## 可用规则

{{{ruleTable}}}

<a name="custom_anchor_rules_description"></a>

## 规则简要说明

{{{rulesDescription}}}

## 常见问题

- **为什么 $ref 修改很危险？** 因为它意味着 $ref 引用了模式的公共部分，其修改可能导致规范中重用 $ref 的另一部分发生隐式更改，这种错误将极难捕获。

## 人工智能工具

- DeepWiki 文档](https://deepwiki.com/itwillwork/openapi-modifier)
- 用于 LLM 和 AI 代码编辑器的 Context7 文档](https://context7.com/itwillwork/openapi-modifier)

## 使用示例

在 `examples` 目录中，您可以找到各种使用包的示例：

- [example-cli-generate-api-types](./examples/example-cli-generate-api-types) - 使用 CLI 生成 API 类型的示例
- [example-cli-openapi-json](./examples/example-cli-openapi-json) - 通过 CLI 使用 OpenAPI JSON 格式的示例
- [example-cli-openapi-yaml](./examples/example-cli-openapi-yaml) - 通过 CLI 使用 OpenAPI YAML 格式的示例
- [example-cli-openapi-yaml-to-json](./examples/example-cli-openapi-yaml-to-json) - 将 YAML 转换为 JSON 格式的示例
- [example-cli-simple-generate-api-types](./examples/example-cli-simple-generate-api-types) - 生成 API 类型的简单示例
- [example-cli-simple-json-config](./examples/example-cli-simple-json-config) - 使用 JSON 配置的示例
- [example-cli-simple-npx](./examples/example-cli-simple-npx) - 通过 npx 使用的示例
- [example-package-openapi-yaml](./examples/example-package-openapi-yaml) - 程序化使用包的示例 