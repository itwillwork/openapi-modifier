{{{langSwitcher}}}

# 添加新规则

您需要在 `src/rules` 目录中添加一个以新创建规则命名的文件夹，包含 6 个文件：

- `index.ts` - 包含规则逻辑的主文件 - 必须导出：`processor`（默认导出）和 `configSchema`（命名导出）
- `index.test.ts` - 规则测试，覆盖所有配置字段和使用示例
- `/docs/{lang}/_description.md` - 包含规则描述的文件
- `/docs/{lang}/_motivation.md` - 包含规则动机描述和示例的文件（在实践中哪些情况下可能有用）
- `/docs/{lang}/_config.md` - 包含规则配置描述的文件

有关调试所需的详细日志，[请参阅"调试"部分](#custom_anchor_debug)。

所有规则名称必须以动作标识开头。

## 项目结构

```
src/
├── cli/          # CLI 接口
├── config.ts     # 配置和验证
├── core/         # 核心逻辑
├── logger/       # 日志系统
├── openapi.ts    # OpenAPI 文件处理
├── rules/        # 修改规则
└── index.ts      # 入口点
```

## 开发

### 安装依赖

```bash
npm install
```

### 构建

```bash
npm run build
```

### 测试

```bash
npm test
```

### 附加命令

- `npm run clear` - 清理构建目录
- `npm run format` - 代码格式化
- `npm run tools:generate-readme` - 文档生成
- `npm run tools:generate-rule-types` - 规则类型生成

<a name="custom_anchor_debug"></a>

## 调试

{{{debugging}}} 