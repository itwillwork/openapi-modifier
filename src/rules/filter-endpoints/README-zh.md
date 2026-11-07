[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# filter-endpoints

该规则允许根据路径和方法过滤 OpenAPI 规范中的端点。它能够明确指定哪些端点应该保留或从规范中删除。该规则支持精确匹配和基于正则表达式的过滤。



## 配置

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

**如果需要修改多个规范**，您可以在整体配置管道中多次使用此规则。

## 动机

<a name="custom_anchor_motivation_1"></a>
### 1. 需要只保留公共 API 端点

实际示例：

**在 `openapi.yaml` 文件**中有许多端点，包括内部端点：

```yaml
paths:
  /api/v1/pets:
    get:
      summary: List all pets
    post:
      summary: Create a pet
  /internal/health:
    get:
      summary: Health check
  /internal/metrics:
    get:
      summary: Metrics endpoint
```

**我们需要只保留公共端点并排除内部端点。**

**在配置文件** `openapi-modifier-config.js` 中添加 `filter-endpoints` 规则：

```js
module.exports = {
    pipeline: [
        {
            rule: "filter-endpoints",
            config: {
                disabledPathRegExp: [/^\/internal/]
            }
        }
    ]
}
```

**应用规则后**，`openapi.yaml` 文件将只包含公共端点：

```yaml
paths:
  /api/v1/pets:
    get:
      summary: List all pets
    post:
      summary: Create a pet
```

## 重要说明

- 该规则会为配置中指定但在规范中未找到的端点输出警告

## 有用的链接

- [测试中的规则使用示例](https://github.com/itwillwork/openapi-modifier/blob/main/src/rules/filter-endpoints/index.test.ts)
 
- DeepWiki 文档](https://deepwiki.com/itwillwork/openapi-modifier)
- 用于 LLM 和 AI 代码编辑器的 Context7 文档](https://context7.com/itwillwork/openapi-modifier)
