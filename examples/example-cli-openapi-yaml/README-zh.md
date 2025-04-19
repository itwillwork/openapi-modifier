# 使用 YAML 文件的 openapi-modifier 示例

本示例演示如何使用 openapi-modifier 修改 YAML 格式的 OpenAPI 规范。

## 项目结构

```
example-cli-openapi-yaml/
├── input/
│   └── openapi.yml         # 输入的 OpenAPI 规范文件
├── output/
│   └── openapi.yml         # 修改后的输出文件
├── openapi-modifier.config.ts  # 修改器配置
└── package.json            # 项目依赖
```

## 安装

1. 安装依赖：
```bash
npm install
```

## 配置

`openapi-modifier.config.ts` 文件定义了修改 OpenAPI 规范的配置：

```typescript
import { ConfigT } from 'openapi-modifier';

const config: ConfigT = {
  pipeline: [
    {
      rule: 'remove-operation-id',
      config: {
        ignore: [],
      },
    },
  ],
};

export default config;
```

本示例使用 `remove-operation-id` 规则，该规则从 OpenAPI 规范中删除所有 `operationId`。

## 运行

运行修改：

```bash
npm start
```

或直接运行：

```bash
openapi-modifier --input=input/openapi.yml --output=output/openapi.yml --config=openapi-modifier.config.ts
```

## 结果

执行命令后，将在 `output` 目录中创建一个修改后的 OpenAPI 规范文件 `openapi.yml`。在本例中，所有 `operationId` 都将从规范中删除。

## 输入数据

输入文件 `input/openapi.yml` 包含 Petstore API 的 OpenAPI 规范示例，其中包含各种端点和架构。修改后，所有 `operationId` 都将从规范中删除。 