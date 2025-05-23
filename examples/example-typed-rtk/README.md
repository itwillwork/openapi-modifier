[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)

# OpenAPI + RTK Query Type Generation Example

This example demonstrates how to use OpenAPI specifications to generate TypeScript types and integrate them with RTK Query in a React application.

## Features

1. **OpenAPI Type Generation**
   - Uses `dtsgenerator` to generate TypeScript types from OpenAPI specification
   - Automatically generates type definitions for API requests and responses
   - Includes custom type modifications using `openapi-modifier`

2. **RTK Query Integration**
   - Demonstrates how to use generated types with RTK Query
   - Provides type-safe API calls and responses
   - Shows proper typing for query hooks and mutations

3. **Mock Server**
   - Uses Prism CLI to create a mock server based on OpenAPI specification
   - Simulates API responses for development and testing
   - Runs concurrently with the development server

4. **Type Modifications**
   - Shows how to add warning comments to generated types
   - Uses `openapi-modifier` for post-processing generated types
   - Demonstrates custom type transformations

5. **OpenAPI Specification Modification**
   - Uses `openapi-modifier` to transform OpenAPI specification
   - Adds basePath to all endpoints for consistent API path handling
   - Allows custom modifications of the API specification before type generation
   - Supports various transformation rules through configuration

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Generate API types:
   ```bash
   npm run generate-types
   ```

3. Start the development environment:
   ```bash
   npm run dev
   ```
   This will start both the mock server and the React development server.

## Project Structure

- `specs/counter-api.yaml` - OpenAPI specification
- `src/api/types/` - Generated TypeScript types
- `src/api/counterApi.ts` - RTK Query API definition
- `src/App.tsx` - Example React component using the API

## Available Scripts

- `npm run dev` - Starts both mock server and React development server
- `npm run mock-api` - Starts only the mock server
- `npm run prepare-openapi-types` - Prepares OpenAPI specification by adding basePath to all endpoints
- `npm run generate-types` - Generates TypeScript types from OpenAPI spec
- `npm run prepare-generated-types` - Post-processes generated types

## How It Works

1. **OpenAPI Specification Preparation**
   - The original OpenAPI specification is in `specs/counter-api.yaml`
   - `openapi-modifier` is used to prepare the specification by adding basePath to all endpoints
   - The prepared specification is saved to `specs/prepared-counter-api.yaml`
   - This step ensures consistent API path handling across the application

2. **Type Generation**
   - The prepared OpenAPI specification defines the API structure
   - `dtsgenerator` converts the spec to TypeScript types
   - `openapi-modifier` adds custom modifications to the types

3. **RTK Query Setup**
   - Generated types are used to define the API endpoints
   - Type-safe query hooks are created automatically
   - Response types are inferred from the OpenAPI spec

4. **Mock Server**
   - Prism CLI reads the OpenAPI spec
   - Generates mock responses based on the specification
   - Provides a realistic development environment

## Type Safety

The example demonstrates how to achieve full type safety:
- API request/response types are generated from OpenAPI spec
- RTK Query endpoints are properly typed
- TypeScript provides compile-time type checking
- IDE autocompletion for API calls and responses