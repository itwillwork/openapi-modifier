内部使用 npm 包 [debug](https://www.npmjs.com/package/debug) 进行详细日志记录

输出所有调试日志：

```bash
DEBUG=openapi-modifier:* openapi-modifier
```

输出特定规则的调试日志，例如 `remove-operation-id` 规则：

```bash
DEBUG=openapi-modifier:rule:remove-operation-id openapi-modifier
``` 