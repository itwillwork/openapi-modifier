{{{langSwitcher}}}

# OpenAPI Modifier

A tool for modifying OpenAPI specifications using customizable rules.

This package allows you to automate the process of modifying OpenAPI specifications by applying a set of predefined rules.

## Main features

- Modification of OpenAPI specifications in YAML and JSON formats
- Flexible rule system for specification changes
- Support for both CLI and programmatic usage with TypeScript support

> [!IMPORTANT]  
> Supports OpenAPI 3.1, 3.0. We haven't tested OpenAPI 2 support as the format is deprecated and we recommend migrating your documentation to OpenAPI 3.0.

## Motivation and use cases

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
  <summary><b>Demonstration of use</b></summary>

<a name="custom_anchor_demo"></a>

### Demonstration of use

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

{{{cliParams}}}

{{{cliConfigWarning}}}

<a name="custom_anchor_cli_usage"></a>

### CLI

```shell
npm i --save-dev openapi-modifier

openapi-modifier --input=input/openapi.yml --output=output/openapi.yml --config=openapi-modifier.config.js
```

[Example of using as CLI](./examples/example-cli-openapi-yaml/package.json#L7)

{{{cliParams}}}

{{{cliConfigWarning}}}

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

{{{ruleTable}}}

<a name="custom_anchor_rules_description"></a>

## Short descriptions of the rules

{{{rulesDescription}}}

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