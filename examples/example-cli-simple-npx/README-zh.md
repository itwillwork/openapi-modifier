# 通过 NPX 使用 openapi-modifier 的简单示例

本示例演示如何通过 NPX 基本使用 openapi-modifier 来修改 OpenAPI 规范。

## 项目结构

```
example-cli-simple-npx/
├── input/
│   └── openapi.yml      # 输入的 OpenAPI 文件
├── output/
│   └── openapi.yml      # 输出的 OpenAPI 文件（将被创建）
├── openapi-modifier.config.js  # 修改器配置
└── package.json         # npm 配置
```

## 配置

`openapi-modifier.config.js` 文件定义了一个简单的配置，用于从 OpenAPI 规范中删除所有 `operationId`：

```javascript
module.exports = {
  pipeline: [
    {
      rule: 'remove-operation-id',
    },
  ],
};
```

## 运行示例

要运行示例，请执行以下命令：

```bash
npm start
```

此命令将：
1. 读取输入文件 `input/openapi.yml`
2. 应用配置中的修改规则
3. 将结果保存到 `output/openapi.yml`

## 结果

执行命令后，输出文件 `output/openapi.yml` 将包含修改后的 OpenAPI 规范，其中所有 API 操作的 `operationId` 都已被删除。

## 注意事项

- 本示例使用 NPX 运行 openapi-modifier，无需全局安装
- 输入文件包含标准的 Petstore API 示例
- 可以根据需要使用其他修改规则扩展配置 