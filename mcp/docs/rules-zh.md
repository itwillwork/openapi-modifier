| 规则 | 简短描述 |
|------------------------------------------------------------------| ---- |
| [change-content-type](https://raw.githubusercontent.com/itwillwork/openapi-modifier/refs/heads/main/src/rules/change-content-type/README-zh.md) | 根据替换字典修改 OpenAPI 规范中的内容类型 |
| [change-endpoints-basepath](https://raw.githubusercontent.com/itwillwork/openapi-modifier/refs/heads/main/src/rules/change-endpoints-basepath/README-zh.md) | 根据替换字典更改 OpenAPI 规范中的端点基本路径 |
| [filter-by-content-type](https://raw.githubusercontent.com/itwillwork/openapi-modifier/refs/heads/main/src/rules/filter-by-content-type/README-zh.md) | 该规则允许在 OpenAPI 规范中过滤内容类型。它使您能够明确指定哪些内容类型应该保留或从规范中删除。该规则适用于所有 API 组件，包括请求、响应和通用组件。 |
| [filter-endpoints](https://raw.githubusercontent.com/itwillwork/openapi-modifier/refs/heads/main/src/rules/filter-endpoints/README-zh.md) | 该规则允许根据路径和方法过滤 OpenAPI 规范中的端点。它能够明确指定哪些端点应该保留或从规范中删除。该规则支持精确匹配和基于正则表达式的过滤。 |
| [merge-openapi-spec](https://raw.githubusercontent.com/itwillwork/openapi-modifier/refs/heads/main/src/rules/merge-openapi-spec/README-zh.md) | 将两个 OpenAPI 规范合并为一个。允许将当前规范与指定文件中的附加规范合并。支持处理 JSON 和 YAML 格式的文件。 |
| [patch-component-schema](https://raw.githubusercontent.com/itwillwork/openapi-modifier/refs/heads/main/src/rules/patch-component-schema/README-zh.md) | 此规则允许修改 OpenAPI 规范中的组件模式。 |
| [patch-endpoint-parameter-schema](https://raw.githubusercontent.com/itwillwork/openapi-modifier/refs/heads/main/src/rules/patch-endpoint-parameter-schema/README-zh.md) | 该规则允许修改 OpenAPI 规范中端点参数的架构。 |
| [patch-endpoint-request-body-schema](https://raw.githubusercontent.com/itwillwork/openapi-modifier/refs/heads/main/src/rules/patch-endpoint-request-body-schema/README-zh.md) | 用于修改 OpenAPI 规范中请求体模式的规则。允许修改指定端点的请求模式。 |
| [patch-endpoint-response-schema](https://raw.githubusercontent.com/itwillwork/openapi-modifier/refs/heads/main/src/rules/patch-endpoint-response-schema/README-zh.md) | 该规则允许修改 OpenAPI 规范中端点的响应模式（response schema）。 |
| [patch-endpoint-schema](https://raw.githubusercontent.com/itwillwork/openapi-modifier/refs/heads/main/src/rules/patch-endpoint-schema/README-zh.md) | 该规则允许修改 OpenAPI 规范中的整个端点模式。与其他仅处理端点各个部分（参数、请求体、响应）的修补规则不同，此规则可以修改整个端点结构，包括其所有组件。 |
| [remove-deprecated](https://raw.githubusercontent.com/itwillwork/openapi-modifier/refs/heads/main/src/rules/remove-deprecated/README-zh.md) | 该规则允许从 OpenAPI 规范中删除已弃用（deprecated）的元素。它可以删除已弃用的组件、端点、参数和属性，同时提供忽略特定元素和显示已删除元素描述的功能。 |
| [remove-max-items](https://raw.githubusercontent.com/itwillwork/openapi-modifier/refs/heads/main/src/rules/remove-max-items/README-zh.md) | 从 OpenAPI 规范的所有模式中删除 `maxItems` 属性。 |
| [remove-min-items](https://raw.githubusercontent.com/itwillwork/openapi-modifier/refs/heads/main/src/rules/remove-min-items/README-zh.md) | 从 OpenAPI 规范中的所有模式中删除 `minItems` 属性。 |
| [remove-operation-id](https://raw.githubusercontent.com/itwillwork/openapi-modifier/refs/heads/main/src/rules/remove-operation-id/README-zh.md) | 从 OpenAPI 规范中删除所有操作的 operationId，忽略列表中指定的操作除外 |
| [remove-parameter](https://raw.githubusercontent.com/itwillwork/openapi-modifier/refs/heads/main/src/rules/remove-parameter/README-zh.md) | 从 OpenAPI 规范中删除端点的参数 |
| [remove-unused-components](https://raw.githubusercontent.com/itwillwork/openapi-modifier/refs/heads/main/src/rules/remove-unused-components/README-zh.md) | 从 OpenAPI 规范中删除未使用的组件。该规则分析文档中的所有组件引用，并删除那些在任何地方都未使用的组件。 |
