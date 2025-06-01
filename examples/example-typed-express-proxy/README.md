[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)


# example-typed-express-proxy

This project demonstrates a strongly-typed Express proxy application in Node.js using OpenAPI and TypeScript.

## Project Structure

- `src/` — Application source code
  - `index.ts` — Main entry point, route registration, controllers, mock generation
  - `middlewares/` — Custom middlewares (logger, response handler)
  - `services/petstore/generated-api-types.d.ts` — TypeScript types generated from OpenAPI
  - `@types/` — Custom type definitions (including TypedController)
  - `errors.ts` — Custom error classes
  - `example.test.ts` — Example tests for mock/sample generation
- `specs/` — OpenAPI specifications
  - `petstore.json` — Original OpenAPI spec
  - `prepared-petstore.json` — Modified spec (after openapi-modifier)
- `openapi-modifier.config.ts` — Config for OpenAPI spec modification
- `simple-text-file-modifier.config.ts` — Config for post-processing generated types
- `package.json` — Project configuration and scripts

## Available npm scripts

- `start` — Run the Express proxy server
- `prepare-openapi-spec` — Modify the OpenAPI spec using openapi-modifier
- `generate-types` — Generate TypeScript types from OpenAPI (with post-processing)
- `prepare-generated-types` — Post-process generated types for naming consistency
- `test` — Run tests (Jest)

## How it works

### Type generation from OpenAPI
- The OpenAPI spec (`specs/petstore.json`) is modified by `openapi-modifier` (see `openapi-modifier.config.ts`) and saved as `specs/prepared-petstore.json`.
- Types are generated from the prepared spec using `dtsgenerator` and post-processed for naming consistency.
- The result is a strongly-typed API contract in `src/services/petstore/generated-api-types.d.ts`.

### Controller typing with TypedController
- Controllers are typed using the `TypedController<T>` interface, where `T` describes the request/response shape for each endpoint.
- This enables full type safety for request params, body, query, and responses, including error handling.

### Mock endpoint responses with getMockFromOpenApi
- The utility `getMockFromOpenApi` generates mock responses for endpoints by converting OpenAPI schemas to JSON Schema and using `json-schema-faker`.
- This allows for instant mock data generation for any endpoint/response defined in the spec.

### Sample entity/response generation in tests
- The utilities `createEndpointResponseSampleFromOpenApi` and `createEntitySampleFromOpenApi` generate sample data for endpoints and entities in tests, using the same OpenAPI-to-JSON-Schema conversion and json-schema-faker logic.

### OpenAPI spec modification with openapi-modifier
- The CLI tool `openapi-modifier` is used to preprocess the OpenAPI spec (e.g., removing operationId fields for better type generation).
- The modification pipeline is configured in `openapi-modifier.config.ts`.

---

For more details, see the source code and comments in each file. 