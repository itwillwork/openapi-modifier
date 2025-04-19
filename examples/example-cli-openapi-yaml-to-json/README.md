# Example of Converting OpenAPI from YAML to JSON

This example demonstrates using `openapi-modifier` to convert OpenAPI specification from YAML to JSON format while applying modification rules.

## Project Structure

```
example-cli-openapi-yaml-to-json/
├── input/
│   └── openapi.yml      # Input OpenAPI file in YAML format
├── output/
│   └── openapi.json     # Output OpenAPI file in JSON format
├── openapi-modifier.config.ts  # Modification rules configuration
└── package.json         # Project dependencies
```

## Installation

```bash
npm install
```

## Configuration

The `openapi-modifier.config.ts` file defines a rule to remove `operationId` from all API operations:

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

## Usage

To run the conversion:

```bash
npm start
```

or directly:

```bash
openapi-modifier --input=input/openapi.yml --output=output/openapi.json
```

## Result

After executing the command:
1. The `input/openapi.yml` file will be read
2. Modification rules will be applied (in this case - removal of all `operationId`)
3. The result will be saved to `output/openapi.json` in JSON format

## Notes

- Input file must be in YAML format
- Output file will be created in JSON format
- All modification rules are applied in the order they are defined in the configuration file
