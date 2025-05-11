[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# remove-parameter

Removes a parameter from an endpoint in the OpenAPI specification



## Configuration

| Parameter | Description | Example                           | Typing | Default |
| -------- |-------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------|------------------------|-----------|
| `endpointDescriptor`  | [**required**] Description of the endpoint from which to remove the parameter | `"GET /pets"`   | `EndpointDescriptorConfig` | - |
| `parameterDescriptor`  | [**required**] Description of the parameter to remove. In the `in` parameter, you can specify: `"query"`, `"path"`, `"header"`, `"cookie"`. | `{"name": "petId", "in": "path"}` | `EndpointParameterDescriptorConfig` | - |

Configuration example:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "remove-parameter",
            config: {
                endpointDescriptor: "GET /pets/{petId}",
                parameterDescriptor: {
                    name: "version",
                    in: "query"
                }
            },
        }
        // ... other rules
    ]
}
```

**If you need to modify multiple specifications**, you can use this rule multiple times in the overall configuration pipeline.

## Motivation

<a name="custom_anchor_motivation_1"></a>
### 1. Need to remove an unused parameter from an endpoint to stop using it and remove it later

Practical example:

**In the `openapi.yaml` file**, the endpoint documentation looks like this:

```yaml
paths:
  /pets/{petId}:
    get:
      summary: Get pet by ID
      parameters:
        - name: petId
          in: path
          required: true
          schema:
            type: string
        - name: version
          in: query
          required: false
          schema:
            type: string
```

**Need to remove the unused parameter `version`.**

**In the configuration file** `openapi-modifier-config.js`, add the `remove-parameter` rule:

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-parameter",
            config: {
                endpointDescriptor: "GET /pets/{petId}",
                parameterDescriptor: {
                    name: "version",
                    in: "query"
                }
            },
        }
    ]
}
```

**After applying the rule**, the `openapi.yaml` file looks like this:

```yaml
paths:
  /pets/{petId}:
    get:
      summary: Get pet by ID
      parameters:
        - name: petId
          in: path
          required: true
          schema:
            type: string
```

<a name="custom_anchor_motivation_2"></a>
### 2. Need to remove a common parameter that interferes with TypeScript type generation

Practical example:

**In the `openapi.yaml` file**, there is a component with a parameter:

```yaml
components:
  parameters:
    ApiKeyHeader:
      name: X-API-Key
      in: header
      required: true
      schema:
        type: string
```

**Need to remove the `ApiKeyHeader` parameter component.**

**In the configuration file** `openapi-modifier-config.js`, add the `remove-parameter` rule:

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-parameter",
            config: {
                parameterDescriptor: {
                    name: "X-API-Key",
                    in: "header"
                }
            },
        }
    ]
}
```

**After applying the rule**, the `openapi.yaml` file looks like this:

```yaml
components:
  parameters: {}
```

## Important Notes

- If the endpoint or parameter is not found, the rule outputs a warning and leaves the specification unchanged, for timely updating of the openapi-modifier configuration
- The rule can be applied to parameters of any type (query, path, header, cookie)

## Useful Links

- [Rule usage examples in tests](./index.test.ts)  
 