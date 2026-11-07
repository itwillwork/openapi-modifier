CLI 参数：

| 选项     | 描述                                                                                                     | 示例                         | 默认值                                       |
| -------- | -------------------------------------------------------------------------------------------------------- | ---------------------------- |----------------------------------------------|
| `input`  | [**必填**] 输入文件，openapi 规范/文档                                                                   | `input/openapi.yml`          |                                              |
| `output` | [**必填**] 输出文件，openapi 规范/文档                                                                   | `output/openapi.yml`         |                                              |
| `config` | 配置文件路径。详细配置说明[见下方](#custom_anchor_config_parameters)                                      | `openapi-modifier.config.js` | `openapi-modifier.config.(js\ts\json\yaml\yml)` |
| `verbose` | 启用 trace 日志、每条规则执行后的差异输出，以及临时文件中的完整日志。优先于 `minLevel`。 | `--verbose` | `false` |
| `minLevel` | 最低控制台日志级别：`0` trace、`1` info、`2` not-important-warning、`3` warning、`4` error、`5` success。Trace 包含每条规则执行后的差异。 | `--minLevel 0` | `2`（除非在配置中指定） |
