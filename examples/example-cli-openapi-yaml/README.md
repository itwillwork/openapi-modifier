[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# Example of Using openapi-modifier with YAML File

This example demonstrates using openapi-modifier to modify OpenAPI specification in YAML format.

## Project Structure

```
example-cli-openapi-yaml/
├── input/
│   └── openapi.yml         # Input OpenAPI specification file
├── output/
│   └── openapi.yml         # Output file after modification
├── openapi-modifier.config.ts  # Modifier configuration
└── package.json            # Project dependencies
```

## Installation

1. Install dependencies:
```bash
npm install
```

## Configuration

The `openapi-modifier.config.ts` file defines the configuration for modifying the OpenAPI specification:

```typescript
import { ConfigT } from 'openapi-modifier';

const config: ConfigT = {
  pipeline: [
    {
      rule: 'remove-operation-id',
      config: {
        ignore: [],
      },
    },
  ],
};

export default config;
```

This example uses the `remove-operation-id` rule, which removes all `operationId` from the OpenAPI specification.

## Running

To run the modification:

```bash
npm start
```

or directly:

```bash
openapi-modifier --input=input/openapi.yml --output=output/openapi.yml --config=openapi-modifier.config.ts
```

## Result

After executing the command, a file `openapi.yml` will be created in the `output` directory with the modified OpenAPI specification. In this case, all `operationId` will be removed from the specification.

## Input Data

The input file `input/openapi.yml` contains an example OpenAPI specification for the Petstore API with various endpoints and schemas. After modification, all `operationId` will be removed from the specification. 