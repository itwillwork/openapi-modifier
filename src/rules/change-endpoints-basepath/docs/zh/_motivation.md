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