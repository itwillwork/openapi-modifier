| Parameter                    | Description                                                              | Example               | Typing                | Default |
|-----------------------------|-----------------------------------------------------------------------|----------------------|--------------------------|-----------|
| `map`                       | [**required**] Path replacement dictionary                                     | `{"/api/v1": "/v1"}` | `Record<string, string>` | `{}`      |
| `ignoreOperarionCollisions` | Ignore endpoint collisions that occur after applying replacements | `true`               | `boolean`                | `false`        |


Configuration example:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "change-endpoints-basepath",
            config: {
               map: { 
                   '/public/api': '',
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
                   '/public/v1/service/api': '/api',
               }, 
               ignoreOperarionCollisions: false,
            },
        }
        // ... other rules
    ]
}
``` 