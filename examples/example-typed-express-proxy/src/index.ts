/// <reference path="./services/petstore/generated-api-types.d.ts" />

import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import openapiSchemaToJsonSchema from '@openapi-contrib/openapi-schema-to-json-schema';
import jsf from 'json-schema-faker';
import RefParser from '@apidevtools/json-schema-ref-parser';
import {ServiceResponseError} from "./errors";

const app = express();
const PORT = 3001;

// Enable JSON body parsing for POST
app.use(express.json());

// Utility to generate mock data from OpenAPI
async function getMockFromOpenApi<T>(method: string, endpointPath: string, statusCode: string): Promise<T> {
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
  return jsf.generate(jsonSchema) as T;
}

// Mock route for GET /pet/:petId
app.get('/pet/:petId', async (request: Request, response: Response) => {
  const mock = await getMockFromOpenApi<Paths.GetPetById.Responses.$200>('get', '/pet/{petId}', '200');
  response.json(mock);
});

type GetOrderByIdRoute = {
  request: {
    params: {
      orderId: Paths.GetOrderById.Parameters.OrderId;
    };
  };
  responses: {
    success: Paths.GetOrderById.Responses.$200;
    error:
        | Paths.GetOrderById.Responses.$400
        | Paths.GetOrderById.Responses.$404;
  };
}

const getOrderByIdRouteTypedController: TypedController<GetOrderByIdRoute> = async (request, response, next) => {
    const orderId = request.params.orderId;

    // @ts-expect-error: TS2322: Type '{ foo: string; }' is not assignable to type 'Order'. Object literal may only specify known properties, and 'foo' does not exist in type 'Order'.
    response.result = { foo: 'bar'};


    const responseMock = await getMockFromOpenApi<Paths.GetOrderById.Responses.$200>('get', '/store/order/{orderId}', '200');
    response.result = responseMock;
    next();

    next(
        // @ts-expect-error: TS2345: Argument of type 'ServiceResponseError<number>' is not assignable to parameter of type 'ServiceResponseError<$400 | $404>'. Type 'number' is not assignable to type '$400 | $404'.
  new ServiceResponseError({
            statusCode: 400,
            body: 123
           }),
    );

    const responseErrorMock = await getMockFromOpenApi<Paths.GetOrderById.Responses.$400>('get', '/store/order/{orderId}', '400');
    next(
        new ServiceResponseError({
            statusCode: 400,
            body: responseErrorMock
        }),
    );
}

app.get('/store/order/{orderId}', getOrderByIdRouteTypedController);


type PlaceOrderRoute = {
    request: {
        body: Paths.PlaceOrder.RequestBody;
    };
    responses: {
        success: Paths.PlaceOrder.Responses.$200;
        error:
            | Paths.PlaceOrder.Responses.$400
            | Paths.PlaceOrder.Responses.$422;
    };
}

const placeOrderRouteTypedController: TypedController<PlaceOrderRoute> = async (request, response, next) => {
    const order = request.body;


    const responseMock = await getMockFromOpenApi<Paths.PlaceOrder.Responses.$200>('post', '/store/order', '200');
    response.result = responseMock;
    next();
}

app.post('/store/order', placeOrderRouteTypedController);

// Ping route
app.get('/ping', (req: Request, res: Response) => {
  res.send('OK');
});

app.listen(PORT, () => {
  console.log(`Express proxy server is running on http://localhost:${PORT}`);
});
