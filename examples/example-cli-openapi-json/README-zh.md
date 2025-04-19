[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# 使用 JSON 文件的 openapi-modifier 示例

本示例演示如何使用 openapi-modifier 修改 JSON 格式的 OpenAPI 规范。

## 项目结构

```
example-cli-openapi-json/
├── input/                  # 输入文件目录
│   └── openapi.json       # 源 OpenAPI 文件
├── output/                 # 输出文件目录
│   └── openapi.json       # 修改后的 OpenAPI 文件
├── openapi-modifier.config.ts  # openapi-modifier 配置
└── package.json           # 依赖和脚本
```

## 安装

```bash
npm install
```

## 使用方法

运行 OpenAPI 文件修改：

```bash
npm start
```

这将执行以下命令：
```bash
openapi-modifier --input=input/openapi.json --output=output/openapi.json --config=openapi-modifier.config.ts
```

## 配置

本示例使用一个简单的配置，用于从 OpenAPI 规范中删除所有 operationId：

```typescript
import { ConfigT } from 'openapi-modifier';

const config: ConfigT = {
  pipeline: [
    {
      rule: 'remove-operation-id',
      config: {
        ignore: [], // 您可以指定要保留的 operationId
      },
    },
  ],
};

export default config;
```

## 结果

运行脚本后，修改后的 OpenAPI 文件将保存在 `output/` 目录中。所有 operationId 都将从规范中删除，这在需要清理文档中的内部操作标识符时很有用。 