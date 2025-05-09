| Parameter | Description                          | Example                     | Type              | Default |
| -------- |-----------------------------------|----------------------------|------------------------|-----------|
| `ignore`  | [**optional**] List of operationIds to ignore | `["getPets", "createPet"]` | `string[]` | `[]` |

Configuration example:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "remove-operation-id",
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
            rule: "remove-operation-id",
            config: {
                ignore: ["getPets", "createPet"]
            },
        }
        // ... other rules
    ]
} 