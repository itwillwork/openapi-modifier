[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# Example of using openapi-modifier with YAML

This example demonstrates how to use the `openapi-modifier` library to modify OpenAPI specification in YAML format.

## Project Structure

```
example-package-openapi-yaml/
├── input/
│   └── openapi.yml      # Input OpenAPI specification file
├── output/
│   └── openapi.yml      # Output file after modification
├── generate.ts          # Modification script
└── package.json         # Project dependencies
```

## Installation

```bash
npm install
```

## Usage

1. Place your OpenAPI specification in YAML format in the `input/openapi.yml` directory
2. Run the modification script:

```bash
npm start
```

3. The modified specification will be saved to `output/openapi.yml`

## Code Example

This example uses the `remove-operation-id` rule to remove all `operationId` from the specification:

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
            ignore: [], // You can specify operationIds to preserve
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

## Result

After running the script, all `operationId` will be removed from the specification while preserving the rest of the document structure unchanged.

## Dependencies

- openapi-modifier
- ts-node
