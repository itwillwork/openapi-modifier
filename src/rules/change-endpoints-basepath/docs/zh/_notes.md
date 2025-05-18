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