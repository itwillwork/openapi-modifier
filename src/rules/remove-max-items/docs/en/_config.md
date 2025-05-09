| Parameter | Description | Example | Type | Default |
| --------- | ----------- | ------- | ---- | ------- |
| `showUnusedWarning` | [**optional**] Show a warning if no schemas with maxItems are found | `true` | `boolean` | `false` |

Configuration example:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "remove-max-items",
            config: {},
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
            rule: "remove-max-items",
            config: {
                showUnusedWarning: true
            },
        }
        // ... other rules
    ]
}
``` 