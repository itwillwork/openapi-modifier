[🇺🇸 English](./simple-text-file-modifier.md) | [🇷🇺 Русский](./simple-text-file-modifier-ru.md)  | [🇨🇳 中文](./simple-text-file-modifier-zh.md)

# Simple Text File Modifier

一个简单的文本文件修改工具。允许对文本文件执行基本操作，例如在文件开头或结尾添加文本，以及使用正则表达式替换文本。

## 动机和使用场景

例如，我们生成了 [API 类型定义](../examples/example-cli-generate-api-types/output/generated-api-types.d.ts)。
我们想明确地告诉其他开发人员：该文件不应手动修改，并将一些实体重命名为更具声明性的名称。
我们编写一个[配置文件](../examples/example-cli-generate-api-types/simple-text-file-modifier.config.ts)，描述所有需要的更改并附带解释性注释。
然后[使用此配置文件和 simple-text-file-modifier cli](../examples/example-cli-generate-api-types/package.json#L9)，我们得到[修改后的 API 类型定义文件](../examples/example-cli-generate-api-types/output/generated-api-types.d.ts)。

## 安装

```bash
npm install --save-dev openapi-modifier
```

## 使用方法

```bash
simple-text-file-modifier --input=input/file.txt --output=output/file.txt --config=simple-text-file-modifier.config.js
```

[使用示例](../examples/example-cli-generate-api-types/package.json#L9)

## 命令行参数

| 参数 | 描述                                                                                                 | 示例                                | 是否必需 |
| --------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------- | ------------ |
| **input** | 输入文件路径                                                                                    | `input/file.txt`                     | 是           |
| **output**| 输出文件路径                                                                                   | `output/file.txt`                    | 是           |
| **config**| 配置文件路径。支持的格式：js、ts、json、yaml、yml                               | `simple-text-file-modifier.config.js` | 否          |
| **verbose**| 启用详细输出                                                                                 | `--verbose`                          | 否          |

## 配置

配置文件可以包含以下参数：

| 参数     | 类型                                                             | 示例                                                                 | 描述                                                                                 |
| ------------ | --------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **addAfter** | `string`                                                        | `"WARNING! This file was auto-generated"`                              | 要添加到文件末尾的文本                                              |
| **addBefore**| `string`                                                        | `"/// <reference types=\"../../a\" />"`                                | 要添加到文件开头的文本                                             |
| **replace**  | `Array<{ searchValue: string \| RegExp; replaceValue: string }>`| `{ searchValue: /\ Components\./g, replaceValue: ' ApiComponents.' }`  | 替换数组。支持字符串和正则表达式                        |

## 配置示例

### JavaScript (simple-text-file-modifier.config.js)
```javascript
module.exports = {
    addBefore: "// This file was auto-generated. Do not edit manually.\n",
    addAfter: "\n// End of auto-generated file",
    replace: [
        {
            searchValue: /Components\./g,
            replaceValue: 'ApiComponents.'
        }
    ]
};
```

### TypeScript (simple-text-file-modifier.config.ts)
```typescript
export default {
    addBefore: "// This file was auto-generated. Do not edit manually.\n",
    addAfter: "\n// End of auto-generated file",
    replace: [
        {
            searchValue: /Components\./g,
            replaceValue: 'ApiComponents.'
        }
    ]
};
```

### JSON (simple-text-file-modifier.config.json)
```json
{
  "addBefore": "// This file was auto-generated. Do not edit manually.\n",
  "addAfter": "\n// End of auto-generated file",
  "replace": [
    {
      "searchValue": "Components.",
      "replaceValue": "ApiComponents."
    }
  ]
}
```

## 使用示例

### 在文件开头添加警告
```bash
simple-text-file-modifier --input=input/file.txt --output=output/file.txt --config=simple-text-file-modifier.config.js
```

其中 `simple-text-file-modifier.config.js` 包含：
```javascript
module.exports = {
    addBefore: "// WARNING: This file was auto-generated. Do not edit manually.\n"
};
```

### 替换文件中的文本
```bash
simple-text-file-modifier --input=input/file.txt --output=output/file.txt --config=simple-text-file-modifier.config.js
```

其中 `simple-text-file-modifier.config.js` 包含：
```javascript
module.exports = {
    replace: [
        {
            searchValue: /old\.namespace\./g,
            replaceValue: 'new.namespace.'
        }
    ]
};
```

## 注意事项

- 如果未指定 `--config` 参数，工具将查找名为 `simple-text-file-modifier.config` 的配置文件，支持扩展名：js、ts、json、yaml、yml
- 所有操作按顺序执行：先替换，然后添加文本到开头，最后 - 添加文本到文件末尾
- 在 JSON 配置中使用正则表达式时，需要将它们指定为字符串 