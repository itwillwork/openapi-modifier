import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      target: './specs/prepared-openapi.json',
    },
    output: {
      target: './src/api/generated/api.ts',
      client: 'fetch',
      mode: 'tags',
      baseUrl: 'http://localhost:4010',
    },
  },
});

