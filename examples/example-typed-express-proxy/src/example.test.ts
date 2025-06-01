/// <reference path="./services/petstore/generated-api-types.d.ts" />

import { describe, it, expect } from '@jest/globals';
import jsf from 'json-schema-faker';
import RefParser from '@apidevtools/json-schema-ref-parser';
import openapiSchemaToJsonSchema from '@openapi-contrib/openapi-schema-to-json-schema';
import fs from 'fs';
import path from 'path';

// Generates a sample response object for a given endpoint, HTTP method, and status code
// using the OpenAPI specification.
async function createEndpointResponseSampleFromOpenApi<T>(method: string, endpointPath: string, statusCode: string): Promise<T> {
  // Load the OpenAPI spec from a file
  const specPath = path.join(__dirname, '../specs/petstore.json');
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf-8'));
  // Dereference all $ref pointers for easier access
  const dereferenced: any = await RefParser.dereference(spec);
  // Find the specified endpoint
  const pathItem = dereferenced.paths[endpointPath];
  if (!pathItem) throw new Error('Path not found');
  // Find the specified HTTP method
  const op = pathItem[method.toLowerCase()];
  if (!op) throw new Error('Method not found');
  // Extract the response for the given status code
  const resp = op.responses && op.responses[statusCode];
  if (!resp) throw new Error('Status code not found');
  // Get the JSON schema for the response
  const content = resp.content && resp.content['application/json'];
  if (!content || !content.schema) throw new Error('Response schema not found');
  // Convert the OpenAPI schema to JSON Schema
  const jsonSchema = openapiSchemaToJsonSchema(content.schema);
  // Generate a sample object matching the schema
  return jsf.generate(jsonSchema) as T;
}

// Generates a sample object for a given entity/component defined in the OpenAPI spec.
async function createEntitySampleFromOpenApi<T>(entityName: string): Promise<T> {
  // Load the OpenAPI spec from a file
  const specPath = path.join(__dirname, '../specs/petstore.json');
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf-8'));
  // Dereference all $ref pointers for easier access
  const dereferenced: any = await RefParser.dereference(spec);
  // Find the schema for the specified entity/component
  const entitySchema = dereferenced.components.schemas[entityName];
  if (!entitySchema) throw new Error('Component not found');
  // Convert the OpenAPI schema to JSON Schema
  const jsonSchema = openapiSchemaToJsonSchema(entitySchema);
  // Generate a sample object matching the schema
  return jsf.generate(jsonSchema) as T;
}

// Test suite for mocking data using the OpenAPI specification
// Each test demonstrates generating valid mock data for entities and endpoint responses

describe('Example of mocking via OpenAPI specification', () => {
  it('should generate a valid Pet object', async () => {
    // Generate a sample object for the 'Pet' entity defined in the OpenAPI spec
    const sample = await createEntitySampleFromOpenApi<Components.Schemas.Pet>('Pet');
    console.log("sample", JSON.stringify(sample, null, 2));
    expect(sample).toBeTruthy();
  });

  it('should generate a valid endpoint response', async () => {
    // Generate a sample response for the GET /pet/{petId} endpoint with status 200
    const sampleResponse = await createEndpointResponseSampleFromOpenApi<Paths.GetPetById.Responses.$200>('get', '/pet/{petId}', '200');
    console.log("sampleResponse", JSON.stringify(sampleResponse, null, 2));
    expect(sampleResponse).toBeTruthy();
  });
}); 