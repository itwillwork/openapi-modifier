import { describe, it, expect } from '@jest/globals';
import jsf from 'json-schema-faker';
import RefParser from '@apidevtools/json-schema-ref-parser';
import openapiSchemaToJsonSchema from '@openapi-contrib/openapi-schema-to-json-schema';
import fs from 'fs';
import path from 'path';

async function createEndpointResponseSampleFromOpenApi(method: string, endpointPath: string, statusCode: string): Promise<any> {
  const specPath = path.join(__dirname, '../specs/petstore.json');
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf-8'));
  const dereferenced: any = await RefParser.dereference(spec);
  const pathItem = dereferenced.paths[endpointPath];
  if (!pathItem) throw new Error('Path not found');
  const op = pathItem[method.toLowerCase()];
  if (!op) throw new Error('Method not found');
  const resp = op.responses && op.responses[statusCode];
  if (!resp) throw new Error('Status code not found');
  const content = resp.content && resp.content['application/json'];
  if (!content || !content.schema) throw new Error('Response schema not found');
  const jsonSchema = openapiSchemaToJsonSchema(content.schema);
  return jsf.generate(jsonSchema);
}

async function createEntitySampleFromOpenApi(entityName: string): Promise<any> {
  const specPath = path.join(__dirname, '../specs/petstore.json');
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf-8'));
  const dereferenced: any = await RefParser.dereference(spec);
  const entitySchema = dereferenced.components.schemas[entityName];
  if (!entitySchema) throw new Error('Component not found');
  const jsonSchema = openapiSchemaToJsonSchema(entitySchema);
  return jsf.generate(jsonSchema);
}

describe('Пример мока через openapi спецификацию', () => {
  it('должен сгенерировать валидный объект Pet', async () => {
    const sample = await createEntitySampleFromOpenApi('Pet');
    console.log("sample", JSON.stringify(sample, null, 2));
    expect(sample).toBeTruthy();
  });

  it('должен сгенерировать валидный ответ ', async () => {
    const sampleResponse = await createEndpointResponseSampleFromOpenApi('get', '/pet/{petId}', '200');
    console.log("sampleResponse", JSON.stringify(sampleResponse, null, 2));
    expect(sampleResponse).toBeTruthy();
  });
}); 