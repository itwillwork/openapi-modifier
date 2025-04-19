# Example of Using openapi-modifier with JSON File

This example demonstrates the basic usage of openapi-modifier for modifying OpenAPI specification in JSON format.

## Project Structure

```
example-cli-openapi-json/
├── input/                  # Input files directory
│   └── openapi.json       # Source OpenAPI file
├── output/                 # Output files directory
│   └── openapi.json       # Modified OpenAPI file
├── openapi-modifier.config.ts  # openapi-modifier configuration
└── package.json           # Dependencies and scripts
```

## Installation

```bash
npm install
```

## Usage

To run the OpenAPI file modification:

```bash
npm start
```

This will execute the following command:
```bash
openapi-modifier --input=input/openapi.json --output=output/openapi.json --config=openapi-modifier.config.ts
```

## Configuration

This example uses a simple configuration that removes all operationId from the OpenAPI specification:

```typescript
import { ConfigT } from 'openapi-modifier';

const config: ConfigT = {
  pipeline: [
    {
      rule: 'remove-operation-id',
      config: {
        ignore: [], // You can specify operationIds to preserve
      },
    },
  ],
};

export default config;
```

## Result

After running the script, the modified OpenAPI file will be saved in the `output/` directory. All operationId will be removed from the specification, which can be useful when you need to clean up the documentation from internal operation identifiers.
