import {OpenAPIFileT} from '../../../../openapi';
import {z} from 'zod';
import {openAPISchemaConfigSchema} from "../../config";
import {HttpMethods, ReferenceObject, SchemaObject} from "../../openapi-models";
import {checkIsRefSchema} from "../refs";

type AnySchemaObject = ReferenceObject | SchemaObject;

type SchemaCallbackT = (schema: AnySchemaObject) => void;

// TODO iterator creator
export const forEachSchema = (openAPIFile: OpenAPIFileT, callback: SchemaCallbackT) => {
    const stack: Array<AnySchemaObject | null | undefined> = [];

    // forEach - components.schemas[name]
    Object.keys(openAPIFile.document?.components?.schemas || {}).forEach((name) => {
        const schema = openAPIFile.document?.components?.schemas?.[name];
        stack.push(schema);
    });

    Object.keys(openAPIFile.document?.paths || {}).forEach((pathName) => {
        const pathObj = openAPIFile.document?.paths?.[pathName];
        const methods = Object.keys(pathObj || {}) as Array<HttpMethods>;

        methods.forEach((method) => {
            const methodSchema = openAPIFile.document?.paths?.[pathName]?.[method];

            // forEach - paths[name][method].parameters[].schema
            const parameters = methodSchema?.parameters || [];

            parameters.forEach((parameter) => {
                if (checkIsRefSchema(parameter)) {
                    stack.push(parameter);
                } else {
                    stack.push(parameter?.schema);
                }
            });

            // forEach - paths[name][method].responses[code].content[contentType].schema
            const responses = methodSchema?.responses || {};
            Object.keys(responses).forEach((code) => {
                const responseSchema = responses[code];
                if (checkIsRefSchema(responseSchema)) {
                    stack.push(responseSchema);
                } else {
                    Object.keys(responseSchema?.content || {}).forEach((contentType) => {
                        const responseContentSchema = responseSchema?.content?.[contentType]?.schema;

                        stack.push(responseContentSchema);
                    });
                }
            });

            // forEach - paths[name][method].requestBody.content[contentType].schema
            const requestBody = methodSchema?.requestBody;
            if (checkIsRefSchema(requestBody)) {
                stack.push(requestBody);
            } else {
                Object.keys(requestBody?.content || {}).forEach((contentType) => {
                    const requestBodyContentSchema = requestBody?.content?.[contentType]?.schema;

                    stack.push(requestBodyContentSchema);
                });
            }
        });
    });

    while (stack.length) {
        const item = stack.pop();

        if (item) {
            callback(item);
        }

        if (!checkIsRefSchema(item) && item) {
            if (item.type === 'array' && item.items) {
                stack.push(item.items);
            }

            if (item.type === 'object' && item.properties) {
                Object.keys(item.properties).forEach((propertyKey) => {
                    const property = item.properties?.[propertyKey];
                    if (!checkIsRefSchema(property)) {
                        stack.push(property);
                    }
                });
            }

            item.oneOf?.forEach((schema) => {
                stack.push(schema);
            });

            item.allOf?.forEach((schema) => {
                stack.push(schema);
            });

            item.anyOf?.forEach((schema) => {
                stack.push(schema);
            });
        }
    }
};

