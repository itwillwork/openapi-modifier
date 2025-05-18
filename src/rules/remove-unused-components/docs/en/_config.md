| Parameter    | Description                          | Example            | Type              | Default |
| -------- |-----------------------------------|-------------------|------------------------|-----------|
| `ignore`  | [**optional**] List of components or regular expressions to ignore during removal | `["NotFoundDTO", "/^Error.*/"]` | `Array<string \| RegExp>` | `[]` |
| `printDeletedComponents` | [**optional**] If true, prints the list of deleted components to console | `true` | `boolean` | `false` |

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

More detailed configuration example:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "remove-unused-components",
            config: {
                ignore: [
                    "NotFoundDTO",
                    /^Error.*/, // ignore all components starting with Error
                    /.*Response$/ // ignore all components ending with Response
                ],
                printDeletedComponents: true // print list of deleted components to console
            },
        }
        // ... other rules
    ]
} 
```