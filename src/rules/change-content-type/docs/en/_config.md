| Parameter | Description                          | Example                     | Typing              | Default |
|----------|-----------------------------------|----------------------------|------------------------|-----------|
| `map`    | [**required**] Dictionary for content type replacements | `{"*/*": "application/json"}` | `Record<string, string>` | `{}`        |

Configuration example:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "change-content-type",
            config: {
                map: {
                    "*/*": "application/json"
                }
            },
        }
        // ... other rules
    ]
}
``` 