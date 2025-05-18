| Parameter                    | Description                                                              | Example               | Typing                | Default |
|-----------------------------|-----------------------------------------------------------------------|----------------------|--------------------------|-----------|
| `map`                       | [**required**] Map of path prefixes to replace                                     | `{"/api/v1": "/v1"}` | `Record<string, string>` | `{}`      |
| `ignoreOperationCollisions` | [**optional**] Whether to ignore operation collisions during path replacement | `true`               | `boolean`                | `false`        |


Configuration example:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "change-endpoints-basepath",
            config: {
               map: { 
                   '/public/api': '', // remove the /public/api prefix from all paths
               },
            },
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
            rule: "change-endpoints-basepath",
            config: {
               map: { 
                   '/public/v1/service/api': '/api', // replace the prefix /public/v1/service/api with /api
               }, 
               ignoreOperationCollisions: false, // do not ignore operation conflicts when replacing paths
            },
        }
        // ... other rules
    ]
}
``` 