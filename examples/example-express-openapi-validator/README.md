[🇺🇸 English](./README.md) | [🇷🇺 Русский](./README-ru.md) | [🇨🇳 中文](./README-zh.md)


# Example: Express Server with express-openapi-validator

This project demonstrates how to use `express-openapi-validator` to validate requests and responses in an Express server, with OpenAPI specification modification using `openapi-modifier`.

## Project Structure

- `src/` – Application source code
  - `routes/` – Express route handlers
  - `services/` – Business logic services
  - `index.ts` – Express application entry point
- `specs/` – OpenAPI specifications
  - `openapi.json` – Original OpenAPI spec
  - `prepared-openapi.json` – Modified OpenAPI spec (after running scripts)
- `openapi-modifier.config.ts` – Config for OpenAPI spec modification

## Available npm Scripts

- `prepare-openapi` – Modifies the OpenAPI spec using the CLI tool `openapi-modifier`.
- `start` – Starts the Express server using `ts-node`.
- `dev` – Starts the Express server in development mode with hot reload using `ts-node-dev`.
- `build` – Compiles TypeScript to JavaScript.

## How It Works

### OpenAPI Specification Modification
- The script `prepare-openapi` modifies the original OpenAPI spec (e.g., changes base paths, filters endpoints) using `openapi-modifier`.
- The modified spec is saved to `specs/prepared-openapi.json` and used by `express-openapi-validator`.

### Request and Response Validation
- `express-openapi-validator` validates incoming requests against the OpenAPI specification.
- Response validation is enabled to ensure responses match the specification.
- Invalid requests or responses automatically return appropriate error responses.

### Express Routes
- Routes are defined in `src/routes/` and use the validated request/response objects.
- The validator ensures type safety and schema compliance at runtime.

### Error Handling
- A custom error handler formats validation errors and returns them in a consistent format.

## Usage

1. Install dependencies:
```bash
npm install
```

2. Prepare the OpenAPI specification:
```bash
npm run prepare-openapi
```

3. Start the server:
```bash
npm start
```

Or in development mode with hot reload:
```bash
npm run dev
```

4. Test the API:
```bash
# Get pet by ID
curl http://localhost:3000/api/v3/pet/1

# View the API spec
curl http://localhost:3000/spec
```

## API Examples

### Successful Request

Example of a successful request:
```bash
curl -X GET "http://localhost:3000/api/v3/pet/1"
```

Response:
```json
{"id":1,"name":"sparky","status":"available","photoUrls":["https://example.com/sparky.jpg"],"tags":[{"name":"sweet"}]}
```

### Validation Error

Example of a request that is rejected due to validation:
```bash
curl -X GET "http://localhost:3000/api/v3/pet/not-a-number"
```

Response:
```json
{"message":"request/params/petId must be integer","errors":[{"path":"/params/petId","message":"must be integer","errorCode":"type.openapi.validation"}]}
```

## OpenAPI Spec Modification

The OpenAPI spec is modified using a pipeline of rules defined in `openapi-modifier.config.ts`:
- Changing base paths from `/` to `/api/v3/`
- Filtering endpoints to only include `GET /api/v3/pet/{petId}`
- Removing unused components to keep the spec minimal

