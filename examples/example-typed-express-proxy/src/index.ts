import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import openapiSchemaToJsonSchema from '@openapi-contrib/openapi-schema-to-json-schema';
import jsf from 'json-schema-faker';
import RefParser from '@apidevtools/json-schema-ref-parser';

const app = express();
const PORT = 3001;

// Enable JSON body parsing for POST
app.use(express.json());

// Utility to generate mock data from OpenAPI
async function getMockFromOpenApi(method: string, endpointPath: string, statusCode: string): Promise<any> {
  // Path to the OpenAPI specification file
  const specPath = path.join(__dirname, '../specs/petstore.json');
  // Read and parse the OpenAPI specification
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf-8'));
  // Resolve all $ref references in the OpenAPI document
  const dereferenced: any = await RefParser.dereference(spec);
  // Get the path item for the requested endpoint
  const pathItem = dereferenced.paths[endpointPath];
  if (!pathItem) throw new Error('Path not found');
  // Get the operation object for the requested HTTP method
  const op = pathItem[method.toLowerCase()];
  if (!op) throw new Error('Method not found');
  // Get the response object for the requested status code
  const resp = op.responses && op.responses[statusCode];
  if (!resp) throw new Error('Status code not found');
  // Get the application/json response schema
  const content = resp.content && resp.content['application/json'];
  if (!content || !content.schema) throw new Error('Response schema not found');
  // Convert the OpenAPI schema to JSON Schema
  const jsonSchema = openapiSchemaToJsonSchema(content.schema);
  // Generate mock data using json-schema-faker
  return jsf.generate(jsonSchema);
}

// Mock route for GET /pet/:petId
app.get('/pet/:petId', async (req: Request, res: Response) => {
    const mock = await getMockFromOpenApi('get', '/pet/{petId}', '200');
    res.json(mock);
});

// Ping route
app.get('/ping', (req: Request, res: Response) => {
  res.send('OK');
});

app.listen(PORT, () => {
  console.log(`Express proxy server is running on http://localhost:${PORT}`);
});
