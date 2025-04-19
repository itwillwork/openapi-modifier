# Example of Simple Usage of openapi-modifier via NPX

This example demonstrates the basic usage of openapi-modifier via NPX for modifying OpenAPI specification.

## Project Structure

```
example-cli-simple-npx/
├── input/
│   └── openapi.yml      # Input OpenAPI file
├── output/
│   └── openapi.yml      # Output OpenAPI file (will be created)
├── openapi-modifier.config.js  # Modifier configuration
└── package.json         # npm configuration
```

## Configuration

The `openapi-modifier.config.js` file defines a simple configuration that removes all `operationId` from the OpenAPI specification:

```javascript
module.exports = {
  pipeline: [
    {
      rule: 'remove-operation-id',
    },
  ],
};
```

## Running the Example

To run the example, execute the following command:

```bash
npm start
```

This command will:
1. Read the input file `input/openapi.yml`
2. Apply modification rules from the configuration
3. Save the result to `output/openapi.yml`

## Result

After executing the command, the output file `output/openapi.yml` will contain a modified version of the OpenAPI specification where all `operationId` have been removed from the API operations.

## Notes

- This example uses NPX to run openapi-modifier without requiring global installation
- The input file contains a standard Petstore API example
- The configuration can be extended with additional modification rules as needed
