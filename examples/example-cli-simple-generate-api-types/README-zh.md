[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# 使用 openapi-modifier 生成 API 类型的示例

本示例演示如何使用 `openapi-modifier` 修改 OpenAPI 规范并生成 TypeScript 类型。

## 示例说明

在本示例中，我们将：
1. 使用 `openapi-modifier` 修改输入的 OpenAPI 文件
2. 从修改后的 OpenAPI 文件生成 TypeScript 类型

## 项目结构

```
example-cli-simple-generate-api-types/
├── input/
│   └── openapi.yaml         # 输入的 OpenAPI 文件
├── output/
│   ├── openapi.yaml         # 修改后的 OpenAPI 文件
│   └── generated-api-types.d.ts  # 生成的 TypeScript 类型
├── openapi-modifier.config.ts    # openapi-modifier 配置
└── package.json             # 依赖和脚本
```

## 配置

`openapi-modifier.config.ts` 文件定义了以下修改规则：

1. 基础路径修改：
   - 从 API 路径中删除 `/api/external` 前缀

2. 端点过滤：
   - 删除所有包含 `/internal` 的路径

3. 删除未使用的组件：
   - 清理 API 中未使用的架构

## 使用方法

1. 安装依赖：
```bash
npm install
```

2. 运行修改和类型生成过程：
```bash
npm start
```

这将执行以下步骤：
1. 修改输入的 OpenAPI 文件（`prepare-input-openapi`）
2. 从修改后的文件生成 TypeScript 类型（`generate-api-types`）

## 结果

运行脚本后，将在 `output/` 目录中创建以下文件：
- `openapi.yaml` - 修改后的 OpenAPI 规范版本
- `generated-api-types.d.ts` - 生成的 TypeScript 类型

## 依赖项

- `openapi-modifier` - 用于修改 OpenAPI 规范
- `dtsgenerator` - 用于生成 TypeScript 类型 