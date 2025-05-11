[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# OpenAPI Modifier

A tool for modifying OpenAPI specifications using customizable rules.

This package allows you to automate the process of modifying OpenAPI specifications by applying a set of predefined rules.

## Key Features

- Modification of OpenAPI specifications in YAML and JSON formats
- Flexible rule system for specification changes
- Support for both CLI and programmatic usage with TypeScript support

> [!IMPORTANT]  
> Supports OpenAPI 3.1, 3.0. We haven't tested OpenAPI 2 support as the format is deprecated and we recommend migrating your documentation to OpenAPI 3.0.

## Motivation and Use Cases

OpenAPI describing backend API is not always perfect: it may contain errors, inaccuracies, or certain features that break other tools, such as code generation or type generation.

Storing information about changes in a declarative format to maintain context and relevance of each change is especially useful in large teams.

<details>
  <summary><b>Other Use Cases</b></summary>

### Other Use Cases:

- Backend developer asks to check if a field is used in some entity;
- Backend developer asks to check if a parameter is used in some endpoint;
- Backend developer creates a task to stop using an endpoint;
- Backend developer wrote a new API in development, but it's not in the documentation;
- Backend developer asks to stop using a parameter in an endpoint;
- Invalid OpenAPI (e.g., used non-existent type int);
- Need to preserve modification knowledge (it's important for colleagues to know why a field is blocked);
- Need to monitor API changes and adjust config in time (removed endpoint usage);
- Remove deprecated fields from openapi (to timely notice API capabilities that will be removed);

</details>

<details>
  <summary><b>Usage Demonstration</b></summary>

<a name="custom_anchor_demo"></a>

### Usage Demonstration

For example, we have an [input specification/documentation file](./examples/example-cli-generate-api-types/input/openapi.yaml) from backend developers. For example, [downloaded via curl cli from github](./examples/example-cli-generate-api-types/package.json#L11).

We write a [configuration file](./examples/example-cli-generate-api-types/openapi-modifier.config.ts) describing all changes needed in the original specification/documentation with explanatory comments:

```ts
const config: ConfigT = {
    pipeline: [
        // JIRA-10207 - new feature API for epic JIRA-232
        {
            rule: 'merge-openapi-spec',
            config: {
                path: 'input/feature-openapi-JIRA-232.yaml',
            },
        },

        // ...

        // JIRA-10212 - wrong docs, waiting JIRABACKEND-8752
        {
            rule: 'patch-schemas',
            config: [
                {
                    descriptor: {
                        type: 'component-schema',
                        componentName: 'Pet',
                    },
                    patchMethod: 'merge',
                    schemaDiff: {
                        properties: {
                            id: {
                                type: 'string',
                                format: 'uuid',
                            },
                        },
                    },
                },
            ],
        },

        // ...

        // JIRA-11236 - removed deprecated endpoint, waiting JIRABACKEND-3641
        {
            rule: 'filter-endpoints',
            config: {
                disabled: [
                    {
                        path: '/v1/pets/{petId}',
                        method: 'delete',
                    },
                ],
            },
        },

        // ...
}
```

Then [using this configuration file and openapi-modifier cli](./examples/example-cli-generate-api-types/package.json#L7), we modify the original specification/documentation file and get a [modified specification/documentation](./examples/example-cli-generate-api-types/output/openapi.yaml).

Then using, for example, the [dtsgenerator](https://github.com/horiuchi/dtsgenerator) cli, we generate [API typing file](./examples/example-cli-generate-api-types/output/generated-api-types.d.ts) from the modified specification/documentation, which we then use in the project code.

[Complete example code](./examples/example-cli-generate-api-types)

</details>

## Installation

```bash
npm install --save-dev openapi-modifier
```

## Usage

<a name="custom_anchor_cli_npx_usage"></a>

### CLI via NPX

```shell
npx openapi-modifier --input=input/openapi.yml --output=output/openapi.yml --config=openapi-modifier.config.js
```

[Example of using as CLI via NPX](./examples/example-cli-simple-npx/package.json#L6)

CLI parameters:

| Option   | Description                                                                                              | Example                      | Default                                      |
| -------- | -------------------------------------------------------------------------------------------------------- | ---------------------------- |----------------------------------------------|
| `input`  | [**required**] input file, openapi specification/documentation                                          | `input/openapi.yml`          |                                              |
| `output` | [**required**] output file, openapi specification/documentation                                         | `output/openapi.yml`         |                                              |
| `config` | path to the configuration file. For detailed configuration description [see below](#custom_anchor_config_parameters) | `openapi-modifier.config.js` | `openapi-modifier.config.(js\ts\json\yaml\yml)` | 

For more details about the configuration file, [see below](#custom_anchor_config_parameters)

If the configuration path is not specified, the default configuration is taken from the `openapi-modifier.config.js` file relative to the launch directory.

You can use configs with the following extensions: `.ts`, `.js`, `.yaml`, `.yml`, `.json`. 

<a name="custom_anchor_cli_usage"></a>

### CLI

```shell
npm i --save-dev openapi-modifier

openapi-modifier --input=input/openapi.yml --output=output/openapi.yml --config=openapi-modifier.config.js
```

[Example of using as CLI](./examples/example-cli-openapi-yaml/package.json#L7)

CLI parameters:

| Option   | Description                                                                                              | Example                      | Default                                      |
| -------- | -------------------------------------------------------------------------------------------------------- | ---------------------------- |----------------------------------------------|
| `input`  | [**required**] input file, openapi specification/documentation                                          | `input/openapi.yml`          |                                              |
| `output` | [**required**] output file, openapi specification/documentation                                         | `output/openapi.yml`         |                                              |
| `config` | path to the configuration file. For detailed configuration description [see below](#custom_anchor_config_parameters) | `openapi-modifier.config.js` | `openapi-modifier.config.(js\ts\json\yaml\yml)` | 

For more details about the configuration file, [see below](#custom_anchor_config_parameters)

If the configuration path is not specified, the default configuration is taken from the `openapi-modifier.config.js` file relative to the launch directory.

You can use configs with the following extensions: `.ts`, `.js`, `.yaml`, `.yml`, `.json`. 

<a name="custom_anchor_package_usage"></a>

### Programmatic Usage

```typescript
import { openapiModifier } from 'openapi-modifier';

(async () => {
    try {
        await openapiModifier({
            input: 'input/openapi.yml',
            output: 'output/openapi.yml',
            pipeline: [
                {
                    rule: 'remove-operation-id',
                    config: {
                        ignore: [],
                    },
                },
            ],
        });

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();
```

[Example of programmatic usage](./examples/example-package-openapi-yaml/generate.ts)

<a name="custom_anchor_config_parameters"></a>

## Configuration

Create a configuration file (e.g., `openapi-modifier.config.js` or `openapi-modifier.config.ts`) with the following structure:

```javascript
module.exports = {
    // (optional) Logger settings
    logger: {
        verbose: true, // Enable detailed logging
        minLevel: 0    // Minimum logging level: 0 - trace, 1 - debug, 2 - info, 3 - warn, 4 - error
    },
    // Path to input OpenAPI specification file
    input: './openapi.yaml',
    // Path to output file
    output: './modified-openapi.yaml',
    // Pipeline of rules to apply (see below for all available rules with configuration examples)
    pipeline: [
        {
            rule: "change-content-type",
            disabled: false, // (optional) Disable rule
            config: {
                map: {
                    "*/*": "application/json"
                }
            }
        }
        // Other rules...
    ]
}
```

> [!IMPORTANT]  
> Thanks to the pipeline structure of rules, you can:
> - edit the result of the previous stage with the next stage, thus building a sequence of necessary changes;
> - use rules as many times as needed and in the required sequence;

<a name="custom_anchor_rule_table"></a>

## Available Rules

| Rule | Short Description |
|------------------------------------------------------------------| ---- | | [change-content-type](./src/rules/change-content-type/README.md) | Changes content types in the OpenAPI specification according to the replacement dictionary |
| [change-endpoints-basepath](./src/rules/change-endpoints-basepath/README.md) | Changes basepaths of endpoints according to the replacement dictionary |
| [filter-by-content-type](./src/rules/filter-by-content-type/README.md) | The rule allows filtering content types in the OpenAPI specification. It enables explicit specification of which content types should be kept or removed from the specification. The rule applies to all API components, including requests, responses, and common components. |
| [filter-endpoints](./src/rules/filter-endpoints/README.md) | The rule allows filtering endpoints in the OpenAPI specification based on their paths and methods. It enables explicit specification of which endpoints should be kept or removed from the specification. The rule supports both exact matching and regular expression-based filtering. |
| [merge-openapi-spec](./src/rules/merge-openapi-spec/README.md) | Merges two OpenAPI specifications into one. Allows merging the current specification with an additional specification from a specified file. Supports working with files in JSON and YAML formats. |
| [patch-component-schema](./src/rules/patch-component-schema/README.md) | This rule allows modifying the component schema in the OpenAPI specification. |
| [patch-endpoint-parameter-schema](./src/rules/patch-endpoint-parameter-schema/README.md) | The rule allows modifying the schema of endpoint parameters in the OpenAPI specification. |
| [patch-endpoint-request-body-schema](./src/rules/patch-endpoint-request-body-schema/README.md) | Rule for modifying the request body schema in OpenAPI specification. Allows to modify the request schema for a specified endpoint. |
| [patch-endpoint-response-schema](./src/rules/patch-endpoint-response-schema/README.md) | The rule allows modifying the response schema for endpoints in the OpenAPI specification. |
| [patch-endpoint-schema](./src/rules/patch-endpoint-schema/README.md) | The rule allows modifying the entire endpoint schema in the OpenAPI specification. Unlike other patching rules that work with individual parts of the endpoint (parameters, request body, responses), this rule can modify the entire endpoint structure, including all its components. |
| [remove-deprecated](./src/rules/remove-deprecated/README.md) | The rule allows removing deprecated elements from the OpenAPI specification. It can remove deprecated components, endpoints, parameters, and properties, while providing the ability to ignore specific elements and display descriptions of removed elements. |
| [remove-max-items](./src/rules/remove-max-items/README.md) | Removes the `maxItems` property from all schemas in the OpenAPI specification. |
| [remove-min-items](./src/rules/remove-min-items/README.md) | Removes the `minItems` property from all schemas in the OpenAPI specification. |
| [remove-operation-id](./src/rules/remove-operation-id/README.md) | Removes operationId from all operations in the OpenAPI specification, except those specified in the ignore list |
| [remove-parameter](./src/rules/remove-parameter/README.md) | Removes a parameter from an endpoint in the OpenAPI specification |
| [remove-unused-components](./src/rules/remove-unused-components/README.md) | Removes unused components from the OpenAPI specification. The rule analyzes all component references in the document and removes those that are not used anywhere. |


<a name="custom_anchor_rules_description"></a>

## Brief Rule Descriptions

<a name="custom_anchor_rule_change-content-type"></a>

### change-content-type

Changes content types in the OpenAPI specification according to the replacement dictionary

#### Config

| Parameter | Description                          | Example                     | Typing              | Default |
|----------|-----------------------------------|----------------------------|------------------------|-----------|
| `map`    | [**required**] Dictionary for content type replacements | `{"*/*": "application/json"}` | `Record<string, string>` | `{}`        |

Configuration example:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "change-content-type",
            config: {
                map: {
                    "*/*": "application/json"
                }
            },
        }
        // ... other rules
    ]
}
```

[More details about rule change-content-type](./src/rules/change-content-type/README.md) 

----------------------

<a name="custom_anchor_rule_change-endpoints-basepath"></a>

### change-endpoints-basepath

Changes basepaths of endpoints according to the replacement dictionary

#### Config

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

[More details about rule change-endpoints-basepath](./src/rules/change-endpoints-basepath/README.md) 

----------------------

<a name="custom_anchor_rule_filter-by-content-type"></a>

### filter-by-content-type

The rule allows filtering content types in the OpenAPI specification. It enables explicit specification of which content types should be kept or removed from the specification. The rule applies to all API components, including requests, responses, and common components.

#### Config

| Parameter  | Description                                          | Example                | Type           | Default |
|------------|------------------------------------------------------|------------------------|----------------|---------|
| `enabled`  | [**optional**] List of allowed content types. If not specified, all types not listed in `disabled` are kept | `['application/json']` | `Array<string>` |         |
| `disabled` | [**optional**] List of forbidden content types       | `['multipart/form-data']` | `Array<string>` |         |

Configuration examples:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "filter-by-content-type",
            config: {
                enabled: ['application/json'],
            },
        }
        // ... other rules
    ]
}
```

or

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "filter-by-content-type",
            config: {
                disabled: ['multipart/form-data'],
            },
        }
        // ... other rules
    ]
}
```

[More details about rule filter-by-content-type](./src/rules/filter-by-content-type/README.md) 

----------------------

<a name="custom_anchor_rule_filter-endpoints"></a>

### filter-endpoints

The rule allows filtering endpoints in the OpenAPI specification based on their paths and methods. It enables explicit specification of which endpoints should be kept or removed from the specification. The rule supports both exact matching and regular expression-based filtering.

#### Config

> [!IMPORTANT]  
> The rule works either in enabled mode - filtering endpoints from the specification (when either `enabled` or `enabledPathRegExp` is specified in the configuration), or in disabled mode - excluding endpoints from the specification (when either `disabled` or `disabledPathRegExp` is specified in the configuration)

| Parameter             | Description                                                                                                                                                                               | Example                | Typing          | Default         |
|----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------|-----------------|-----------------|
| `enabled`            | List of endpoints to keep | `[{"method": "GET", "path": "/pets"}]` | `Array<string \ { path: string; method: string }>` | - |
| `enabledPathRegExp`  | List of regular expressions for paths to keep | `[/^\/api\/v1/]` | `Array<RegExp>` | - |
| `disabled`           | List of endpoints to exclude | `[{"method": "POST", "path": "/pets"}]` | `Array<string \ { path: string; method: string }>` | - |
| `disabledPathRegExp` | List of regular expressions for paths to exclude | `[/^\/internal/]` | `Array<RegExp>` | - |
| `printIgnoredEndpoints` | Whether to output information about excluded endpoints to the log | `true` | `boolean` | `false` |

Configuration examples:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "filter-endpoints",
            config: {
                enabled: [
                    'GET /foo/ping'
                ],
            },
        }
        // ... other rules
    ]
}
```

or

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "filter-endpoints",
            config: {
                enabledPathRegExp: [
                    /\/public/
                ],
            },
        }
        // ... other rules
    ]
}
```

or

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "filter-endpoints",
            config: {
                disabled: [
                    'GET /foo/ping'
                ],
            },
        }
        // ... other rules
    ]
}
```

or

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "filter-endpoints",
            config: {
                disabledPathRegExp: [
                    /\/internal/
                ],
                printIgnoredEndpoints: true,
            },
        }
        // ... other rules
    ]
}

[More details about rule filter-endpoints](./src/rules/filter-endpoints/README.md) 

----------------------

<a name="custom_anchor_rule_merge-openapi-spec"></a>

### merge-openapi-spec

Merges two OpenAPI specifications into one. Allows merging the current specification with an additional specification from a specified file. Supports working with files in JSON and YAML formats.

#### Config

| Parameter                   | Description                                                                                                                                                                                                                                                                                                                                       | Example                                      | Type     | Default   |
|----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------|----------|-----------|
| `path`                     | [**required**] Path to the OpenAPI configuration that needs to be merged into the current specification. The path can be relative (relative to package.json location) or absolute (e.g., obtained via `__dirname` relative to config location). Supported formats: `*.json`, `*.yml`, `*.yaml`.                                                    | `temp-openapi-specs/new-list-endpoints.yaml` | `string` |           |
| `ignoreOperarionCollisions`| When merging multiple specifications, conflicts may occur when there are identical endpoints. By default, the tool prohibits merging if collisions are found to prevent unexpected changes in the source specification. This setting allows you to ignore conflicts and merge specifications anyway.                                                | `true`                                       | `boolean` | `false`   |
| `ignoreComponentCollisions`| When merging multiple specifications, conflicts may occur when there are identical common components. By default, the tool prohibits merging if collisions are found to prevent unexpected changes in the source specification. This setting allows you to ignore conflicts and merge specifications anyway.                                         | `true`                                       | `boolean` | `false`   |

> [!IMPORTANT]
> **If you need to merge multiple specifications**, you can use this rule multiple times in the general pipeline configuration.

Configuration examples:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "merge-openapi-spec",
            config: {
                path: 'temp-openapi-specs/new-list-endpoints.yaml',
            },
        }
        // ... other rules
    ]
}
```

or

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "merge-openapi-spec",
            config: {
                path: __dirname + '../temp-openapi-specs/new-list-endpoints.json',
                ignoreOperarionCollisions: true,
                ignoreComponentCollisions: true,
            },
        }
        // ... other rules
    ]
}

[More details about rule merge-openapi-spec](./src/rules/merge-openapi-spec/README.md) 

----------------------

<a name="custom_anchor_rule_patch-component-schema"></a>

### patch-component-schema

This rule allows modifying the component schema in the OpenAPI specification.

#### Config

| Parameter | Description | Example | Typing | Default |
| -------- |------------------------------------------------------------------------------------------|------------------------------------------------------------------------------|-------------------------------------------|-----------------------------------------|
| `descriptor` | [**required**] Description of the component to modify. [Learn more about the differences between simple and object component descriptors with correction](./docs/descriptor.md) | `"Pet.name"` or `{"componentName": "Pet", "correction": "properties.name"}` | `string \ { componentName: string; correction: string }` | - |
| `patchMethod` | Patch application method. [Learn more about the differences between merge and deepmerge methods](./docs/merge-vs-deepmerge.md) | `"merge"` | `"merge" \ "deepmerge"` | `"merge"` |
| `schemaDiff` | [**required**] Schema for patching. [Detailed examples of OpenAPI specifications](./docs/schema-diff.md) | `{"type": "string", "description": "New description"}` | `OpenAPISchema` | - |

> [!IMPORTANT]
> Nuances of setting the `descriptor` parameter:
> - Following $refs is not supported. Because it may cause unintended changes in shared components, and thus create unexpected changes elsewhere in the specification. In this case, it's better to modify the entity referenced by $ref directly;
> - If you need to traverse array elements - you need to specify `[]` in the `descriptor`, for example, `TestSchemaDTO[].test`
> - If you need to traverse oneOf, allOf, anyOf, you need to specify `oneOf[{number}]`, `allOf[{number}]` or `anyOf[{number}]` in the `descriptor`, for example, `TestObjectDTO.oneOf[1].TestSchemaDTO`, `TestObjectDTO.allOf[1].TestSchemaDTO` or `TestObjectDTO.anyOf[1].TestSchemaDTO`;

Configuration example:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "patch-component-schema",
            config: {
                descriptor: 'TestDTO',
                schemaDiff: {
                    type: 'string',
                },
            },
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
            rule: "patch-component-schema",
            config: {
                descriptor: 'TestObjectDTO.oneOf[0].TestArraySchemaDTO[]',
                schemaDiff: {
                    type: 'string',
                    enum: ['foo', 'bar'],
                },
                patchMethod: 'deepmerge',
            },
        }
        // ... other rules
    ]
}

[More details about rule patch-component-schema](./src/rules/patch-component-schema/README.md) 

----------------------

<a name="custom_anchor_rule_patch-endpoint-parameter-schema"></a>

### patch-endpoint-parameter-schema

The rule allows modifying the schema of endpoint parameters in the OpenAPI specification.

#### Config

| Parameter             | Description                                                                                                               | Example                                                                                                                                                                | Typing                                                                              | Default      |
|-----------------------|------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|--------------|
| `endpointDescriptor`  | [**required**] Specifies which endpoint's request parameter schema needs to be changed.                                   | `'GET /api/list'`                                                                                                                                                      | `string \ { path: string; method: string }`                                                                            |              |
| `parameterDescriptor` | [**required**] Specifies which request parameter, referenced by `endpointDescriptor`, needs to be changed.         | `'TestSchemaDTO'`, `'TestSchemaDTO.test'`, `'TestSchemaDTO[].testField'`,  `'TestObjectDTO.oneOf[1]'`, `'TestObjectDTO.allOf[1]'` or  `'TestObjectDTO.anyOf[1].testField'` | `string`                                                                            |              |
| `schemaDiff`          | Changes for the parameter schema [Detailed OpenAPI Specification Examples](./docs/schema-diff.md)                                                              | `{type: "number"}`                                                                                                                                                     | `OpenAPISchema`                                                                     |              |
| `objectDiff`          | Changes for the parameter itself                                                                                         | `{ required: true }`                                                                                                                                                   | `{name?: string; in?: 'query' / 'header' / 'path' / 'cookie'; required?: boolean;}` |              |
| `patchMethod`         | Method for applying changes specified in `objectDiff` and `schemaDiff`. [More about differences between merge and deepmerge methods](./docs/merge-vs-deepmerge.md) | `"merge"` | `"merge" \ "deepmerge"` | `"merge"` |

Configuration example:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "patch-endpoint-parameter-schema",
            config: {
                endpointDescriptor: 'GET /api/list',
                parameterDescriptor: {
                    name: 'test',
                    in: 'query',
                },
                schemaDiff: {
                    enum: ['foo', 'bar'],
                }
            },
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
            rule: "patch-endpoint-parameter-schema",
            config: {
                endpointDescriptor: 'GET /api/list',
                parameterDescriptor: {
                    name: 'test',
                    in: 'path',
                },
                schemaDiff: {
                    type: 'string',
                    enum: ['foo', 'bar'],
                },
                objectDiff: {
                    name: 'newTest',
                    in: 'query',
                    required: true,
                },
                patchMethod: 'deepmerge',
            },
        }
        // ... other rules
    ]
}

[More details about rule patch-endpoint-parameter-schema](./src/rules/patch-endpoint-parameter-schema/README.md) 

----------------------

<a name="custom_anchor_rule_patch-endpoint-request-body-schema"></a>

### patch-endpoint-request-body-schema

Rule for modifying the request body schema in OpenAPI specification. Allows to modify the request schema for a specified endpoint.

#### Config

| Parameter                    | Description                                                                                                                                                | Example                                                                                                                                                               | Type      | Default |
|-----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|-----------|
| `endpointDescriptor`        | [**required**] Specifies which endpoint's request parameter schema should be modified.                                                                    | `'GET /api/list'`                                                                                                                                                    | `string \ { path: string; method: string }`       |           |
| `contentType`               | Specifies which request type (content-type) of the endpoint should be modified. If not specified, all request types will be modified. | `'application/json'`                                                                                                                                                 | `string`       |  |
| `correction`                | Path to the field in the schema for modification                                                                                                                     | `"name"` | `string` | - |
| `schemaDiff`                | [**required**] Changes to apply to the schema. [Detailed examples of OpenAPI specifications](./docs/schema-diff.md)                                                                                                                          | `{type: "number"}`                                                                                                 | `OpenAPISchema` |           |
| `patchMethod`               | Method for applying changes [Learn more about differences between merge and deepmerge methods](./docs/merge-vs-deepmerge.md) | `"merge"` | `"merge" \ "deepmerge"` | `"merge"` |

Configuration examples:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "patch-endpoint-request-body-schema",
            config: {
                endpointDescriptor: 'POST /api/order',
                correction: "status",
                schemaDiff: {
                    enum: ['foo', 'bar'],
                },
            },
        }
        // ... other rules
    ]
}
```

or

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "patch-endpoint-request-body-schema",
            config: {
                endpointDescriptor: 'POST /api/order',
                contentType: "application/json",
                schemaDiff: {
                    properties: {
                        testField: {
                            type: 'number',
                        },
                    },
                },
                patchMethod: "deepmerge"
            },
        }
        // ... other rules
    ]
}
```

or

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "patch-endpoint-request-body-schema",
            config: {
                endpointDescriptor: 'POST /api/orders',
                correction: '[].status',
                schemaDiff: {
                    enum: ['foo', 'bar'],
                },
                patchMethod: "deepmerge"
            },
        }
        // ... other rules
    ]
}
```

[More details about rule patch-endpoint-request-body-schema](./src/rules/patch-endpoint-request-body-schema/README.md) 

----------------------

<a name="custom_anchor_rule_patch-endpoint-response-schema"></a>

### patch-endpoint-response-schema

The rule allows modifying the response schema for endpoints in the OpenAPI specification.

#### Config

| Parameter             | Description                                                                                                                                         | Example                                                                                                                                                                  | Type            | Default   |
|----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------|-----------|
| `endpointDescriptor` | [**required**] Specifies which endpoint's response schema should be modified.                                                                       | `'GET /api/list'`                                                                                                                                                        | `string \ { path: string; method: string }`        |           |
| `correction`         | Path to the schema property for modification                                                                                                        | `"status"`                                                                                                                                                               | `string`        | -         |
| `code`               | Specifies which response status code to apply the change to. If not specified, will be applied to the first 2xx response.                          | `200`                                                                                                                                                                    | `number`        |           |
| `contentType`        | Specifies which response type (content-type) of the endpoint to apply the change to. If not specified, all response types will be modified.        | `'application/json'`                                                                                                                                                     | `string`        |           |
| `schemaDiff`         | [**required**] Required changes in OpenAPI format. [Detailed OpenAPI specification examples](./docs/schema-diff.md)    | `{type: "number"}`                                                                                         | `OpenAPISchema` |           |
| `patchMethod`        | Method for applying changes [Learn more about differences between merge and deepmerge methods](./docs/merge-vs-deepmerge.md) | `"merge"` | `"merge" \ "deepmerge"` | `"merge"` |

Configuration example:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "patch-endpoint-response-schema",
            config: {
                endpointDescriptor: 'GET /api/list',
                correction: '[].status',
                schemaDiff: {
                    enum: ['foo', 'bar'],
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
            rule: "patch-endpoint-response-schema",
            config: {
                endpointDescriptor: 'GET /api/list',
                correction: '[].status',
                code: 200,
                contentType: 'application/json',
                schemaDiff: {
                    enum: ['foo', 'bar'],
                },
                patchMethod: 'deepmerge'
            },
        }
        // ... other rules
    ]
}

[More details about rule patch-endpoint-response-schema](./src/rules/patch-endpoint-response-schema/README.md) 

----------------------

<a name="custom_anchor_rule_patch-endpoint-schema"></a>

### patch-endpoint-schema

The rule allows modifying the entire endpoint schema in the OpenAPI specification. Unlike other patching rules that work with individual parts of the endpoint (parameters, request body, responses), this rule can modify the entire endpoint structure, including all its components.

#### Config

| Parameter                      | Description                                            | Example | Typing     | Default       |
|--------------------------------|--------------------------------------------------------|---------|------------|---------------|
| `endpointDescriptor`           | [**required**] Endpoint description for patching       | `{ path: "/pets", method: "get" }` | `{ path: string, method: string }` | -             |
| `endpointDescriptorCorrection` | Path to a specific field in the endpoint schema for patching | `"responses.200.content.application/json.schema"` | `string` | -             |
| `schemaDiff`                   | [**required**] Required changes in OpenAPI format. [Detailed OpenAPI specification examples](./docs/schema-diff.md)              | `{ type: "object", properties: { ... } }` | `OpenAPISchema` | -             |
| `patchMethod`                  | Method for applying changes [Learn more about differences between merge and deepmerge methods](./docs/merge-vs-deepmerge.md)                                                                        | `"merge"` | `"merge" \ "deepmerge"` | `"merge"` |

Configuration example:

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-schema",
            config: {
                endpointDescriptor: "GET /pets",
                patchMethod: "merge",
                schemaDiff: {
                    "security": [
                        {
                            "bearerAuth": []
                        }
                    ]
                }
            }
        }
    ]
}
```

More detailed configuration example:

```js
module.exports = {
    pipeline: [
        {
            rule: "patch-endpoint-schema",
            config: {
                patchMethod: 'merge',
                endpointDescriptor: "GET /pets",
                endpointDescriptorCorrection: 'responses.200.content.*/*.schema',
                schemaDiff: {
                    enum: ['3', '4'],
                },
            }
        }
    ]
}

[More details about rule patch-endpoint-schema](./src/rules/patch-endpoint-schema/README.md) 

----------------------

<a name="custom_anchor_rule_remove-deprecated"></a>

### remove-deprecated

The rule allows removing deprecated elements from the OpenAPI specification. It can remove deprecated components, endpoints, parameters, and properties, while providing the ability to ignore specific elements and display descriptions of removed elements.

#### Config

| Parameter | Description                                                                                                                | Example                                                                | Type | Default |
|----------|-------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------|-----------|-----------|
| `ignoreComponents` | [**optional**] List of components that should not be removed, even if they are marked as deprecated            | `[{"componentName": "Pet"}]`                                           | `Array<{ componentName: string }>` | `[]` |
| `ignoreEndpoints` | [**optional**] List of endpoints that should not be removed, even if they are marked as deprecated             | `["GET /pets"]`                                                        | `Array<string \ { path: string; method: string }>` | `[]` |
| `ignoreEndpointParameters` | [**optional**] List of endpoint parameters that should not be removed, even if they are marked as deprecated  | `[{"path": "/pets", "method": "get", "name": "limit", "in": "query"}]` | `Array<{ path: string; method: string; name: string; in: "query" \ "path" \ "header" \ "cookie" }>` | `[]` |
| `showDeprecatedDescriptions` | [**optional**] Whether to show descriptions of removed deprecated elements in logs, useful for explaining what should be used instead | `true`                                                                 | `boolean` | `false` |

> [!IMPORTANT]  
> Only local $refs of the file are considered, in the format: `#/...`

Configuration example:

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-deprecated",
            config: {},
        }
    ]
}
```

Example of a more detailed configuration:

```js
module.exports = {
    pipeline: [
        {
            rule: "remove-deprecated",
            config: {
                ignoreComponents: [
                    { componentName: "Pet" }
                ],
                ignoreEndpoints: [
                    { path: "/pets", method: "get" }
                ],
                ignoreEndpointParameters: [
                    { path: "/pets", method: "get", name: "limit", in: "query" }
                ],
                showDeprecatedDescriptions: true
            },
        }
    ]
}

[More details about rule remove-deprecated](./src/rules/remove-deprecated/README.md) 

----------------------

<a name="custom_anchor_rule_remove-max-items"></a>

### remove-max-items

Removes the `maxItems` property from all schemas in the OpenAPI specification.

#### Config

| Parameter | Description | Example | Type | Default |
| --------- | ----------- | ------- | ---- | ------- |
| `showUnusedWarning` | [**optional**] Show a warning if no schemas with maxItems are found | `true` | `boolean` | `false` |

Configuration example:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "remove-max-items",
            config: {},
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
            rule: "remove-max-items",
            config: {
                showUnusedWarning: true
            },
        }
        // ... other rules
    ]
}
```

[More details about rule remove-max-items](./src/rules/remove-max-items/README.md) 

----------------------

<a name="custom_anchor_rule_remove-min-items"></a>

### remove-min-items

Removes the `minItems` property from all schemas in the OpenAPI specification.

#### Config

| Parameter | Description | Example | Type | Default |
| --------- | ----------- | ------- | ---- | ------- |
| `showUnusedWarning` | [**optional**] Show a warning if no schemas with `minItems` are found | `true` | `boolean` | `false` |

Configuration example:

```js
module.exports = {
    pipeline: [
        // ... other rules
        {
            rule: "remove-min-items",
            config: {},
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
            rule: "remove-min-items",
            config: {
                showUnusedWarning: true
            },
        }
        // ... other rules
    ]
}
```

[More details about rule remove-min-items](./src/rules/remove-min-items/README.md) 

----------------------

<a name="custom_anchor_rule_remove-operation-id"></a>

### remove-operation-id

Removes operationId from all operations in the OpenAPI specification, except those specified in the ignore list

#### Config

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

[More details about rule remove-operation-id](./src/rules/remove-operation-id/README.md) 

----------------------

<a name="custom_anchor_rule_remove-parameter"></a>

### remove-parameter

Removes a parameter from an endpoint in the OpenAPI specification

#### Config

| Parameter | Description | Example                           | Typing | Default |
| -------- |-------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------|------------------------|-----------|
| `endpointDescriptor`  | [**required**] Description of the endpoint from which to remove the parameter | `"GET /pets"`   | `string \ { path: string; method: string }` | - |
| `parameterDescriptor`  | [**required**] Description of the parameter to remove. In the `in` parameter, you can specify: `"query"`, `"path"`, `"header"`, `"cookie"`. | `{"name": "petId", "in": "path"}` | `{ name: string; in: "query" \ "path" \ "header" \ "cookie" }` | - |

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

[More details about rule remove-parameter](./src/rules/remove-parameter/README.md) 

----------------------

<a name="custom_anchor_rule_remove-unused-components"></a>

### remove-unused-components

Removes unused components from the OpenAPI specification. The rule analyzes all component references in the document and removes those that are not used anywhere.

#### Config

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

[More details about rule remove-unused-components](./src/rules/remove-unused-components/README.md) 

## FAQ

- **Why are $ref modifications dangerous?** Because it means that $ref refers to a common part of the schema, and its modification may lead to implicit changes in another part of the specification where $ref is reused, and such a bug will be extremely difficult to catch.

## Usage Examples

In the `examples` directory, you can find various examples of using the package:

- [example-cli-generate-api-types](./examples/example-cli-generate-api-types) - Example of generating API types using CLI
- [example-cli-openapi-json](./examples/example-cli-openapi-json) - Example of working with OpenAPI JSON format via CLI
- [example-cli-openapi-yaml](./examples/example-cli-openapi-yaml) - Example of working with OpenAPI YAML format via CLI
- [example-cli-openapi-yaml-to-json](./examples/example-cli-openapi-yaml-to-json) - Example of converting YAML to JSON format
- [example-cli-simple-generate-api-types](./examples/example-cli-simple-generate-api-types) - Simple example of generating API types
- [example-cli-simple-json-config](./examples/example-cli-simple-json-config) - Example of using JSON configuration
- [example-cli-simple-npx](./examples/example-cli-simple-npx) - Example of using via npx
- [example-package-openapi-yaml](./examples/example-package-openapi-yaml) - Example of programmatic package usage 