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
            config: {} // remove all operationId attributes from endpoints
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
            rule: "remove-operation-id",
            config: {
                ignore: ["getPets", "createPet"], // keep operationId for this endpoint
            },
        }
        // ... other rules
    ]
} 
```