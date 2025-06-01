[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md)  | [🇨🇳 中文](./README-zh.md)


# Example: Typed OpenAPI + React Query

This project demonstrates how to generate TypeScript types from an OpenAPI specification and use them with [react-query](https://tanstack.com/query/latest) in a React application.

## Project Structure

```
examples/example-typed-react-query/
├── public/                  # Static assets
├── specs/                   # OpenAPI specs (original and prepared)
│   ├── openapi.json         # Original OpenAPI spec
│   └── prepared-openapi.json# Modified spec for codegen/mocking
├── src/
│   ├── api/
│   │   ├── fetchPetById.ts  # Example API call using generated types
│   │   └── types/
│   │       ├── generated-api-types.d.ts # Generated types from OpenAPI
│   │       └── models.ts    # Type aliases for app usage
│   ├── App.tsx              # Main React app with react-query integration
│   └── ...
├── openapi-modifier.config.ts           # Config for OpenAPI spec modification
├── simple-text-file-modifier.config.ts  # Config for post-processing generated types
├── package.json
└── ...
```

## Available npm scripts

- `generate-types` — Generate TypeScript types from OpenAPI (`specs/prepared-openapi.json`) and post-process them
- `prepare-generated-types` — Add a warning header to generated types
- `prepare-openapi` — Modify the original OpenAPI spec using `openapi-modifier` CLI
- `mock:api` — Run a mock server using [Prism](https://github.com/stoplightio/prism)
- `dev` — Run both the mock server and the React app concurrently

## How it works

### 1. OpenAPI Spec Modification
- The original spec (`specs/openapi.json`) is processed by `openapi-modifier` (see `openapi-modifier.config.ts`).
- Example: changing base paths, filtering endpoints, removing unused components.
- Output: `specs/prepared-openapi.json`.

### 2. Type Generation
- Types are generated from the prepared OpenAPI spec using `dtsgenerator`.
- Output: `src/api/types/generated-api-types.d.ts`.
- Post-processed by `simple-text-file-modifier` to add a warning header.

### 3. Integration with React Query
- API functions (e.g., `fetchPetById`) use the generated types for type safety.
- React components use `@tanstack/react-query` for data fetching and caching.

### 4. Mock Server
- The mock server (`mock:api`) serves the prepared OpenAPI spec using Prism.
- Useful for local development and testing without a real backend.

### 5. Type and Spec Modification
- Types can be post-processed (e.g., add comments, fix issues) via `simple-text-file-modifier`.
- The OpenAPI spec can be programmatically modified via `openapi-modifier` CLI and config.

---

Feel free to explore the code and configs for more details! 