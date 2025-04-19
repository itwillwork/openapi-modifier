# 使用 YAML 的 openapi-modifier 示例

本示例演示如何使用 `openapi-modifier` 库修改 YAML 格式的 OpenAPI 规范。

## 项目结构

```
example-package-openapi-yaml/
├── input/
│   └── openapi.yml      # 输入的 OpenAPI 规范文件
├── output/
│   └── openapi.yml      # 修改后的输出文件
├── generate.ts          # 修改脚本
└── package.json         # 项目依赖
```

## 安装

```bash
npm install
```

## 使用方法

1. 将您的 YAML 格式的 OpenAPI 规范放在 `input/openapi.yml` 目录中
2. 运行修改脚本：

```bash
npm start
```

3. 修改后的规范将保存到 `output/openapi.yml`

## 代码示例

此示例使用 `remove-operation-id` 规则从规范中删除所有 `operationId`：

```typescript
import { openapiModifier } from 'openapi-modifier';

(async () => {
  try {
    await openapiModifier({
      input: 'input/openapi.yml',
      output: 'output/openapi.yml',
      pipeline: [
        {
          rule: 'remove-operation-id',
          config: {
            ignore: [], // 您可以指定要保留的 operationId
          },
        },
      ],
    });

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
```

## 结果

运行脚本后，所有 `operationId` 将从规范中删除，同时保持文档其余结构不变。

## 依赖项

- openapi-modifier
- ts-node 