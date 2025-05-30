[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# remove-operation-id

Removes operationId from all operations in the OpenAPI specification, except those specified in the ignore list



## Configuration

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

**If you need to modify multiple specifications**, you can use this rule multiple times in the overall configuration pipeline.

## Motivation

<a name="custom_anchor_motivation_1"></a>
### 1. Need to remove operationId from all operations for TypeScript type generation

Practical example:

**In the `openapi.yaml` file**, the endpoint documentation looks like this:

```yaml
paths:
  /pets:
    get:
      operationId: getPets
      summary: List all pets
      responses:
        200:
          content:
            'application/json':
              schema:
                type: 'object'
```

**We need to remove operationId from all operations.**

**In the configuration file** `openapi-modifier-config.js`, we add the `remove-operation-id` rule:

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-operation-id",
            config: {
                ignore: []
            },
        }
    ]
}
```

**After applying the rule**, the `openapi.yaml` file looks like this:

```yaml
paths:
  /pets:
    get:
      summary: List all pets
      responses:
        200:
          content:
            'application/json':
              schema:
                type: 'object'
```

## Important Notes

- If an endpoint is not found, the rule outputs a warning and leaves the specification unchanged, for timely updating of the openapi-modifier configuration

## Useful Links

- [Rule usage examples in tests](./index.test.ts)  

- [DeepWiki Documentation](https://deepwiki.com/itwillwork/openapi-modifier)
- [Context7 documentation for LLMs and AI code editors](https://context7.com/itwillwork/openapi-modifier)