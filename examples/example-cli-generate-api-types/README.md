[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# Example of Using openapi-modifier for API Type Generation

This example demonstrates using `openapi-modifier` to modify OpenAPI specification and subsequently generate TypeScript types.

## Description

In this example, we:
1. Modify the input OpenAPI specification using `openapi-modifier`
2. Generate TypeScript types from the modified specification
3. Patch the generated types to improve their structure

## Installation

```bash
npm install
```

## Project Structure

```
.
├── input/                      # Input files directory
│   └── openapi.yaml           # Original OpenAPI specification
├── output/                     # Output files directory
│   ├── openapi.yaml           # Modified OpenAPI specification
│   └── generated-api-types.d.ts # Generated TypeScript types
├── openapi-modifier.config.ts  # openapi-modifier configuration
└── simple-text-file-modifier.config.ts # Configuration for type patching
```

## Scripts

The following scripts are defined in `package.json`:

- `prepare-input-openapi` - Modifies the input OpenAPI specification
- `generate-api-types` - Generates TypeScript types from the modified specification
- `patch-api-types` - Patches the generated types
- `start` - Runs all scripts sequentially
- `download-input-openapi` - Downloads an example OpenAPI specification

## openapi-modifier Configuration

The `openapi-modifier.config.ts` file defines the following modifications:

1. Merging with additional OpenAPI specification
2. Changing endpoint base path
3. Filtering internal paths
4. Removing deprecated parameters
5. Fixing parameter documentation
6. Patching schemas
7. Removing deprecated endpoints
8. Optimizing for type generator

## Type Patching Configuration

The `simple-text-file-modifier.config.ts` file defines the following changes:

1. Adding auto-generation warning
2. Renaming `Components` namespace to `ApiComponents`
3. Renaming `Paths` namespace to `ApiEndpoints`

## Usage

To run the complete type generation process:

```bash
npm run start
```

This will execute all steps sequentially:
1. OpenAPI specification modification
2. TypeScript type generation
3. Generated type patching

## Result

After running the scripts, the following files will be created in the `output/` directory:
- Modified OpenAPI specification (`openapi.yaml`)
- Generated TypeScript types with applied patches (`generated-api-types.d.ts`) 