[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# Example of Using openapi-modifier for API Type Generation

This example demonstrates how to use `openapi-modifier` to modify OpenAPI specification and subsequently generate TypeScript types.

## Example Description

In this example, we:
1. Modify the input OpenAPI file using `openapi-modifier`
2. Generate TypeScript types from the modified OpenAPI file

## Project Structure

```
example-cli-simple-generate-api-types/
├── input/
│   └── openapi.yaml         # Input OpenAPI file
├── output/
│   ├── openapi.yaml         # Modified OpenAPI file
│   └── generated-api-types.d.ts  # Generated TypeScript types
├── openapi-modifier.config.ts    # openapi-modifier configuration
└── package.json             # Dependencies and scripts
```

## Configuration

The `openapi-modifier.config.ts` file defines the following modification rules:

1. Base Path Modification:
   - Removing `/api/external` prefix from API paths

2. Endpoint Filtering:
   - Removing all paths containing `/internal`

3. Unused Components Removal:
   - Cleaning up schemas that are not used in the API

## Usage

1. Install dependencies:
```bash
npm install
```

2. Run the modification and type generation process:
```bash
npm start
```

This will execute the following steps:
1. Modify the input OpenAPI file (`prepare-input-openapi`)
2. Generate TypeScript types from the modified file (`generate-api-types`)

## Result

After running the scripts, the following files will be created in the `output/` directory:
- `openapi.yaml` - modified version of OpenAPI specification
- `generated-api-types.d.ts` - generated TypeScript types

## Dependencies

- `openapi-modifier` - for modifying OpenAPI specification
- `dtsgenerator` - for generating TypeScript types
