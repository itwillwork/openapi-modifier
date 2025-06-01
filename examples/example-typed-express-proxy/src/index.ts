/// <reference path="./services/petstore/generated-api-types.d.ts" />

import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import openapiSchemaToJsonSchema from '@openapi-contrib/openapi-schema-to-json-schema';
import jsf from 'json-schema-faker';
import RefParser from '@apidevtools/json-schema-ref-parser';
import {ServiceResponseError} from "./errors";
import {setupLoggerMiddleware} from "./middlewares/setup-logger";
import {responseHandlerMiddleware,errorResponseHandlerMiddleware } from "./middlewares/response-handler";

const app = express();
const PORT = 3001;

// Enable JSON body parsing for POST
app.use(express.json());

app.use(setupLoggerMiddleware);

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
  const mock = await getMockFromOpenApi<PetstorePaths.Pet$PetId.Get.Responses.$200>('get', '/pet/{petId}', '200');
  response.json(mock);
});

// Define the route type for getting an order by ID, including request params and possible responses
type GetOrderByIdRoute = {
  request: {
    params: {
      orderId: PetstorePaths.StoreOrder$OrderId.Get.Parameters.OrderId;
    };
  };
  responses: {
    success: PetstorePaths.StoreOrder$OrderId.Get.Responses.$200;
    error:
        | PetstorePaths.StoreOrder$OrderId.Get.Responses.$400
        | PetstorePaths.StoreOrder$OrderId.Get.Responses.$404; 
  };
}

// Typed controller for the GetOrderById route
const getOrderByIdRouteTypedController: TypedController<GetOrderByIdRoute> = async (request, response, next) => {
    const orderId = request.params.orderId; // Extract orderId from request parameters

    // Example 1: not valid response body
    // Intentionally assign an invalid object to demonstrate TypeScript error checking
    // @ts-expect-error: TS2322: Type '{ foo: string; }' is not assignable to type 'Order'. Object literal may only specify known properties, and 'foo' does not exist in type 'Order'.
    response.result = { foo: 'bar'};

    // Example 2: valid response body
    // Generate a mock response for a successful 200 response using OpenAPI types
    const responseMock = await getMockFromOpenApi<PetstorePaths.StoreOrder$OrderId.Get.Responses.$200>('get', '/store/order/{orderId}', '200');
    response.result = responseMock;
    next(); // Call next middleware

    // Example 3: not valid error body
    // Intentionally trigger a TypeScript error by passing an invalid error body
    next(
        // @ts-expect-error: TS2345: Argument of type 'ServiceResponseError<number>' is not assignable to parameter of type 'ServiceResponseError<$400 | $404>'. Type 'number' is not assignable to type '$400 | $404'.
          new ServiceResponseError({
            statusCode: 400,
            body: 123
           }),
    );

    // Example 4: valid error body
    // Generate a mock error response for a 400 error using OpenAPI types
    const responseErrorMock = await getMockFromOpenApi<PetstorePaths.StoreOrder$OrderId.Get.Responses.$400>('get', '/store/order/{orderId}', '400');
    next(
        new ServiceResponseError({
            statusCode: 400,
            body: responseErrorMock
        }),
    );
}

// Register the GET /store/order/{orderId} route with the typed controller
app.get('/store/order/{orderId}', getOrderByIdRouteTypedController);

// Define the route type for placing an order, including request body and possible responses
type PlaceOrderRoute = {
    request: {
        body: PetstorePaths.StoreOrder.Post.RequestBody;
    };
    responses: {
        success: PetstorePaths.StoreOrder.Post.Responses.$200;
        error:
            | PetstorePaths.StoreOrder.Post.Responses.$400
            | PetstorePaths.StoreOrder.Post.Responses.$422;
    };
}

// Typed controller for the PlaceOrder route
const placeOrderRouteTypedController: TypedController<PlaceOrderRoute> = async (request, response, next) => {
    const order = request.body; // order is typed as PetstoreComponents.Schemas.Order

    // Generate a mock response for a successful 200 response using OpenAPI types
    const responseMock = await getMockFromOpenApi<PetstorePaths.StoreOrder.Post.Responses.$200>('post', '/store/order', '200');
    response.result = responseMock;
    next(); // Call next middleware
}

// Register the POST /store/order route with the typed controller
app.post('/store/order', placeOrderRouteTypedController);

// Define the route type for user login, including query parameters and possible responses
type LoginUserRoute = {
    request: {
        query: PetstorePaths.UserLogin.Get.QueryParameters;
    };
    responses: {
        success: PetstorePaths.UserLogin.Get.Responses.$200;
        error: PetstorePaths.UserLogin.Get.Responses.$400;
    };
}

// Typed controller for the LoginUser route
const loginUserRouteTypedController: TypedController<LoginUserRoute> = async (request, response, next) => {
    const username = request.query.username; // username is typed as string
    const password = request.query.password; // password is typed as string

    // Generate a mock response for a successful 200 response using OpenAPI types
    const responseMock = await getMockFromOpenApi<PetstorePaths.UserLogin.Get.Responses.$200>('get', '/user/login', '200');
    response.result = responseMock;
    next(); // Call next middleware
}

// why does endpoint /user/login have a get method? Because that's how it was in the openapi petstore example.
app.get('/user/login', loginUserRouteTypedController);

app.use(responseHandlerMiddleware);
app.use(errorResponseHandlerMiddleware);

// Ping route
app.get('/ping', (req: Request, res: Response) => {
  res.send('OK');
});

app.listen(PORT, () => {
  console.log(`Express proxy server is running on http://localhost:${PORT}`);
});
