Internally uses the npm package [debug](https://www.npmjs.com/package/debug) for detailed logging

To output all debug logs:

```bash
DEBUG=openapi-modifier:* openapi-modifier
```

To output debug logs for a specific rule, for example for the `remove-operation-id` rule:

```bash
DEBUG=openapi-modifier:rule:remove-operation-id openapi-modifier
``` 