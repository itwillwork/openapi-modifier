Create a configuration file (e.g., `openapi-modifier.config.js` or `openapi-modifier.config.ts`) with the following structure:

```javascript
module.exports = {
    // (optional) Logger settings
    logger: {
        verbose: true, // Enable detailed logging
        minLevel: 0    // Minimum logging level: 0 - trace, 1 - debug, 2 - info, 3 - warn, 4 - error
    },
    // Path to input OpenAPI specification file
    input: './openapi.yaml',
    // Path to output file
    output: './modified-openapi.yaml',
    // Pipeline of rules to apply (see below for all available rules with configuration examples)
    pipeline: [
        {
            rule: "change-content-type",
            disabled: false, // (optional) Disable rule
            config: {
                map: {
                    "*/*": "application/json"
                }
            }
        }
        // Other rules...
    ]
}
```

> [!IMPORTANT]  
> Thanks to the pipeline structure of rules, you can:
> - edit the result of the previous stage with the next stage, thus building a sequence of necessary changes;
> - use rules as many times as needed and in the required sequence;
