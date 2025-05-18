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
                    "*/*": "application/json" // replace all content types with application/json
                }
            },
        }
        // ... other rules
    ]
}
```

More detailed configuration example:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "change-content-type",
            config: {
                map: {
                    "application/xml": "application/json", // replace application/xml with application/json
                    "text/plain": "application/json", // replace text/plain with application/json
                    "*/*": "application/json" // replace all other content types with application/json
                }
            },
        }
        // ... other rules
    ]
}
``` 