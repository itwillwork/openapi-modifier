# Example of Using openapi-modifier with Simple JSON Configuration

This example demonstrates the basic usage of openapi-modifier with JSON configuration for modifying OpenAPI specification.

## Project Structure

```
example-cli-simple-json-config/
├── input/
│   └── openapi.yml         # Input OpenAPI file
├── output/
│   └── openapi.yml         # Modified OpenAPI file
├── openapi-modifier.config.json  # Configuration file
└── package.json            # npm dependencies file
```

## Configuration

The `openapi-modifier.config.json` file defines a simple configuration that removes all `operationId` from the API specification:

```json
{
  "pipeline": [
    {
      "rule": "remove-operation-id"
    }
  ]
}
```

## Running the Example

1. Install dependencies:
```bash
npm install
```

2. Run the modifier:
```bash
npm start
```

or directly:
```bash
openapi-modifier --input=input/openapi.yml --output=output/openapi.yml --config=openapi-modifier.config.json
```

## Result

After executing the command, a modified `openapi.yml` file will be created in the `output` directory, where all `operationId` will be removed from the API specification.

## Expected Output

In the output file `output/openapi.yml`, all `operationId` will be removed while the rest of the API specification structure remains unchanged.
