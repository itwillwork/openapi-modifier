[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)


# Example: Typed Native Fetch with OpenAPI

This project demonstrates how to generate TypeScript types from an OpenAPI specification and use them with a type-safe wrapper around the native `fetch` API.

## Project Structure

- `src/` – Application source code
  - `api/` – API client and types
    - `client.ts` – Type-safe API client using native fetch
    - `types/` – Generated and custom TypeScript types
  - `App.tsx`, `index.tsx` – React application entry points
- `specs/` – OpenAPI specifications
  - `openapi.json` – Original OpenAPI spec
  - `prepared-openapi.json` – Modified OpenAPI spec (after running scripts)
- `openapi-modifier.config.ts` – Config for OpenAPI spec modification
- `simple-text-file-modifier.config.ts` – Config for type file modification

## Available npm Scripts

- `generate-types` – Generates TypeScript types from the prepared OpenAPI spec and applies modifications.
- `prepare-generated-types` – Modifies the generated types (e.g., adds a warning header).
- `prepare-openapi` – Modifies the OpenAPI spec using the CLI tool `openapi-modifier`.
- `mock:api` – Starts a mock server using the prepared OpenAPI spec.
- `dev` – Runs both the mock API server and the React app concurrently.

## How It Works

### Type Generation from OpenAPI
- The script `prepare-openapi` modifies the original OpenAPI spec (e.g., changes base paths, filters endpoints) using `openapi-modifier`.
- The script `generate-types` uses `dtsgenerator` to generate TypeScript types from the modified OpenAPI spec.
- The script `prepare-generated-types` applies additional modifications to the generated types (e.g., adds a warning comment).

### Type-Safe Native Fetch Wrapper
- The `ApiClient` class in `src/api/client.ts` provides a type-safe wrapper around the native `fetch` API, using the generated types for request and response validation.

### Mock Server
- The script `mock:api` runs a mock server using `@stoplight/prism-cli` and the prepared OpenAPI spec, allowing local testing without a real backend.

### Type and OpenAPI Spec Modification
- Type files are post-processed using a simple text file modifier (see `simple-text-file-modifier.config.ts`).
- The OpenAPI spec is modified using a pipeline of rules defined in `openapi-modifier.config.ts` (e.g., changing base paths, filtering endpoints, removing unused components). 