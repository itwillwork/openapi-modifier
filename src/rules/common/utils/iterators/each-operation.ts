import {OpenAPIFileT} from "../../../../openapi";
import {HttpMethods, OperationObject} from "../../openapi-models";

type OperationSchema = OperationObject;

type OperationCallbackParamsT = {
    operationSchema: OperationSchema;
    method: HttpMethods;
    path: string;
}

type OperationCallbackT = (params: OperationCallbackParamsT) => void;

// TODO iterator creator
export const forEachOperation = (openAPIFile: OpenAPIFileT, callback: OperationCallbackT) => {
    const paths = openAPIFile.document?.paths;

    Object.keys(paths || {}).forEach((pathKey) => {
        const path = paths?.[pathKey];

        const methods = Object.keys(path || {}) as Array<HttpMethods>
        methods.forEach((method) => {
            const operationSchema = path?.[method];

            if (operationSchema) {
                callback({
                    operationSchema,
                    method,
                    path: pathKey,
                });
            }
        });
    });
};
