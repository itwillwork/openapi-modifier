[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# merge-openapi-spec

将两个 OpenAPI 规范合并为一个。允许将当前规范与指定文件中的附加规范合并。支持处理 JSON 和 YAML 格式的文件。



## 配置

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

**如果需要修改多个规范**，您可以在整体配置管道中多次使用此规则。

## 动机

<a name="custom_anchor_motivation_1"></a>
### 1. 需要将多个 OpenAPI 规范合并为一个

通常需要将尚未在微服务中实现的未来 API 设计添加到 OpenAPI 中，但 API 格式已经达成一致，可以开始开发接口。

实际示例：

**在文件 `openapi.yaml` 中** 主规范：

```yaml
openapi: 3.0.0
info:
  title: Main API
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

**在文件 `additional-spec.yaml` 中** 附加规范：

```yaml
openapi: 3.0.0
info:
  title: Additional API
paths:
  /users:
    get:
      summary: List all users
      responses:
        200:
          content:
            'application/json':
              schema:
                type: 'object'
```

**在配置文件** `openapi-modifier-config.js` 中添加 `merge-openapi-spec` 规则：

```js
module.exports = {
    pipeline: [
        {
            rule: "merge-openapi-spec",
            config: {
                path: "./additional-spec.yaml"
            },
        }
    ]
}
```

**应用规则后**，文件 `openapi.yaml` 将包含合并后的规范：

```yaml
openapi: 3.0.0
info:
  title: Main API
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
  /users:
    get:
      summary: List all users
      responses:
        200:
          content:
            'application/json':
              schema:
                type: 'object'
```

## 重要说明



## 有用的链接

- [测试中的规则使用示例](./index.test.ts)  
 