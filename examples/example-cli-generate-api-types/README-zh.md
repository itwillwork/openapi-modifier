# 使用 openapi-modifier 生成 API 类型的示例

本示例演示如何使用 `openapi-modifier` 修改 OpenAPI 规范并生成 TypeScript 类型。

## 说明

在本示例中，我们将：
1. 使用 `openapi-modifier` 修改输入的 OpenAPI 规范
2. 从修改后的规范生成 TypeScript 类型
3. 修补生成的类型以改善其结构

## 安装

```bash
npm install
```

## 项目结构

```
.
├── input/                      # 输入文件目录
│   └── openapi.yaml           # 原始 OpenAPI 规范
├── output/                     # 输出文件目录
│   ├── openapi.yaml           # 修改后的 OpenAPI 规范
│   └── generated-api-types.d.ts # 生成的 TypeScript 类型
├── openapi-modifier.config.ts  # openapi-modifier 配置
└── simple-text-file-modifier.config.ts # 类型修补配置
```

## 脚本

在 `package.json` 中定义了以下脚本：

- `prepare-input-openapi` - 修改输入的 OpenAPI 规范
- `generate-api-types` - 从修改后的规范生成 TypeScript 类型
- `patch-api-types` - 修补生成的类型
- `start` - 按顺序运行所有脚本
- `download-input-openapi` - 下载示例 OpenAPI 规范

## openapi-modifier 配置

`openapi-modifier.config.ts` 文件定义了以下修改：

1. 与其他 OpenAPI 规范合并
2. 更改端点基础路径
3. 过滤内部路径
4. 删除已弃用的参数
5. 修复参数文档
6. 修补架构
7. 删除已弃用的端点
8. 优化类型生成器

## 类型修补配置

`simple-text-file-modifier.config.ts` 文件定义了以下更改：

1. 添加自动生成警告
2. 将 `Components` 命名空间重命名为 `ApiComponents`
3. 将 `Paths` 命名空间重命名为 `ApiEndpoints`

## 使用方法

运行完整的类型生成过程：

```bash
npm run start
```

这将按顺序执行所有步骤：
1. OpenAPI 规范修改
2. TypeScript 类型生成
3. 生成类型修补

## 结果

运行脚本后，将在 `output/` 目录中创建以下文件：
- 修改后的 OpenAPI 规范（`openapi.yaml`）
- 应用修补后的生成 TypeScript 类型（`generated-api-types.d.ts`） 