| Parameter | Description                          | Example            | Type              | Default |
| -------- |-----------------------------------|-------------------|------------------------|-----------|
| `ignore`  | [**optional**] List of components to ignore during removal | `["NotFoundDTO"]` | `Array<string>` | `[]` |

Configuration example:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "remove-unused-components",
            config: {},
        }
        // ... other rules
    ]
}
```

Example of a more detailed configuration:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "remove-unused-components",
            config: {
                ignore: [
                    "NotFoundDTO"
                ]
            },
        }
        // ... other rules
    ]
} 
```