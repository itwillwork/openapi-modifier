[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)


# Example: Typed Native Fetch with Orval

This project demonstrates how to generate TypeScript types and API client functions from an OpenAPI specification using Orval and use them with a type-safe wrapper around the native `fetch` API.

## Project Structure

- `src/` – Application source code
  - `api/` – API client and types
    - `generated/` – Generated API client and types by Orval
  - `App.tsx`, `index.tsx` – React application entry points
- `specs/` – OpenAPI specifications
  - `openapi.json` – Original OpenAPI spec
  - `prepared-openapi.json` – Modified OpenAPI spec (after running scripts)
- `openapi-modifier.config.ts` – Config for OpenAPI spec modification
- `orval.config.ts` – Config for Orval code generation

## Available npm Scripts

- `generate-types` – Generates TypeScript types and API client functions from the prepared OpenAPI spec using Orval.
- `prepare-openapi` – Modifies the OpenAPI spec using the CLI tool `openapi-modifier`.
- `mock:api` – Starts a mock server using the prepared OpenAPI spec.
- `dev` – Runs both the mock API server and the React app concurrently.

## How It Works

### Type and Client Generation from OpenAPI
- The script `prepare-openapi` modifies the original OpenAPI spec (e.g., changes base paths, filters endpoints) using `openapi-modifier`.
- The script `generate-types` uses `orval` to generate TypeScript types and API client functions from the modified OpenAPI spec.
- Orval generates type-safe API functions that use the native `fetch` API directly.

### Type-Safe Native Fetch
- Orval generates API functions (e.g., `getPetById`) that use the native `fetch` API, providing full type safety for requests and responses.
- The base URL is configured in `orval.config.ts` and is automatically included in all API calls.

### Mock Server
- The script `mock:api` runs a mock server using `@stoplight/prism-cli` and the prepared OpenAPI spec, allowing local testing without a real backend.

### OpenAPI Spec Modification
- The OpenAPI spec is modified using a pipeline of rules defined in `openapi-modifier.config.ts` (e.g., changing base paths, filtering endpoints, removing unused components).

