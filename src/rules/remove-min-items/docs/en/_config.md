| Parameter | Description | Example | Type | Default |
| --------- | ----------- | ------- | ---- | ------- |
| `showUnusedWarning` | [**optional**] Show a warning if no schemas with `minItems` are found | `true` | `boolean` | `false` |

Configuration example:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "remove-min-items",
            config: {} // remove minItems property from all schemas, don't show warnings
        }
        // ... other rules
    ]
}
```

Example of more detailed configuration:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "remove-min-items",
            config: {
                showUnusedWarning: true // show warning if no schemas with minItems are found in the specification
            }
        }
        // ... other rules
    ]
}
``` 