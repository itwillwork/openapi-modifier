# 将 OpenAPI 从 YAML 转换为 JSON 的示例

本示例演示如何使用 `openapi-modifier` 在应用修改规则的同时将 OpenAPI 规范从 YAML 格式转换为 JSON 格式。

## 项目结构

```
example-cli-openapi-yaml-to-json/
├── input/
│   └── openapi.yml      # YAML 格式的输入 OpenAPI 文件
├── output/
│   └── openapi.json     # JSON 格式的输出 OpenAPI 文件
├── openapi-modifier.config.ts  # 修改规则配置
└── package.json         # 项目依赖
```

## 安装

```bash
npm install
```

## 配置

`openapi-modifier.config.ts` 文件定义了从所有 API 操作中删除 `operationId` 的规则：

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

## 使用方法

运行转换：

```bash
npm start
```

或直接运行：

```bash
openapi-modifier --input=input/openapi.yml --output=output/openapi.json
```

## 结果

执行命令后：
1. 将读取 `input/openapi.yml` 文件
2. 应用修改规则（在本例中 - 删除所有 `operationId`）
3. 结果将以 JSON 格式保存到 `output/openapi.json`

## 注意事项

- 输入文件必须是 YAML 格式
- 输出文件将以 JSON 格式创建
- 所有修改规则按照配置文件中定义的顺序应用 