[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

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
            rule: 'patch-component-schema',
            config: {
                descriptor: { componentName: 'Pet' },
                patchMethod: 'deepmerge',
                schemaDiff: {
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                        },
                    },
                },
            },
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
    ],
};
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

CLI 参数：

| 选项     | 描述                                                                                                     | 示例                         | 默认值                                       |
| -------- | -------------------------------------------------------------------------------------------------------- | ---------------------------- |----------------------------------------------|
| `input`  | [**必填**] 输入文件，openapi 规范/文档                                                                   | `input/openapi.yml`          |                                              |
| `output` | [**必填**] 输出文件，openapi 规范/文档                                                                   | `output/openapi.yml`         |                                              |
| `config` | 配置文件路径。详细配置说明[见下方](#custom_anchor_config_parameters)                                      | `openapi-modifier.config.js` | `openapi-modifier.config.(js\ts\json\yaml\yml)` |
| `verbose` | 启用 trace 日志、每条规则执行后的差异输出，以及临时文件中的完整日志。优先于 `minLevel`。 | `--verbose` | `false` |
| `minLevel` | 最低控制台日志级别：`0` trace、`1` info、`2` not-important-warning、`3` warning、`4` error、`5` success。Trace 包含每条规则执行后的差异。 | `--minLevel 0` | `2`（除非在配置中指定） |


有关配置文件更多详情，[请参见下方](#custom_anchor_config_parameters)

如果未指定配置路径，默认配置将从启动目录下的 `openapi-modifier.config.js` 文件中获取。

您可以使用以下扩展名的配置文件：`.ts`、`.js`、`.yaml`、`.yml`、`.json`。 

<a name="custom_anchor_cli_usage"></a>

### CLI

```shell
npm i --save-dev openapi-modifier

openapi-modifier --input=input/openapi.yml --output=output/openapi.yml --config=openapi-modifier.config.js
```

[使用 CLI 的示例](./examples/example-cli-openapi-yaml/package.json#L7)

CLI 参数：

| 选项     | 描述                                                                                                     | 示例                         | 默认值                                       |
| -------- | -------------------------------------------------------------------------------------------------------- | ---------------------------- |----------------------------------------------|
| `input`  | [**必填**] 输入文件，openapi 规范/文档                                                                   | `input/openapi.yml`          |                                              |
| `output` | [**必填**] 输出文件，openapi 规范/文档                                                                   | `output/openapi.yml`         |                                              |
| `config` | 配置文件路径。详细配置说明[见下方](#custom_anchor_config_parameters)                                      | `openapi-modifier.config.js` | `openapi-modifier.config.(js\ts\json\yaml\yml)` |
| `verbose` | 启用 trace 日志、每条规则执行后的差异输出，以及临时文件中的完整日志。优先于 `minLevel`。 | `--verbose` | `false` |
| `minLevel` | 最低控制台日志级别：`0` trace、`1` info、`2` not-important-warning、`3` warning、`4` error、`5` success。Trace 包含每条规则执行后的差异。 | `--minLevel 0` | `2`（除非在配置中指定） |


有关配置文件更多详情，[请参见下方](#custom_anchor_config_parameters)

如果未指定配置路径，默认配置将从启动目录下的 `openapi-modifier.config.js` 文件中获取。

您可以使用以下扩展名的配置文件：`.ts`、`.js`、`.yaml`、`.yml`、`.json`。 

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
        verbose: true, // 将完整日志写入临时文件
        minLevel: 0    // 最低控制台日志级别：0 - trace，1 - info，2 - not-important-warning，3 - warning，4 - error，5 - success
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

| 规则 | 简短描述 |
|------------------------------------------------------------------| ---- |
| [change-content-type](./src/rules/change-content-type/README-zh.md) | 根据替换字典修改 OpenAPI 规范中的内容类型 |
| [change-endpoints-basepath](./src/rules/change-endpoints-basepath/README-zh.md) | 根据替换字典更改 OpenAPI 规范中的端点基本路径 |
| [filter-by-content-type](./src/rules/filter-by-content-type/README-zh.md) | 该规则允许在 OpenAPI 规范中过滤内容类型。它使您能够明确指定哪些内容类型应该保留或从规范中删除。该规则适用于所有 API 组件，包括请求、响应和通用组件。 |
| [filter-endpoints](./src/rules/filter-endpoints/README-zh.md) | 该规则允许根据路径和方法过滤 OpenAPI 规范中的端点。它能够明确指定哪些端点应该保留或从规范中删除。该规则支持精确匹配和基于正则表达式的过滤。 |
| [merge-openapi-spec](./src/rules/merge-openapi-spec/README-zh.md) | 将两个 OpenAPI 规范合并为一个。允许将当前规范与指定文件中的附加规范合并。支持处理 JSON 和 YAML 格式的文件。 |
| [patch-component-schema](./src/rules/patch-component-schema/README-zh.md) | 此规则允许修改 OpenAPI 规范中的组件模式。 |
| [patch-endpoint-parameter-schema](./src/rules/patch-endpoint-parameter-schema/README-zh.md) | 该规则允许修改 OpenAPI 规范中端点参数的架构。 |
| [patch-endpoint-request-body-schema](./src/rules/patch-endpoint-request-body-schema/README-zh.md) | 用于修改 OpenAPI 规范中请求体模式的规则。允许修改指定端点的请求模式。 |
| [patch-endpoint-response-schema](./src/rules/patch-endpoint-response-schema/README-zh.md) | 该规则允许修改 OpenAPI 规范中端点的响应模式（response schema）。 |
| [patch-endpoint-schema](./src/rules/patch-endpoint-schema/README-zh.md) | 该规则允许修改 OpenAPI 规范中的整个端点模式。与其他仅处理端点各个部分（参数、请求体、响应）的修补规则不同，此规则可以修改整个端点结构，包括其所有组件。 |
| [remove-deprecated](./src/rules/remove-deprecated/README-zh.md) | 该规则允许从 OpenAPI 规范中删除已弃用（deprecated）的元素。它可以删除已弃用的组件、端点、参数和属性，同时提供忽略特定元素和显示已删除元素描述的功能。 |
| [remove-max-items](./src/rules/remove-max-items/README-zh.md) | 从 OpenAPI 规范的所有模式中删除 `maxItems` 属性。 |
| [remove-min-items](./src/rules/remove-min-items/README-zh.md) | 从 OpenAPI 规范中的所有模式中删除 `minItems` 属性。 |
| [remove-operation-id](./src/rules/remove-operation-id/README-zh.md) | 从 OpenAPI 规范中删除所有操作的 operationId，忽略列表中指定的操作除外 |
| [remove-parameter](./src/rules/remove-parameter/README-zh.md) | 从 OpenAPI 规范中删除端点的参数 |
| [remove-unused-components](./src/rules/remove-unused-components/README-zh.md) | 从 OpenAPI 规范中删除未使用的组件。该规则分析文档中的所有组件引用，并删除那些在任何地方都未使用的组件。 |


<a name="custom_anchor_rules_description"></a>

## 规则简要说明

<a name="custom_anchor_rule_change-content-type"></a>

### change-content-type

根据替换字典修改 OpenAPI 规范中的内容类型

#### 配置

| 参数 | 描述                          | 示例                     | 类型              | 默认值 |
|----------|-----------------------------------|----------------------------|------------------------|-----------|
| `map`    | [**必填**] 内容类型替换字典 | `{"*/*": "application/json"}` | `Record<string, string>` | `{}`        |

配置示例：

```js
module.exports = {
    pipeline: [
        // ... 其他规则
        {
            rule: "change-content-type",
            config: {
                map: {
                    "*/*": "application/json" // 将所有内容类型替换为 application/json
                }
            }
        }
        // ... 其他规则
    ]
}
```

更详细的配置示例：

```js
module.exports = {
    pipeline: [
        // ... 其他规则
        {
            rule: "change-content-type",
            config: {
                map: {
                    "application/xml": "application/json", // 将 XML 内容类型替换为 JSON
                    "text/plain": "application/json", // 将纯文本内容类型替换为 JSON
                    "*/*": "application/json" // 将所有其他内容类型替换为 JSON
                }
            }
        },
        // ... 其他规则
    ]
}
```

[关于规则 change-content-type 的更多详情](./src/rules/change-content-type/README-zh.md) 

----------------------

<a name="custom_anchor_rule_change-endpoints-basepath"></a>

### change-endpoints-basepath

根据替换字典更改 OpenAPI 规范中的端点基本路径

#### 配置

| 参数                    | 描述                                                              | 示例               | 类型                | 默认值 |
|-----------------------------|-----------------------------------------------------------------------|----------------------|--------------------------|-----------|
| `map`                       | [**必填**] 路径替换字典                                     | `{"/api/v1": "/v1"}` | `Record<string, string>` | `{}`      |
| `ignoreOperationCollisions` | 忽略应用替换后发生的端点冲突 | `true`               | `boolean`                | `false`        |


配置示例：

```js
module.exports = {
    pipeline: [
        // ... 其他规则
        {
            rule: "change-endpoints-basepath",
            config: {
                map: {
                    "/public/api": "" // 从所有路径中删除 '/public/api' 前缀
                }
            }
        }
        // ... 其他规则
    ]
}
```

更详细的配置示例：

```js
module.exports = {
    pipeline: [
        // ... 其他规则
        {
            rule: "change-endpoints-basepath",
            config: {
                map: {
                    "/public/v1/service/api": "/api" // 将 '/public/v1/service/api' 前缀替换为 '/api'
                },
                ignoreOperationCollisions: false // 在路径替换时不允许操作冲突
            }
        }
        // ... 其他规则
    ]
}
```

[关于规则 change-endpoints-basepath 的更多详情](./src/rules/change-endpoints-basepath/README-zh.md) 

----------------------

<a name="custom_anchor_rule_filter-by-content-type"></a>

### filter-by-content-type

该规则允许在 OpenAPI 规范中过滤内容类型。它使您能够明确指定哪些内容类型应该保留或从规范中删除。该规则适用于所有 API 组件，包括请求、响应和通用组件。

#### 配置

| 参数       | 描述                                                 | 示例                   | 类型           | 默认值 |
|------------|------------------------------------------------------|------------------------|----------------|--------|
| `enabled`  | [**可选**] 允许的内容类型列表。如果未指定，则保留所有未在 `disabled` 中列出的类型 | `['application/json']` | `Array<string>` |        |
| `disabled` | [**可选**] 禁止的内容类型列表                        | `['multipart/form-data']` | `Array<string>` |        |

配置示例：

```js
module.exports = {
    pipeline: [
        // ... 其他规则
        {
            rule: "filter-by-content-type",
            config: {
                enabled: ['application/json'], // 只保留 application/json 内容类型，删除其他所有类型
            }
        }
        // ... 其他规则
    ]
}
```

或

```js
module.exports = {
    pipeline: [
        // ... 其他规则
        {
            rule: "filter-by-content-type",
            config: {
                disabled: ['multipart/form-data'], // 删除 multipart/form-data 内容类型，保留其他所有类型
            }
        }
        // ... 其他规则
    ]
}
``` 

> [!IMPORTANT]
> 1. 如果同时指定了 `enabled` 和 `disabled` 参数，则先应用 `enabled` 过滤器，然后再应用 `disabled`
> 2. 规则会为配置中指定但在规范中未找到的内容类型输出警告

[关于规则 filter-by-content-type 的更多详情](./src/rules/filter-by-content-type/README-zh.md) 

----------------------

<a name="custom_anchor_rule_filter-endpoints"></a>

### filter-endpoints

该规则允许根据路径和方法过滤 OpenAPI 规范中的端点。它能够明确指定哪些端点应该保留或从规范中删除。该规则支持精确匹配和基于正则表达式的过滤。

#### 配置

> [!IMPORTANT]  
> 该规则可以在启用模式下工作 - 从规范中过滤端点（当配置中指定了 `enabled` 或 `enabledPathRegExp`），或在禁用模式下工作 - 从规范中排除端点（当配置中指定了 `disabled` 或 `disabledPathRegExp`）

| 参数                  | 描述                                                                                                                                                                               | 示例                | 类型            | 默认值          |
|----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------|-----------------|-----------------|
| `enabled`            | 要保留的端点列表 | `[{"method": "GET", "path": "/pets"}]` | `Array<string \ { path: string; method: string }>` | - |
| `enabledPathRegExp`  | 要保留的路径的正则表达式列表 | `[/^\/api\/v1/]` | `Array<RegExp>` | - |
| `disabled`           | 要排除的端点列表 | `[{"method": "POST", "path": "/pets"}]` | `Array<string \ { path: string; method: string }>` | - |
| `disabledPathRegExp` | 要排除的路径的正则表达式列表 | `[/^\/internal/]` | `Array<RegExp>` | - |
| `printIgnoredEndpoints` | 是否在日志中输出有关已排除端点的信息 | `true` | `boolean` | `false` |

配置示例：

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "filter-endpoints",
            config: {
                enabled: [
                    'GET /foo/ping' // 只保留 GET /foo/ping 端点，其他所有端点将被删除
                ],
            },
        }
        // ... other rules
    ]
}
```

或

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "filter-endpoints",
            config: {
                enabledPathRegExp: [
                    /\/public/ // 保留所有路径包含 /public 的端点
                ],
            },
        }
        // ... other rules
    ]
}
```

或

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "filter-endpoints",
            config: {
                disabled: [
                    'GET /foo/ping' // 删除 GET /foo/ping 端点，其他端点保持不变
                ],
            },
        }
        // ... other rules
    ]
}
```

或

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "filter-endpoints",
            config: {
                disabledPathRegExp: [
                    /\/internal/ // 删除所有路径包含 /internal 的端点
                ],
                printIgnoredEndpoints: true, // 在控制台打印已删除端点的信息
            },
        }
        // ... other rules
    ]
} 
```

[关于规则 filter-endpoints 的更多详情](./src/rules/filter-endpoints/README-zh.md) 

----------------------

<a name="custom_anchor_rule_merge-openapi-spec"></a>

### merge-openapi-spec

将两个 OpenAPI 规范合并为一个。允许将当前规范与指定文件中的附加规范合并。支持处理 JSON 和 YAML 格式的文件。

#### 配置

| 参数                        | 描述                                                                                                                                                                                                                                                                                                                                              | 示例                                         | 类型     | 默认值    |
|----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------|----------|-----------|
| `path`                     | [**必填**] 需要合并到当前规范的 OpenAPI 配置文件的路径。路径可以是相对路径（相对于 package.json 的位置）或绝对路径（例如，通过 `__dirname` 相对于配置文件位置获取）。支持的格式：`*.json`、`*.yml`、`*.yaml`。                                                                                                                                    | `temp-openapi-specs/new-list-endpoints.yaml` | `string` |           |
| `ignoreOperationCollisions`| 合并多个规范时，当存在相同的端点时可能会发生冲突。默认情况下，工具会禁止合并以防止源规范发生意外更改。此设置允许您忽略冲突并仍然合并规范。                                                                                                                                                                                                        | `true`                                       | `boolean` | `false`   |
| `ignoreComponentCollisions`| 合并多个规范时，当存在相同的公共组件时可能会发生冲突。默认情况下，工具会禁止合并以防止源规范发生意外更改。此设置允许您忽略冲突并仍然合并规范。                                                                                                                                                                                                        | `true`                                       | `boolean` | `false`   |

> [!IMPORTANT]
> **如果需要合并多个规范**，您可以在通用管道配置中多次使用此规则。

配置示例：

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "merge-openapi-spec",
            config: {
                path: 'temp-openapi-specs/new-list-endpoints.yaml', // 指定要合并的规范文件路径（相对路径）
            },
        }
        // ... other rules
    ]
}
```

更详细的配置示例：

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "merge-openapi-spec",
            config: {
                path: __dirname + '../temp-openapi-specs/new-list-endpoints.json', // 指定要合并的规范文件路径（绝对路径）
                ignoreOperationCollisions: true, // 忽略操作冲突（同名端点）
                ignoreComponentCollisions: true, // 忽略组件冲突（同名组件）
            },
        }
        // ... other rules
    ]
} 
```

[关于规则 merge-openapi-spec 的更多详情](./src/rules/merge-openapi-spec/README-zh.md) 

----------------------

<a name="custom_anchor_rule_patch-component-schema"></a>

### patch-component-schema

此规则允许修改 OpenAPI 规范中的组件模式。

#### 配置

| 参数 | 描述 | 示例 | 类型 | 默认值 |
| -------- |------------------------------------------------------------------------------------------|------------------------------------------------------------------------------|--------------------------------------------------|------------------------------------------|
| `descriptor` | [**必填**] 要修改的组件的描述。 [了解简单组件描述符和带校正的对象组件描述符之间的区别](./docs/descriptor-zh.md) | `"Pet.name"` 或 `{"componentName": "Pet", "correction": "properties.name"}` | `string \ { componentName: string; correction: string }` | - |
| `patchMethod` | 补丁应用方法。 [了解 merge 和 deepmerge 方法之间的区别](./docs/merge-vs-deepmerge-zh.md) | `"merge"` | `"merge" \ "deepmerge"` | `"merge"` |
| `schemaDiff` | [**必填**] 用于补丁的模式。 [OpenAPI 规范的详细示例](./docs/schema-diff-zh.md) | `{"type": "string", "description": "New description"}` | `OpenAPISchema` | - |

> [!IMPORTANT]
> 设置 `descriptor` 参数的注意事项：
> - 不支持跟随 $refs。因为这可能会导致共享组件中的意外更改，从而在规范的其他地方创建意外的更改。在这种情况下，最好直接修改 $ref 引用的实体；
> - 如果需要遍历数组元素 - 需要在 `descriptor` 中指定 `[]`，例如 `TestSchemaDTO[].test`
> - 如果需要遍历 oneOf、allOf、anyOf，需要在 `descriptor` 中指定 `oneOf[{number}]`、`allOf[{number}]` 或 `anyOf[{number}]`，例如 `TestObjectDTO.oneOf[1].TestSchemaDTO`、`TestObjectDTO.allOf[1].TestSchemaDTO` 或 `TestObjectDTO.anyOf[1].TestSchemaDTO`；

配置示例：

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "patch-component-schema",
            config: {
                descriptor: 'TestDTO',
                schemaDiff: {
                    type: 'string',
                },
            },
        }
        // ... other rules
    ]
}
```

更详细的配置示例：

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "patch-component-schema",
            config: {
                descriptor: 'TestObjectDTO.oneOf[0].TestArraySchemaDTO[]',
                schemaDiff: {
                    type: 'string',
                    enum: ['foo', 'bar'],
                },
                patchMethod: 'deepmerge',
            },
        }
        // ... other rules
    ]
} 
```

[关于规则 patch-component-schema 的更多详情](./src/rules/patch-component-schema/README-zh.md) 

----------------------

<a name="custom_anchor_rule_patch-endpoint-parameter-schema"></a>

### patch-endpoint-parameter-schema

该规则允许修改 OpenAPI 规范中端点参数的架构。

#### 配置

| 参数                  | 描述                                                                                                               | 示例                                                                                                                                                                 | 类型                                                                                | 默认值        |
|-----------------------|------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|--------------|
| `endpointDescriptor`  | [**必填**] 指定需要更改请求参数架构的端点。                                   | `'GET /api/list'`                                                                                                                                                     | `string \ { path: string; method: string }`                                                                            |              |
| `parameterDescriptor` | [**必填**] 指定由 `endpointDescriptor` 引用的需要更改的请求参数。         | `'TestSchemaDTO'`, `'TestSchemaDTO.test'`, `'TestSchemaDTO[].testField'`,  `'TestObjectDTO.oneOf[1]'`, `'TestObjectDTO.allOf[1]'` 或  `'TestObjectDTO.anyOf[1].testField'`        | `string`                                                                            |              |
| `schemaDiff`          | 参数架构的更改 [OpenAPI 规范详细示例](./docs/schema-diff-zh.md)                                                              | `{type: "number"}`                                                                                                   | `OpenAPISchema`                                                                     |              |
| `objectDiff`          | 参数本身的更改                                                                                         | `{ required: true }`                                                                                                    | `{name?: string; in?: 'query' / 'header' / 'path' / 'cookie'; required?: boolean;}` |              |
| `patchMethod`         | 应用 `objectDiff` 和 `schemaDiff` 中指定更改的方法。 [更多关于 merge 和 deepmerge 方法的区别](./docs/merge-vs-deepmerge-zh.md) | `"merge"` | `"merge" \ "deepmerge"` | `"merge"` |

配置示例：

```js
module.exports = {
    pipeline: [
        // ... 其他规则
        {
            rule: "patch-endpoint-parameter-schema",
            config: {
                endpointDescriptor: 'GET /api/list',
                parameterDescriptor: {
                    name: 'test',
                    in: 'query',
                },
                schemaDiff: {
                    enum: ['foo', 'bar'],
                }
            },
        }
        // ... 其他规则
    ]
}
```

更详细的配置示例：

```js
module.exports = {
    pipeline: [
        // ... 其他规则
        {
            rule: "patch-endpoint-parameter-schema",
            config: {
                endpointDescriptor: 'GET /api/list',
                parameterDescriptor: {
                    name: 'test',
                    in: 'path',
                },
                schemaDiff: {
                    type: 'string',
                    enum: ['foo', 'bar'],
                },
                objectDiff: {
                    name: 'newTest',
                    in: 'query',
                    required: true,
                },
                patchMethod: 'deepmerge',
            },
        }
        // ... 其他规则
    ]
}
```

[关于规则 patch-endpoint-parameter-schema 的更多详情](./src/rules/patch-endpoint-parameter-schema/README-zh.md) 

----------------------

<a name="custom_anchor_rule_patch-endpoint-request-body-schema"></a>

### patch-endpoint-request-body-schema

用于修改 OpenAPI 规范中请求体模式的规则。允许修改指定端点的请求模式。

#### 配置

| 参数                    | 描述                                                                                                                                                | 示例                                                                                                                                                               | 类型      | 默认值 |
|-----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|-----------|
| `endpointDescriptor`        | [**必填**] 指定需要修改请求参数模式的端点。                                                                    | `'GET /api/list'`                                                                                                                                                    | `string \ { path: string; method: string }`       |           |
| `contentType`               | 指定需要修改的端点请求类型（content-type）。如果未指定，将修改所有请求类型。 | `'application/json'`                                                                                                                                                 | `string`       |  |
| `correction`                | 模式中需要修改的字段路径                                                                                                                     | `"name"` | `string` | - |
| `schemaDiff`                | [**必填**] 要应用于模式的更改。 [OpenAPI 规范详细示例](./docs/schema-diff-zh.md)                                                                                                                          | `{type: "number"}`                                                                                                | `OpenAPISchema` |           |
| `patchMethod`               | 应用更改的方法 [了解更多关于 merge 和 deepmerge 方法的区别](./docs/merge-vs-deepmerge-zh.md) | `"merge"` | `"merge" \ "deepmerge"` | `"merge"` |

配置示例：

```js
module.exports = {
    pipeline: [
        // ... 其他规则
        {
            rule: "patch-endpoint-request-body-schema",
            config: {
                endpointDescriptor: 'POST /api/order',
                correction: "status",
                schemaDiff: {
                    enum: ['foo', 'bar'],
                },
            },
        }
        // ... 其他规则
    ]
}
```

或

```js
module.exports = {
    pipeline: [
        // ... 其他规则
        {
            rule: "patch-endpoint-request-body-schema",
            config: {
                endpointDescriptor: 'POST /api/order',
                contentType: "application/json",
                schemaDiff: {
                    properties: {
                        testField: {
                            type: 'number',
                        },
                    },
                },
                patchMethod: "deepmerge"
            },
        }
        // ... 其他规则
    ]
}
```

或

```js
module.exports = {
    pipeline: [
        // ... 其他规则
        {
            rule: "patch-endpoint-request-body-schema",
            config: {
                endpointDescriptor: 'POST /api/orders',
                correction: '[].status',
                schemaDiff: {
                    enum: ['foo', 'bar'],
                },
                patchMethod: "deepmerge"
            },
        }
        // ... 其他规则
    ]
}
```

[关于规则 patch-endpoint-request-body-schema 的更多详情](./src/rules/patch-endpoint-request-body-schema/README-zh.md) 

----------------------

<a name="custom_anchor_rule_patch-endpoint-response-schema"></a>

### patch-endpoint-response-schema

该规则允许修改 OpenAPI 规范中端点的响应模式（response schema）。

#### 配置

| 参数                  | 描述                                                                                                                                                 | 示例                                                                                                                                                                     | 类型            | 默认值    |
|----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------|-----------|
| `endpointDescriptor` | [**必填**] 指定需要修改响应模式的端点。                                                                                                              | `'GET /api/list'`                                                                                                                                                        | `string \ { path: string; method: string }`        |           |
| `correction`         | 要修改的模式属性的路径                                                                                                                               | `"status"`                                                                                                                                                               | `string`        | -         |
| `code`               | 指定要应用更改的响应状态码。如果未指定，将应用于第一个 2xx 响应。                                                                                     | `200`                                                                                                                                                                    | `number`        |           |
| `contentType`        | 指定要应用更改的端点响应类型（content-type）。如果未指定，将修改所有响应类型。                                                                        | `'application/json'`                                                                                                                                                     | `string`        |           |
| `schemaDiff`         | [**必填**] OpenAPI 格式所需的更改。[详细的 OpenAPI 规范示例](./docs/schema-diff-zh.md)                                    | `{type: "number"}`                                                                                         | `OpenAPISchema` |           |
| `patchMethod`        | 应用更改的方法 [了解更多关于 merge 和 deepmerge 方法的区别](./docs/merge-vs-deepmerge-zh.md)                             | `"merge"` | `"merge" \ "deepmerge"` | `"merge"` |

配置示例：

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "patch-endpoint-response-schema",
            config: {
                endpointDescriptor: 'GET /api/list',
                correction: '[].status',
                schemaDiff: {
                    enum: ['foo', 'bar'],
                },
            },
        }
        // ... other rules
    ]
}
```

更详细的配置示例：

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "patch-endpoint-response-schema",
            config: {
                endpointDescriptor: 'GET /api/list',
                correction: '[].status',
                code: 200,
                contentType: 'application/json',
                schemaDiff: {
                    enum: ['foo', 'bar'],
                },
                patchMethod: 'deepmerge'
            },
        }
        // ... other rules
    ]
}
```

[关于规则 patch-endpoint-response-schema 的更多详情](./src/rules/patch-endpoint-response-schema/README-zh.md) 

----------------------

<a name="custom_anchor_rule_patch-endpoint-schema"></a>

### patch-endpoint-schema

该规则允许修改 OpenAPI 规范中的整个端点模式。与其他仅处理端点各个部分（参数、请求体、响应）的修补规则不同，此规则可以修改整个端点结构，包括其所有组件。

#### 配置

| 参数                           | 描述                                                   | 示例    | 类型       | 默认值         |
|--------------------------------|--------------------------------------------------------|---------|------------|---------------|
| `endpointDescriptor`           | [**必填**] 需要修补的端点描述                          | `{ path: "/pets", method: "get" }` | `{ path: string, method: string }` | -             |
| `endpointDescriptorCorrection` | 端点模式中需要修补的特定字段路径                       | `"responses.200.content.application/json.schema"` | `string` | -             |
| `schemaDiff`                   | [**必填**] OpenAPI 格式所需的更改。[OpenAPI 规范详细示例](./docs/schema-diff-zh.md)              | `{ type: "object", properties: { ... } }` | `OpenAPISchema` | -             |
| `patchMethod`                  | 应用更改的方法 [了解 merge 和 deepmerge 方法的区别](./docs/merge-vs-deepmerge-zh.md)                                                                        | `"merge"` | `"merge" \ "deepmerge"` | `"merge"` |

配置示例：

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-schema",
            config: {
                endpointDescriptor: "GET /pets", // 指定要修改的端点
                patchMethod: "merge", // 使用 merge 方法应用更改
                schemaDiff: {
                    "security": [ // 向模式添加 security 部分
                        {
                            "bearerAuth": []
                        }
                    ]
                }
            }
        }
    ]
}
```

更详细的配置示例：

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-schema",
            config: {
                patchMethod: 'merge',
                endpointDescriptor: "GET /pets",
                endpointDescriptorCorrection: 'responses.200.content.*/*.schema',
                schemaDiff: {
                    enum: ['3', '4'],
                },
            }
        }
    ]
} 
```

[关于规则 patch-endpoint-schema 的更多详情](./src/rules/patch-endpoint-schema/README-zh.md) 

----------------------

<a name="custom_anchor_rule_remove-deprecated"></a>

### remove-deprecated

该规则允许从 OpenAPI 规范中删除已弃用（deprecated）的元素。它可以删除已弃用的组件、端点、参数和属性，同时提供忽略特定元素和显示已删除元素描述的功能。

#### 配置

| 参数 | 描述                                                                                                                | 示例 | 类型 | 默认值 |
|----------|-------------------------------------------------------------------------------------------------------------------------|---------|-----------|-----------|
| `ignoreComponents` | [**可选**] 即使标记为已弃用也不应删除的组件列表            | `[{"componentName": "Pet"}]` | `Array<{ componentName: string }>` | `[]` |
| `ignoreEndpoints` | [**可选**] 即使标记为已弃用也不应删除的端点列表             | `["GET /pets"]` | `Array<string \ { path: string; method: string }>` | `[]` |
| `ignoreEndpointParameters` | [**可选**] 即使标记为已弃用也不应删除的端点参数列表  | `[{"path": "/pets", "method": "get", "name": "limit", "in": "query"}]` | `Array<{ path: string; method: string; name: string; in: "query" \ "path" \ "header" \ "cookie" }>` | `[]` |
| `showDeprecatedDescriptions` | [**可选**] 是否在日志中显示已删除的已弃用元素的描述，对于解释应该使用什么替代很有用 | `true` | `boolean` | `false` |

> [!IMPORTANT]  
> 仅考虑文件的本地 $ref，格式为：`#/...`

配置示例：

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-deprecated",
            config: {},
        }
    ]
}
```

更详细的配置示例：

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-deprecated",
            config: {
                ignoreComponents: [
                    { componentName: "Pet" } // 即使标记为已弃用也保留 Pet 组件
                ],
                ignoreEndpoints: [
                    { path: "/pets", method: "get" } // 即使标记为已弃用也保留 GET /pets 端点
                ],
                ignoreEndpointParameters: [
                    { path: "/pets", method: "get", name: "limit", in: "query" } // 即使标记为已弃用也保留 GET /pets 中的 limit 参数
                ],
                showDeprecatedDescriptions: true // 在控制台打印已删除的已弃用元素的描述
            },
        }
    ]
}
```

[关于规则 remove-deprecated 的更多详情](./src/rules/remove-deprecated/README-zh.md) 

----------------------

<a name="custom_anchor_rule_remove-max-items"></a>

### remove-max-items

从 OpenAPI 规范的所有模式中删除 `maxItems` 属性。

#### 配置

| 参数 | 描述 | 示例 | 类型 | 默认值 |
| ---- | ---- | ---- | ---- | ------ |
| `showUnusedWarning` | [**可选**] 如果未找到带有 maxItems 的模式，显示警告 | `true` | `boolean` | `false` |

配置示例：

```js
module.exports = {
    pipeline: [
        // ... 其他规则
        {
            rule: "remove-max-items",
            config: {} // 删除所有模式中的 maxItems 属性，不显示警告
        }
        // ... 其他规则
    ]
}
```

更详细的配置示例：

```js
module.exports = {
    pipeline: [
        // ... 其他规则
        {
            rule: "remove-max-items",
            config: {
                showUnusedWarning: true // 如果在规范中未找到带有 maxItems 的模式，则显示警告
            }
        }
        // ... 其他规则
    ]
}
```

[关于规则 remove-max-items 的更多详情](./src/rules/remove-max-items/README-zh.md) 

----------------------

<a name="custom_anchor_rule_remove-min-items"></a>

### remove-min-items

从 OpenAPI 规范中的所有模式中删除 `minItems` 属性。

#### 配置

| 参数 | 描述 | 示例 | 类型 | 默认值 |
| ---- | ---- | ---- | ---- | ------ |
| `showUnusedWarning` | [**可选**] 如果未找到带有 `minItems` 的模式，显示警告 | `true` | `boolean` | `false` |

配置示例：

```js
module.exports = {
    pipeline: [
        // ... 其他规则
        {
            rule: "remove-min-items",
            config: {} // 删除所有模式中的 minItems 属性，不显示警告
        }
        // ... 其他规则
    ]
}
```

更详细的配置示例：

```js
module.exports = {
    pipeline: [
        // ... 其他规则
        {
            rule: "remove-min-items",
            config: {
                showUnusedWarning: true // 如果在规范中未找到带有 minItems 的模式，则显示警告
            }
        }
        // ... 其他规则
    ]
}
```

[关于规则 remove-min-items 的更多详情](./src/rules/remove-min-items/README-zh.md) 

----------------------

<a name="custom_anchor_rule_remove-operation-id"></a>

### remove-operation-id

从 OpenAPI 规范中删除所有操作的 operationId，忽略列表中指定的操作除外

#### 配置

| 参数 | 描述                          | 示例                     | 类型              | 默认值 |
| -------- |-----------------------------------|----------------------------|------------------------|-----------|
| `ignore`  | [**可选**] 要忽略的 operationId 列表 | `["getPets", "createPet"]` | `string[]` | `[]` |

配置示例：

```js
module.exports = {
    pipeline: [
        // ... 其他规则
        {
            rule: "remove-operation-id",
            config: {} // 删除所有端点的 operationId，不保留任何例外
        }
        // ... 其他规则
    ]
}
```

更详细的配置示例：

```js
module.exports = {
    pipeline: [
        // ... 其他规则
        {
            rule: "remove-operation-id",
            config: {
                ignore: ["getPets", "createPet"] // 保留指定端点的 operationId，删除其他所有端点的 operationId
            }
        }
        // ... 其他规则
    ]
} 
```

[关于规则 remove-operation-id 的更多详情](./src/rules/remove-operation-id/README-zh.md) 

----------------------

<a name="custom_anchor_rule_remove-parameter"></a>

### remove-parameter

从 OpenAPI 规范中删除端点的参数

#### 配置

| 参数 | 描述 | 示例 | 类型 | 默认值 |
| -------- |-------------------------------------------------------------------------------------------------------------------------------------------|----------------------------|------------------------|-----------|
| `endpointDescriptor`  | [**必填**] 要从中删除参数的端点描述 | `"GET /pets"` | `string \ { path: string; method: string }` | - |
| `parameterDescriptor`  | [**必填**] 要删除的参数描述。在 `in` 参数中，可以指定：`"query"`、`"path"`、`"header"`、`"cookie"`。 | `{"name": "petId", "in": "path"}` | `{ name: string; in: "query" \ "path" \ "header" \ "cookie" }` | - |

配置示例：

```js
module.exports = {
    pipeline: [
        // ... 其他规则
        {
            rule: "remove-parameter",
            config: {
                endpointDescriptor: "GET /pets/{petId}", // 指定要从中删除参数的端点
                parameterDescriptor: {
                    name: "version", // 指定要删除的参数名称
                    in: "query" // 指定参数位置（查询参数）
                }
            },
        }
        // ... 其他规则
    ]
}
```

[关于规则 remove-parameter 的更多详情](./src/rules/remove-parameter/README-zh.md) 

----------------------

<a name="custom_anchor_rule_remove-unused-components"></a>

### remove-unused-components

从 OpenAPI 规范中删除未使用的组件。该规则分析文档中的所有组件引用，并删除那些在任何地方都未使用的组件。

#### 配置

| 参数    | 描述                          | 示例            | 类型              | 默认值 |
| -------- |-----------------------------------|-------------------|------------------------|-----------|
| `ignore`  | [**可选**] 删除时要忽略的组件或正则表达式列表 | `["NotFoundDTO", "/^Error.*/"]` | `Array<string \| RegExp>` | `[]` |
| `printDeletedComponents` | [**可选**] 如果为true，则在控制台打印已删除组件的列表 | `true` | `boolean` | `false` |

配置示例：

```js
module.exports = {
    pipeline: [
        // ... 其他规则
        {
            rule: "remove-unused-components",
            config: {},
        }
        // ... 其他规则
    ]
}
```

更详细的配置示例：

```js
module.exports = {
    pipeline: [
        // ... 其他规则
        {
            rule: "remove-unused-components",
            config: {
                ignore: [
                    "NotFoundDTO",
                    /^Error.*/, // 忽略所有以Error开头的组件
                    /.*Response$/ // 忽略所有以Response结尾的组件
                ],
                printDeletedComponents: true // 在控制台打印已删除组件的列表
            },
        }
        // ... 其他规则
    ]
}
```

[关于规则 remove-unused-components 的更多详情](./src/rules/remove-unused-components/README-zh.md) 

## 常见问题

<a name="custom_anchor_faq_ref"></a>

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