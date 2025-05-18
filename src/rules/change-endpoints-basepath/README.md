[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# change-endpoints-basepath

Changes basepaths of endpoints according to the replacement dictionary



## Configuration

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

**If you need to modify multiple specifications**, you can use this rule multiple times in the overall configuration pipeline.

## Motivation

<a name="custom_anchor_motivation_1"></a>
### 1. Need to shorten the pathname for some (or all) endpoints

Practical example:

**In the `openapi.yaml` file**, the endpoint documentation looks like this:

```yaml
paths:
  /public/api/v1/pets:
    get:
      summary: List all pets
```
**We need to remove `/public/api` to shorten `/public/api/v1/pets` to `/v1/pets`.**

**In the configuration file** `openapi-modifier-config.js`, we add the `change-endpoints-basepath` rule:

```js
module.exports = {
    pipeline: [
        {
            rule: "change-endpoints-basepath",
            config: {
                map: { '/public/api': '' },
            },
        }
    ]
}
```

**After applying the rule**, the `openapi.yaml` file looks like this:

```yaml
paths:
  /v1/pets:
    get:
      summary: List all pets
```

## Important Notes

### About operation collision handling and the ignoreOperationCollisions parameter

The rule checks for operation collisions when changing paths. If a conflict occurs after path replacement (for example, two different endpoints become the same), the rule will throw an error.

Example of a collision:

```yaml
paths:
  /api/v1/pets:
    get:
      summary: List all pets
  /v1/pets:
    get:
      summary: Get pet by id
```

When trying to replace `/api/v1` with `/v1`, a conflict will occur as both endpoints will become `/v1/pets`.

In this case, you can:
1. Use `ignoreOperationCollisions: true` to ignore conflicts
2. Change the path replacement configuration to avoid conflicts
3. Modify conflicting endpoints beforehand

## Useful Links

- [Rule usage examples in tests](./index.test.ts)  
 