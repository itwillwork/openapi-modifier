# 使用简单 JSON 配置的 openapi-modifier 示例

本示例演示如何使用 JSON 配置的 openapi-modifier 来修改 OpenAPI 规范。

## 项目结构

```
example-cli-simple-json-config/
├── input/
│   └── openapi.yml         # 输入的 OpenAPI 文件
├── output/
│   └── openapi.yml         # 修改后的 OpenAPI 文件
├── openapi-modifier.config.json  # 配置文件
└── package.json            # npm 依赖文件
```

## 配置

`openapi-modifier.config.json` 文件定义了一个简单的配置，用于从 API 规范中删除所有 `operationId`：

```json
{
  "pipeline": [
    {
      "rule": "remove-operation-id"
    }
  ]
}
```

## 运行示例

1. 安装依赖：
```bash
npm install
```

2. 运行修改器：
```bash
npm start
```

或直接运行：
```bash
openapi-modifier --input=input/openapi.yml --output=output/openapi.yml --config=openapi-modifier.config.json
```

## 结果

执行命令后，将在 `output` 目录中创建修改后的 `openapi.yml` 文件，其中所有 `operationId` 都将从 API 规范中删除。

## 预期输出

在输出文件 `output/openapi.yml` 中，所有 `operationId` 都将被删除，而 API 规范的其余结构保持不变。 