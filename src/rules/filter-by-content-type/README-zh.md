[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# filter-by-content-type

该规则允许在 OpenAPI 规范中过滤内容类型。它使您能够明确指定哪些内容类型应该保留或从规范中删除。该规则适用于所有 API 组件，包括请求、响应和通用组件。



## 配置

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

**如果需要修改多个规范**，您可以在整体配置管道中多次使用此规则。

## 动机

<a name="custom_anchor_motivation_1"></a>
### 1. 需要仅保留特定内容类型用于代码生成

实际示例：

**在 `openapi.yaml` 文件中**，端点文档如下所示：

```yaml
paths:
  /pets:
    get:
      summary: List all pets
      responses:
        403:
          content:
            'application/xml':
              schema:
                type: 'number'
            'application/json':
              schema:
                type: 'object'
```
**需要删除应用程序未使用的 `application/xml` 格式的响应/请求。**

**在配置文件** `openapi-modifier-config.js` 中，添加 `filter-by-content-type` 规则：

```js
module.exports = {
    pipeline: [
        {
            rule: "filter-by-content-type",
            config: {
                enabled: ["application/json"],
            },
        }
    ]
}
```

**应用规则后**，`openapi.yaml` 文件如下所示：

```yaml
paths:
  /pets:
    get:
      summary: List all pets
      responses:
        403:
          content:
            'application/json':
              schema:
                type: 'object'
```

<a name="custom_anchor_motivation_2"></a>
### 2. 需要排除特定内容类型

实际示例：

**在 `openapi.yaml` 文件中**，端点文档如下所示：

```yaml
paths:
  /pets:
    get:
      summary: List all pets
      responses:
        200:
          content:
            'application/json':
              schema:
                type: 'object'
            'text/plain':
              schema:
                type: 'string'
```

**需要排除 `text/plain`。**

**在配置文件** `openapi-modifier-config.js` 中，添加 `filter-by-content-type` 规则：

```js
module.exports = {
    pipeline: [
        {
            rule: "filter-by-content-type",
            config: {
                disabled: ["text/plain"]
            },
        }
    ]
}
```

**应用规则后**，`openapi.yaml` 文件如下所示：

```yaml
paths:
  /pets:
    get:
      summary: List all pets
      responses:
        200:
          content:
            'application/json':
              schema:
                type: 'object'
```

## 重要说明

1. 如果同时指定了 `enabled` 和 `disabled` 参数，则首先应用 `enabled` 过滤器，然后应用 `disabled`
2. 该规则会对配置中指定但在规范中未找到的内容类型输出警告

## 有用的链接

- [测试中的规则使用示例](./index.test.ts)  
 
- DeepWiki 文档](https://deepwiki.com/itwillwork/openapi-modifier)
- 用于 LLM 和 AI 代码编辑器的 Context7 文档](https://context7.com/itwillwork/openapi-modifier)
