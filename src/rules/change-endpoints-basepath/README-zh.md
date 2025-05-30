[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# change-endpoints-basepath

根据替换字典更改 OpenAPI 规范中的端点基本路径



## 配置

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

**如果需要修改多个规范**，您可以在整体配置管道中多次使用此规则。

## 动机

<a name="custom_anchor_motivation_1"></a>
### 1. 需要缩短某些（或所有）端点的路径名

实际示例：

**在 `openapi.yaml` 文件中**，端点文档如下所示：

```yaml
paths:
  /public/api/v1/pets:
    get:
      summary: List all pets
```
**需要删除 `/public/api` 以将 `/public/api/v1/pets` 缩短为 `/v1/pets`。**

**在配置文件** `openapi-modifier-config.js` 中，添加 `change-endpoints-basepath` 规则：

```js
module.exports = {
    pipeline: [
        {
            rule: "change-endpoints-basepath",
            config: {
                map: { '/public/api': '' },
            },
        }
    ]
}
```

**应用规则后**，`openapi.yaml` 文件如下所示：

```yaml
paths:
  /v1/pets:
    get:
      summary: List all pets
```

## 重要说明

### 关于操作冲突处理和 ignoreOperationCollisions 参数

该规则在更改路径时检查操作冲突。如果在路径替换后发生冲突（例如，两个不同的端点变得相同），规则将抛出错误。

冲突示例：

```yaml
paths:
  /api/v1/pets:
    get:
      summary: List all pets
  /v1/pets:
    get:
      summary: Get pet by id
```

当尝试将 `/api/v1` 替换为 `/v1` 时，将发生冲突，因为两个端点都将变为 `/v1/pets`。

在这种情况下，您可以：
1. 使用 `ignoreOperationCollisions: true` 忽略冲突
2. 更改路径替换配置以避免冲突
3. 预先修改冲突的端点

## 有用的链接

- [测试中的规则使用示例](./index.test.ts)  
 
- DeepWiki 文档](https://deepwiki.com/itwillwork/openapi-modifier)
- 用于 LLM 和 AI 代码编辑器的 Context7 文档](https://context7.com/itwillwork/openapi-modifier)
